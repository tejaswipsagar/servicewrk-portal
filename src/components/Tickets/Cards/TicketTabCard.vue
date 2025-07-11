<template>
  <v-card flat>
    <v-tabs
      class="ma-2"
      v-model="tab"
      background-color="transparent"
      color="primary"
    >
      <v-tab>Ticket Details </v-tab>
      <v-tab>Work Logs </v-tab>
      <v-tab
        v-if="
          $store.getters.get_current_user_details.user_type != 'DEALER_OWNER'
        "
        >Ticket History
      </v-tab>
      <v-tab
        v-if="
          $store.getters.get_current_user_details.user_type != 'DEALER_OWNER'
        "
        >Chat</v-tab
      >
      <v-toolbar dense class="elevation-0">
        <v-spacer /><v-spacer />
        <v-btn @click="EmitTab()" class="mr-5 mt-2" small color="primary"
          ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
        >
      </v-toolbar>
    </v-tabs>
    <v-card flat v-if="tab == 0">
      <ViewTicketDetails :StoreObj="StoreObj" />
    </v-card>
    <v-card flat v-if="tab == 1">
      <WorkHistory :StoreObj="StoreObj" />
    </v-card>
    <v-card flat v-if="tab == 2">
      <ViewTicketHistory :StoreObj="StoreObj" />
    </v-card>
    <v-card flast v-if="tab == 3">
      <ViewChats :StoreObj="StoreObj" />
    </v-card>
  </v-card>
</template>
<script>
import ViewChats from "@/components/Tickets/Cards/ViewChats.vue";
import WorkHistory from "@/components/Tickets/Cards/WorkHistory.vue";
import ViewTicketHistory from "@/components/Tickets/Cards/ViewTicketHistory.vue";
import ViewTicketDetails from "@/components/Tickets/Cards/ViewTicketDetails.vue";
export default {
  components: {
    ViewChats,
    WorkHistory,
    ViewTicketHistory,
    ViewTicketDetails,
  },
  props: {
    StoreObj: Object,
  },
  data() {
    return {
      Toggle: 0,
      tab: null,
    };
  },
  methods: {
    EmitTab() {
      this.$emit("clicked");
    },
  },
};
</script>
