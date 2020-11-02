import { Db, FilterQuery, Cursor } from 'mongodb';
import * as qs from 'qs';

import { cgiUrl, axios, phpUrl } from '@/utils/api';
import { techLogin, techPasswd, days } from '@config/db.config';
import {
    ICaseObj,
    ICaseParamObj,
    IDetailParamObj,
    IWfUser,
    IWfStat,
    IStatusConfigs,
    IWarehouseObj,
    IStatusConfigObj,
    IFullConfigs,
    IWfResultObj,
    IWfDataObj,
    ISubletVendors,
    Config,
    FullConfigObj,
    SubletVendor,
} from '@/interfaces/response.interface';
import { noop, isDevelopment } from '@/utils/composition';

export class DbService {
    private _session: string = '';
    private request = axios();

    constructor(private db: Db) {
        this.login().then(() => this.read());
    }

    private async login() {
        const response = await this.request.post(
            cgiUrl,
            qs.stringify({
                action: 'login',
                login: techLogin,
                passwd: techPasswd,
            })
        );

        this.session = response.data?.result?.session;
    }

    private get session() {
        return this._session;
    }

    private set session(value: string) {
        this._session = value;
        this.request = axios(this.session);
    }

    read() {
        this.readCases();
        this.readCaseParams();
        this.readDetailParams();
        this.readWhParts();
        this.readStatusConfigs();
        this.readWfStats();
        this.readWfUsers();
        this.readFullConfigs();
        this.readSubletVendors();
    }

    private readCases() {
        this.request
            .get(cgiUrl, {
                params: {
                    action: 'read_cases_all',
                    days,
                },
            })
            .then(({ data }) => data.result)
            .then(this.setCollection<ICaseObj>(COLLECTION_NAMES.CASES));
    }

    private readCaseParams() {
        this.request
            .get(cgiUrl, {
                params: {
                    action: 'get_case_param_all',
                    days,
                },
            })
            .then(({ data }) => data.result)
            .then(
                this.setCollection<ICaseParamObj>(COLLECTION_NAMES.CASE_PARAMS)
            );
    }

    private readDetailParams() {
        this.request
            .get(cgiUrl, {
                params: {
                    action: 'get_detail_param_all',
                    days,
                },
            })
            .then(({ data }) => data.result)
            .then(
                this.setCollection<IDetailParamObj>(
                    COLLECTION_NAMES.DETAIL_PARAMS
                )
            );
    }

    private readWhParts() {
        this.request
            .get(cgiUrl, {
                params: {
                    action: 'get_warehouse_all',
                    days,
                },
            })
            .then(({ data }) => data.result)
            .then(this.setCollection<IWarehouseObj>(COLLECTION_NAMES.WH_PARTS));
    }

    private readStatusConfigs() {
        this.request
            .get(phpUrl, {
                params: {
                    action: 'get_status_config_all',
                },
            })
            .then(({ data }: { data: { data: IStatusConfigs } }) => {
                let lists = Object.entries(data.data)
                    .map(([_, { list }]) => list)
                    .flat();
                return { data: lists };
            })
            .then(
                this.setCollection<IStatusConfigObj>(
                    COLLECTION_NAMES.STATUS_CONFIGS
                )
            );
    }

    private readWfStats() {
        this.request
            .get(phpUrl, {
                params: {
                    action: 'read_wf_stat_all',
                    days,
                },
            })
            .then(({ data }) => data.result)
            .then(this.setCollection<IWfStat>(COLLECTION_NAMES.WF_STATS));
    }

    private readWfUsers() {
        this.request
            .get(phpUrl, {
                params: {
                    action: 'get_users_wf_all',
                },
            })
            .then(({ data }) => data.result)
            .then(this.setCollection<IWfUser>(COLLECTION_NAMES.WF_USERS));
    }

    private readFullConfigs() {
        this.request
            .get<IWfResultObj<IFullConfigs>>(cgiUrl, {
                params: {
                    action: 'read_full_config_all',
                },
            })
            .then(({ data }) => ({
                data: Object.entries(data.result).map(([key, value]) => ({
                    configName: key,
                    configs: value,
                })),
            }))
            .then(this.setCollection(COLLECTION_NAMES.FULL_CONFIGS));
    }

