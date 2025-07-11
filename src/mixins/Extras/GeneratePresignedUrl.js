import { GenerateS3Url } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import axios from "axios";

export const GenerateS3URL = {
  data: () => ({}),
  methods: {
    async GenerateS3URLMethods(key, file, userId, upload_type, uploaded_from) {
      let metadata = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        creator_user_id: this.$store.getters.get_current_user_details.user_id,
        user_id: userId != undefined ? userId : undefined,
        upload_type: upload_type || undefined,
        uploaded_from: uploaded_from || undefined,
      };
      try {
        let result = await API.graphql(
          graphqlOperation(GenerateS3Url, {
            input: {
              key: key,
              metadata: JSON.stringify(metadata),
            },
          })
        );
        let ResultObj = JSON.parse(result.data.GenerateS3Url);
        if (ResultObj.status === "Success") {
          let FinalResult = this.UploadS3method(ResultObj.message, key, file);
          return FinalResult;
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
    async UploadS3method(UploadURL, key, file) {
      try {
        let config = {
          method: "put",
          maxBodyLength: Infinity,
          url: UploadURL,
          headers: {
            "Content-Type": file.type,
            "Content-Disposition": "inline",
          },
          data: file,
        };
        let result = await axios(config);
        if (result.status === 200 && result.statusText === "OK") {
          let FinalResultObj = {
            status: "SUCCESS",
            profile_pic_url: `https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/${key}`,
          };

          this.filegotUploaded = true;
          return FinalResultObj;
        }
      } catch (error) {}
    },
  },
};
