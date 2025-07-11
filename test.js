async getPresignedUrl(file) {
    try {
      this.tempkey = `${this.StoreObj.organisation_id}/${this.StoreObj.ticket_id}/${
        this.StoreObj.ticket_stage_name
      }/${new Date().getTime()}/${file.name.replace(/ /g, "-")}`;
      const params = {
        key: this.tempkey,
      };

      const config = {
        method: "post",
        url: "https://kfofet10y2.execute-api.ap-northeast-2.amazonaws.com/DEV/getPreSignedUrl",
        headers: {
          "Content-Type": "application/json",
        },
        data: params,
      };

      const result = await axios.request(config);

      if (result.data.status == "Success") return result.data.message;
    } catch (error) {
      console.log("error in closing ticket", error);
    }
  },
  async uploadFiles() {
    this.loading = true;
    this.AddComments.attachments = [];
    if (this.selectedFiles.length > 0) {
      let file = this.selectedFiles[0];

      let preSignedUrl = await this.getPresignedUrl(file);
      try {
        const response = await axios.put(preSignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        if (response.status == 200) {
          let file_url = https://hellowrk-ticket-attachments.s3.ap-northeast-2.amazonaws.com/${this.tempkey};
          let fileDetails = {
            filename: file.name,
            url: file_url,
          };
          this.AddComments.attachments.push(fileDetails);
          this.addComments();
        } else {
          alert("Error uploading file");
        }
      } catch (error) {
        this.loading = false;
        console.error("Error uploading file:", error);
        alert("Error uploading file");
      }
    } else {
      this.addComments();
    }
  },