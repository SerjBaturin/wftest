import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import authStore from './modules/auth.store';
import workflowStore from './modules/workflow.store';
import draggableStore from './modules/draggable.store';
import socketStore from './modules/socket.store';
import hasAction from './plugins/hasAction';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: true,
        snackbar: {
            color: 'info',
            show: false,
            text: null
        },
        cancelSource: null,
    },
    mutations: {
        SET_LOADING(state, status) {
            state.isLoading = status;
        },
        SET_SNACKBAR({ snackbar }, payload) {
            snackbar.color = payload.color;
            snackbar.text = payload.text;
            snackbar.show = payload.show;
        },
        SET_CANCEL_SOURCE(state, source) {
            state.cancelSource = source;
        },
    },
    actions: {
        setLoading({ commit }, status) {
            commit('SET_LOADING', status);
        },
        showSnackbar({ commit }, { text, color }) {
            commit('SET_SNACKBAR', { show: true, text, color });
        },
        hideSnackbar({ commit }) {
            commit('SET_SNACKBAR', { show: false, text: null, color: 'info' });
        },
        generateCancelSource({ commit }) {
            const source = axios.CancelToken.source();
            commit('SET_CANCEL_SOURCE', source);
        },
        abortSource({ getters: { cancelSource } }, reason = '') {
            cancelSource?.cancel(reason);
            this.commit('SET_CANCEL_SOURCE', null);
        },
    },
    getters: {
        isLoading: ({ isLoading }) => isLoading,
        snackbar: ({ snackbar }) => snackbar,
        cancelSource: ({ cancelSource }) => cancelSource,
    },
    modules: {
        auth: authStore,
        workflow: workflowStore,
        draggable: draggableStore,
        socket: socketStore,
    },
    plugins: [hasAction]
});
