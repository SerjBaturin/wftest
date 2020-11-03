const inRole = roleId => roleObj => roleObj.role_id === roleId;

const isCan = (list, listType, roleList) =>
    roleList.some(
        role => list[listType].findIndex(inRole(role.role_id)) !== -1
    );

const canMove = (list, roleList) => isCan(list, 'mlist', roleList);
const canView = (list, roleList) => isCan(list, 'vlist', roleList);

const typeParamName = {
    estimators: {
        name: 'est_list',
        typeId: 1
    },
    bodytechs: {
        name: 'bt_list',
        typeId: 2
    },
    painters: {
        name: 'pnt_list',
        typeId: 3
    },
    others: {
        name: 'oth_list',
        typeId: 99
    }
};

export { canMove, canView, typeParamName };
