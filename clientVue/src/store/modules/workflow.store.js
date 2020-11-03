import Vue from 'vue';
import { api } from '$src/utils/api';
import prettifyCases from "$src/utils/prettifyCases";
import { typeParamName } from '$src/utils/role.util';
import wfActions from './wfActions';
import { isEmpty } from '$src/utils/composition.util';

const state = {
    lists: null,
    days: localStorage.getItem('days') || 30,
    wfUsers: {},
    choosedUsersType: null,
    wfStats: {},
    insurances: [],
    detailParam: [],
    whParts: [],
    subletVendors: {},
    preconditions: [],
};

/**
 * @type { import('vuex').MutationTree<state> }
 */
const mutations = {
    SET_LISTS(state, lists) {
        state.lists = lists;
    },
    MOVE_CASE(state, { from, i, to }) {
        let fromList = state.lists[from];
        let caseObj = fromList.cases.splice(i, 1)[0];
        caseObj.params.wf_status.param_value = state.lists[to].status_id;

        state.lists[to].cases.push(caseObj);
    },
    SET_WF_USERS(state, wfUsers) {
        if (isEmpty(wfUsers)) {
            state.wfUsers = wfUsers;
            return;
        }

        let users = wfUsers.map(user => {
            let initials = user.user_name.split(' ').map(n => n[0]?.toUpperCase()).join('').slice(0, 2) || 'NaN';
            let user_name = user.user_name ? user.user_name : 'NaN';
            let cloneUser = Object.assign({}, user, {
                bgColor: colors[Math.floor(Math.random() * colors.length)],
                initials: initials.padEnd(2, initials[0]),
                user_name
            });
            return cloneUser;
        });

        let estimators = users.filter(user => user.role_id === '8').map(setIcon('circle'));
        let bodytechs = users.filter(user => user.role_id === '3').map(setIcon('rhomb'));
        let painters = users.filter(user => user.role_id === '13').map(setIcon('square'));
        let others = users.filter(user => user.role_id !== '8' && user.role_id !== '3' && user.role_id !== '13').map(setIcon('ellipse'));

        state.wfUsers = { estimators, bodytechs, painters, others };
    },
    ASSIGN_USER(state, payload) {
        const { wfStatus, caseIndex, wfUserId, choosedUsersType } = payload;
        const caseObj = state.lists[wfStatus].cases[caseIndex];
        const params = caseObj.params;
        const param_name = typeParamName[choosedUsersType].name;
        const param = params[param_name] || {
            envelope_id: `${caseObj.envelope_id}`,
            company_id: `${caseObj.company_id}`,
            param_name,
            param_value: '',
        };

        const stuffIdsList = param.param_value.split(',').filter(stuffId => stuffId.length);

        if (stuffIdsList.includes(wfUserId)) {
            return;
        }

        param.param_value = (stuffIdsList.length ? stuffIdsList.concat(wfUserId) : [wfUserId]).join(',');

        if (params[param_name] === undefined) {
            Vue.set(params, param_name, param);
        }

        payload.result = params[param_name];
    },
    CHOOSE_USERS_TYPE(state, usersType) {
        state.choosedUsersType = usersType;
    },
    REMOVE_USER(state, payload) {
        const { wfStatus, caseIndex, wfUserId, choosedUsersType } = payload;
        const caseObj = state.lists[wfStatus].cases[caseIndex];
        const params = caseObj.params;
        const param_name = typeParamName[choosedUsersType].name;
        const param = params[param_name];

        if (param !== undefined) {
            const stuffIdsList = param.param_value.split(',').filter(stuffId => stuffId.length);

            if (!stuffIdsList.includes(wfUserId)) {
                return;
            }

            param.param_value = stuffIdsList.filter(stuffId => stuffId !== wfUserId).join(',');
        }
    },
    REMOVE_CASE(state, payload) {
        const { wfStatus, caseIndex } = payload;
        state.lists[wfStatus].cases.splice(caseIndex, 1);
    },
    SET_CASE_PRIORITY(state, payload) {
        const { wfStatus, caseIndex, casePriority } = payload;
        const caseObj = state.lists[wfStatus].cases[caseIndex];
        const params = caseObj.params;
        const param_name = 'case_priority';
        
        const param = params[param_name] || {
            envelope_id: `${caseObj.envelope_id}`,
            company_id: `${caseObj.company_id}`,
            param_name,
            param_value: '',
        }

        param.param_value = casePriority;

        if (params[param_name] === undefined) {
            Vue.set(params, param_name, param);
        }
    },
    SET_WF_STATS(state, payload) {
        state.wfStats = payload;
    },
    SET_INSURANCES(state, payload) {
        state.insurances = payload;
    },
    SET_DETAIL_PARAM(state, payload) {
        state.detailParam = payload;
    },
    SET_WH_PARTS(state, payload) {
        state.whParts = payload;
    },
    SET_SUBLET_VENDORS(state, payload) {
        state.subletVendors = payload;
    },
    SET_PRECONDITIONS(state, payload) {
        state.preconditions = payload;
    }
};

/**
 * @type { import('vuex').ActionTree<state> }
 */
