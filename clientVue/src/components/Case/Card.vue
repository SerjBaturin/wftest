<template lang="pug">
    .case(draggable, @dragstart="dragStart($event, status, index)", @dragend="dragEnd", v-on="handlers",
            :class="priorityClass")
        v-img.case__img(v-if="imageSrc && !hideImg" :src="imageSrc" @error="() => hideImg = true")
        .case__number # {{ caseObj.params.env_no && caseObj.params.env_no.param_value }}
        .case__car
            .case__car-info
                | {{ caseObj.vehicle.vehicle_production_year }} 
                | {{ caseObj.vehicle.vehicle_make_desc }}
                | {{ caseObj.vehicle.vehicle_model }}
            .case__car-vin {{ caseObj.vehicle.vehicle_vin }}
            .case__car-owner
                i.fa.fa-user.mr-2(aria-hidden="true")
                | {{ caseObj.first_name }} {{ caseObj.last_name }}
            .case__car-stuff
                Stuff(v-for="stuff in carStuff", :key="stuff.user_id", :wfUser="stuff", :onlyIcon="true")
            .case__car-status In status: {{ shortDurationText }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { crono } from 'vue-crono';
import chunk from 'lodash.chunk';

import { getStuff as _getStuff, isEmpty } from '$src/utils/composition.util.js';

const MINUTE = 1000 * 60;

export default {
    mixins: [crono],
    cron: {
        time: MINUTE,
        method: 'updateDuration',
        autostart: false
    },
    props: ['status', 'index', 'caseObj'],
    data: () => ({
        duration: 0,
        imageSrc: '',
        hideImg: false
    }),
    methods: {
        ...mapActions(['startMoveCase', 'endMoveCase', 'assignUser']),
        dragStart(e, statusName, index) {
            this.startMoveCase();
            e.dataTransfer.effectAllowed = 'move';

            e.dataTransfer.setData('statusName', statusName);
            e.dataTransfer.setData('index', index);

            setTimeout(() => {
                e.target.classList.add('d-none');
            }, 0);
        },
        dragEnd(e) {
            this.endMoveCase();
            e.target.classList.remove('d-none');
        },
        drop(e) {
            const userId = e.dataTransfer.getData('user_id');
            const payload = {
                wfStatus: this.status,
                caseIndex: this.index,
                wfUserId: userId,
                choosedUsersType: this.choosedUsersType
            };

            this.assignUser(payload);
        },
        getStatusDuration() {
            const history = chunk(
                this.wfStats[this.caseObj.envelope_id]?.history.filter(
                    historyItem =>
                        historyItem.from_status_id === this.status ||
                        historyItem.to_status_id === this.status
                ),
                2
            );

            this.duration = history.reduce(
                (
                    dur,
                    [to, from = { start_datetime: new Date().toString() }]
                ) => {
                    const diff =
                        new Date(from.start_datetime) -
                        new Date(to.start_datetime);
                    return dur + diff;
                },
                0
            );
        },
        updateDuration() {
            if (+this.caseObj.status !== 0) {
                this.duration += MINUTE;
            }
        },
        setImgSrc() {
            if (this.activeDC && this.caseObj.imgSrc) {
                this.imageSrc = this.activeDC + this.caseObj.imgSrc;
            }
        }
    },
    computed: {
        ...mapGetters([
            'wfUsers',
            'assignInProcess',
            'canToAssign',
            'choosedUsersType',
            'wfStats',
            'activeDC'
        ]),
        carStuff() {
            const getStuff = _getStuff(this.caseObj.params, this.wfUsers);

            let estimators = getStuff('est_list', 'estimators');
            let bodytechs = getStuff('bt_list', 'bodytechs');
            let painters = getStuff('pnt_list', 'painters');
            let others = getStuff('oth_list', 'others');

            let stuffList = [estimators, bodytechs, painters, others]
                .flat()
                .reduce((stuffList, curStuff) => {
                    return stuffList.findIndex(
                        stuff => stuff.user_id === curStuff.user_id
                    ) === -1
                        ? stuffList.concat(curStuff)
                        : stuffList;
                }, []);

            return stuffList;
        },
        handlers() {
            return this.assignInProcess && this.canToAssign
                ? {
                      dragover: e => e.preventDefault(),
                      drop: this.drop
                  }
                : null;
        },
        priorityClass() {
            const priorityValue = this.caseObj.params?.case_priority
                ?.param_value;
            return (
                (priorityValue && [`case--priority-${+priorityValue}`]) || []
            );
        },
        shortDurationText() {
            if (this.duration === 0) {
                return '';
            }

            let duration = this.duration;

            const days = Math.floor(duration / (1000 * 60 * 60 * 24));
            duration -= days * (1000 * 60 * 60 * 24);

            const hours = Math.floor(duration / (1000 * 60 * 60));
            duration -= hours * (1000 * 60 * 60);

            const mins = Math.floor(duration / (1000 * 60));
            duration -= mins * (1000 * 60);

            return `${days > 99 ? '>99' : days}d ${hours}h ${mins}m`;
        }
    },
    watch: {
        wfStats() {
            if (+this.status !== 0) {
                this.getStatusDuration();
                this.$cron.start('updateDuration');
            }
        },
        status() {
            if (+this.status !== 0) {
                this.getStatusDuration();
            }
        }
    },
    created() {
        if (isEmpty(this.activeDC)) {
            const unwatch = this.$watch('activeDC', () => {
                unwatch();
                this.setImgSrc();
            });
        } else {
            this.setImgSrc();
        }
    },
    components: { Stuff: () => import('$src/components/Stuff') }
};
</script>

<style lang="scss" scoped>
.case {
    display: block;
    text-decoration: none;
    background-color: #e2e2e2;
    border-radius: 10px;
    color: #979494;

    $h: 29px;
    padding-bottom: $h;

    &__img {
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }

    &__number {
        height: $h;
        line-height: $h;
    }

    &__car {
        background-color: #fff9f9;
        padding-top: 7px;
        padding-bottom: 7px;

        &-info {
            color: #000;
            font-weight: bold;
        }

        &-owner {
            color: #f3ad2e;
        }

        &-stuff {
            min-height: 50px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
    }

    &__number,
    &__car {
        padding-left: 10px;
        padding-right: 10px;
    }

    &--priority {
        &-1,
        &-2 {
            border: solid 2px;
        }

        &-1 {
            border-color: #ffdc98;
        }

        &-2 {
            border-color: #ff0000;
        }
    }

    &__car-status {
        font-size: 12px;
    }
}

.stuff {
    & + & {
        margin-left: 5px;
    }
}

.stuff__name {
    display: none;
}
</style>
