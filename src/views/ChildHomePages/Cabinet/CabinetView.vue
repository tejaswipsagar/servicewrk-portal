<template>
  <div>
    <Overlay :overlay="overlay" />
    <CreateFolder
      :CreateFolderDialog="createFolderDialog"
      :StoreObj="storeObj"
      @clicked="CreateFolderDialogEmit"
    />
    <UploadFiles
      :UploadFilesDialog="uploadFilesDialog"
      :StoreObj="storeObj"
      @clicked="UploadFilesDialogEmit"
    />
    <v-card class="ma-1" elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Cabinet</div>

        <v-spacer></v-spacer>
        <v-text-field
          style="max-width: 200px"
          class="mr-2 mt-7"
          v-model="search"
          dense
          outlined
          label="Search"
          append-icon="mdi-magnify"
        ></v-text-field>
        <v-btn
          v-if="
            $store.getters.get_user_type === 'ADMIN' ||
            $store.getters.get_user_type === 'OWNER'
          "
          class="ml-2 mr-2"
          small
          color="primary"
          @click="createFolderMethod()"
          >Create Folder<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
        >
        <v-btn
          v-if="
            $store.getters.get_user_type === 'ADMIN' ||
            $store.getters.get_user_type === 'OWNER'
          "
          class="ml-2"
          small
          color="primary"
          @click="uploadFilesMethod()"
          >Upload Files<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <div style="display: flex; flex-direction: row">
          <div
            v-for="(item, index) in breadCrumbItems"
            :key="index"
            v-if="breadCrumbItems.length > 1"
          >
            <v-btn
              :disabled="breadCrumbItems.length - 1 === index"
              text
              class="text-capitalize pl-2 pr-2"
              color="primary"
              @click="breadCrumbNavigationMethod(item.path, index)"
              >{{ item.text }}
            </v-btn>
            <v-icon v-if="index < breadCrumbItems.length - 1" color="grey"
              >mdi-chevron-right</v-icon
            >
          </div>
          <v-spacer />
          <div v-if="breadCrumbItems.length > 1">
            <v-btn color="primary" small @click="backArrowNavMethod()"
              ><v-icon small>mdi-arrow-left</v-icon>Back</v-btn
            >
          </div>
        </div>
        <v-data-table
          style="cursor: pointer"
          dense
          fixed-header
          :height="TableHeight"
          :search="search"
          :headers="headers"
          :items="folderFilesList"
          :items-per-page="50"
          :no-data-text="
            folderFilesList.length === 0 ? 'Empty folder' : undefined
          "
          @click:row="handleRowClickMethod"
        >
          <template v-slot:[`item.sl_no`]="{ index }">
            <div>{{ index + 1 }}</div>
          </template>
          <template v-slot:[`item.Size`]="{ item }">
            <div v-if="item.Size">
              {{ parseFloat(item.Size / 1024).toFixed(2) }} KB
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </template>
          <template v-slot:[`item.Key`]="{ item }">
            <v-icon :color="getIconForFileType(item.Key).color" small>
              {{ getIconForFileType(item.Key).icon }}
            </v-icon>
            <span class="pl-2">{{
              formatedFileFolderNameMethod(item.Key)
            }}</span>
          </template>
          <!-- <template v-slot:[`item.delete`]="{ item }">
            <div>
              <v-btn icon @click.stop="deletefolderFileMethod()"
                ><v-icon color="red" small>mdi-delete</v-icon></v-btn
              >
            </div>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import CreateFolder from "@/components/Cabinet/CreateFolderDialog.vue";
