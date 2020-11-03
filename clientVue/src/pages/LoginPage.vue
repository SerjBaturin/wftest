<template>
    <Login/>
</template>

<script>
import { mapGetters } from "vuex";
import Login from '$src/layout/Login';

export default {
    name: "LoginPage",
    computed: {
        ...mapGetters(["isAuthenticated"])
    },
    created() {
        if (this.isAuthenticated) {
            this.$router.push({ name: "index" });
        }
    },
    components: { Login }
};
</script>
