<template lang="pug">
    extends BaseLayout/layout.pug
    block controls
        v-tabs(v-model="tab", style="flex: 0;", background-color="#303030", slider-size="3")
            v-tab(:key="'workflow'") Workflow
            v-tab(:key="'inShop'" disabled) InShop

        v-menu(offset-y, nudge-bottom="15")
            template(v-slot:activator="{ on, attrs }")
                v-btn(text, small, style="margin: 0 7px", v-bind="attrs", v-on="on")
                    v-breadcrumbs(:items="breadcrumbs")
                        template(v-slot:divider)
                            v-icon fa-caret-right
                        template(v-slot:item="{ item }")
                            v-breadcrumbs-item
                                span {{ item.text }}
            v-list
                v-list-item(v-for="menuItem in menuList", :key="menuItem.text", @click="menuItem.handler")
                    v-list-item-title {{ menuItem.text }}

        v-btn.ml-1(rounded, :outlined="showed !== usersType", :disabled="!canToAssign"
                    color="primary", v-for="(_, usersType) in wfUsers",
                    :key="usersType", @click="canToAssign ? toggleUsers(usersType) : null")
            i.fa.mr-2(:class="`fa-caret-${showed !== usersType ? 'down' : 'up'}`")
            | {{ usersType }}

        template(v-if="choosedUsersType && canToAssign" v-slot:extension)
            v-slide-group(show-arrows, center-active, mandatory, v-model="groupModel")
                v-slide-item(v-for="(wfUser, i) in wfUsers[choosedUsersType]" :key="i")
                    Stuff(:wfUser="wfUser", draggable)
                    
    block content
        v-tabs-items(v-model="tab" style="height: 100%;", :touchless="true").transparent
            v-tab-item(:key="'workflow'", style="height: 100%;")
                CasesWorkflow
            v-tab-item(:key="'inShop'", style="height: 100%") 
                div InShop

</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BaseLayoutVue from './BaseLayout';
import Stuff from '$src/components/Stuff.vue';
import { isEmpty } from '$src/utils/composition.util.js';

export default {
    extends: BaseLayoutVue,
    data() {
        return {
            tab: null,
            showed: null,
            groupModel: null,
            menuList: [
                {
                    text: 'Change company',
                    handler: this.removeCompany
                },
                {
                    text: 'Log out',
                    handler: this.logout
                }
            ],
            intervalId: null
        };
    },
    methods: {
        ...mapActions([
            'logout',
            'removeCompany',
            'setLoading',
            'readCases',
            'getWfUsers',
            'setUsersType',
            'connect',
            'getWfStat',
            'getDetailParam'
        ]),
        toggleUsers(usersType) {
            this.showed = this.groupModel =
                this.showed === usersType ? null : usersType;
            this.setUsersType(this.showed);
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'choosedCompany',
            'isLoading',
            'wfUsers',
            'choosedUsersType',
            'canToAssign',
            'wfStats',
            'updates',
            'lists'
        ]),
        breadcrumbs() {
            if (!this.user) {
                return [];
            }
            
            let user = { text: this.user.user_name };
            let company = { text: this.choosedCompany.company_name };

            return [company, user];
        }
    },
    components: {
        CasesWorkflow: () => import('$src/components/CasesWorkflow.vue'),
        Stuff
    },
    async created() {
        if (!this.isLoading) {
            this.setLoading(true);
        }

        isEmpty(this.updates) && this.connect();
        isEmpty(this.wfStats) && this.getWfStat();
        isEmpty(this.wfUsers) && this.getWfUsers();
        isEmpty(this.detailParam) && this.getDetailParam();
        
        let readCasesResponse = isEmpty(this.lists) && await this.readCases();

        if (process.env.NODE_ENV === 'development' && readCasesResponse) {
            window.console.log(readCasesResponse);
        }

        this.setLoading(false);

        this.intervalId = setInterval(() => {
            this.getWfStat();
            this.getWfUsers();
            this.getDetailParam();
            this.readCases();
        }, 5 * 60 * 1000);
    },
    beforeDestroy() {
        !isEmpty(this.intervalId) && clearInterval(this.intervalId);
    }
};
</script>

<style lang="scss" scoped>
.stuff {
    &-wrapper {
        display: flex;
    }

    & + & {
        margin-left: 10px;
    }
}
</style>
