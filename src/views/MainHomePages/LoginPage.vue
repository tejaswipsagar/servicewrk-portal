<template>
  <v-card class="elevation-0">
    <SignInDialog
      :sign_in_dialog="sign_in_dialog"
      @clicked="SignInDialogEmit"
    />
    <div>
      <template>
        <div>
          <v-navigation-drawer v-model="drawer" app temporary>
            <v-list>
              <v-list-item>
                <v-list-item-avatar width="100%" height="100%">
                  <img src="@/assets/img/logo.png" alt="Logo" />
                </v-list-item-avatar>
                <v-list-item-content> </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-list dense>
              <v-list-item
                v-for="([icon, text, link], i) in items"
                :key="i"
                link
                @click="$vuetify.goTo(link)"
              >
                <v-list-item-icon class="justify-center">
                  <v-icon>{{ icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="subtitile-1">{{
                    text
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="sign_in_dialog = true">
                <v-list-item-icon class="justify-center">
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="subtitile-1"
                    >Sign In
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
          <v-app-bar app color="white" class="px-6 black">
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
              class="mr-0"
              v-if="isXs"
            />
            <v-toolbar-title>
              <v-img src="@/assets/img/logo.png" max-width="100%" />
            </v-toolbar-title>
            <v-spacer />
            <v-icon @click="sign_in_dialog = true" v-if="isXs"
              >mdi-account-outline</v-icon
            >
            <div v-else>
              <v-btn text @click="$vuetify.goTo('#hero')">
                <span class="mr-2">Home</span>
              </v-btn>
              <v-btn text @click="$vuetify.goTo('#features')">
                <span class="mr-2">About</span>
              </v-btn>
              <v-btn text @click="$vuetify.goTo('#contact')">
                <span class="mr-2">Contact us</span>
              </v-btn>
              <v-btn rounded outlined text @click="sign_in_dialog = true">
                <span class="mr-1">Sign in</span>
              </v-btn>
            </div>
          </v-app-bar>
        </div>
      </template>
      <section id="hero">
        <v-parallax dark src="@/assets/img/bg-hero1.png" height="600">
          <v-row align="center" justify="center">
            <v-col cols="12 ">
              <v-row align="center" justify="center">
                <v-col cols="12" md="5" xl="4" sm="4">
                  <div class="display-1 header font-weight-bold mb-4">
                    <h1>Empower your Field Engineers</h1>
                  </div>
                  <h2 class="font-weight-bold">
                    An easy tool to manage Service Ticket's & increase
                    productivity <br />
                  </h2>
                  <v-btn
                    rounded
                    outlined
                    large
                    dark
                    @click="$vuetify.goTo('#features')"
                    class="mt-12"
                  >
                    Know More
                    <v-icon class="ml-2">mdi-arrow-down</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" xl="4" class="hidden-sm-and-down">
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="svg-border-waves text-white">
            <v-img src="@/assets/img/borderWaves.svg" />
          </div>
        </v-parallax>
        <v-container fluid id="features" class="mt-n16 pt-n16">
          <v-row align="center" justify="center">
            <v-col cols="10">
              <v-row align="center" justify="space-around">
                <v-col
                  cols="12"
                  sm="4"
                  class="text-center"
                  v-for="(feature, i) in features"
                  :key="i"
                >
                  <v-hover v-slot:default="{ hover }">
                    <v-card
                      class="card"
                      shaped
                      :elevation="hover ? 10 : 4"
                      :class="{ up: hover }"
                    >
                      <v-img
                        :src="feature.img"
                        max-width="80px"
                        class="d-block ml-auto mr-auto"
                        :class="{ 'zoom-efect': hover }"
                      ></v-img>
                      <h1 class="font-weight-regular">{{ feature.title }}</h1>
                      <h4 class="font-weight-regular subtitle-1">
                        {{ feature.text }}
                      </h4>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <section id="about">
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-col cols="10">
                <v-row align="center" justify="center">
                  <v-col cols="12" md="7">
                    <h1 class="font-weight-dark mb-3">
                      Build a Profitable Service Organization
                    </h1>
                    <br />
                    <v-row>
                      <v-col cols="12" class="d-block align-center">
                        <p>
                          ❶‎‎‎‏‏‎ ‎‏‏‎ ‎ Managers can assign task to field
                          engineers with just one click
                          <br /><br />

                          ❷‏‏‎ ‎‏‏‎ ‎ Ticket generation is simple and easy<br /><br />
                          ❸‏‏‎ ‎‏‏‎ ‎ Tickets are generated and its status is
                          updated<br /><br />

                          ❹‏‏‎ ‎‏‏‎ ‎ Field staff can easily navigate to the
                          exact location for service by accessing the map<br /><br />

                          ❺‏‏‎ ‎‏‏‎ ‎ Helps tracking of technician’s job work<br /><br />
                          ❻‏‏‎ ‎‏‏‎ ‎ Work efficiency calculation or the time
                          taken for each call can be computed
                        </p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="5" class="d-none d-md-flex">
                    <v-img
                      src="@/assets/img/ill1.png"
                      class="d-block ml-auto mr-auto"
                      max-width="400px"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <section id="about">
              <v-container fluid>
                <v-row align="center" justify="center">
                  <v-row align="center" justify="center">
                    <v-col cols="12" class="d-block align-center">
                      <div class="text-center">
                        <v-bottom-sheet v-model="sheet" inset>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn color="purple" dark v-bind="attrs" v-on="on">
                              Click to see value of ServiceWRK
                            </v-btn>
                          </template>
                          <v-sheet class="text-center" height="800px">
                            <div class="my-12">
                              <v-img src="@/assets/img/bg.png" />
                            </div>
                            <v-btn
                              class="mt-n16"
                              text
                              color="error"
                              @click="sheet = !sheet"
                            >
                              close
                            </v-btn>
                          </v-sheet>
                        </v-bottom-sheet>
                      </div>
                    </v-col>
                  </v-row>
                </v-row>
              </v-container>
            </section>
          </v-container>
        </section>

        <section id="download">
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-card-title align="center">
                <h1 class="font-weight-dark white--text mb-3 mt-16">
                  Screenshots of the App
                </h1>
              </v-card-title>
              <div class="image-gallery">
                <v-img src="@/assets/img/app.png" class="img-1" />
                <v-img src="@/assets/img/app2.png" class="img-2" />
                <v-img src="@/assets/img/app4.png" class="img-3" />
                <v-img src="@/assets/img/app3.png" class="img-4" />
                <v-img src="@/assets/img/app5.png" class="img-5" />
              </div>
            </v-row>
          </v-container>
        </section>

        <section class="pb-8" id="contact">
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-col cols="10">
                <v-row justify="center">
                  <v-col cols="12" sm="5">
                    <h1 class="font-weight-black mb-4">Contact us</h1>
                    <h4 class="font-weight-dark mt-3">Address :</h4>
                    <h4 class="font-weight-light mt-3">
                      No 588, HMT Layout Vidyaranyapura,<br />
                      Bangalore - 560097
                    </h4>

                    <h4 class="font-weight-dark mt-3">Phone Number :</h4>
                    <h4 class="font-weight-light mt-3">080 41615842</h4>
                    <br />
                    <h4 class="font-weight-dark">Email :</h4>
                    <h4 class="font-weight-light mt-3">contactus@wrktop.com</h4>

                    <v-btn
                      @click="reportIssue()"
                      class="gradient-bg white--text mr-5 mt-16"
                      x-small
                      >report issue ?</v-btn
                    >
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                      <h1 class="font-weight-black mb-3">Write to Us</h1>
                      <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="Name"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                      <v-select
                        label="Country Code"
                        v-model="CountryCode"
                        :items="CountryList"
                        item-value="dial_code"
                        item-text="name"
                        :rules="codeRules"
                        required
                      >
                        <template slot="selection" slot-scope="{ item }">
                          {{ item.name }}({{ item.dial_code }})
                        </template>
                        <template slot="item" slot-scope="{ item }">
                          {{ item.name }}({{ item.dial_code }})
                        </template>
                      </v-select>
                      <v-text-field
                        v-model="phone"
                        :rules="phoneRules"
                        label="Phone Number"
                        required
                      ></v-text-field>
                      <v-textarea
                        v-model="textArea"
                        :rules="textAreaRules"
                        label="Message"
                        required
                      />
                      <v-btn
                        :disabled="!valid"
                        color="primary"
                        :dark="valid"
                        rounded
                        block
                        class="mt-3"
                        @click="submit"
                      >
                        Send
                      </v-btn>
                    </v-form>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>

          <div class="svg-border-waves text-white mt-12">
            <v-img src="~@/assets/img/borderWavesBlue.png" />
          </div>
        </section>
        <v-footer dark padless>
          <v-card tile class="grey darken-1 white--text text-center">
            <v-card-text class="white--text">
              Copyright © All rights reserved by WRKTOP Technologies
            </v-card-text>
          </v-card>
        </v-footer>
        <v-scale-transition>
          <v-btn
            fab
            v-show="fab"
            v-scroll="onScroll"
            dark
            fixed
            bottom
            right
            color="primary"
            @click="toTop"
          >
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </v-scale-transition>
      </section>
    </div>
  </v-card>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import SignInDialog from "@/components/Login/Dialogs/SignInDialog.vue";
export default {
  components: {
    SignInDialog,
  },
  data: () => ({
    fab: null,
    sign_in_dialog: false,
    CountryCode: "India(+91)",
    valid: true,
    name: "",
    submit: false,
    Country: "",
    CountryList: [],
    dialog: false,
    sheet: false,
    nameRules: [
      (v) => !!v || "Name must be filled.",
      (v) => (v && v.length >= 6) || "Minimum 6 Charechers",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-Mail is required.",
      (v) => /.+@.+\..+/.test(v) || "Enter appropriate E-Mail",
    ],
    code: "",
    codeRules: [
      (v) => !!v || "Country Code is must",
      //  (v) => (v && v.length == country) || "Country Code should contain",
    ],
    phone: "",
    phoneRules: [
      (v) => !!v || "Phone Number is must",
      (v) => (v && v.length >= 9) || "Phone should contain 10 numbers",
    ],
    textArea: "",
    textAreaRules: [
      (v) => !!v || "Enter Message",
      (v) => (v && v.length >= 10) || "Minimum 10 characters",
    ],
    lazy: false,
    snackbar: {
      enabled: false,
      text: "",
      color: "",
    },
    drawer: null,
    isXs: false,
    items: [
      ["mdi-home-outline", "Home", "#hero"],
      ["mdi-information-outline", "About", "#features"],
      ["mdi-email-outline", "Contact us", "#contact"],
    ],
    features: [
      {
        img: require("@/assets/img/a1.png"),
        title: "‎‎‎Ticket Creation",
        text: "Log customer queries across channels as a ticket",
      },
      {
        img: require("@/assets/img/a2.png"),
        title: "Ticket Assignment",
        text: "Field Engineer can  claim a floating ticket or  get  a ticket assigned (based on availabilty or expertise)",
      },
      {
        img: require("@/assets/img/a3.png"),
        title: "Ticket Resolution",
        text: "Field  Engineer resolves issue and ticket is closed by OTP based satisfactory acceptance from customer",
      },
    ],
  }),
  watch: {
    fab(value) {
      if (value) {
        this.color = "secondary";
      } else {
        this.color = "transparent";
      }
    },
  },

  created() {
    this.CountryListDetails();
    this.CountryCode = "India(+91)";
    const top = window.pageYOffset || 0;
    if (top <= 60) {
      this.color = "transparent";
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },

  methods: {
    reportIssue() {
      window.open("http://www.bugtrakr.com/BugReportForm/SRVCEWRK");
    },
    SignInDialogEmit() {
      this.sign_in_dialog = false;
    },
    onResize() {
      this.isXs = window.innerWidth < 850;
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 60;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    CountryListDetails() {
      this.CountryList = CountryList;
    },
    GetCurrentCountry() {
      fetch("https://extreme-ip-lookup.com/json/")
        .then((res) => res.json())
        .then((response) => {
          this.dial_code = response.country;
          var self = this;
          self.CountryList.forEach(function (CountryIDX) {
            if (CountryIDX.name == response.country) {
              self.CountryCode = CountryIDX.dial_code;
            }
          });
        })
        .catch((data, status) => {
          console.log("Request failed data", data);
          console.log("Request failed status", status);
        });
    },
  },
};
</script>
<style>
#about {
  padding-top: 30px;
  background-color: #f4f7f5;
}
#download {
  background-color: black;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 700px;
}

#download .container,
#download .row {
  height: 100%;
}
.image-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    "img-1 img-2 img-3 img-4"
    "img-1 img-5 img-5 img-6";
}

.image-gallery {
  width: 100%;
  margin: 50px;
  margin-left: 100px;
  margin-right: 100px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.img-1 {
  grid-area: img-1;

  min-height: 20rem;
}
.img-2 {
  grid-area: img-2;

  min-height: 20rem;
}

.img-1:hover,
.img-2:hover,
.img-3:hover,
.img-4:hover,
.img-5:hover,
.img-6:hover {
  transform: scale(1.22);
}
@media screen and (max-width: 600px) {
  #download {
    height: 400px;
  }
  .image-gallery {
    width: 100%;
    margin: 50px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .img-1 {
    grid-area: img-1;

    min-height: 7rem;
  }
  .img-2 {
    grid-area: img-2;

    min-height: 7rem;
  }
}

#contact {
  padding-top: 30px;
  background-color: #f4f7f5;
}
.v-card {
  width: 100%;
}
.svg-border-waves .v-image {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rem;
  width: 100%;
  overflow: hidden;
}
.header h1 {
  font-size: 36px;
}

@media only screen and (max-width: 400px) {
  .header h1 {
    font-size: 28px;
  }
  h2 {
    color: rgb(136, 134, 134);
    background-color: purple;
    opacity: 0.9;
    padding: -20px;
    text-align: justify;
    display: unset;
    cursor: pointer;
    -webkit-transition: background-color 2s ease-out;
    -moz-transition: background-color 2s ease-out;
    -o-transition: background-color 2s ease-out;
    transition: background-color 2s ease-out;
  }
}
.gradient-btn {
  background: -webkit-linear-gradient(#7b046c 40%, #bd58b0 60%);
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: transparent;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #bd58b0 0%, #7b046c 100%);
  background: -moz-linear-gradient(145deg, #bd58b0 0%, #7b046c 100%);
  background: -o-linear-gradient(145deg, #bd58b0 0%, #7b046c 100%);
  background: -ms-linear-gradient(145deg, #bd58b0 0%, #7b046c 100%);
  background: linear-gradient(145deg, #bd58b0 0%, #7b046c 100%);
}
.gradient-bg2 {
  background: -webkit-linear-gradient(145deg, #7b046c 0%, #bd58b0 100%);
  background: -moz-linear-gradient(145deg, #7b046c 0%, #bd58b0 100%);
  background: -o-linear-gradient(145deg, #7b046c 0%, #bd58b0 100%);
  background: -ms-linear-gradient(145deg, #7b046c 0%, #bd58b0 100%);
  background: linear-gradient(145deg, #7b046c 0%, #bd58b0 100%);
}
</style>
<style>
.svg-border-waves .v-image {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rem;
  width: 100%;
  overflow: hidden;
}

#hero {
  z-index: 0;
}

.svg-border-waves img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: -2px;
  z-index: -1;
}
.btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: -2px;
  z-index: -1;
}

.card {
  min-height: 300px;
  padding: 10px;
  transition: 0.5s ease-out;
}

.card .v-image {
  margin-bottom: 15px;
  transition: 0.75s;
}

.card h1 {
  margin-bottom: 10px;
}

.zoom-efect {
  transform: scale(1.1);
}

.up {
  transform: translateY(-20px);
  transition: 0.5s ease-out;
}
</style>

<style>
section {
  position: relative;
}
.v-toolbar {
  transition: 0.6s;
}

.expand {
  height: 80px !important;
  padding-top: 10px;
}
</style>
