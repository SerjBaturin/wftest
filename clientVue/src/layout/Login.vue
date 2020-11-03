<template lang="pug">
    extends BaseLayout/layout.pug
    block content
        v-container.fill-height.justify-center
            v-row
                div.col-12.col-sm-6.col-md-5.col-lg-3.mx-auto
                    v-form(
                        v-model="valid", 
                        lazy-validation, 
                        @submit.prevent="submitHandle", 
                        ref="form")
                        v-text-field(
                            v-model="login"
                            label="Login"
                            :rules="requiredRules"
                            autofocus
                            required)
                        v-text-field(
                            type="password"
                            v-model="passwd"
                            label="Password"
                            :rules="requiredRules"
                            required)
                        v-btn.mt-2.col-12(
                            color="primary"
                            rounded
                            type="submit"
                            :disabled="!valid || isSubmitting") Log In
</template>

<script>
import { mapActions } from "vuex";
import BaseLayout from './BaseLayout';

export default {
    name: "Login",
    extends: BaseLayout,
    data: () => ({
        valid: false,
        login: '',
        passwd: '',
        isSubmitting: false,
        requiredRules: [v => !!v || 'Required field'],
    }),
    methods: {
        ...mapActions(['authenticate', 'setLoading', 'showSnackbar']),
        async submitHandle() {
            if (!this.$refs.form.validate()) {
                return;
            }

            this.isSubmitting = true;
            let result = await this.authenticate({
                login: this.login,
                passwd: this.passwd
            });
            this.isSubmitting = false;

            if (result.error) {
                this.showSnackbar({ text: result.error, color: 'error' });
            }
        }
    },
    mounted() {
        this.setLoading(false);
    }
};
</script>
