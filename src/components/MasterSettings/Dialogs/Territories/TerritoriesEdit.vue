<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="EditTerritoryDialog" persistent width="500px">
      <v-card tile class="elevation-0">
        <v-toolbar dense class="elevation-0 gradient-bg white--text">
          <div class="ml-2">
            {{ ActionObj.action == "EDIT" ? "EDIT" : "Delete" }}
            {{ ActionObj.pincode_territory_type }}
          </div>
          <v-spacer />
          <v-btn size="small" dark icon @click="EditTerritoriesEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-form ref="forms">
          <v-text-field
            v-if="ActionObj.action == 'EDIT'"
            dense
            outlined
            label="Territory Type"
            v-model="Pincode_Territory_type"
            class="mx-4 mt-2"
          ></v-text-field>

          <v-select
            v-if="ActionObj.action == 'EDIT'"
            v-model="selection"
            :items="options"
            label="Select Option"
            dense
            outlined
            class="mx-4"
          ></v-select>

          <v-select
            v-if="selection === 'Hours'"
            dense
            outlined
            label="Hours"
            v-model="Time_Values"
            :items="TimeArray"
            class="mx-4"
          ></v-select>
          <v-menu
            v-if="ActionObj.action == 'EDIT' && selection === 'Days'"
            v-model="menu"
            :close-on-content-click="false"
            nudge-width="150"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formattedDay"
                label="Select Day"
                readonly
                dense
                outlined
                v-bind="attrs"
                v-on="on"
                class="mx-4"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :picker-date="baseDate"
              :min="startDate"
              :max="endDate"
              show-current="false"
              no-title
              scrollable
              @input="updateFormattedDay"
              class="Date_Custom mt-3"
              width="350"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" class="mt-n8" @click="menu = false"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-form>
        <div
          align="center"
          v-if="ActionObj.action == 'DELETE'"
          class="mx-3 my-3"
        >
          Do you need to delete designation
          <span class="font-weight-bold text-red"
            >{{ ActionObj.pincode_territory_type }} </span
          >?
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            @click="EditTerritoriesEmit(1)"
            dark
            depressed
            variant="flat"
            >Cancel</v-btn
          >
          <v-btn
            v-if="ActionObj.action == 'EDIT'"
            small
            dark
            depressed
            color="primary"
            variant="elevated"
            @click="editPinCodeMethod()"
            :loading="loading"
            >EDIT</v-btn
          >
          <v-btn
            v-if="ActionObj.action == 'DELETE'"
            small
            dark
            depressed
            color="red"
            @click="DeletePharmacyMethod()"
            :loading="loading"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { EditPincodeType } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: {
    EditTerritoryDialog: Boolean,
    ActionObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Pincode_Territory_type: "",
    loading: false,
    SnackBarComponent: {},
    Time_Values: "",
    Territory_Type: "",
    options: ["Hours", "Days"],
    selection: "",
    menu: false,
    time: null,
    formattedTime: "",
    date: null,
    formattedDay: "",
    baseDate: "2025-01-01",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    renderComp: true,
  }),
  computed: {
    TimeArray() {
      let Time_Value = [];
      for (let i = 1; i <= 24; i++) {
        if (i === 1) {
          Time_Value.push(`${i} Hour`);
        } else {
          Time_Value.push(`${i} Hours`);
        }
      }
      return Time_Value;
    },
  },
  watch: {
    EditTerritoryDialog(val) {
      if (val == true) {
        console.log("ActionObj", this.ActionObj);
        this.Pincode_Territory_type = this.ActionObj.pincode_territory_type;
        this.selection = this.ActionObj.estimated_time.includes("Days")
          ? "Days"
          : "Hours";
        this.formattedDay = this.ActionObj.estimated_time.includes("Days")
          ? this.ActionObj.estimated_time
          : "";
        this.Time_Values = this.ActionObj.estimated_time.includes("Hours")
          ? this.ActionObj.estimated_time
          : "";
      }
    },
  },
  methods: {
    updateFormattedDay() {
      if (this.date) {
        const day =
          Math.floor(
            (new Date(this.date) - new Date(this.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        this.formattedDay = `${day} Days`;
      }
    },
    EditTerritoriesEmit(Toggle) {
      this.$refs.forms.reset();
      this.$emit("clicked", Toggle);
    },
    async editPinCodeMethod() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          pincode_id: this.ActionObj.pincode_id,
          pincode_territory_type: this.Pincode_Territory_type,
          estimated_time:
            this.selection == "Days" ? this.formattedDay : this.Time_Values,
        };
        let result = await API.graphql(
          graphqlOperation(EditPincodeType, {
            input: inputparams,
          })
        );

        this.loading = false;
        var ResultObject = JSON.parse(result.data.EditPincodeType);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.EditTerritoriesEmit(2);
        }
      } catch (error) {
        this.loading = false;
        console.log("error", error);
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
  },
};
</script>
