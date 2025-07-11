<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style>
.fontsize16px {
  font-size: 16px !important;
}
.xsmallFontSize {
  font-size: 12px !important;
  margin-left: 16px;
}
.tableTextWidth {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50px;
}
.WidthVariation1 {
  max-width: 200px !important;
}
.WidthVariation2 {
  max-width: 150px !important;
}
.widthSmall {
  max-width: 120px !important;
}
.PrimaryFontColor {
  color: 42424;
  font-size: 20px !important;
}
.PrimaryFontColorSmall {
  color: #7b046c;
  font-size: 15px !important;
}
.btn {
  padding: 30;
  font-size: 30px;
  color: #7b046c;
}
.heading1 {
  font-size: 30px;
}
.heading3 {
  font-size: 20px;
}
.heading2 {
  font-size: 16px;
  color: #1c1c1c;
}
.smallwidth {
  max-width: 100px !important;
}
.mediumWidth {
  max-width: 180px !important;
}
.smallFontSize {
  font-size: 15px;
}
.FontSize10px {
  font-size: 10px !important;
}
.PrimaryFontColorSmall {
  color: #3d3d3d;
  font-size: 15px;
}
.PrimaryFontColorXSmall {
  color: #3d3d3d;
  font-size: 12px;
}
.xlargeFontSize {
  font-size: 30px;
  color: #3d3d3d;
  line-height: 35px;
}

.largeFontSize {
  font-size: 40px;
  color: #3d3d3d;
  line-height: 50px;
  font-weight: bold;
  margin: 0;
}
.largeFontSizeNew {
  font-size: 20px;
  color: 42424;
  line-height: 50px;
  font-weight: bold;
  margin: 15px;
}
.FontSize10px {
  font-size: 10px !important;
}
.xmediumFontSize {
  font-size: 20px;
  color: #3d3d3d;
}
.xmediumFontSizeRed {
  font-size: 20px;
  color: red;
  font-weight: lighter;
}
.largeFontSizeRed {
  font-size: 30px;
  color: red;
}
.largeFontSizePrimary {
  font-size: 30px;
  color: #3d3d3d;
}
.largeFontSizePrimaryGreen {
  font-size: 30px;
  color: green;
}
.largeFontSizePrimaryOrange {
  font-size: 30px;
  color: orange;
}
.mediumFontSize {
  font-size: 25px;
  line-height: 30px;
  color: #3d3d3d;
}
.paddingTop {
  padding-top: 130px;
}
.borderRadius {
  border-radius: 20px !important;
}
.v-input .v-label {
  font-size: 12px;
}
.field_height.v-text-field .v-input__control .v-input__slot {
  min-height: 12px !important;
  display: flex !important;
  align-items: center !important;
}
.field_label_size .v-input .v-label {
  font-size: 12px;
}
.v-select
  .v-input__control
  .v-input__slot
  .v-select__slot
  .v-select__selections {
  padding: 0 !important;
  min-height: 0 !important;
}

.v-select-list .v-list-item {
  min-height: 0 !important;
}

.v-select-list .v-list-item .v-list-item__content {
  padding: 14px 0 !important;
}
.borderRadius {
  border-radius: 20px !important;
}
.theme--light.v-divider {
  border-color: #909090 !important;
  height: 100px;
}
.FontSize {
  font-size: 12px !important;
}
.BorderPrimary {
  border: 2px dashed #3d3d3d !important;
}
.BorderRed {
  border: 2px dashed red !important;
}
.BorderGreen {
  border: 2px dashed green !important;
}
.BorderOrange {
  border: 2px dashed orange !important;
}
.GreenHeader {
  color: green;
}
.RedHeader {
  color: red;
}
.BlackHeader {
  color: black;
  font-weight: bold;
}
.BlueHeader {
  color: blue;
}
.OrangeHeader {
  color: orange;
}
.YellowHeader {
  color: black;
}
.maxWidth {
  max-width: 250px !important;
}
.maxWidthSmall {
  max-width: 180px !important;
}
.maxWidthXSmall {
  max-width: 120px !important;
}
.maxWidth80px {
  max-width: 90px !important;
}
.BorderOutline {
  border: 1px solid black !important;
}
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}

.excel-upload-input {
  display: none;
  z-index: -9999;
}

.ContactStyle {
  font-size: 30px !important;
  color: grey !important;
}
.fontsize20px {
  font-size: 20px !important;
}
.fontsize15px {
  font-size: 15px !important;
}
.CardBorderClass {
  border: 2px solid black !important;
}
.TableValFontsize td {
  font-size: 12px !important;
}
.DashedCard {
  border: 2px dashed #7b046c !important;
}
.DashedCard1 {
  border: 2px solid #7b046c !important;
}
</style>
