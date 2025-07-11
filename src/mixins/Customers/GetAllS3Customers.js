export const getAllCustomerUsingS3URL = {
  methods: {
    async getAllCustomerUsingS3URLMethod() {
      try {
        this.overlay = true;
        this.customerDataLoaded = false;
        this.customerData = [];
        const baseUrl =
          this.$store.getters.get_current_user_details.organization_details
            .customer_list_s3_url;
        console.log("BASE_URL", baseUrl);
        const cacheBustedUrl = `${baseUrl}?ts=${Date.now()}`;
        const response = await fetch(cacheBustedUrl);
        const parsedData = await response.json();
        this.customerDataLoaded = true;
        this.overlay = false;
        return parsedData;
      } catch (error) {
        this.customerData = [];
        this.customerDataLoaded = true;
        this.overlay = false;
      }
    },
  },
};
