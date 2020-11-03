<template lang="pug">
    div.base-wrapper
        slot
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

/**
 * @type { import('vue').Component }
 */
const _BasePage = {
    computed: {
        ...mapGetters(['isAuthenticated', 'user', 'cancelSource'])
    },
    methods: {
        ...mapActions(['ping', 'choseCompany', 'generateCancelSource'])
    },
    async created() {
        if (!this.isAuthenticated) {
            this.$router.replace({ name: 'login' });
            return;
        }

        !this.cancelSource && this.generateCancelSource();

        if (!this.user) {
            let data = await this.ping();

            if (data?.user?.company_list?.length === 1) {
                this.choseCompany(0);
            }

            const companyId = localStorage.getItem('companyId');

            if (companyId !== undefined) {
                const companyIndex = (data?.user?.company_list || []).findIndex(company => +company.company_id === +companyId);
                if (companyIndex > -1) {
                    this.choseCompany(companyIndex);
                }
            }
        }
    },
}

export default _BasePage;
</script>

<style scoped>
.base-wrapper {
    display: contents;
}
</style>
