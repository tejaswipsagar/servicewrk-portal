<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />
    <v-dialog
      class="pa-2"
      v-model="rechargecreditDialog"
      width="1200px"
      height="700px"
    >
      <v-toolbar color="primary" class="white--text elevation-0" dense dark>
        <div>Recharge Credits</div>
        <v-spacer />
        <v-icon @click="CloseDialog((Toggle = 1))">mdi-close </v-icon>
      </v-toolbar>
      <v-card class="pa-4">
        <v-radio-group class="pa-2" dense v-model="radios" row>
          <v-row>
            <v-col @click="radios = 0" cols="12" md="2" sm="12" lg="2">
              <v-img
                contain
                src="@/assets/Value.png"
                :class="radios == 0 ? 'zoom-efect' : ''"
              ></v-img>
              <v-radio
                v-if="radios == 0"
                class=""
                color="primary"
                label="Select"
                v-model="valueradio"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="valueradio1"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
            <v-col @click="radios = 1" cols="12" md="2" sm="12" lg="2">
              <v-img
                :class="radios == 1 ? 'zoom-efect' : ''"
                contain
                src="@/assets/Value+.png"
              ></v-img>
              <v-radio
                v-if="radios == 1"
                class="green"
                color="primary"
                label="Select"
                v-model="valueplusradio2"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="valueplusradio3"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
            <v-col @click="radios = 2" cols="12" md="2" sm="12" lg="2">
              <v-img
                :class="radios == 2 ? 'zoom-efect' : ''"
                contain
                src="@/assets/Super Value.png"
              ></v-img>
              <v-radio
                v-if="radios == 2"
                class="green"
                color="primary"
                label="Select"
                v-model="SuperValueradio2"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="SuperValueradio3"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
            <v-col @click="radios = 3" cols="12" md="2" sm="12" lg="2">
              <v-img
                :class="radios == 3 ? 'zoom-efect' : ''"
                contain
                src="@/assets/Super Value+.png"
              ></v-img>
              <v-radio
                v-if="radios == 3"
                class="green"
                color="primary"
                label="Select"
                v-model="SuperValueplusradio2"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="SuperValueplusradio3"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
            <v-col @click="radios = 4" cols="12" md="2" sm="12" lg="2">
              <v-img
                :class="radios == 4 ? 'zoom-efect' : ''"
                contain
                src="@/assets/Ultra Value.png"
              ></v-img>
              <v-radio
                v-if="radios == 4"
                class="green"
                color="primary"
                label="Select"
                v-model="ultravalueradio2"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="ultravalueradio3"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
            <v-col @click="radios = 5" cols="12" md="2" sm="12" lg="2">
              <v-img
                :class="radios == 5 ? 'zoom-efect' : ''"
                contain
                src="@/assets/Ultra Value+.png"
              ></v-img>
              <v-radio
                v-if="radios == 5"
                class="green"
                color="primary"
                label="Select"
                v-model="ultravalueplusradio2"
                style="
                  font-weight: bolder;
                  font-size: 40px;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
              <v-radio
                v-else
                class="white"
                color="white"
                label="Select"
                v-model="ultravalueplusradio3"
                style="
                  font-weight: bolder;
                  margin-top: -35px;
                  margin-left: 30px;
                "
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
        <v-row align="center" justify="center" class="ma-2">
          <v-card-actions>
            <v-btn
              :loading="loading"
              @click="redirectpayment()"
              small
              color="primary"
              ><v-icon small>mdi-currency-inr</v-icon>PROCEED TO PAY
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-dialog>
    <PaymentSuccessful :paysuccess="paysuccess" />
  </div>
</template>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
import { API } from "aws-amplify";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import PaymentSuccessful from "@/components/Recharge/PaymentSuccessful.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    PaymentSuccessful,
  },
  props: {
    rechargecreditDialog: Boolean,
  },
  data: () => ({
    order_id: "",
    amount: "4130",
    loading: false,
    overlay: false,
    paysuccess: false,
    radios: 0,
    valueradio: 0,
    valueradio1: 0,
    valueplusradio2: 1,
    valueplusradio3: 1,
    SuperValueradio2: 2,
    SuperValueradio3: 2,
    ultravalueradio2: 4,
    ultravalueradio3: 4,
    SuperValueplusradio2: 3,
    SuperValueplusradio3: 3,
    ultravalueplusradio2: 5,
    ultravalueplusradio3: 5,
    SnackBarComponent: {},
  }),
  watch: {
    radios(val) {
      if (val == 0) {
        this.pack = "1000 CREDITS";
        this.credits = 3500;
        this.amount = 4130;
      } else if (val == 1) {
        this.pack = "5000 CREDITS ";
        this.credits = 15000;
        this.amount = 17700;
      } else if (val == 2) {
        this.pack = "25000 CREDITS ";
        this.credits = 25000;
        this.amount = 29500;
      } else if (val == 3) {
        this.credits = 50000;
        this.pack = "50000 CREDITS ";
        this.amount = 59000;
      } else if (val == 4) {
        this.credits = 75000;
        this.pack = "75000 CREDITS ";
        this.amount = 88500;
      } else if (val == 5) {
        this.credits = 100000;
        this.pack = "100000 CREDITS ";
        this.amount = 118000;
      }
    },
  },
  methods: {
    async razorpayResponse(response) {
      if (response.hasOwnProperty("error")) {
        alert("Payment Unsuccessul.");
      } else {
        this.paysuccess = true;
      }
    },
    async redirectpayment() {
      this.loading = true;
      const path = "/razorpaypayment";
      const v = {
        body: {
          command: "generateOrderId",
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          payment_initiator_id:
            this.$store.getters.get_current_user_details.user_id,
          amount: this.amount,
        },
      };
      await API.post("razorpaypayment", path, v)
        .then((res) => {
          if (res.status == "SUCCESS") {
            this.order_id = res.order_id;
            this.key_secret = "hkBOpj4ez9D8Exrw14OThXXL";
            this.loading = false;
            var rzp1 = new Razorpay({
              key_id: "rzp_live_f69SvLfBZi4RLS",
              amount: this.amount,
              currency: "INR",
              name: "ServiceWRK Recharge",
              description: this.pack,
              image:
                "https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/e3bcefad-4b74-476a-80ec-2a602fd30434/OrganizationLogo/logo2.jpg",
              order_id: this.order_id,
              handler: this.razorpayResponse,
              prefill: {
                name: "",
                email: this.$store.getters.get_user_email.user_email_id,
                contact: "",
              },
              notes: {
                address: "",
              },
              theme: {
                color: "#7b046c",
              },
              redirect: false,
            });
            rzp1.on("payment.failed", this.razorpayResponse);
            rzp1.open();
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    CloseDialog(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
