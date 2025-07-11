<template>
  <div>
    <v-dialog max-width="600px" :value="tagparntersdialog">
      <v-card class="elevation-0">
        <v-toolbar dense color="primary">
          <v-icon small dark class="mr-2">mdi-tag</v-icon>
          <strong class="white--text"
            >Tag Partner to
            <span>{{ StoreObj.user_name }}</span>
          </strong>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeEmmit((Toggle = 1))">
            <v-icon small class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            :items="GetAllPartnerAndPartnerUserList"
            :single-select="singleSelect"
            show-select
            v-model="selected"
            item-key="partner_id"
            :loading="loading"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="tagPartnerMethod()" color="primary" small
          :loading="loadingbtn"
          >
            confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateDealerUser } from "@/graphql/mutations.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
export default {
  props: {
    StoreObj: Object,
    tagparntersdialog: Boolean,
  },
  mixins: [GetAllPartnerUser],
  data: () => ({
    loading: false,
    loadingbtn : false,
    singleSelect: false,
    selected: [],
    GetAllPartnerAndPartnerUserList: [],
    headers: [
      { text: "Partner Name", value: "user_name" },
      { text: "Partner Mail ID", value: "user_email_id" },
    ],
  }),
  watch: {
    async tagparntersdialog(val) {
      if (val == true) {
        await this.GetAllPartnerUserMethod(
          (this.user_type = "SERVICE_PARTNER"),
          (this.user_status = "ACTIVE"),
          this.partner_id
        );
        var store_ids = this.StoreObj.tagged_partner_ids;
        for (let i = 0; i < store_ids.length; i++) {
          for (
            let j = 0;
            j < this.GetAllPartnerAndPartnerUserList.length;
            j++
          ) {
            if (
              store_ids[i] == this.GetAllPartnerAndPartnerUserList[j].partner_id
            ) {
              this.selected.push(this.GetAllPartnerAndPartnerUserList[j]);
            }
          }
        }
      }
    },
  },
  methods: {
    async tagPartnerMethod() {
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.StoreObj.user_id,
          user_name: this.StoreObj.user_name,
          tagged_partner_ids: this.selected.map((val) => val.partner_id),
        };
        this.loading = true;
        this.loadingbtn = true;
        let result = await API.graphql(
          graphqlOperation(UpdateDealerUser, {
            input: inputParams,
          })
        );
        let ResultObject = JSON.parse(result.data.UpdateDealerUser);
        if (ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.Status_Message,
          };
          this.closeEmmit((this.Toggle = 2), ResultObject.Status_Message);
        }
        this.loadingbtn = false;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.loadingbtn = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
      }
    },
    closeEmmit(Toggle) {
      this.selected = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
