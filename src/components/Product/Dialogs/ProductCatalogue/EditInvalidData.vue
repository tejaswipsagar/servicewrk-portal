<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent max-width="450px" :value="DialogEditInvalidData">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-information</v-icon
            ><span></span> Edit Invalid Data
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DialogEditInvalidDataEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-row no-gutters>
              <v-col cols="12" xs="12" sm="12" md="5">
                <v-checkbox
                  v-model="edit_object[create_table.Enable_Technician]"
                  label="Enable Technician"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="5">
                <v-checkbox
                  v-model="edit_object[create_table.Enable_Visibility]"
                  label="Enable Visibility"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-text-field
              outlined
              dense
              label="Master Category *"
              v-model="edit_object[create_table.Master_Category]"
              class="FontSize field_label_size field_height mt-4"
              item-text="category_name"
              item-value="category_id"
              :rules="[
                (v) => !!v || 'Required',
                (v) =>
                  /^(?=[a-zA-Z 0-9@._%+-]{0,100}$)[ a-z A-Z ]{0,100}$/.test(
                    v
                  ) || 'Invalid',
              ]"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              class="FontSize field_label_size field_height"
              label="Category *"
              item-text="user_name"
              item-value="user_name"
              :rules="[(v) => !!v || 'Required']"
              v-model="edit_object[create_table.Category]"
            >
            </v-text-field>
            <v-text-field
              dense
              outlined
              multiple
              class="FontSize field_label_size field_height"
              label="Product *"
              :rules="[(v) => !!v || 'Required']"
              :items="GetAllServicesList"
              item-text="service_name"
              item-value="service_name"
              v-model="edit_object[create_table.Product]"
            >
            </v-text-field>
            <v-text-field
              dense
              outlined
              multiple
              class="FontSize field_label_size field_height"
              label="Product Id *"
              :rules="[(v) => !!v || 'Required']"
              :items="GetAllServicesList"
              item-text="service_name"
              item-value="service_name"
              v-model="edit_object[create_table.Product_Id]"
            >
            </v-text-field>
            <v-text-field
              dense
              outlined
              multiple
              class="FontSize field_label_size field_height"
              label="Service Prefix *"
              :rules="[(v) => !!v || 'Required']"
              item-text="territory_name"
              item-value="territory_name"
              v-model="edit_object[create_table.Ticket_Prefix]"
            >
            </v-text-field>
            <v-text-field
              dense
              outlined
              multiple
              class="FontSize field_label_size field_height"
              label="Service Type *"
              :rules="[(v) => !!v || 'Required']"
              :items="GetAllServicesList"
              item-text="service_name"
              item-value="service_name"
              v-model="edit_object[create_table.Service_Type]"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="validateMethod"
            class="white--text"
            ><span v-text="'Edit'"></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
export default {
  props: {
    StoreObj: Object,
    create_table: Object,
    DialogEditInvalidData: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GetAllUsers, GetAllServices],
  data: () => ({
    renderComp: true,
    CountryList: [],
    service_ids: [],
    SnackBarComponent: {},
    edit_object: {
      create_table: { Enable_Technician: true, Enable_Visibility: true },
    },
  }),
  watch: {
    DialogEditInvalidData(val) {
      if (val == true) {
        this.GetAllServicesMethod("PRODUCT", 'ACTIVE');
        this.edit_object = {
          [this.create_table.Enable_Technician]:
            this.StoreObj[this.create_table.Enable_Technician],
          [this.create_table.Enable_Visibility]:
            this.StoreObj[this.create_table.Enable_Visibility],
          [this.create_table.Master_Category]:
            this.StoreObj[this.create_table.Master_Category],
          [this.create_table.Category]:
            this.StoreObj[this.create_table.Category],
          [this.create_table.Ticket_Prefix]:
            this.StoreObj[this.create_table.Ticket_Prefix],
          [this.create_table.Product]: this.StoreObj[this.create_table.Product],
          [this.create_table.Service_Type]:
            this.StoreObj[this.create_table.Service_Type],
          [this.create_table.Product_Id]:
            this.StoreObj[this.create_table.Product_Id],
        };
      }
    },
  },
  mounted() {
    this.CountryList = CountryList;
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        let edit_object = { ...this.edit_object };
        this.DialogEditInvalidDataEmit((this.Toggle = 2), edit_object);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    DialogEditInvalidDataEmit(Toggle, edit_object) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle, edit_object);
    },
  },
};
</script>