import UploadFiles from "@/components/Cabinet/UploadFilesDialog.vue";
import { ListCabinetFolders } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: { Overlay, CreateFolder, UploadFiles },
  data: () => ({
    overlay: true,
    search: "",
    TableHeight: 0,
    headers: [
      { text: "Sl.No", value: "sl_no" },
      { text: "Files/Folders", value: "Key" },
      { text: "File Size", value: "Size" },
      // { text: "Delete", value: "delete" },

      //   { text: "File Size", value: "file_size" },
    ],
    createFolderDialog: false,
    uploadFilesDialog: false,
    folderFilesList: [],
    forMount: 0,
    folderPath: "",
    storeObj: {},
    breadCrumbItems: [
      // {text: "Main Folder", path:}
    ],
  }),

  //    :no-data-text="noDataText"

  async mounted() {
    this.TableHeight = window.innerHeight - 220;
    this.breadCrumbItems.push({
      text: "Main Menu",
      path: `${this.$store.getters.get_current_user_details.organization_id}/CABINET/`,
    });
    await this.callFolderListingApiMethod();
  },

  methods: {
    createFolderMethod() {
      this.createFolderDialog = true;
      this.storeObj.folder_path = this.folderPath;
    },

    uploadFilesMethod() {
      this.uploadFilesDialog = true;
      this.storeObj.folder_path = this.folderPath;
    },

    async callFolderListingApiMethod(FOLDER_FILE) {
      try {
        // this.overlay = true;
        this.folderPath =
          FOLDER_FILE ||
          `${this.$store.getters.get_current_user_details.organization_id}/CABINET/`;

        const result = await API.graphql(
          graphqlOperation(ListCabinetFolders, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              prefix:
                this.forMount === 0
                  ? `${this.$store.getters.get_current_user_details.organization_id}/CABINET/`
                  : FOLDER_FILE,
            },
          })
        );
        const response = JSON.parse(result.data.ListCabinetFolders);
        if (response.CommonPrefixes) {
          this.folderFilesList = response.CommonPrefixes.map((item) => ({
            Key: item.Prefix,
          }));
        } else {
          this.folderFilesList = [];
        }
        if (response.Contents) {
          const list = response.Contents.filter((item) => {
            if (item.Key !== this.folderPath) {
              return item;
            }
          });
          this.folderFilesList.push(...list);
        }
        setTimeout(() => {
          this.overlay = false;
        }, 1500);
      } catch (error) {
        this.overlay = false;
        console.log("Error", error);
      }
    },

    formatedFileFolderNameMethod(item) {
      const normalizedStr = item.endsWith("/") ? item.slice(0, -1) : item;
      return normalizedStr.substring(normalizedStr.lastIndexOf("/") + 1);
    },

    getIconForFileType(filePath) {
      const cleanedPath = filePath.endsWith("/")
        ? filePath.slice(0, -1)
        : filePath;
      const fileName = cleanedPath.split("/").pop();
      if (!fileName.includes(".")) {
        return { icon: "mdi-folder", color: "yellow darken-3" };
      }
      const extension = fileName.split(".").pop().toLowerCase();
      const fileTypeMap = {
        png: { icon: "mdi-file-image", color: "blue" },
        jpg: { icon: "mdi-file-image", color: "blue" },
        jpeg: { icon: "mdi-file-image", color: "blue" },
        gif: { icon: "mdi-file-image", color: "blue" },
        bmp: { icon: "mdi-file-image", color: "blue" },
        svg: { icon: "mdi-file-image", color: "blue" },
        mp4: { icon: "mdi-file-video", color: "green" },
        avi: { icon: "mdi-file-video", color: "green" },
        mkv: { icon: "mdi-file-video", color: "green" },
        mov: { icon: "mdi-file-video", color: "green" },
        flv: { icon: "mdi-file-video", color: "green" },
        wmv: { icon: "mdi-file-video", color: "green" },
        mp3: { icon: "mdi-file-music", color: "purple" },
        wav: { icon: "mdi-file-music", color: "purple" },
        aac: { icon: "mdi-file-music", color: "purple" },
        ogg: { icon: "mdi-file-music", color: "purple" },
        flac: { icon: "mdi-file-music", color: "purple" },
        pdf: { icon: "mdi-file-pdf-box", color: "red" },
        doc: { icon: "mdi-file-word", color: "blue darken-3" },
        docx: { icon: "mdi-file-word", color: "blue darken-3" },
        xls: { icon: "mdi-file-excel", color: "green darken-3" },
        xlsx: { icon: "mdi-file-excel", color: "green darken-3" },
        ppt: { icon: "mdi-file-powerpoint", color: "orange darken-3" },
        pptx: { icon: "mdi-file-powerpoint", color: "orange darken-3" },
        txt: { icon: "mdi-file-document-outline", color: "grey darken-1" },
        log: { icon: "mdi-file-document-outline", color: "grey darken-1" },
        csv: { icon: "mdi-file-document-outline", color: "grey darken-1" },
        zip: { icon: "mdi-folder-zip", color: "brown" },
        rar: { icon: "mdi-folder-zip", color: "brown" },
        tar: { icon: "mdi-folder-zip", color: "brown" },
        gz: { icon: "mdi-folder-zip", color: "brown" },
        "7z": { icon: "mdi-folder-zip", color: "brown" },
        html: { icon: "mdi-file-code", color: "teal" },
        css: { icon: "mdi-file-code", color: "teal" },
        js: { icon: "mdi-file-code", color: "teal" },
        ts: { icon: "mdi-file-code", color: "teal" },
        json: { icon: "mdi-file-code", color: "teal" },
        xml: { icon: "mdi-file-code", color: "teal" },
      };
      const result = fileTypeMap[extension] || {
        icon: "mdi-file",
        color: "grey",
      };
      return result;
    },

    async handleRowClickMethod(item) {
      this.forMount = 1;
      if (item.Key.endsWith("/")) {
        await this.callFolderListingApiMethod(item.Key);
      } else {
        window.open(
          `https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/${item.Key}`
        );
      }
      if (item.Key.endsWith("/")) {
        const normalizedKey = item.Key.slice(0, -1);
        const folderName = normalizedKey.substring(
          normalizedKey.lastIndexOf("/") + 1
        );
        this.breadCrumbItems.push({
          text: folderName,
          path: item.Key,
        });
      }
    },

    async breadCrumbNavigationMethod(PATH, index) {
      this.breadCrumbItems.splice(index + 1);
      await this.callFolderListingApiMethod(PATH);
    },

    async backArrowNavMethod() {
      await this.callFolderListingApiMethod(
        this.breadCrumbItems[this.breadCrumbItems.length - 2].path
      );
      this.breadCrumbItems.pop();
    },

    async CreateFolderDialogEmit(Toggle) {
      this.createFolderDialog = false;
      if (Toggle === 2) {
        await this.callFolderListingApiMethod(this.folderPath);
      }
    },

    async UploadFilesDialogEmit(Toggle) {
      this.uploadFilesDialog = false;
      if (Toggle === 2) {
        await this.callFolderListingApiMethod(this.folderPath);
      }
    },
  },
};
</script>
