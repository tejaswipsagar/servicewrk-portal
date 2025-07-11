<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="sign_in_dialog"
      max-width="400px"
      persistent
      transition="dialog-top-transition"
    >
      <v-card class="elevation-0">
        <v-toolbar dense class="elevation-0 gradient-bg white--text" dark>
          <v-toolbar-title class="font-weight-light">{{
            currentTitle
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="SignInDialogEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="pt-4" align="center" justify="center">
          <v-img max-width="120px" src="@/assets/logo2.jpg"></v-img>
        </div>
        <v-card-text>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    dense
                    label="Email ID *"
                    class="FontSize"
                    autocomplete="off"
                    prepend-inner-icon="mdi-account"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => /.+@.+/.test(v) || 'Email must be valid',
                    ]"
                    v-model="Login.EmailID"
                    @keyup="mailPasswordLowerCaseMethod(Login.EmailID)"
                  ></v-text-field>
                  <v-text-field
                    autocomplete="off"
                    label="Password *"
                    class="FontSize"
                    :type="isPwd ? 'text' : 'password'"
                    @click:append="isPwd = !isPwd"
                    required
                    :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Login.Password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="py-0">
                <v-checkbox
                  dense
                  class="my-0 ml-2"
                  v-model="rememberme"
                  label="Remember Me"
                  :disabled="Login.EmailID == '' || Login.Password === ''"
                />
                <v-spacer></v-spacer>
                <v-btn
                  x-small
                  text
                  class="FontSize mb-4"
                  color="primary"
                  @click="step = 3"
                  >Forgot Password ?</v-btn
                >
              </v-card-actions>
              <v-card-actions class="pt-0 pb-8 px-4">
                <v-btn
                  block
                  :loading="loading"
                  tile
                  class="gradient-bg white--text"
                  @click="ValidateLoginForm()"
                  >Login</v-btn
                >
              </v-card-actions>
              <div class="text-center mt-n6">OR</div>
              <v-card-actions class="px-4 pb-4">
                <v-btn block tile outlined small @click="step = 5"
                  >Login With OTP</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text>
                <v-form ref="formCP" lazy-validation>
                  <v-text-field
                    class="BorderRadius FontSize"
                    dense
                    autocomplete="off"
                    label="Enter New Password *"
                    :type="isPwdNew ? 'text' : 'password'"
                    @click:append="isPwdNew = !isPwdNew"
                    required
                    :append-icon="isPwdNew ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Password.NewPassword"
                  ></v-text-field>
                  <v-text-field
                    class="BorderRadius FontSize"
                    dense
                    autocomplete="off"
                    label="Confirm New Password *"
                    :type="isPwdConfirm ? 'text' : 'password'"
                    @click:append="isPwdConfirm = !isPwdConfirm"
                    required
                    :append-icon="isPwdConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Password.ConfirmPassword"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="pt-0 pb-8 px-4">
                <v-btn
                  block
                  :loading="loading"
                  tile
                  class="gradient-bg2 white--text"
                  @click="ValidateConfirmPasswordForm()"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <v-form ref="formOTP">
                  <div class="text-center" style="color: #7b046c">
                    Please Enter The Registered Email
                  </div>
                  <v-text-field
                    label="Email"
                    outlined
                    autocomplete="off"
                    v-model="OTPEmail"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => /.+@.+/.test(v) || 'Email must be valid',
                    ]"
                    class="mt-4 FontSize"
                  >
                  </v-text-field>
                  <div class="FontSize text-center" style="color: #7b046c">
                    *Please enter the e-mail used for login/registration
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" small @click="step = 1"
                  >Back To Sign In</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn text color="primary" small @click="ValidateOTP()"
                  >Next</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <v-form ref="formConfirmOTP">
                  <div class="text-center" style="color: #0c9f6b">
                    Enter the Activation Code
                  </div>
                  <v-text-field
                    label="Code *"
                    autocomplete="off"
                    v-model="ConfirmOTP"
                    :rules="[(v) => !!v || 'Code is required']"
                    class="mt-4 FontSize"
                  >
                  </v-text-field>
                  <v-text-field
                    autocomplete="off"
                    label="Enter New Password *"
                    v-model="ConfirmNewPassword"
                    :rules="[(v) => !!v || 'Password is required']"
                    class="mt-4 FontSize"
                    :type="isPwdConfirmCode ? 'text' : 'password'"
                    @click:append="isPwdConfirmCode = !isPwdConfirmCode"
                    required
                    :append-icon="isPwdConfirmCode ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                  >
                  </v-text-field>
                  <div class="FontSize text-center" style="color: #0c9f6b">
                    Enter the Activation Code sent to your registered Email.
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" small @click="step = 1"
                  >Back To Sign In</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn text color="primary" small @click="ValidateEnteredOTP()"
                  >Next</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="5">
              <v-card-text>
                <v-form ref="loginWithOPT">
                  <v-text-field
                    dense
                    label="Email ID *"
                    class="FontSize"
                    prepend-inner-icon="mdi-account"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => /.+@.+/.test(v) || 'Email must be valid',
                    ]"
                    v-model="EmailForOPT"
                    @keyup="mailOtpLowerCaseMethod(EmailForOPT)"
                  ></v-text-field>
                </v-form>
                <v-card-actions class="pt-0 pb-8 px-0">
                  <v-btn
                    tile
                    block
                    @click="getOptMethods()"
                    :loading="loading_get_otp_btn"
                    class="primary white--text"
                  >
                    Get OTP
                  </v-btn>
                </v-card-actions>
                <div class="mt-n6 text-center">OR</div>
                <v-card-actions class="px-0">
                  <v-btn
                    tile
                    block
                    outlined
                    @click="(step = 1), (EmailForOPT = '')"
                    >Back to Sign in</v-btn
                  >
                </v-card-actions>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="6">
              <div>Enter OTP</div>
              <v-card-text>
                <v-form ref="form_enter_otp_step">
                  <v-otp-input
                    dense
                    v-model="opt_to_login"
                    :rules="[(v) => !!v || 'OTP is required']"
                  ></v-otp-input>
                </v-form>
                <v-card-actions class="px-0">
                  <v-btn
                    block
                    tile
                    :loading="loading_btn_check_otp"
                    class="primary white--text"
                    @click="validateOPTMethod()"
                  >
                    Login
                  </v-btn>
                </v-card-actions>
                <v-card-actions class="px-0">
                  <v-btn
                    block
                    outlined
                    tile
                    @click="(step = 5), (opt_to_login = '')"
                  >
                    Go Back
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    sign_in_dialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    loading_get_otp_btn: false,
    loading_btn_check_otp: false,
    step: 1,
    Login: {
      EmailID: "",
      Password: "",
    },
    EmailForOPT: "",
    opt_to_login: "",
    ConfirmOTP: "",
    ConfirmNewPassword: "",
    OTPEmail: "",
    isPwdNew: false,
    isPwdConfirm: false,
    isPwdConfirmCode: false,
    Password: {
      NewPassword: "",
      ConfirmPassword: "",
    },
    isPwd: false,
    loading: false,
    rememberme: false,
    user: {},
    SnackBarComponent: {},
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign In";
        case 2:
          return "Change Temporary Password";
        case 3:
          return "Forgot Password ?";
        case 4:
          return "Forgot Password ?";
        case 5:
          return "Enter Email ID";
        case 6:
          return "Enter OTP";
        default:
          return "Account created";
      }
    },
  },
  watch: {
    rememberme(val) {
      if (val == true) {
        localStorage.setItem("currentuseremail", JSON.stringify(this.Login));
      } else if (val == false) {
        delete localStorage.currentuseremail;
      }
    },
  },
  mounted() {
    this.CheckRememberMe();
  },
  methods: {
    mailOtpLowerCaseMethod(EmailForOPT) {
      this.EmailForOPT = EmailForOPT.trim().toLowerCase();
    },
    mailPasswordLowerCaseMethod(mail) {
      this.Login.EmailID = mail.trim().toLowerCase();
    },
    validateOPTMethod() {
      if (this.$refs.form_enter_otp_step.validate()) {
        this.confirmOTPForLogin();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Enter OTP *",
          };
          this.renderComp = true;
        });
      }
    },
    async confirmOTPForLogin() {
      try {
        this.loading_btn_check_otp = true;
        await Auth.sendCustomChallengeAnswer(this.user, this.opt_to_login).then(
          (result) => {
            if (result.attributes.email_verified == undefined) {
              this.loading_btn_check_otp = false;
              this.renderComp = false;
              this.$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "red",
                  Top: true,
                  SnackbarText: "Invalid OTP Entered",
                };
                this.renderComp = true;
              });
            } else {
              this.renderComp = false;
              this.loading_btn_check_otp = false;
              this.$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "green",
                  Top: true,
                  SnackbarText: "Logged in Successfully..!",
                };
                this.renderComp = true;
              });
              this.ActivateMethod();
            }
          }
        );
      } catch (error) {
        console.log("error :", error);
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.message,
          };
          this.renderComp = true;
        });
        this.loading_btn_check_otp = false;
      }
    },
    getOptMethods() {
      if (this.$refs.loginWithOPT.validate()) {
        this.opt_login();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Enter Email ID *",
        };
      }
    },
    async opt_login() {
      try {
        this.loading_get_otp_btn = true;
        this.user = await Auth.signIn(this.EmailForOPT.toLowerCase().trim());
        this.$store.commit("SET_USEREMAIL", this.EmailForOPT);
        if (this.user.challengeName === "CUSTOM_CHALLENGE") {
          this.step = 6;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "OTP Sent Successfully !",
            };
            this.renderComp = true;
          });
        }
        this.loading_get_otp_btn = false;
      } catch (error) {
        console.log("error :", error);
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Invalid Mail ID !!",
          };
          this.renderComp = true;
        });
        this.loading_get_otp_btn = false;
      }
    },
    CheckRememberMe() {
      if (localStorage.getItem("currentuseremail") != null) {
        this.Login = JSON.parse(localStorage.getItem("currentuseremail"));
        this.rememberme = true;
      }
    },
    ConfirmOTPMethod() {
      Auth.forgotPasswordSubmit(
        this.OTPEmail,
        this.ConfirmOTP,
        this.ConfirmNewPassword
      )
        .then(() => {
          this.$refs.formConfirmOTP.reset();
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Password Successfully Changed",
            };
            this.renderComp = true;
          });
          this.step = 1;
        })
        .catch((err) => {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: err.message,
            };
            this.renderComp = true;
          });
        });
    },
    ValidateEnteredOTP() {
      (this.OTPEmail = this.OTPEmail.trim()),
        (this.ConfirmOTP = this.ConfirmOTP.trim()),
        (this.ConfirmNewPassword = this.ConfirmNewPassword.trim());
      if (this.$refs.formConfirmOTP.validate()) {
        this.ConfirmOTPMethod();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Enter The Code Sent To Registered Email",
          };
          this.renderComp = true;
        });
      }
    },
    ValidateOTP() {
      this.OTPEmail = this.OTPEmail.trim();
      if (this.$refs.formOTP.validate()) {
        if (this.OTPEmail != "" && this.OTPEmail != null) {
          this.SendOTPEmail();
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Enter Registered Email",
          };
          this.renderComp = true;
        });
      }
    },
    SendOTPEmail() {
      Auth.forgotPassword(this.OTPEmail)
        .then(() => {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "OTP Sent To Registered Email",
            };
            this.renderComp = true;
          });
          this.step = 4;
        })
        .catch((err) => {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: err.message,
            };
            this.renderComp = true;
          });
        });
    },
    async ConfirmPassword() {
      try {
        this.loading = true;
        const result = await Auth.completeNewPassword(
          this.user,
          this.Password.ConfirmPassword
        )
          .then((user) => {
            return user;
          })
          .catch((e) => {
            return e;
          });
        if (result.username) {
          this.$refs.formCP.reset();
          this.loading = false;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Login Successful",
            };
            this.renderComp = true;
          });
          this.ActivateMethod();
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.message,
          };
          this.renderComp = true;
        });
      }
    },
    ValidateConfirmPasswordForm() {
      this.Password.NewPassword = this.Password.NewPassword.trim();
      this.Password.ConfirmPassword = this.Password.ConfirmPassword.trim();
      if (this.$refs.formCP.validate()) {
        if (
          this.Password.NewPassword != "" &&
          this.Password.NewPassword != null &&
          this.Password.ConfirmPassword != "" &&
          this.Password.ConfirmPassword != null
        ) {
          if (this.Password.NewPassword == this.Password.ConfirmPassword) {
            this.ConfirmPassword();
          } else {
            this.$refs.form.reset();
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Password does not match",
              };
              this.renderComp = true;
            });
          }
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with asterisks (*) are mandatory",
          };
          this.renderComp = true;
        });
      }
    },
    ValidateLoginForm() {
      (this.Login.EmailID = this.Login.EmailID.trim()),
        (this.Login.Password = this.Login.Password.trim());
      if (this.$refs.form.validate()) {
        if (
          this.Login.EmailID != "" &&
          this.Login.EmailID != null &&
          this.Login.Password != "" &&
          this.Login.Password != null
        ) {
          this.SignIn();
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with asterisks (*) are mandatory",
          };
          this.renderComp = true;
        });
      }
    },
    async SignIn() {
      try {
        this.overlay = true;
        this.loading = true;
        const user = await Auth.signIn(this.Login.EmailID, this.Login.Password);
        this.user = user;
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          this.step = 2;
          this.loading = false;
          this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
        } else {
          this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Login Successful",
            };
            this.renderComp = true;
          });
          this.ActivateMethod();
        }
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.message,
          };
          this.renderComp = true;
        });
      }
    },
    ActivateMethod() {
      this.overlay = false;
      setTimeout(() => this.$router.push("/LandingPage"), 500);
    },
    SignInDialogEmit() {
      this.step = 1;
      this.EmailForOPT = "";
      this.opt_to_login = "";
      this.$emit("clicked");
    },
  },
};
</script>