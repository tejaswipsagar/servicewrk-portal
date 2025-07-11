<template>
  <v-dialog fullscreen flat>
    <v-card class="ma-5">
      <v-card-text align="end">
        <v-btn
          x-small
          @click="gotoDashBoard"
          class="mt-5 gradient-bg white--text"
          >Back to Home</v-btn
        ></v-card-text
      >
      <v-row justify="center" align="center">
        <v-card-text align="center" class="mt-8">
          <v-img
            width="242"
            height="242"
            src="@/assets/paymentsucess.png"
          ></v-img>
          <div><h3>Payment Successful !</h3></div>
        </v-card-text>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    paysuccess: Boolean,
  },
  data: () => ({
    countDown: 10,
  }),
  watch: {
    // paysuccess(val) {
    //   if (val == true) {
    //     this.callinterval();
    //     this.countDownTimer();
    //   } else {
    //     clearInterval(this.myVar);
    //   }
    // },
  },
  methods: {
    gotoDashBoard() {
      this.$router.push("Dashboard");
    },
    //  countDownTimer() {
    //   if (this.countDown > 0) {
    //     setTimeout(() => {
    //       this.countDown -= 1;
    //       this.countDownTimer();
    //     }, 1000);
    //   }
    // },
    //  callinterval() {
    //   this.myVar = setInterval(
    //     () => {
    //       this.gotoDashBoard();
    //     },
    //     10000,
    //     this
    //   );
    // },
  },
};
</script>
