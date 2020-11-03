import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from '$src/plugins/vuetify';
import Fragment from 'vue-fragment';

import 'typeface-roboto/index.css';

Vue.config.productionTip = false;

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://0b1a7661a5f444e8ad4ef55f074fe4bf@sentry.io/5177582',
        integrations: [
            new Integrations.Vue({ Vue, attachProps: true, logErrors: true })
        ],
        ignoreErrors: ['Abort Request']
    });
}

Vue.filter('capitalize', (value = '') => {
    if (!value) {
        return '';
    }
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('toUpperCase', (value = '') => value.toUpperCase());

Vue.use(Fragment.Plugin);

Vue.use(VueFilterDateParse);
Vue.use(VueFilterDateFormat);

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
