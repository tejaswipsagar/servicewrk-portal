var AWS = require("aws-sdk");
window.Buffer = window.Buffer || require("buffer").Buffer;
export const uploadFileToS3 = {
  data: () => ({}),
  mounted() {},
  methods: {
    uploadImageToS3Method(fileObject, key) {
      return new Promise((res) => {
        var self = this; 
        var s3Bucket = new AWS.S3({
          region: 'ap-south-1',
          accessKeyId: 'AKIARAJXABES6RGOPDVD',
          secretAccessKey: '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',
        });
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileObject);
        fileReader.onload = async () => {
          var base64FileContent = fileReader.result.split(",");
          var buf = Buffer.from(base64FileContent[1], "base64");
          var param = {
            Bucket: 'servicewrkcabinet',
            Key: key,
            Body: buf,
            ContentType: fileObject.type,
            ACL: "public-read-write",
            Metadata: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
                creator_user_id:this.$store.getters.get_current_user_details.user_id,
            },
          };
          await s3Bucket.putObject(param, (err, data) => {
            if (err) {
              console.log(err);
              res({
                status: "ERROR",
                status_message: err.toString(),
              });
            } else if (data) {
              res({
                status: "SUCCESS",
                status_message: "File Uploade Successfully!!",
                file_url: `https://${param.Bucket}.s3.${
                  'ap-south-1'
                }.amazonaws.com/${encodeURI(param.Key)}`,
              });
            }
          });
        };
      });
    },
  },
};
