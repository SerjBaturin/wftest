<template lang="pug">
.workflow
    ul.workflow__lists
        li.workflow__list-item(v-for="[key, listObj] in lists", :key="key")
            CaseList(:name="listObj.name", :status="key")
                template(v-for="(caseObj, index) in listObj.cases")
                    router-link.workflow__link(
                        :to="{ name: 'case', params: { envId: caseObj.envelope_id, statusId: key } }",
                        target="_blank",
                        @click.native="copyStore(caseObj.envelope_id)"
                    )
                        CaseCard(
                            :key="index",
                            :status="key",
                            :caseObj="caseObj",
                            :index="index"
                        )
</template>

<script>
import { mapGetters } from 'vuex';
import { sortLists } from '$src/utils/prettifyCases';

export default {
    computed: {
        ...mapGetters({
            buckets: 'lists'
        }),
        lists() {
            return sortLists(Object.entries(this.buckets));
        },
    },
    methods: {
        copyStore(envId) {
            const { auth, workflow } = this.$store.state;
            try {
                window.localStorage.setItem(envId, JSON.stringify({ auth, workflow }));
            } catch (err) {
                if (err.name !== 'QuotaExceededError') {
                    throw err;
                }
            }
        },
    },
    components: {
        CaseList: () => import('./Case/List.vue'),
        CaseCard: () => import('./Case/Card.vue'),
    },
};
</script>

<style lang="scss" scoped>
.workflow {
    max-height: calc(100vh - 50px);
    height: 100%;

    &__lists {
        display: flex;
        padding: 25px;
        height: 100%;
        list-style: none;
        overflow-x: auto;
    }

    &__list-item {
        padding: 0 15px;
        flex: 0;

        &:first-child {
            padding-left: 0;
        }

        &:last-child {
            padding-right: 25px;
        }
    }

    &__link {
        display: block;
        text-decoration: none;

        & + & {
            margin-top: 15px;
        }
    }
}

.v-toolbar--extended + .content .workflow {
    max-height: calc(100vh - 93px);
}
</style>
