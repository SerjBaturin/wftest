import { api } from '$src/utils/api';

const state = {
    user: null,
    estSession: localStorage.getItem('est_session'),
    choosedCompany: null,
    activeDC: null
};

/**
 * @type { import('vuex').MutationTree<state> }
 */
const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_SESSION(state, session) {
        state.estSession = session;
    },
    LOG_OUT(state) {
        state.user = state.estSession = null;
    },
    CHOSE_COMPANY(state, i) {
        state.choosedCompany = state.user?.company_list[i] || null;
        localStorage.setItem('companyId', state.choosedCompany?.company_id);
    },
    REMOVE_COMPANY(state) {
        localStorage.removeItem('companyId');
        state.choosedCompany = null;
    },
    SET_ACTIVE_DC(state, payload) {
        state.activeDC = payload;
    }
};

/**
 * @type { import('vuex').ActionTree<state> }
 */
const actions = {
    setToken({ commit }, token) {
        localStorage.setItem('est_session', token);
        commit('SET_SESSION', token);
    },
    removeToken({ commit }) {
        localStorage.removeItem('est_session');
        commit('SET_SESSION', null);
    },
    async authenticate({ dispatch }, authData) {
        let response = await api.post('/login', authData);

        if (response.data.token) {
            await dispatch('setToken', response.data.token);
        }
        return response.data;
    },
    logout({ commit, dispatch }) {
        dispatch('removeToken');
        dispatch('removeCompany', 'Abort request by "logout"');
        commit('LOG_OUT');
    },
    async ping({ commit, getters, dispatch }) {
        let response = await api.get('/ping', {
            cancelToken: getters.cancelSource?.token,
            headers: {
                Authorization: `Bearer ${getters.estSession}`
            }
        }).catch(reason => {
            if (reason.response?.status !== 403) {
                throw reason;
            }
        });

        if (response?.data?.id) {
            commit('SET_USER', { ...response.data.user });
        } else {
            await dispatch('removeToken');
        }

        return response?.data;
    },
    choseCompany({ commit }, i) {
        commit('CHOSE_COMPANY', i);
    },
    removeCompany({ commit, dispatch }, reason = 'Abort request by "change company"') {
        dispatch('abortSource', reason);
        dispatch('disconnectSocket');
        commit('SET_LISTS', null);
        commit('REMOVE_COMPANY');
        commit('SET_ACTIVE_DC', null);
        commit('SET_INSURANCES', null);
        dispatch('setDetailParam', []);
        dispatch('setWhParts', []);
        dispatch('setWfStat', {});
        dispatch('setWfUsers', {});
        dispatch('setSubletVendors', {});
    },
};

/**
 * @type { import('vuex').GetterTree<state> }
 */
const getters = {
    user: ({ user, choosedCompany }) =>
        user && choosedCompany
            ? {
                  ...user,
                  role_list: user.role_list.filter(
                      roleObj =>
                          roleObj.company_id === choosedCompany.company_id
                  )
              }
            : (user
            ? user
            : null),
    estSession: ({ estSession }) => estSession,
    isAuthenticated: ({ estSession }) => !!estSession,
    choosedCompany: ({ choosedCompany }) => choosedCompany,
    canToAssign: (_, { user }) =>
        user.role_list?.some(
            roleObj => roleObj.role_id === '2' || roleObj.role_id === '8'
        ),
    activeDC: ({ activeDC }) => activeDC
};

export default { state, mutations, actions, getters };
