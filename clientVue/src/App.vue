<template lang="pug">
v-app
  router-view
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
  },
  methods: {
    ...mapActions(["setLoading"]),
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        return this.$router.push({ name: "index" });
      }

      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="scss">
html {
  overflow-y: auto !important;
}

.theme--dark {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #ffffff;
    -webkit-box-shadow: 0 0 0px 1000px #444141 inset;
    box-shadow: 0 0 0px 1000px #444141 inset;
  }
}
</style>
