import io from 'socket.io-client';

const state = {
    updates: null
};

const mutations = {
    SET_UPDATES(state, connection) {
        state.updates = connection;
    },
};

/**
 * @type { import('vuex').ActionTree<state> }
 */
const actions = {
    setUpdates({ commit }, updates) {
        commit('SET_UPDATES', updates);
    },
    connect({ dispatch, getters, commit }) {
        let init = true;
        const updates = io('/updates', {
            transports: ['websocket'],
            query: {
                cid: getters.choosedCompany.company_id
            },
            timeout: 25000,
        });

        updates.on('reconnect_attempt', () => {
            updates.io.opts.transports = ['polling', 'websocket'];
        })
        .on('connect', () => {
            dispatch('setUpdates', updates);
            window.console.log('Connected:', updates.id);
            if (!init) {
                dispatch('readCases').then(() => dispatch('setLoading', false))
            }
            init = false;
        })
        .on('disconnect', reason => {
            window.console.log('Disconnect:', reason);
            dispatch('setUpdates', null);
        })
        .on('update', ({action, data}) => {
            const encodedData = typeof data === 'string' ? JSON.parse(data) : data;
            dispatch.ifHasAction(action, encodedData).else(() => {
                window.console.warn('Uknown action:', {action, encodedData});
            });
        })
        .on('setActiveDC', url => {
            commit('SET_ACTIVE_DC', url);
        });
    },
    disconnectSocket({ getters, dispatch }) {
        getters.updates?.disconnect();
        dispatch('setUpdates', null);
    }
};

const getters = {
    updates: ({updates}) => updates
};

export default { state, mutations, actions, getters };
