import Vue from 'vue';
import Router from 'vue-router';

const IndexPage = () => import('$src/pages/IndexPage.vue');
const LoginPage = () => import('$src/pages/LoginPage.vue');
const CasePage = () => import('$src/pages/CasePage.vue');

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            component: IndexPage,
            name: 'index',
        },
        {
            path: '/login',
            component: LoginPage,
            name: 'login',
        },
        {
            path: '/case/:statusId/:envId',
            component: CasePage,
            name: 'case',
        }
    ],
    mode: 'history',
});

export default router;
