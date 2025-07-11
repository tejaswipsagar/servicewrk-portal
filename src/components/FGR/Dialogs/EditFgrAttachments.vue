<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      v-model="EditFgrAttachemntsDialog"
      width="70%"
      height="90%"
      persistent
    >
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Attachments</div>
          <v-spacer></v-spacer>
          <v-btn text @click="saveAttachments()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <!-- Saved Attachments Section -->
          <div
            class="mt-4"
            v-if="copiedAttachementObj.section_attachments?.length > 0"
          >
            <h3>Saved Attachments</h3>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <div
                class="ma-2"
                v-for="(
                  attachment, index
                ) in copiedAttachementObj.section_attachments"
                :key="`saved-${index}`"
              >
                <v-img
                  v-if="isImage(attachment.file_url)"
                  cover
                  :src="attachment.file_url"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <div class="d-flex">
                      <div>
                        <v-btn
                          color="red"
                          icon
                          @click="deleteAttachment('SECTION_ATT', index)"
                        >
                          <v-icon small color="red">mdi-close-circle</v-icon>
                        </v-btn>
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="downloadImgMethod(attachment.file_url)"
                          ><v-icon color="blue">mdi-download</v-icon></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="ViewAttachmentsMethod(attachment.file_url)"
                          ><v-icon color="green">mdi-eye</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-img>
                <div v-else-if="isVideo(attachment.file_url)">
                  <div style="position: absolute; z-index: 1000">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachment('SECTION_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                  <video
                    controls
                    :src="attachment.file_url"
                    style="width: 200px; height: 100px; position: relative"
                  ></video>
                </div>
                <v-img
                  v-else
                  src="@/assets/file.jpg"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <!-- <v-btn
                      color="red"
                      icon
                      @click="deleteAttachment('SECTION_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn> -->
                    <div class="d-flex">
                      <div>
                        <v-btn
                          color="red"
                          icon
                          @click="deleteAttachment('SECTION_ATT', index)"
                        >
                          <v-icon small color="red">mdi-close-circle</v-icon>
                        </v-btn>
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="downloadImgMethod(attachment.file_url)"
                          ><v-icon color="blue">mdi-download</v-icon></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="ViewAttachmentsMethod(attachment.file_url)"
                          ><v-icon color="green">mdi-eye</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-img>
              </div>
            </div>
          </div>

          <!-- Newly Added Attachments Section -->
          <div class="mt-4" v-if="groupedAttachments.length > 0">
            <h3>Newly Added Attachments</h3>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <div
                class="ma-2"
                v-for="(attachment, index) in groupedAttachments"
                :key="`new-${index}`"
              >
                <v-img
                  v-if="isImage(attachment.file_url)"
                  cover
                  :src="attachment.file_url"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <div class="d-flex">
                      <div>
                        <v-btn
                          color="red"
                          icon
                          @click="deleteAttachment('NEW_ATT', index)"
                        >
                          <v-icon small color="red">mdi-close-circle</v-icon>
                        </v-btn>
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="downloadImgMethod(attachment.file_url)"
                          ><v-icon color="blue">mdi-download</v-icon></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="ViewAttachmentsMethod(attachment.file_url)"
                          ><v-icon color="green">mdi-eye</v-icon></v-btn
                        >
                      </div>
                    </div>
                    <!-- <v-btn
                      color="red"
                      icon
                      @click="deleteAttachment('NEW_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn> -->
                  </div>
                </v-img>
                <div v-else-if="isVideo(attachment.file_url)">
                  <div style="position: absolute; z-index: 1000">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachment('NEW_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                  <video
                    controls
                    :src="attachment.file_url"
                    style="width: 200px; height: 100px; position: relative"
                  ></video>
                </div>

                <v-img
                  v-else
                  src="@/assets/file.jpg"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <div class="d-flex">
                      <div>
                        <v-btn
                          color="red"
                          icon
                          @click="deleteAttachment('NEW_ATT', index)"
                        >
                          <v-icon small color="red">mdi-close-circle</v-icon>
                        </v-btn>
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="downloadImgMethod(attachment.file_url)"
                          ><v-icon color="blue">mdi-download</v-icon></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="ViewAttachmentsMethod(attachment.file_url)"
                          ><v-icon color="green">mdi-eye</v-icon></v-btn
                        >
                      </div>
                    </div>
                    <!-- <v-btn
                      color="red"
                      icon
                      @click="deleteAttachment('NEW_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn> -->
                  </div>
                </v-img>
              </div>
            </div>
          </div>

          <!-- Save Notice -->
          <!-- <div class="text-center mt-3">
            <h5 class="red--text">Kindly Save after adding/deleting files</h5>
          </div> -->
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="text-capitalize white--text"
              color="primary"
              small
              @click="saveAttachments()"
            >
              OK
              <v-icon small class="pl-1">mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
export default {
  components: { Snackbar },
  props: {
    EditFgrAttachemntsDialog: Boolean,
    AttachementObj: Object,
  },
  data() {
    return {
      copiedAttachementObj: {},
      renderComp: true,
      SnackBarComponent: {},
    };
  },
  computed: {
    groupedAttachments() {
      const savedAttachments =
        this.copiedAttachementObj.section_attachments ?? [];
      const newlyAddedAttachments =
        this.copiedAttachementObj.newly_added_attachments ?? [];

      // Remove duplicates
      return newlyAddedAttachments.filter(
        (newAttachment) =>
          !savedAttachments.some(
            (saved) => saved.file_url === newAttachment.file_url
          )
      );
    },
  },
  watch: {
    EditFgrAttachemntsDialog(val) {
      if (val) {
        this.copiedAttachementObj = JSON.parse(
          JSON.stringify(this.AttachementObj)
        );
      }
    },
  },
  methods: {
    isImage(url) {
      return /\.(png|jpeg|jpg|gif|bmp|tiff|ico|webp)$/i.test(url);
    },
    isVideo(url) {
      return /\.(mp4|mov|wmv|avi|webm|m4a|flac|mp3|wav|aac)$/i.test(url);
    },

    async downloadImgMethod(file) {
      console.log("FILE", file);
      try {
        // Use fetch without 'no-cors' if CORS is properly configured
        const response = await fetch(file);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.split("/").pop() || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the file:", error);
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Error while downloading an image!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    ViewAttachmentsMethod(file) {
      window.open(file);
    },

    deleteAttachment(type, index) {
      if (type === "SECTION_ATT") {
        this.copiedAttachementObj.section_attachments.splice(index, 1);
      } else if (type === "NEW_ATT") {
        this.copiedAttachementObj.newly_added_attachments.splice(index, 1);
      }
    },
    saveAttachments() {
      const extractedAttachments = [
        ...(this.copiedAttachementObj.section_attachments || []),
        ...(this.groupedAttachments || []),
      ];
      this.$emit("clicked", 2, extractedAttachments);
    },
    closeDialog() {
      this.$emit("clicked", 1);
    },
  },
};
</script>
