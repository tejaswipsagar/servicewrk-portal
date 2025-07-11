<template>
  <div>
    <v-dialog :value="previewAttachments" width="70%" height="90%">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Uploaded Documents</div>
          <v-spacer></v-spacer>
          <v-btn text @click="previewAttachmentsEmit">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-carousel>
            <v-carousel-item
              v-for="(item, i) in this.StoreObjNew.attachments != undefined
                ? this.StoreObjNew.attachments
                : this.StoreObjNew.attachment_file != undefined
                ? this.StoreObjNew.attachment_file
                : this.StoreObjNew.product_attachment_file"
              :key="i"
              reverse-transition="fade-transition"
              transition="fade-transition"
            >
              <v-img
                v-if="typeof item != 'string'"
                :src="item.file_url"
                contain
                height="80%"
                @click="downloadImg(item.file_url)"
              ></v-img>
              <v-img
                v-else
                :src="item"
                contain
                height="80%"
                @click="downloadImg(item)"
              >
              </v-img>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjNew: Object,
    previewAttachments: Boolean,
  },
  watch: {
    previewAttachments(val) {
      if (val) {
        console.log("ATTA", this.StoreObjNew);
      }
    },
  },
  methods: {
    previewAttachmentsEmit() {
      this.$emit("clicked");
    },
    downloadImg(item) {
      window.open(item);
    },
  },
};
</script>
