import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: "#7b046c",
            secondary: "#bd58b0",
            theme: "#09719e",
          },
        },
      },
});
