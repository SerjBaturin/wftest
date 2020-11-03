/**
 * @typedef {(number|string)} NumberLike
 */

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @param { { [key in PropertyKey]: any } } obj
 * @return { boolean }
 */
export const isEmpty = obj => {
    if (obj === null || obj === undefined) return true;

    if (obj.length === 0) return true;
    else if (obj.length > 0) return false;

    if (typeof obj !== 'object') return true;

    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
};

/**
 * @function
 * @template T
 * @template K
 * @param {Iterable<T>} source
 * @param { (value: T, index: number, arr: T[]) => value is K } predicate
 *
 * @returns {K | undefined}
 */
export const find = (source = [], predicate = () => false) => {
    return Array.prototype.find.call([...source], predicate);
};

/**
 * @typedef { Object } WfUser
 * @property { NumberLike } user_id
 */

 /**
  * @typedef {string} ParamName
  */

/**
 * @typedef {Object} Param
 * @property {string} param_value
 */

/**
 * @param { {[key: ParamName]: Param} } params
 * @param { {[key: string]: WfUser[]} } wfUsers
 * 
 * @returns { (listName: string, usersType: string) => WfUser[] }
 */
export const getStuff = (params, wfUsers) => (listName, usersType) => {
    /**
     * @type {number[]}
     */
    let stuffIds = params[listName]?.param_value.split(',') || [];
    return stuffIds.length
        ? wfUsers[usersType]?.filter(({ user_id }) =>
              stuffIds.some(id => +user_id === +id)
          ) || []
        : [];
};

/**
 * @param { ('true' | 'false') } str 
 */
export const isTrueSet = str => ('' + str).toLowerCase() === 'true';
