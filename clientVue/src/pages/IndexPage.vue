<template lang="pug">
    Base
        Workflow(v-if="choosedCompany")
        ChooseCompany(v-else)
</template>

<script>
import { mapGetters } from 'vuex';
import Base from './_BasePage.vue';

/**
 * @type { import('vue').Component }
 */
const IndexPage = {
    name: 'IndexPage',
    computed: {
        ...mapGetters(['choosedCompany'])
    },
    components: {
        Base,
        ChooseCompany: () => import('$src/layout/ChooseCompany.vue'),
        Workflow: () => import('$src/layout/Workflow.vue')
    }
};

export default IndexPage;
</script>
