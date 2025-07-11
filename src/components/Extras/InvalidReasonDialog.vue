<template>
  <v-dialog persistent max-width="400px" :value="DialogInvalidReason">
    <v-card>
      <v-toolbar dark dense class="elevation-0" color="primary">
        <div>
          <v-icon small class="mr-2">mdi-information</v-icon
          ><span></span> Reasons
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="DialogInvalidReasonEmit((Toggle = 1))"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-list-item v-for="(item, idx) in StoreObj.reasons" :key="idx">
          <v-list-item-content>
            <v-list-item-title>{{ `${idx + 1}. ${item}` }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    DialogInvalidReason: Boolean,
  },
  data: () => ({}),
  methods: {
    DialogInvalidReasonEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
