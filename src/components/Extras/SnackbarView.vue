<template>
  <v-snackbar
    :value="SnackBarComponent.SnackbarVmodel"
    :color="SnackBarComponent.SnackbarColor"
    :top="SnackBarComponent.Top"
    timeout="5000"
  >
    <div class="text-center">{{ SnackBarComponent.SnackbarText }}</div>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    SnackBarComponent: Object,
  },
};
</script>

<style></style>
