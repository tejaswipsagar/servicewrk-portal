<template>
  <div>
    <v-dialog v-model="EditFgrAttachemntsDialog" width="70%" height="90%">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Attachments</div>
          <v-spacer></v-spacer>
          <v-btn text @click="EditFgrAttachemntsDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div
            class="mt-4"
            v-if="
              copiedAttachementObj.section_attachments &&
              copiedAttachementObj.section_attachments.length > 0
            "
          >
            <h3>Saved Attachments</h3>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <div
                class="ma-2"
                v-for="(
                  attachement, index
                ) in copiedAttachementObj.section_attachments"
                :key="index"
              >
                <!-- <v-img
                  cover
                  :src="attachement.file_url"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -2px; right: 1px">
                    <v-btn
                      color="red"
                      small
                      @click="deleteAttachmentMethod('SECTION_ATT', index)"
                      ><v-icon small color="white">mdi-delete</v-icon></v-btn
                    >
                  </div>
                </v-img> -->
                <v-img
                  v-if="
                    attachement.file_url.endsWith('png') ||
                    attachement.file_url.endsWith('PNG') ||
                    attachement.file_url.endsWith('jpeg') ||
                    attachement.file_url.endsWith('jpg') ||
                    attachement.file_url.endsWith('gif') ||
                    attachement.file_url.endsWith('giff') ||
                    attachement.file_url.endsWith('bmp') ||
                    attachement.file_url.endsWith('tif') ||
                    attachement.file_url.endsWith('tiff') ||
                    attachement.file_url.endsWith('ico')
                  "
                  cover
                  :src="attachement.file_url"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('SECTION_ATT', index)"
                      ><v-icon small color="red"
                        >mdi-close-circle</v-icon
                      ></v-btn
                    >
                  </div>
                </v-img>
                <div
                  style="
                    position: relative;
                    display: inline-block;
                    width: 200px;
                    height: 100px;
                  "
                  v-if="
                    attachement.file_url.endsWith('MP4') ||
                    attachement.file_url.endsWith('mp4') ||
                    attachement.file_url.endsWith('MOV') ||
                    attachement.file_url.endsWith('mov') ||
                    attachement.file_url.endsWith('WMV') ||
                    attachement.file_url.endsWith('wmv') ||
                    attachement.file_url.endsWith('AVI') ||
                    attachement.file_url.endsWith('avi') ||
                    attachement.file_url.endsWith('AVCHD') ||
                    attachement.file_url.endsWith('avchd') ||
                    attachement.file_url.endsWith('WEBM') ||
                    attachement.file_url.endsWith('webm') ||
                    attachement.file_url.endsWith('HTML5') ||
                    attachement.file_url.endsWith('html5') ||
                    attachement.file_url.endsWith('M4A') ||
                    attachement.file_url.endsWith('m4a') ||
                    attachement.file_url.endsWith('FLAC') ||
                    attachement.file_url.endsWith('flac') ||
                    attachement.file_url.endsWith('MP3') ||
                    attachement.file_url.endsWith('WAV') ||
                    attachement.file_url.endsWith('wav') ||
                    attachement.file_url.endsWith('WMA') ||
                    attachement.file_url.endsWith('wma') ||
                    attachement.file_url.endsWith('AAC') ||
                    attachement.file_url.endsWith('aac')
                  "
                >
                  <video
                    :src="attachement.file_url"
                    controls
                    style="width: 100%; height: 100%"
                  ></video>
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('SECTION_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                </div>

                <v-img
                  v-if="
                    attachement.file_url.endsWith('xlsx') ||
                    attachement.file_url.endsWith('xls') ||
                    attachement.file_url.endsWith('csv') ||
                    attachement.file_url.endsWith('ods') ||
                    attachement.file_url.endsWith('txt') ||
                    attachement.file_url.endsWith('json') ||
                    attachement.file_url.endsWith('rtf') ||
                    attachement.file_url.endsWith('docx')
                  "
                  src="@/assets/file.jpg"
                  :width="200"
                  :height="100"
                  @click.stop="downloadPdf(attachement.file_url)"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('SECTION_ATT', index)"
                      ><v-icon small color="red"
                        >mdi-close-circle</v-icon
                      ></v-btn
                    >
                  </div></v-img
                >
              </div>
            </div>
          </div>
          <div
            class="mt-4"
            v-if="groupedAttachments && groupedAttachments.length > 0"
          >
            <!-- v-if="
              copiedAttachementObj.newly_added_attachments &&
              copiedAttachementObj.newly_added_attachments.length > 0
            " -->
            <h3 v-if="groupedAttachments && groupedAttachments.length > 0">
              <!-- v-if="
                copiedAttachementObj.newly_added_attachments &&
                copiedAttachementObj.section_attachments
              " -->
              Newly Added Attachments
            </h3>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <div
                class="ma-2"
                v-for="(attachement, index) in groupedAttachments"
                :key="index"
              >
                <v-img
                  v-if="
                    attachement.file_url.endsWith('png') ||
                    attachement.file_url.endsWith('PNG') ||
                    attachement.file_url.endsWith('jpeg') ||
                    attachement.file_url.endsWith('jpg') ||
                    attachement.file_url.endsWith('gif') ||
                    attachement.file_url.endsWith('giff') ||
                    attachement.file_url.endsWith('bmp') ||
                    attachement.file_url.endsWith('tif') ||
                    attachement.file_url.endsWith('tiff') ||
                    attachement.file_url.endsWith('ico')
                  "
                  cover
                  :src="attachement.file_url"
                  :width="200"
                  :height="100"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('NEW_ATT', index)"
                      ><v-icon small color="red"
                        >mdi-close-circle</v-icon
                      ></v-btn
                    >
                  </div>
                </v-img>
                <div
                  style="
                    position: relative;
                    display: inline-block;
                    width: 200px;
                    height: 100px;
                  "
                  v-if="
                    attachement.file_url.endsWith('MP4') ||
                    attachement.file_url.endsWith('mp4') ||
                    attachement.file_url.endsWith('MOV') ||
                    attachement.file_url.endsWith('mov') ||
                    attachement.file_url.endsWith('WMV') ||
                    attachement.file_url.endsWith('wmv') ||
                    attachement.file_url.endsWith('AVI') ||
                    attachement.file_url.endsWith('avi') ||
                    attachement.file_url.endsWith('AVCHD') ||
                    attachement.file_url.endsWith('avchd') ||
                    attachement.file_url.endsWith('WEBM') ||
                    attachement.file_url.endsWith('webm') ||
                    attachement.file_url.endsWith('HTML5') ||
                    attachement.file_url.endsWith('html5') ||
                    attachement.file_url.endsWith('M4A') ||
                    attachement.file_url.endsWith('m4a') ||
                    attachement.file_url.endsWith('FLAC') ||
                    attachement.file_url.endsWith('flac') ||
                    attachement.file_url.endsWith('MP3') ||
                    attachement.file_url.endsWith('WAV') ||
                    attachement.file_url.endsWith('wav') ||
                    attachement.file_url.endsWith('WMA') ||
                    attachement.file_url.endsWith('wma') ||
                    attachement.file_url.endsWith('AAC') ||
                    attachement.file_url.endsWith('aac')
                  "
                >
                  <video
                    :src="attachement.file_url"
                    controls
                    style="width: 100%; height: 100%"
                  ></video>
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('NEW_ATT', index)"
                    >
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                </div>

                <v-img
                  v-if="
                    attachement.file_url.endsWith('xlsx') ||
                    attachement.file_url.endsWith('xls') ||
                    attachement.file_url.endsWith('csv') ||
                    attachement.file_url.endsWith('ods') ||
                    attachement.file_url.endsWith('txt') ||
                    attachement.file_url.endsWith('json') ||
                    attachement.file_url.endsWith('rtf') ||
                    attachement.file_url.endsWith('docx')
                  "
                  src="@/assets/file.jpg"
                  :width="200"
                  :height="100"
                  @click.stop="downloadPdf(attachement.file_url)"
                >
                  <div style="position: absolute; top: -10px; right: -8px">
                    <v-btn
                      color="red"
                      icon
                      @click="deleteAttachmentMethod('NEW_ATT', index)"
                      ><v-icon small color="red"
                        >mdi-close-circle</v-icon
                      ></v-btn
                    >
                  </div></v-img
                >
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <h5 class="red--text">Kindly Save after adding/deleting files</h5>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="text-capitalize white--text"
              color="primary"
              small
              @click="saveAttachmentsMethod()"
              >Save Attachments<v-icon small class="pl-1"
                >mdi-bookmark</v-icon
              ></v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    EditFgrAttachemntsDialog: Boolean,
    AttachementObj: Object,
  },

  data: () => ({
    copiedAttachementObj: {},
  }),

  computed: {
    groupedAttachments() {
      const savedAttachments =
        this.copiedAttachementObj.section_attachments ?? [];
      const newlyAddedAttachments =
        this.copiedAttachementObj.newly_added_attachments ?? [];

      // Check for duplicates
      const markedAttachments = newlyAddedAttachments.map((attachment) => {
        const isDuplicate = savedAttachments.some(
          (saved) => saved.file_url === attachment.file_url
        );
        return {
          ...attachment,
          isDuplicate,
        };
      });

      return markedAttachments;
    },
  },

  watch: {
    EditFgrAttachemntsDialog(val) {
      if (val) {
        this.copiedAttachementObj = { ...this.AttachementObj };
        console.log("ATT", this.AttachementObj);
      }
    },
  },
  methods: {
    downloadPdf(file) {
      window.open(file);
    },
    deleteAttachmentMethod(ATT_FROM, index) {
      if (ATT_FROM === "SECTION_ATT") {
        this.copiedAttachementObj.section_attachments.splice(index, 1);
        console.log("YES", this.AttachementObj.section_attachments);
      } else if (ATT_FROM === "NEW_ATT") {
        this.copiedAttachementObj.newly_added_attachments.splice(index, 1);
      }
    },

    // saveAttachmentsMethod() {
    //   const extractedAttachments = [
    //     ...(this.copiedAttachementObj.newly_added_attachments ?? []),
    //     ...(this.copiedAttachementObj.section_attachments ?? []),
    //   ];

    //   this.EditFgrAttachemntsDialogEmit(2, extractedAttachments);
    // },

    saveAttachmentsMethod() {
      const savedAttachments =
        this.copiedAttachementObj.section_attachments ?? [];
      const newlyAddedAttachments =
        this.copiedAttachementObj.newly_added_attachments ?? [];

      const filteredNewAttachments = newlyAddedAttachments.filter(
        (newAttachment) =>
          !savedAttachments.some(
            (savedAttachment) =>
              savedAttachment.file_url === newAttachment.file_url
          )
      );

      const extractedAttachments = [
        ...savedAttachments,
        ...filteredNewAttachments,
      ];

      this.EditFgrAttachemntsDialogEmit(2, extractedAttachments);
    },

    EditFgrAttachemntsDialogEmit(Toggle, extractedAttachments) {
      this.$emit("clicked", Toggle, extractedAttachments);
    },
  },
};
</script>
