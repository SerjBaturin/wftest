<template lang="pug">
    extends BaseLayout/layout.pug
    block content
        v-container(style="display: flex; height: 100%")
            v-row(align="center")
                v-col(cols="12")
                    v-row
                        v-col.text-center(cols="12")
                            template(v-if="user && user.company_list.length > 0")
                                v-row.my-2.justify-center(v-for="(company, i) in user.company_list" :key="i")
                                    v-btn.col-11.col-sm-6.col-md-5.col-lg-4(rounded, color="primary", @click="choseCompany(i)") {{ company.company_name }}
                            template(v-else-if="user")
                                span Company List is empty
                            template(v-else)
                                v-row.my-2.justify-center
                                    v-btn.col-11.col-sm-6.col-md-5.col-lg-4(rounded, color="primary", loading)
                    v-row    
                        v-col.text-center(cols="12")
                            v-row.my-2.justify-center
                                v-btn.col-11.col-sm-6.col-md-5.col-lg-4(rounded, color="error", @click="logout") Log out
</template>

<script>
import BaseLayout from "./BaseLayout";

import { mapGetters, mapActions } from "vuex";
export default {
    extends: BaseLayout,
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        ...mapActions(['choseCompany', 'setLoading', 'logout'])
    },
    async created() {
        this.setLoading(false);
    }
};
</script>
