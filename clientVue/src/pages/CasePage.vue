<template lang="pug">
    Base
        Case(:caseInfo="caseInfo")
                  
</template>

<script>
import Base from './_BasePage.vue';
import { mapGetters, mapActions } from 'vuex';
import { isEmpty } from '$src/utils/composition.util.js';

/**
 * @type { import('vue').Component }
 */
const CasePage = {
    name: 'CasePage',
    data: () => ({
        caseData: {},
        intervalId: null
    }),
    computed: {
        ...mapGetters([
            'isLoading',
            'updates',
            'choosedCompany',
            'lists',
            'wfUsers',
            'detailParam',
            'whParts',
            'subletVendors'
        ]),
        caseInfo() {
            const details = this.caseData?.details?.filter(detail =>
                detail.part_type?.includes('PA')
            );

            return {
                ...this.caseData,
                ...(isEmpty(details) ? {} : { details })
            };
        }
    },
    methods: {
        ...mapActions([
            'setLoading',
            'connect',
            'readCases',
            'getWfUsers',
            'getDetailParam',
            'getWhParts',
            'getSubletVendors'
        ])
    },
    created() {
        if (isEmpty(this.caseInfo) && !this.isLoading) {
            this.setLoading(true);
        }

        const { statusId, envId } = this.$route.params;

        const getCase = () =>
            isEmpty(this.caseInfo) &&
            (() => {
                this.caseData = this.lists[statusId].cases.find(
                    ({ envelope_id }) => +envelope_id === +envId
                );
                this.setLoading(false);

                this.intervalId = setInterval(() => {
                    this.getDetailParam();
                    this.getWhParts();
                    this.getWfUsers();
                    this.getSubletVendors();
                    this.readCases();
                }, 5 * 60 * 1000);
            })();

        setTimeout(() => {
            const stateCopy = window.localStorage.getItem(envId);
            if (!isEmpty(stateCopy)) {
                window.localStorage.removeItem(envId);
                let rootState = this.$store.state;
                this.$store.replaceState({
                    ...rootState,
                    ...JSON.parse(stateCopy)
                });
                getCase();
            } else {
                const unwatchLists = this.$watch('lists', () => {
                    if (!isEmpty(this.lists)) {
                        unwatchLists();
                        getCase();
                    }
                });
            }

            const callActionsQueue = () => {
                isEmpty(this.detailParam) && this.getDetailParam();
                isEmpty(this.whParts) && this.getWhParts();
                isEmpty(this.wfUsers) && this.getWfUsers();
                isEmpty(this.updates) && this.connect();
                isEmpty(this.subletVendors) && this.getSubletVendors();
                isEmpty(this.lists) && this.readCases();
            };

            if (isEmpty(this.choosedCompany)) {
                const unwatchCompany = this.$watch('choosedCompany', () => {
                    unwatchCompany();
                    callActionsQueue();
                });
            } else {
                callActionsQueue();
            }
        }, 0);
    },
    beforeDestroy() {
        !isEmpty(this.intervalId) && clearInterval(this.intervalId);
    },
    components: {
        Base,
        Case: () => import('$src/layout/Case.vue')
    }
};

export default CasePage;
</script>
