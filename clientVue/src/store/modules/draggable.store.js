const state = {
    moveInProcess: false,
    assignInProcess: false,
};

/**
 * @type {import('vuex').MutationTree<state>}
 */
const mutations = {
    SET_MOVE_PROCESSING(state, status) {
        state.moveInProcess = status;
    },
    SET_ASSIGN_PROCESSING(state, status) {
        state.assignInProcess = status;
    },
};

/**
 * @type {import('vuex').ActionTree<state>}
 */
const actions = {
    startMoveCase({ commit }) {
        commit('SET_MOVE_PROCESSING', true);
    },
    endMoveCase({ commit }) {
        commit('SET_MOVE_PROCESSING', false);
    },
    startToAssign({ commit }) {
        commit('SET_ASSIGN_PROCESSING', true);
    },
    endToAssign({ commit }) {
        commit('SET_ASSIGN_PROCESSING', false);
    },
};

/**
 * @type {import('vuex').GetterTree<state>}
 */
const getters = {
    moveInProcess: ({ moveInProcess }) => moveInProcess,
    assignInProcess: ({ assignInProcess }) => assignInProcess,
};

export default { state, mutations, actions, getters };
