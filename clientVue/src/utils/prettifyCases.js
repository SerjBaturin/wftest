import { canView, canMove } from './role.util';

const prettifyCases = (
    { config, cases, params },
    { role_list: roleList },
    user
) => {
    // Список статусов в виде объекта
    let buckets = getBucketsObj(config);

    // Список кейсов с параметрами в виде объекта
    let envelopesParams = getParamsObj(params);

    let envelopesInfos = getAddInfos(cases);

    // Сортируем кейсы по статусам
    setBucketCases({
        cases,
        envelopesParams,
        user,
        buckets,
        roleList,
        envelopesInfos
    });

    // Фильтруем список статусов по параметрам
    const filteredBuckets = filterBuckets(Object.entries(buckets), roleList);
    return Object.fromEntries(filteredBuckets);
};

const unknown = {
    status_id: '-1',
    name: 'Unknown',
    cases: [],
    vlist: [{ role: 'manager', role_id: '2' }],
    mlist: []
};

const getBucketsObj = config =>
    Object.assign(
        { unknown },
        config.data.list.reduce((buckets, listItem) => {
            listItem.cases = [];
            buckets[listItem.status_id] = listItem;
            return buckets;
        }, {})
    );

const getParamsObj = params =>
    params.data.reduce((paramsObj, param) => {
        let envelope_id = param.envelope_id;
        let envelope = paramsObj[envelope_id] || {};

        let param_name = param.param_name;
        envelope[param_name] = param;

        paramsObj[envelope_id] = envelope;

        return paramsObj;
    }, {});

const getAddInfos = cases =>
    cases?.add_info.reduce((infosDict, infoObj) => {
        let envelopeId = infoObj.envelope_id;
        let infos = (infosDict[envelopeId] || []).concat(infoObj);

        infosDict[envelopeId] = infos;

        return infosDict;
    }, {}) || {};

const CHECK_PREC_IDS = {
    LF: 6,
    RF: 10,
    FBG: 7,
    DA: 4
};

/**
 * @typedef {Object} AddInfo
 * @property {string} file_name
 * @property {number} reference
 * @property {number} prec_id
 */

/**
 * @param {AddInfo[]} addInfo
 * @returns {string} imageSrc
 */
export const generateImageUrl = (addInfo = []) => {
    const envelopeId = addInfo[0] && addInfo[0].envelope_id;

    let image =
        (addInfo[0] && `${addInfo[0].reference}/${addInfo[0].file_name}`) || '';

    let LF = '';
    let RF = '';
    let FBG = '';
    let DA = '';

    for (const addInfoObj of addInfo) {
        if (addInfoObj.prec_id === CHECK_PREC_IDS.LF) {
            LF = `${addInfoObj.reference}/${addInfoObj.file_name}`;
        }
        if (addInfoObj.prec_id === CHECK_PREC_IDS.RF) {
            RF = `${addInfoObj.reference}/${addInfoObj.file_name}`;
        }
        if (addInfoObj.prec_id === CHECK_PREC_IDS.FBG) {
            FBG = `${addInfoObj.reference}/${addInfoObj.file_name}`;
        }
        if (addInfoObj.prec_id === CHECK_PREC_IDS.DA) {
            DA = `${addInfoObj.reference}/${addInfoObj.file_name}`;
        }
    }

    if (LF) image = LF;
    else if (RF) image = RF;
    else if (FBG) image = FBG;
    else if (DA) image = DA;

    image = image.replace('.jpg', '_m');

    return (image && `/dl/0/${envelopeId}/${image}`) || '';
};

const defaultParam = {
    wf_status: {
        param_name: 'wf_status',
        param_value: '0'
    }
};
const setBucketCases = ({
    cases,
    envelopesParams,
    user,
    buckets,
    roleList,
    envelopesInfos
}) => {
    cases?.data.forEach(caseItem => {
        let envelopeId = caseItem.envelope_id;
        let params = Object.assign(
            {},
            defaultParam,
            envelopesParams[envelopeId] || {}
        );
        const userId = user.user_id;
        const defIns = user.def_ins;

        let status = getStatus(params, userId, buckets, roleList);

        if (
            roleList.some(({ role_id }) => +role_id === 2) ||
            checkAssignment(params, userId) ||
            checkReferal({ roleList, caseItem, userId, defIns })
        ) {
            caseItem.params = params;

            let addInfo = envelopesInfos[envelopeId] || [];
            caseItem.add_info = addInfo;

            caseItem.imgSrc = generateImageUrl(addInfo);

            buckets[status].cases.push(caseItem);
        }
    });
};

const assignments = ['bt_list', 'est_list', 'pnt_list', 'oth_list'];
const checkAssignment = (params, userId) =>
    assignments.some(assignmentName =>
        params[assignmentName]?.param_value.split(',').some(id => id === userId)
    );

const checkReferal = ({ roleList, caseItem, userId, defIns }) =>
    roleList.some(({ role_id }) => +role_id === 12) &&
    (+caseItem.owner_user_id === +userId || +caseItem.ins_grp_id === +defIns);

const getStatus = (params, userId, buckets, roleList) => {
    let status = params.wf_status.param_value;

    return status === '0'
        ? status
        : roleList.some(role => role.role_id === '2') &&
          !Reflect.has(buckets, status)
        ? 'unknown'
        : !canView(buckets[status], roleList) && checkAssignment(params, userId)
        ? '0'
        : status;
};

/**
 * @typedef List
 * @type {object}
 * @property {string} index
 *
 * @typedef {string | number} StatusID
 *
 * @typedef {[StatusID, List]} ListsEntry
 */

/**
 * @param {ListsEntry[]} lists
 * @param {K[]} roleList
 * @returns {ListsEntry[]}
 */
const filterBuckets = (buckets, roleList) =>
    buckets.filter(([status, bucket]) => {
        if (status === '0') {
            return !!bucket.cases.length;
        }

        if (status === 'unknown') {
            return roleList.some(role => role.role_id === '2')
                ? !!bucket.cases.length
                : false;
        }

        let canSee = canView(bucket, roleList);
        let canMoveTo = canMove(bucket, roleList);

        return canSee || canMoveTo;
    });

export const sortLists = filteredBuckets => {
    const mapped = filteredBuckets.map((list, i) => ({
        value: list[1].index,
        i
    }));
    mapped.sort((objA, objB) => objA.value - objB.value);
    const sortedLists = mapped.map(({ i }) => filteredBuckets[i]);
    return sortedLists;
};

export default prettifyCases;
