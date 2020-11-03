<template lang="pug">
    v-container(fluid)
        v-card.overview__card.pr-0
            v-row
                v-col(cols="12", md="8", lg="9")
                    v-row
                        v-col(cols="12", md="3")
                            v-row
                                v-col VIN 
                                v-col.font-weight-bold {{ caseInfo.vehicle && caseInfo.vehicle.vehicle_vin }}
                            v-row
                                v-col Claim # 
                                v-col.font-weight-bold {{ caseInfo.claim_number }}
                            v-row
                                v-col Plate # 
                                v-col.font-weight-bold {{ caseInfo.vehicle && caseInfo.vehicle.plate_number }}
                        v-divider(vertical)
                        v-col(cols="12", md="4")
                            v-row
                                v-col Insurance 
                                v-col.font-weight-bold {{ insurance.name }}
                            v-row
                                v-col Created 
                                v-col.font-weight-bold {{ caseInfo.create_date | dateParse('YYYY-MM-DD HH:mm:ss') | dateFormat('MMM DD, YYYY') }}
                            v-row
                                v-col Updated 
                                v-col.font-weight-bold {{ caseInfo.database_date | dateParse('YYYY-MM-DD HH:mm:ss') | dateFormat('MMM DD, YYYY') }}
                v-col(cols="12", md="4", lg="3").py-0
                    v-img(v-if="!hideImg && imgSrc", :src="imgSrc", @error="() => hideImg = true", max-height="200").overview__img
                    
        v-card.overview__card
            v-card-subtitle.overview__card-title Customer Authorization
            v-row
                v-col(cols="12")
                    v-chip(color="primary") {{ caseInfo.first_name }} {{ caseInfo.last_name }}
                    
        v-card.overview__card.overview__stuf
            v-card-subtitle.overview__card-title Stuff Assigned
            v-row
                v-col(cols="12", md="4", v-for="(stuffList, i) in stuffs" :key="i").d-md-flex
                    v-list.flex-grow-1.flex-shrink-0
                        v-subheader.overview__subheader(:class="`overview__subheader--${stuffList.modifier}`") 
                            | {{ stuffList.name }}
                        v-list-item(v-for="stuff in stuffList.list" :key="stuff.user_id")
                            v-list-item-content {{ stuff.user_name }}
                            v-spacer
                            v-list-item-content
                                v-btn(text, color="error", @click="removeStuff(stuff)") remove
                    v-divider(v-if="(i + 1) !== stuffs.length" vertical).d-none.d-md-inline-flex
                    v-divider(v-if="(i + 1) !== stuffs.length").d-block.d-md-none

        v-card.overview__card
            v-card-subtitle.overview__card-title Parts
            v-data-table(
                disable-filtering,disable-pagination, disable-sort, hide-default-header, hide-default-footer,
                :headers="partsTable.headers", :items="parts").pb-3.overview__table
                template(v-slot:item.description="{ item }")
                    .text-left {{ item.description.line }}
                    .text-left(v-if="item.description.oem") {{ item.description.oem }}


        v-card.overview__card
            v-card-subtitle.overview__card-title Estimate
            v-data-table(
                disable-filtering,disable-pagination, disable-sort, hide-default-footer
                :items="details", :headers="estimate.headers").pb-3.overview__table
                template(v-slot:item.partsReceived="{ item }")
                    .text-center.text--accent-4(
                        :class="`${item.quantity === partsQuantity ? 'light-green' : 'red'}--text`"
                        ) {{ item.quantity }} / {{ partsQuantity }}
                template(v-slot:item.charge="{ item }")
                    .text-center
                        span(v-if="!item.charge") Click to change
                        v-icon(v-else, color="red") fa-exclamation-triangle
                template(v-slot:item.sublet="{ item }")
                    .text-center
                        v-chip(v-if="item.sublet") {{ 'Sublet' | toUpperCase }}
                        span(v-else) Click to change
                template(v-slot:item.state="{ item }")
                    select(v-model="item.state" v-if="item.sublet")
                        option(value="unscheduled") {{ 'unscheduled' | toUpperCase }}
                        option(value="scheduled") {{ 'scheduled' | toUpperCase }}
                        option(value="completed") {{ 'completed' | toUpperCase }}
</template>

<script>
import { mapGetters } from 'vuex';
import { generateImageUrl } from '$src/utils/prettifyCases.js';
import {
    isEmpty,
    find,
    getStuff as _getStuff,
    isTrueSet
} from '$src/utils/composition.util.js';

/**
 * @typedef {(number|string)} NumberLike
 */

/**
 * @typedef {Object} DetailParam
 * @property {NumberLike} envelope_id
 * @property {('core_chrg' | 'is_sublet' | 'is_scheduled' | 'is_complete')} param_name
 * @property {string} param_value
 */

/**
 * @typedef {Object} Part
 * @property {string} comment
 * @property {NumberLike} envelope_id
 * @property {string} line_description
 * @property {NumberLike} oem_number
 * @property {NumberLike} price
 * @property {NumberLike} type
 * @property {NumberLike} vendor_id
 */

/**
 * @type { import('vue').Component }
 */
