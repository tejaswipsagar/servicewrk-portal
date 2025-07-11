<template>
  <div>
    <!-- <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" /> -->
    <v-dialog v-model="DisplayPaymentImagesDialog" persistent :width="800">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Attachments</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DisplayPaymentImagesDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <!-- {{ StoreArray }} -->
          <v-carousel v-model="model">
            <v-carousel-item
              v-for="(imgItem, index) in StoreArray"
              :key="index"
            >
              <v-toolbar dense>
                <h4 class="">File Name : {{ imgItem.file_name }}</h4>
                <v-spacer />
                <v-btn
                  :loading="downloadLoading"
                  small
                  icon
                  color="primary"
                  @click.stop="downloadFile(imgItem)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </v-toolbar>
              <v-sheet height="100%" tile>
                <v-row class="fill-height mt-2" align="center" justify="center">
                  <div>
                    <v-img
                      v-if="imgItem.file_type.includes('image')"
                      :src="imgItem.file_url"
                      width="780px"
                      height="400px"
                      contain
                    />
                    <v-img
                      v-if="imgItem.file_type.includes('pdf')"
                      src="@/assets/file.jpg"
                      width="780px"
                      contain
                      @click.stop="downloadPdf(imgItem.file_url)"
                    ></v-img>
                    <video
                      v-if="imgItem.file_type.includes('video')"
                      width="640"
                      height="360"
                      controls
                    >
                      <source :src="imgItem.file_url" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { GeneratePresignedUrlForGetImage } from "@/graphql/mutations.js";

export default {
  props: {
    StoreArray: Array,
    DisplayPaymentImagesDialog: Boolean,
  },
  data: () => ({
    model: 0,
    downloadLoading: false,
  }),
  watch: {
    DisplayPaymentImagesDialog(val) {
      if (val == true) {
        console.log("StoreArray", this.StoreArray);
      }
    },
  },
  methods: {
    async downloadFile(attach) {
      console.log("Downloading...", attach);
      try {
        this.downloadLoading = true;
        const result = await API.graphql(
          graphqlOperation(GeneratePresignedUrlForGetImage, {
            input: { s3_url: attach.file_url },
          })
        );

        let presignedUrl = JSON.parse(
          result.data.GeneratePresignedUrlForGetImage
        );
        fetch(presignedUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const fileType = attach.file_type.split("/")[0];
            link.download = fileType === "video" ? "video.mp4" : "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          })
          .catch(console.error);

        this.downloadLoading = false;
      } catch (error) {
        this.downloadLoading = false;
        console.log("Error", error);
      }
    },

    DisplayPaymentImagesDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    downloadPdf(item) {
      window.open(item);
    },
  },
};
</script>
