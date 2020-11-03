<template lang="pug">
    include layout.pug
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['isLoading', 'isAuthenticated', 'choosedUsersType', 'snackbar']),
    },
    methods: {
        ...mapActions(['hideSnackbar']),
    },
};
</script>

<style>
.content {
    background-color: #444141;
}

.v-toolbar--extended + .content {
    max-height: calc(100vh - 48px - 50px);
}
</style>
