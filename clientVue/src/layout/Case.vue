<template lang="pug">
    extends BaseLayout/layout.pug
    block controls
        v-tabs(v-model="tab", style="flex: 0;", background-color="#303030", slider-size="3")
            v-tab(:key="'overview'") Overview
            v-tab(:key="'preconditions'") Preconditions
        v-spacer
        v-btn(fab, small, :to="{ name: 'index' }").btn--home
            v-icon fa-home

    block content
        v-tabs-items(v-model="tab", :touchles="true").transparent
            v-tab-item(:key="'overview'")
                TabOverview(:caseInfo="caseInfo")
            v-tab-item(:key="'preconditions'")
                TabPreconditions(:caseInfo="caseInfo")
</template>

<script>
import BaseLayout from './BaseLayout/index.vue';

/**
 * @type { import('vue').Component }
 */
const Case = {
    extends: BaseLayout,
    name: 'Case',
    props: {
        caseInfo: {
            type: Object,
            default: null,
        }
    },
    data: () => ({
        tab: null,
    }),
    components: {
        TabOverview: () => import('$src/components/Case/Overview.vue'),
        TabPreconditions: () => import('$src/components/Case/Preconditions.vue')
    }
}

export default Case;
</script>
