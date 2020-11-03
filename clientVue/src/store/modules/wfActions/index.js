import { typeParamName } from '$src/utils/role.util';

const wfActions = {
    status_changed({ commit, state, dispatch }, data) {
        for (const listObj of Object.values(state.lists)) {
            const index = listObj.cases
                .findIndex(({envelope_id}) => +(data?.envelope_id) === +(envelope_id));
            if (index !== -1) {
                dispatch('showSnackbar', {
                    text: 'Case Status Changed',
                    color: 'info'
                });
                commit('MOVE_CASE', {
                    from: listObj.status_id,
                    i: index,
                    to: data.status
                });
                break;
            }
        }        
    },
    set_btest({ commit, state }, data) {
        for (const listObj of Object.values(state.lists)) {
            const index = listObj.cases
                .findIndex(({envelope_id}) => +(data?.envelope_id) === +(envelope_id));
            const choosedUsersType = Object.keys(typeParamName)
                .find(key => typeParamName[key].typeId === +data?.type);
            if (index !== -1 && choosedUsersType !== undefined) {
                commit('ASSIGN_USER', {
                    wfStatus: listObj.status_id,
                    caseIndex: index,
                    wfUserId: data.user_id,
                    choosedUsersType
                });
                break;
            }
        }
    },
    del_btest({ commit, state }, data) {
        for (const listObj of Object.values(state.lists)) {
            const index = listObj.cases
                .findIndex(({envelope_id}) => +(data?.envelope_id) === +(envelope_id));
            const choosedUsersType = Object.keys(typeParamName)
                .find(key => typeParamName[key].typeId === +data?.type);
            if (index !== -1) {
                commit('REMOVE_USER', {
                    wfStatus: listObj.status_id,
                    caseIndex: index,
                    wfUserId: data.user_id,
                    choosedUsersType
                });
                break;
            }
        }
    },
    case_deleted({commit, state}, data) {
        for (const listObj of Object.values(state.lists)) {
            const index = listObj.cases
                .findIndex(({envelope_id}) => +(data?.envelope_id) === +(envelope_id));
            if (index !== -1) {
                commit('REMOVE_CASE', {
                    wfStatus: listObj.status_id,
                    caseIndex: index,
                });
                break;
            }
        }
    },
    case_priority_set({commit, state}, data) {
        for (const listObj of Object.values(state.lists)) {
            const index = listObj.cases
                .findIndex(({envelope_id}) => +(data?.envelope_id) === +(envelope_id));
            if (index !== -1) {
                commit('SET_CASE_PRIORITY', {
                    wfStatus: listObj.status_id,
                    caseIndex: index,
                    casePriority: data.case_priority
                });
                break;
            }
        }
    }
};

export default wfActions;
