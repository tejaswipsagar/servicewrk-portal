<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="previewAttachments" width="50%" height="90%">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Attachments</div>
          <v-spacer></v-spacer>

          <v-btn text @click="previewAttachmentsEmit">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-carousel>
            <v-carousel-item
              v-for="(attachment, index) in StoreArray"
              :key="attachment.file_url + index"
              reverse-transition="fade-transition"
              transition="fade-transition"
            >
              <v-card class="elevation-2">
                <v-toolbar dense>
                  <h4 class="">File Name : {{ attachment.file_name }}</h4>
                  <v-spacer />
                  <v-btn
                    x-small
                    depressed
                    color="primary"
                    class="mr-2 text-capitalize"
                    @click.stop="previewFileMethod(attachment)"
                    >Preview</v-btn
                  >
                  <v-btn
                    v-if="saveAttachment == 'SHARE_ATTACHMENTS'"
                    :disabled="isAttachmentSaved(attachment)"
                    x-small
                    depressed
                    color="primary"
                    class="mr-2 text-capitalize"
                    @click.stop="shareImage(attachment, index)"
                    >Save</v-btn
                  >
                  <v-btn
                    :loading="downloadLoading"
                    small
                    icon
                    color="primary"
                    @click.stop="downloadFile(attachment)"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-card>
              <v-img
                class="imgcontainer"
                v-if="
                  attachment.file_url.endsWith('xlsx') ||
                  attachment.file_url.endsWith('xls') ||
                  attachment.file_url.endsWith('csv') ||
                  attachment.file_url.endsWith('ods') ||
                  attachment.file_url.endsWith('txt') ||
                  attachment.file_url.endsWith('json') ||
                  attachment.file_url.endsWith('rtf') ||
                  attachment.file_url.endsWith('docx')
                "
                src="@/assets/file.jpg"
              ></v-img>
              <v-img
                v-if="
                  attachment.file_url.endsWith('png') ||
                  attachment.file_url.endsWith('PNG') ||
                  attachment.file_url.endsWith('jpeg') ||
                  attachment.file_url.endsWith('jpg') ||
                  attachment.file_url.endsWith('gif') ||
                  attachment.file_url.endsWith('giff') ||
                  attachment.file_url.endsWith('bmp') ||
                  attachment.file_url.endsWith('tif') ||
                  attachment.file_url.endsWith('tiff') ||
                  attachment.file_url.endsWith('ico')
                "
                :src="attachment.file_url"
              />
              <video
                class="mx-auto"
                v-if="
                  attachment.file_url.endsWith('MP4') ||
                  attachment.file_url.endsWith('mp4') ||
                  attachment.file_url.endsWith('MOV') ||
                  attachment.file_url.endsWith('mov') ||
                  attachment.file_url.endsWith('WMV') ||
                  attachment.file_url.endsWith('wmv') ||
                  attachment.file_url.endsWith('AVI') ||
                  attachment.file_url.endsWith('avi') ||
                  attachment.file_url.endsWith('AVCHD') ||
                  attachment.file_url.endsWith('avchd') ||
                  attachment.file_url.endsWith('WEBM') ||
                  attachment.file_url.endsWith('webm') ||
                  attachment.file_url.endsWith('HTML5') ||
                  attachment.file_url.endsWith('html5') ||
                  attachment.file_url.endsWith('M4A') ||
                  attachment.file_url.endsWith('m4a') ||
                  attachment.file_url.endsWith('FLAC') ||
                  attachment.file_url.endsWith('flac') ||
                  attachment.file_url.endsWith('MP3') ||
                  attachment.file_url.endsWith('WAV') ||
                  attachment.file_url.endsWith('wav') ||
                  attachment.file_url.endsWith('WMA') ||
                  attachment.file_url.endsWith('wma') ||
                  attachment.file_url.endsWith('AAC') ||
                  attachment.file_url.endsWith('aac')
                "
                :width="320"
                :height="240"
                controls
              >
                <source :src="attachment.file_url" type="video/mp4" />
              </video>
              <div
                v-if="attachment.file_url.endsWith('pdf')"
                class="text-center mt-15"
              >
                <span style="color: red"
                  >Can't view PDF here, please preview or download</span
                >
                <!-- <span style="color: red"
                  >Can't view PDF here, please download and view</span
                > -->
                <!-- <div class="mt-2">
                  <v-btn
                    dense
                    color="primary"
                    small
                    class="text-capitalize"
                    @click="previewPDFMethod(attachment.file_url)"
                    >Preview</v-btn
                  >
                </div> -->
              </div>
              <div>
                <audio
                  v-if="
                    attachment.file_url.endsWith('mp3') ||
                    attachment.file_url.endsWith('mpeg')
                  "
                  :src="attachment.file_url"
                  controls
                ></audio>
              </div>
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreArray: Array,
    saveAttachment: String,
    previewAttachments: Boolean,
    StoredImages: Array,
  },
  components: { Snackbar },
  data: () => ({
    downloadLoading: false,
    restrictSaveBtn: false,
    ShareImageArray: [],
    SnackBarComponent: {},
    renderComp: true,
  }),

  watch: {
    previewAttachments(val) {
      if (val) {
        console.log("STORE_ARRAY", this.StoreArray);
      }
    },
  },

  computed: {
    isAttachmentSaved() {
      return (attachment) => {
        const isInStored = this.StoredImages.some(
          (item) => item.file_url === attachment.file_url
        );
        const isInShared = this.ShareImageArray.some(
          (item) => item.file_url === attachment.file_url
        );
        return isInStored || isInShared;
      };
    },
  },

  methods: {
    previewPDFMethod(url) {
      console.log("LINK", url);
      window.open(url, "_blank");
    },

    previewFileMethod(attach) {
      window.open(attach.file_url, "__blank");
    },

    shareImage(attach) {
      const isExist = this.StoredImages.some(
        (item) => item.file_url === attach.file_url
      );
      if (isExist) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Document already saved!",
            Top: true,
          };
          this.renderComp = true;
        });
      } else {
        this.ShareImageArray.push(attach);
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Document saved successfully!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    async downloadFile(attach) {
      console.log("HERE222");
      try {
        this.downloadLoading = true;
        const result = await API.graphql(
          graphqlOperation(GeneratePresignedUrlForGetImage, {
            input: {
              s3_url: attach.file_url,
            },
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
            console.log("FILE_TYPE", fileType);
            link.download =
              fileType === "mp4"
                ? "video.mp4"
                : fileType === "jpg" ||
                  fileType === "jpeg" ||
                  fileType === "png"
                ? "image.jpg"
                : fileType === "pdf"
                ? "document.pdf"
                : fileType === "excel-xlsx"
                ? "spreadsheet.xlsx"
                : fileType === "excel-xls"
                ? "spreadsheet.xls"
                : fileType === "pptx"
                ? "presentation.pptx"
                : fileType === "ppt"
                ? "presentation.ppt"
                : "file.txt";
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

    previewAttachmentsEmit() {
      this.StoreArray = [];
      this.$emit("clicked", this.ShareImageArray);
      this.restrictSaveBtn = false;
      setTimeout(() => {
        this.ShareImageArray = [];
      }, 1000);
    },
  },
};
</script>
