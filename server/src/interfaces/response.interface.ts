import { AxiosRequestConfig } from "axios";

export interface ICompanyIpList {
    data: ICompanyIpObj[]
}

export interface ICompanyIpObj {
    ip: string,
    port: string,
}

export type NumberLike = number | string;
export type ResponsePropValue = { [key in keyof PropertyKey]: ResponsePropValue | ResponsePropValue[] } | string | number | null;

export interface IResponseObj {
    [key: string]: ResponsePropValue
}

export interface ICaseObj extends IResponseObj{
    company_id: NumberLike,
    envelope_id: NumberLike,
}

export interface ICaseParamObj extends IResponseObj {
    id: NumberLike,
    envelope_id: NumberLike,
    company_id: NumberLike,
    param_name: string,
    param_value: string,
}

export interface IDetailParamObj extends ICaseParamObj {
    db_reference: string
}

export interface IWarehouseObj extends IResponseObj {
    type: NumberLike,
    date_use: string | null,
    line_description: string,
    id: NumberLike,
    company_id: NumberLike,
    vendor_id: NumberLike,
    net: NumberLike,
    envelope_id: NumberLike,
    oem_number: string,
    date_add: Datetime,
    used: NumberLike,
    list: NumberLike,
    inv_no: NumberLike,
    price: NumberLike,
    comment: string
}

export interface IRoleObj {
    role: string,
    role_id: NumberLike
}

export interface IActionObj {
    id: NumberLike,
    status_id: NumberLike,
    action_id: NumberLike,
    company_id: NumberLike,
    acname: string
}

export interface IStatusConfigObj {
    status_id: NumberLike,
    name: string,
    grp: NumberLike,
    index: NumberLike,
    company_id: NumberLike,
    vlist: IRoleObj[],
    mlist: IRoleObj[],
    actions: IActionObj[]
}

export interface IStatusConfigs extends IResponseObj {
    [company_id: string]: {
        list: IStatusConfigObj[]
    }
}

export type Datetime = string;

export interface IWfStat extends IResponseObj {
    status_id: NumberLike,
    envelope_id: NumberLike,
    start_datetime: Datetime,
    user_id: NumberLike,
    from_status_id: NumberLike,
    to_status_id: NumberLike,
    comment: string,
    type: NumberLike,
    pid: NumberLike
}

export interface IWfUser extends IResponseObj {
    user_role_id: NumberLike,
    user_id: NumberLike,
    role_id: NumberLike,
    company_id: NumberLike,
    user_name: string,
    user_login: string
}

export interface IWfResultObj<T> {
    result: T;
}

export interface IWfDataObj<T> {
    data: T;
}

export interface IWfResponse<T> {
    data: T;
    statusText?: string;
    status?: number;
}

export type WfRequest<T> = Promise<IWfResponse<T>>;

export interface IFullConfigs {
    AddActivities: IAddActivity[],
    Company: ICompany[],
    Preconditions: IPrecondition[],
    Codes: ICode[],
    Insurances: IInsurance[],
    AddInfoTypes: IAddInfoType[]
}

export type FullConfigObj = IAddActivity | ICompany | IPrecondition | ICode | IInsurance | IAddActivity

export type Config<T, K> = {
    configName: keyof T,
    configs: K[]
};

export interface IAddActivity {
    company_id: NumberLike,
    description: string,
    id: number,
    code: string
}

export type Email = string;
export type Address = string;
export type PhoneNumber = string;

export interface ICompany {
    company_name: string,
    company_id: NumberLike,
    company_abbr: string,
    company_admin_email: Email,
    company_address: Address,
    company_admin_phone: PhoneNumber,
    company_license: string
}

export interface IPrecondition {
    pictures_to_take: number,
    prec_id: NumberLike,
    description: string,
    pic_desc: string,
    code: string,
    idx: number,
    company_id: number,
    id: number
}

export interface ICode {
    abbr: string,
    code: string,
    description: string,
    id: number,
    company_id: number
}

export interface IInsurance {
    is_default: number,
    enabled: number,
    date: Datetime,
    id: number,
    idx: string,
    company_id: NumberLike,
    name: string,
    tpl: number
}

export interface IAddInfoType {
    export: number,
    type_name: string,
    enabled: number,
    multi_reference: number,
    id: number,
    date: Datetime
}

export interface ISubletVendors {
    vendors: IVendor[],
    sublets: ISublet[],
    subl_custom: ISubletCustom[]
}

export type SubletVendor = IVendor | ISublet | ISubletCustom;

export interface IVendor {
    vendor_id: NumberLike,
    name: string,
    email: Email,
    phone: PhoneNumber,
    company_id: NumberLike,
    type_labor: string,
    zip: NumberLike
}

export interface ISublet {
    id: NumberLike,
    company_id: NumberLike,
    sublet_id: NumberLike
    vendor_id: NumberLike,
}

export interface ISubletCustom{
    sublet_id: NumberLike,
    sublet: string,
    is_sublet: NumberLike,
    company_id: NumberLike,
    operation: string,
    db_reference: NumberLike,
    send_type: NumberLike
}