    private readSubletVendors() {
        this.request
            .get<IWfResultObj<IWfDataObj<ISubletVendors>>>(phpUrl, {
                params: {
                    action: 'get_sublet_vendors_all',
                },
            })
            .then(({ data }) => ({
                data: Object.entries(data.result.data).map(([key, value]) => ({
                    configName: key,
                    configs: value
                })),
            }))
            .then(this.setCollection(COLLECTION_NAMES.SUBLET_VENDORS));
    }

    private setCollection<T>(
        collectionName: string,
        callbackFn: (obj: T, index?: number, arr?: T[]) => T = (obj) => obj
    ): ({ data }: { data: any }) => void {
        return (result) => {
            const objects: T[] = result?.data;
            if (objects !== undefined && objects !== null) {
                const collection = this.db.collection(collectionName);
                collection.drop().catch(noop); // if collection exists - drop it

                const schemas = objects.map((obj, i, arr) =>
                    callbackFn(obj, i, arr)
                );
                const insertResult = collection.insertMany(schemas);
                if (isDevelopment) {
                    insertResult
                        .then(() => {
                            console.log('Inserted:', collectionName);
                        })
                        .catch((err) => console.log(err));
                }
            }
        };
    }

    private find<T>(collectionName: string, query: FilterQuery<T>): Cursor<T> {
        return this.db.collection<T>(collectionName).find(query);
    }

    private findOne<T>(collectionName: string, query: FilterQuery<T>) {
        return this.db.collection<T>(collectionName).findOne(query);
    }

    getCases(query: FilterQuery<ICaseObj> = {}) {
        return this.find(COLLECTION_NAMES.CASES, query).toArray();
    }

    getCaseParams(query: FilterQuery<ICaseParamObj> = {}) {
        return this.find(COLLECTION_NAMES.CASE_PARAMS, query).toArray();
    }

    private get defaultStatusConfigs(): Promise<IStatusConfigObj[]> {
        return this.getStatusConfigs({
            company_id: '0',
        });
    }

    getStatusConfigs(query: FilterQuery<IStatusConfigObj> = {}) {
        return this.find(COLLECTION_NAMES.STATUS_CONFIGS, query)
            .toArray()
            .then((configs) =>
                configs.length === 0 ? this.defaultStatusConfigs : configs
            );
    }

    getDetailParams(query: FilterQuery<IDetailParamObj> = {}) {
        return this.find(COLLECTION_NAMES.DETAIL_PARAMS, query).toArray();
    }

    getWhParts(query: FilterQuery<IWarehouseObj> = {}) {
        return this.find(COLLECTION_NAMES.WH_PARTS, query).toArray();
    }

    getWfStats(query: FilterQuery<IWfStat> = {}) {
        return this.find(COLLECTION_NAMES.WF_STATS, query).toArray();
    }

    getWfUsers(query: FilterQuery<IWfUser> = {}) {
        return this.find(COLLECTION_NAMES.WF_USERS, query).toArray();
    }

    getFullConfigs(query: FilterQuery<Config<IFullConfigs, FullConfigObj>> = {}) {
        return this.find(COLLECTION_NAMES.FULL_CONFIGS, query).toArray();
    }

    getConfig(query: FilterQuery<Config<IFullConfigs, FullConfigObj>> = {}) {
        return this.findOne(COLLECTION_NAMES.FULL_CONFIGS, query);
    }

    getSubletVendors(query: FilterQuery<Config<ISubletVendors, SubletVendor>> = {}) {
        return this.find(COLLECTION_NAMES.SUBLET_VENDORS, query);
    }
}

const COLLECTION_NAMES = {
    CASES: 'cases',
    CASE_PARAMS: 'caseParams',
    STATUS_CONFIGS: 'statusConfigs',
    DETAIL_PARAMS: 'detailParams',
    WH_PARTS: 'whParts',
    WF_STATS: 'wfStats',
    WF_USERS: 'wfUsers',
    FULL_CONFIGS: 'fullConfigs',
    SUBLET_VENDORS: 'subletVendors',
};
