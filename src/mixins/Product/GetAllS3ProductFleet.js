export const getAllProductFleetUsingS3URL = {
  methods: {
    async getAllProductFleetUsingS3URLMethod() {
      try {
        this.overlay = true;
        this.contentFullyLoaded = false;
        this.productFleetData = [];
        this.overallProductFleetData = [];
        let baseUrl =
          this.$store.getters.get_current_user_details.organization_details
            .productfleet_s3_url;
        const cacheBustedUrl = `${baseUrl}?cb=${new Date().getTime()}`;
        const response = await fetch(cacheBustedUrl);
        const parsedData = await response.json();
        return parsedData;
      } catch (error) {
        console.log("Error", error);
      } finally {
        this.productFleetData = [];
        this.overallProductFleetData = [];
        this.overlay = false;
        this.contentFullyLoaded = true;
      }
    },
  },
};