const actions = {
    async readCases({ commit, getters, state }) {
        let data = (await api.get('/cases', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                'Authorization': `Bearer ${getters.estSession}`
            },
            params: {
                days: state.days,
                company_id: getters.choosedCompany.company_id
            }
        }).catch(() => ({ data: null }))).data;

        if (!isEmpty(data)) {
            let insurances = data?.insurances || [];
            commit('SET_INSURANCES', insurances);

            let preconditions = data?.preconditions || [];
            commit('SET_PRECONDITIONS', preconditions);
    
            let lists = prettifyCases(data, getters.user, getters.user);
    
            commit('SET_LISTS', lists);
        }

        return data;
    },
    async moveCase({ commit, getters }, { fromStatus, index, toStatus }) {
        if (fromStatus === toStatus) {
            return false;
        }

        let caseObj = getters.lists[fromStatus].cases[index];
        commit('MOVE_CASE', { from: fromStatus, i: index, to: toStatus });

        let datetime = (new Date()).toISOString().match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
        let response = await api.post('/cases', {
            envelope_id: caseObj.envelope_id,
            company_id: getters.choosedCompany.company_id,
            date: `${datetime[1]} ${datetime[2]}`,
            from_wf_status: caseObj.params.wf_status.param_value,
            to_wf_status: getters.lists[toStatus].status_id,
            user_id: getters.user.user_id
        }, {
            cancelToken: getters.cancelSource?.token,
            headers: {
                'Authorization': `Bearer ${getters.estSession}`
            }
        });

        let updateResponse = await api.post('/update', {
            action: 'status_changed',
            data: {
                envelope_id: caseObj.envelope_id,
                status: getters.lists[toStatus].status_id
            },
            wfID: getters.updates.id
        }, {
            cancelToken: getters.cancelSource?.token,
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            }
        });

        return { response, updateResponse };
    },
    async getWfUsers({ commit, getters }) {
        let wfUsers = (await api.get('/get-wf-users', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                'Authorization': `Bearer ${getters.estSession}`
            },
            params: {
                company_id: getters.choosedCompany.company_id
            }
        })).data;

        commit('SET_WF_USERS', wfUsers);

        return wfUsers;
    },
    setWfUsers({ commit }, payload) {
        commit('SET_WF_USERS', payload);
    },
    async assignUser({ commit, getters }, payload) {
        payload.result = null;
        commit('ASSIGN_USER', payload);

        if (payload.result === null) {
            return;
        }

        const response = await api.post('/assign-user', Object.assign({
            user_id: getters.user.user_id,
            pid: payload.wfUserId,
            type: typeParamName[getters.choosedUsersType].typeId
        }, payload.result), {
            headers: {
                'Authorization': `Bearer ${getters.estSession}`
            }
        });

        const updateResponse = await api.post('/update', {
            action: 'set_btest',
            data: {
                envelope_id: payload.result.envelope_id,
                user_id: payload.wfUserId,
                type: typeParamName[getters.choosedUsersType].typeId
            },
            wfID: getters.updates.id
        }, {
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            }
        });

        return { response, updateResponse }
    },
    setUsersType({ commit }, usersType) {
        commit('CHOOSE_USERS_TYPE', usersType);
    },
    async getWfStat({ commit, getters }) {
        const response = await api.get('/read-wf-stat', {
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            }
        });

        commit('SET_WF_STATS', response?.data || {});

        return response.data;
    },
    setWfStat({ commit }, payload) {
        commit('SET_WF_STATS', payload);
    },
    async getDetailParam({ commit, getters }) {
        const response = await api.get('/get-detail-param', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            },
            params: {
                company_id: getters.choosedCompany?.company_id
            }
        });

        commit('SET_DETAIL_PARAM', response.data?.result?.data);

        return response.data;
    },
    setDetailParam({ commit }, payload) {
        commit('SET_DETAIL_PARAM', payload);
    },
    async getWhParts({ commit, getters }) {
        const response = await api.get('/get-wh-parts', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            },
            params: {
                company_id: getters.choosedCompany?.company_id
            }
        });

        commit('SET_WH_PARTS', response.data?.result?.data);

        return response.data;
    },
    setWhParts({ commit }, payload) {
        commit('SET_WH_PARTS', payload)
    },
    async getSubletVendors({ commit, getters }) {
        const response = await api.get('/get-sublet-vendors', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            },
            params: {
                company_id: getters.choosedCompany?.company_id
            }
        });

        commit('SET_SUBLET_VENDORS', response.data?.result?.data);

        return response.data;
    },
    setSubletVendors({ commit }, payload) {
        commit('SET_SUBLET_VENDORS', payload);
    },

    ...wfActions
};

/**
 * @type { import('vuex').GetterTree<state> }
 */
const getters = {
    lists: ({ lists }) => lists && Object.fromEntries(
        Object.entries(lists).map(([key, list]) => {
            let cases = list.cases
                .sort((a, b) => Date.parse(b.transmit_date) - Date.parse(a.transmit_date))
                .sort((a, b) => {
                    return (a.params.case_priority?.param_value || 0) - (b.params.case_priority?.param_value || 0)
                });

            return [key, { ...list, cases }];
        })
    ),
    wfUsers: ({ wfUsers }) => wfUsers,
    choosedUsersType: ({ choosedUsersType }) => choosedUsersType,
    wfStats: ({ wfStats }) => wfStats,
    insurances: ({ insurances }) => insurances,
    detailParam: ({ detailParam }) => detailParam,
    whParts: ({ whParts }) => whParts,
    subletVendors: ({ subletVendors }) => subletVendors,
    preconditions: ({ preconditions }) => preconditions,
};

export default { state, mutations, actions, getters };

const colors = [
    '#3f48cc',
    '#006600',
    '#006666',
    '#006699',
    '#330033',
    '#333300',
    '#6699cc',
    '#993300',
    '#996666',
    '#cc0000'
];

const setIcon = icon => user => Object.assign({ icon }, user);