const Overview = {
    name: 'CaseOverview',
    props: {
        caseInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            hideImg: false,
            imgSrc: '',
            estimate: {
                headers: [
                    {
                        text: 'Description',
                        value: 'description',
                        divider: true
                    },
                    { text: 'Parts OEM', value: 'partsOEM', divider: true },
                    {
                        text: 'Parts Received',
                        value: 'partsReceived',
                        divider: true
                    },
                    { text: 'W/Core Charge', value: 'charge', divider: true },
                    { text: 'Is Sublet', value: 'sublet', divider: true },
                    { text: 'Sublet Labor State', value: 'state' }
                ]
            },
            partsTable: {
                headers: [
                    { value: 'description', divider: true },
                    { value: 'price', divider: true },
                    { value: 'case', divider: true },
                    { value: 'vendorPart', divider: true },
                    { value: 'commentPart', divider: true }
                ]
            },
            dcWatcher: null
        };
    },
    computed: {
        ...mapGetters([
            'activeDC',
            'insurances',
            'wfUsers',
            'detailParam',
            'whParts',
            'subletVendors'
        ]),
        envId() {
            return +this.$route.params.envId;
        },
        insurance() {
            return find(
                this.insurances,
                ins => +ins.id === +this.caseInfo?.ins_grp_id
            );
        },
        stuffs() {
            const getStuff = _getStuff(this.caseInfo.params, this.wfUsers);

            let estimators = getStuff('est_list', 'estimators');
            let bodytechs = getStuff('bt_list', 'bodytechs');
            let painters = getStuff('pnt_list', 'painters');

            return [
                { name: 'Estimator(s)', list: estimators, modifier: 'est' },
                { name: 'Bodytech(s)', list: bodytechs, modifier: 'body ' },
                { name: 'Painter(s)', list: painters, modifier: 'paint' }
            ];
        },
        partsQuantity() {
            return this.caseInfo.details
                .map(({ part_quantity }) => part_quantity)
                .reduce((acc, val) => acc + val, 0);
        },
        details() {
            /**
             * @type {DetailParam[]}
             */
            const params = (this.detailParam || []).filter(
                param => +param.envelope_id === this.envId
            );

            const chrgValue = params.find(
                param => param.param_name === 'core_chrg'
            )?.param_value;

            const subletValue = params.find(
                param => param.param_name === 'is_sublet'
            )?.param_value;

            const isScheduled = params.find(
                param => param.param_name === 'is_scheduled'
            )?.param_value;

            const isCompleted = params.find(
                param => param.param_name === 'is_complete'
            )?.param_value;

            return this.caseInfo.details.map(detail => ({
                description: detail.line_description,
                partsOEM: detail.oem_part_number,
                quantity: detail.part_quantity,
                charge: +chrgValue === 1,
                sublet: isTrueSet(subletValue),
                state: isTrueSet(isCompleted)
                    ? 'completed'
                    : isTrueSet(isScheduled)
                    ? 'scheduled'
                    : 'unscheduled'
            }));
        },
        parts() {
            /**
             * @type { Part[] }
             */
            const parts = (this.whParts || []).filter(
                part => +part.envelope_id === this.envId
            );

            const vehicle = this.caseInfo.vehicle;

            return parts.map(part => ({
                description: {
                    line: `${part.line_description}${
                        +part.type === 1 ? ' (SCHEDULED)' : ''
                    }`,
                    oem: part.oem_number
                },
                price: part.price + ' $',
                case: [
                    vehicle?.vehicle_production_year,
                    vehicle?.vehicle_make_desc,
                    vehicle?.vehicle_model
                ].join(' '),
                vendorPart:
                    this.subletVendors.vendors?.find(
                        vendor => +vendor.vendor_id === +part.vendor_id
                    )?.name || 'NO VENDOR',
                commentPart: part.comment
            }));
        }
    },
    methods: {
        setImgUrl() {
            const imgUrl = generateImageUrl(this.caseInfo.add_info);
            imgUrl && (this.imgSrc = this.activeDC + imgUrl);
        },
        removeStuff() {}
    },
    created() {
        if (isEmpty(this.activeDC)) {
            const unwatch = this.$watch('activeDC', () => {
                if (!isEmpty(this.activeDC)) {
                    unwatch();
                    this.dcWatcher = {};
                    this.setImgUrl();
                }
            });

            this.dcWatcher = { unwatch };
        } else {
            this.setImgUrl();
        }
    },
    beforeDestroy() {
        this.dcWatcher?.unwatch && this.dcWatcher.unwatch();
    }
};

export default Overview;
</script>

<style lang="scss" scoped>
.overview {
    &__card {
        padding-left: 20px;
        padding-right: 20px;
        overflow: hidden;

        &-title {
            text-transform: uppercase;
        }

        & + & {
            margin-top: 13px;
        }
    }

    &__img {
        margin-right: -20px;
    }

    &__subheader {
        text-transform: uppercase;
        padding-left: 0;
        padding-right: 0;

        &::before {
            content: '';
            display: block;
            width: 15px;
            height: 15px;
            background-color: rgba(255, 255, 255, 0.7);
            margin-right: 6px;
        }

        &--est::before {
            border-radius: 50%;
        }

        &--body::before {
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
    }
}
</style>

<style lang="scss">
.overview {
    &__table {
        tbody {
            background-color: #949494;

            tr:nth-child(2n) {
                background-color: #7f7f7e;
            }
        }
    }
}
</style>
