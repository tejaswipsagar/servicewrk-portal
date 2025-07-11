divdiv
<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="AddServiceDetailsDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Add Service Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="AddServiceDetailsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <div v-if="StoreObj.action !== 'DELETE'">
            <v-form ref="form">
              <div>
                <v-text-field
                  dense
                  outlined
                  label="Service Name"
                  v-model="serviceName"
                  :rules="[(v) => !!v || 'Required']"
                />
              </div>
              <!-- <div>
                <v-text-field
                  dense
                  outlined
                  label="Service Type Name"
                  v-model="serviceType"
                  :rules="[(v) => !!v || 'Required']"
                />
              </div> -->
            </v-form>
            <div>
              <v-text-field
                dense
                outlined
                label="GST"
                v-model="serviceGST"
                :rules="[(v) => !!v || 'Required']"
              />
            </div>
            <div>
              <v-text-field
                dense
                outlined
                label="Cost"
                v-model="serviceCost"
                :rules="[(v) => !!v || 'Required']"
              />
            </div>
          </div>
          <div v-else>
            Do you want to delete <strong>{{ StoreObj.service_name }}</strong
            >?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="AddServiceMethod()" color="primary"
            >{{
              StoreObj.action === "EDIT"
                ? "Edit"
                : StoreObj.action === "DELETE"
                ? "Delete"
                : "Add"
            }}<v-icon size="15" class="pl-1">{{
              StoreObj.action === "EDIT"
                ? "mdi-pencil"
                : StoreObj.action === "DELETE"
                ? "mdi-delete"
                : "mdi-plus"
            }}</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    AddServiceDetailsDialog: Boolean,
    PrevData: Array,
    StoreObj: Object,
  },
  components: { Snackbar },
  data: () => ({
    serviceName: "",
    // serviceType: "",
    serviceGST: 0,
    serviceCost: 0,
    SnackBarComponent: {},
  }),

  watch: {
    AddServiceDetailsDialog(val) {
      if (val) {
        if (this.StoreObj.action === "EDIT") {
          this.serviceName = this.StoreObj.service_name;
          this.serviceCost = this.StoreObj.service_cost;
          this.serviceGST = this.StoreObj.service_gst;
          // this.serviceType = this.StoreObj.service_type_name;
        }
      }
    },
  },

  methods: {
    AddServiceMethod() {
      if (this.StoreObj.action !== "DELETE") {
        if (this.$refs.form.validate()) {
          const obj = {
            service_name: this.serviceName,
            // service_type_name: this.serviceType,
            service_gst: this.serviceGST,
            service_cost: this.serviceCost,
          };
          if (this.StoreObj.action === "EDIT") {
            this.PrevData.splice(this.StoreObj.item_index, 1, obj);
          } else {
            this.PrevData.push(obj);
          }
          this.AddServiceDetailsDialogEmit(2, this.PrevData);
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Data updated successfully",
          };
        } else {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "kindly fill all fields",
          };
        }
      } else {
        this.PrevData.splice(this.StoreObj.item_index, 1);
        this.AddServiceDetailsDialogEmit(2, this.PrevData);
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Data deleted successfully",
        };
      }
    },
    AddServiceDetailsDialogEmit(Toggle, array) {
      this.$emit("clicked", Toggle, array);
      this.$refs.form.reset();
      this.serviceCost = 0;
      this.serviceGST = 0;
    },
  },
};
</script>
