<template lang="pug">
v-container(fluid)
  v-card
    v-row.mx-0
      v-col
        v-row(v-for="precObj in precs", :key="precObj.description")
          v-col.grey--text(cols="12") {{ precObj.description }}
          v-col(
            cols="12",
            sm="6",
            md="4",
            lg="3",
            xl="2",
            v-for="img in precObj.images",
            :key="img"
          )
            v-img(:src="img", v-if="activeDC")
</template>

<script>
import groupby from "lodash.groupby";
import { mapGetters } from "vuex";
export default {
  name: "Preconditions",
  props: {
    caseInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters(["activeDC", "preconditions"]),
    precs() {
      const addInfos = this.caseInfo.add_info;
      const envelopeId = addInfos[0] && addInfos[0].envelope_id;
      const precsObj = groupby(this.caseInfo.add_info || [], "prec_id");
      return Object.entries(precsObj).map(([id, precs]) => {
        const precondition =
          this.preconditions.find((precObj) => +precObj.id === +id) || {};
        const images = precs.map((prec) => {
          let image = `${prec.reference}/${prec.file_name}`;
          image = image.replace(".jpg", "_m");

          return `${this.activeDC}/dl/0/${envelopeId}/${image}`;
        });
        return {
          description: precondition.description || "",
          images,
        };
      });
    },
  },
};
</script>
