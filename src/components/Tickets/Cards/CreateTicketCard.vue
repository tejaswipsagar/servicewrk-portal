<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card flat>
      <v-row flat class="mx-6 mt-2" height="30" color="#ffffff" dark>
        <div class="black--text font-weight-bold">
          {{
            stepperPage == 1
              ? "Customer Information"
              : stepperPage == 2
              ? "Service Information"
              : stepperPage == 3
              ? "Assignee Information"
              : "Preview Page"
          }}
        </div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          v-if="stepperPage == 2"
          prepend-inner-icon="mdi-magnify"
          class="maxWidth FontSize mt-3 mr-2"
        >
        </v-text-field>
        <v-tooltip bottom class="primary" v-if="stepperPage == 2">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              small
              dense
              v-on="on"
              v-bind="attrs"
              color="primary"
              class="mr-4 mt-3"
              @click.stop="AddCategoryDialog = true"
              ><v-icon>{{ "mdi-plus" }}</v-icon></v-btn
            >
          </template>
          <span>Add New Products</span>
        </v-tooltip>
        <v-btn
          tile
          small
          depressed
          color="primary mt-3"
          @click="CreateTicketCardEmit(1)"
          ><v-icon small class="pr-2">mdi-chevron-double-left</v-icon
          >Back</v-btn
        >
      </v-row>
      <v-card-text>
        <v-window v-model="stepperPage">
          <v-window-item :value="1">
            <v-form ref="form1">
              <Windowpage1
                :CreateFrom="CreateFrom"
                :StoreObj="StoreObj"
                @clicked="windowPage1Emit"
              />
            </v-form>
          </v-window-item>
          <v-window-item :value="2">
            <v-form ref="form2">
              <Windowpage2
                :AddCategoryDialog="AddCategoryDialog"
                :StoredObject="StoredObject"
                :currentWindow="currentWindow"
                :search="search"
                :GetTaggedProductList="GetTaggedProductList"
                @clicked="WindowPageEmit"
              />
            </v-form>
          </v-window-item>
          <v-window-item :value="3">
            <v-form ref="form3">
              <Windowpage3
                :StoredObject="StoredObject"
                :currentWindow="currentWindow"
                @clicked="windowpage3Object"
              />
            </v-form>
          </v-window-item>
          <v-window-item :value="4">
            <Windowpage4
              :RFSObj="RFSObj"
              :CreateFrom="CreateFrom"
              :loading="loading"
              :currentWindow="currentWindow"
              :WindowPag1="WindowPag1"
              :WindowPag2="WindowPag2"
              :WindowPag3="WindowPag3"
              @clicked="WindowPage4Emit"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions class="py-0">
        <v-spacer />
        <v-btn
          small
          outlined
          depressed
          class="mb-4"
          color="primary"
          @click="stepperPage--"
          v-if="stepperPage != 1"
          >Back</v-btn
        >
        <v-btn
          small
          depressed
          color="primary"
          class="mr-2 mb-4"
          v-if="stepperPage != 4"
          @click="WindowNextPageMethod()"
          >Next</v-btn
        >
        <v-btn
          small
          depressed
          color="primary"
          class="mb-4 mr-2"
          :loading="loading"
          v-if="stepperPage == 4"
          @click="WindowNextPageMethod()"
          >Create Ticket</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Windowpage1 from "@/components/Tickets/Cards/WindowPages/WindowPage1.vue";
import Windowpage2 from "@/components/Tickets/Cards/WindowPages/WindowPage2.vue";
import Windowpage3 from "@/components/Tickets/Cards/WindowPages/WindowPage3.vue";
import Windowpage4 from "@/components/Tickets/Cards/WindowPages/WindowPage4.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    Windowpage1,
    Windowpage2,
    Windowpage3,
    Windowpage4,
  },
  props: {
    StoreObj: Object,
    CreateFrom: String,
    RFSObj: Object,
  },
  mixins: [],
  data: () => ({
    search: "",
    window3Obj: {},
    WindowPag1: {},
    WindowPag3: {},
    StoredObject: {},
    SnackBarComponent: {},
    WindowPag2: [],
    SelectedData: [],
    GetTaggedProductList: [],
    loading: false,
    overlay: false,
    renderComp: true,
    AddCategoryDialog: false,
    dialogLookUpCustomer: false,
    date: new Date().toISOString().substr(0, 10),
    step: 1,
    Toggle: 0,
    stepperPage: 1,
    currentWindow: 1,
  }),
  watch: {
    stepperPage(val) {
      this.currentWindow = val;
      if (this.CreateFrom === "RFS") {
        this.StoredObject = this.StoreObj;
      }
      setTimeout(() => {
        if (val === 4) {
          this.WindowPag1 = this.StoredObject;
          this.WindowPag2 = this.SelectedData;
          this.WindowPag3 = this.window3Obj;
        }
      }, 500);
    },
  },

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Customer Information";
        case 2:
          return "Service Information";
        case 3:
          return "Assignee Information";
        default:
          return "Create Ticket Details";
      }
    },
  },
  mounted() {
    if (this.CreateFrom === "RFS") {
      this.StoredObject = this.StoreObj;
    }
  },
  methods: {
    WindowPage4Emit(Toggle) {
      if (Toggle == 2) {
        this.loading = false;
        this.CreateTicketCardEmit(2);
      } else if (Toggle == 3) {
        this.currentWindow = 4;
        this.loading = false;
      }
    },
    windowpage3Object(Toggle, window3Obj) {
      if (Toggle == 2) {
        this.window3Obj = window3Obj;
      }
    },
    WindowPageEmit(Toggle, selectedData) {
      this.AddCategoryDialog = false;
      if (Toggle == 2) {
        this.SelectedData = selectedData;
      }
    },
    windowPage1Emit(Toggle, ServiceLocationDetails) {
      if (Toggle == 2) {
        this.dialogLookUpCustomer = true;
      } else if (Toggle == 3) {
        this.StoredObject = ServiceLocationDetails;
      }
    },
    WindowNextPageMethod() {
      switch (this.stepperPage) {
        case 1:
          if (this.$refs.form1.validate()) {
            this.stepperPage++;
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill All Mandatory Fields *",
              };
              this.renderComp = true;
            });
          }
          break;
        case 2:
          if (this.$refs.form2.validate()) {
            this.stepperPage++;
            this.currentWindow = this.stepperPage;
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill All Mandatory Fields *",
              };
              this.renderComp = true;
            });
          }
          setTimeout(() => {
            if (this.SelectedData.length == 0) {
              if (this.stepperPage == 3) {
                this.stepperPage--;
                this.renderComp = false;
                this.$nextTick(() => {
                  this.SnackBarComponent = {
                    SnackbarVmodel: true,
                    SnackbarColor: "red",
                    Top: true,
                    SnackbarText: "Select Alteast One Product..!",
                  };
                  this.renderComp = true;
                });
              }
            }
          });
          break;
        case 3:
          if (this.$refs.form3.validate()) {
            this.stepperPage++;
            this.currentWindow = this.stepperPage;
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill All Mandatory Fields *",
              };
              this.renderComp = true;
            });
          }
          break;
        case 4:
          this.currentWindow = 5;
          this.loading = true;
          break;
      }
    },
    CreateTicketCardEmit(Toggle, Status_Message) {
      this.$emit("clicked", Toggle, Status_Message);
    },
  },
};
</script>
