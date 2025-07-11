export const getAllTicketUsingS3URL = {
  methods: {
    async getAllTicketUsingS3URLMethod() {
      try {
        let baseUrl =
          this.$store.getters.get_current_user_details.organization_details
            .tickets_s3_url;
        const cacheBustedUrl = `${baseUrl}?cb=${new Date().getTime()}`;
        const response = await fetch(cacheBustedUrl);
        const parsedData = await response.json();
        return parsedData;
      } catch (error) {
        console.log("Error", error);
      } finally {
        //
      }
    },
  },
};
