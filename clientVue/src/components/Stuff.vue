<template lang="pug">
    .stuff(@dragstart="assignStart", @dragend="assignEnd")
        .stuff__icon(:class="`stuff__icon--${wfUser.icon}`", 
                    :style="{background: wfUser.bgColor}",
                    :title="onlyIcon ? wfUser.user_name : null" ) {{ wfUser.initials }}
        .stuff__name(v-if="!onlyIcon") {{ wfUser.user_name }}
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: ['wfUser', 'onlyIcon'],
    methods: {
        ...mapActions(['startToAssign', 'endToAssign']),
        assignStart(e) {
            this.startToAssign();
            e.dataTransfer.effectAllowed = 'copy';
            const user_id = this.wfUser.user_id;
            e.dataTransfer.setData('user_id', user_id);
        },
        assignEnd() {
            this.endToAssign();
        }
    }
};
</script>

<style lang="scss" scoped>
.stuff {
    display: flex;
    align-items: stretch;
    font-size: 12px;
    color: #fff;
    position: relative;
    cursor: pointer;

    &__icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        z-index: 2;

        &--ellipse {
            border-radius: 10px;
        }

        &--circle {
            border-radius: 50%;
        }

        &--rhomb {
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
    }

    &__name {
        white-space: nowrap;
        margin-left: -16px;
        background-color: rgba(144, 144, 144, 0.7);
        line-height: 32px;
        padding-left: 21px;
        padding-right: 10px;
        border-bottom-right-radius: 32px;
        border-top-right-radius: 32px;
        z-index: 1;
    }
}
</style>