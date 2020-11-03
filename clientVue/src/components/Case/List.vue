<template lang="pug">
    .column(:class="{ 'column--expanded': expanded }", v-on="handlers")
        .column__title(@click="toExpand = length ? !toExpand : toExpand") 
            i.fa.fa-caret-left
            .column__title-text {{ name | toUpperCase }}
        .column__content
            slot
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { canMove, canView } from '$src/utils/role.util';

export default {
    name: 'CaseList',
    props: ['name', 'status'],
    data() {
        return {
            toExpand: false,
        };
    },
    computed: {
        ...mapGetters(['user', 'lists', 'moveInProcess']),
        length() {
            return this.lists[this.status].cases.length;
        },
        canMove() {
            return canMove(this.lists[this.status], this.user.role_list);
        },
        canView() {
            return (
                this.status === '0' ||
                canView(this.lists[this.status], this.user.role_list)
            );
        },
        expanded() {
            return this.canView && this.length ? this.toExpand : true;
        },
        handlers() {
            return this.moveInProcess && this.canMove
            ? {
                  dragover: e => e.preventDefault(),
                  drop: this.drop
              }
            : null;
        }
    },
    methods: {
        ...mapActions(['moveCase']),
        drop(e) {
            let index = e.dataTransfer.getData('index');
            let fromStatus = e.dataTransfer.getData('statusName');
            let toStatus = this.status;

            this.moveCase({ fromStatus, index, toStatus });
        }
    },
};
</script>

<style lang="scss" scoped>
.column {
    background-color: #26292f;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    padding: 13px;
    max-height: 100%;

    &__title {
        display: flex;
        cursor: pointer;
        max-height: 100%;

        i {
            display: block;
            text-align: center;
            font-size: 24px;
        }
    }

    &:not(&--expanded) {
        width: 270px;

        .column__title {
            flex-direction: row-reverse;
            justify-content: space-between;
            margin-bottom: 13px;
        }
    }

    &--expanded {
        max-height: 415px;
        height: 100%;

        .column__title {
            flex-direction: column;
            height: 100%;

            i {
                margin-bottom: 10px;
                transform: rotateZ(180deg);
            }
            
            &-text {
                writing-mode: vertical-rl;
                min-width: 1.5rem;
            }
        }

        .column__content {
            display: none;
        }
    }

    &__content {
        max-height: 100%;
        overflow-y: auto;
        padding: 0 13px;
        margin: 0 -13px;
    }
}
</style>
