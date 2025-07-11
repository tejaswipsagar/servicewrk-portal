<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddServiceDetails
      :AddServiceDetailsDialog="AddServiceDetailsDialog"
      :PrevData="PrevData"
      :StoreObj="StoreObj"
      @clicked="AddServiceDetailsDialogEmit"
    />
    <EditTerritoryDialog
      :EditTerritoryDialog="EditTerritoryDialog"
      :ActionObj="ActionObj"
      @clicked="EditTerritoriesEmit"
    />
    <ListPincodesHistoryDialog
      :ListPincodesHistoryDialog="ListPincodesHistoryDialog"
      :ActionObj="ActionObj"
      @clicked="ListPincodesHistoryDialogEmit"
    />
    <DeleteTerritoryClassification
      :DeleteTerrClassDialog="deleteTerrClassDialog"
      :TerritoryObj="territoryObj"
      @clicked="DeleteTerrClassDialogEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar elevation="0">
        <div class="largeFontSizeNew">
          Settings
          <span class="PrimaryFontColorSmall">/Organization Settings</span>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              v-on="on"
              class="mr-4"
              v-bind="attrs"
              color="primary"
              @click="copyFormUrlCustomer()"
              >Customer
              <v-icon class="ml-1" small>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy Web Form URL For Customer</span>
        </v-tooltip>
      </v-toolbar>
      <v-row no-gutters>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Organization Logo
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="2">
                    <div>Organization Logo :</div>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="2">
                    <v-card
                      align="center"
                      @click="checkImagePresent()"
                      class="elevation-1 ml-6 mr-3"
                    >
                      <v-fab-transition v-if="url != null && url != ''">
                        <v-btn
                          absolute
                          top
                          right
                          x-small
                          fab
                          color="red"
                          class="mr-4"
                          @click.stop="(url = null), (uploadedImage = false)"
                        >
                          <v-icon x-small>mdi-close</v-icon></v-btn
                        >
                      </v-fab-transition>
                      <v-img
                        v-if="url != null && url != ''"
                        :src="url"
                        :lazy-src="url"
                        height="45"
                        max-width="170"
                        class="mt-4"
                      ></v-img>
                      <div v-else>
                        <input
                          ref="excel-upload-input"
                          accept="image/*"
                          class="excel-upload-input"
                          type="file"
                          @change="handleClick"
                        />
                        <v-icon>mdi-upload</v-icon>
                        <div align="center">Upload Image</div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                    <v-checkbox
                      class="ml-4"
                      color="primary"
                      v-model="enablecomponent"
                      label="Enable Component Inventory"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                    <v-text-field
                      dense
                      outlined
                      color="primary"
                      class="mt-4 FontSize"
                      v-model="org_address"
                      label="Organization Address"
                    >
                    </v-text-field>
                  </v-col>
                  <v-row>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        v-model="orgContNumber"
                        label="Organization Contact Number"
                      />
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        v-model="orgEmailId"
                        label="Organization Email ID"
                      />
                    </v-col>
                  </v-row>
                  <v-text-field
                    v-model="callCenterContNum"
                    label="Call Center Contact Number"
                    dense
                    outlined
                    readonly
                    class="ml-4"
                  ></v-text-field>
                  <v-toolbar dense class="elevation-0 mt-12">
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loadingOrganizationLogo"
                      small
                      class="gradient-bg white--text ml-2"
                      @click="saveOrgLogo"
                      ><v-icon small class="mr-2">mdi-content-save</v-icon
                      >Save</v-btn
                    >
                  </v-toolbar>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Attendence Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                    <v-select
                      :items="AutoMaticLogoutTime"
                      label="Auto Logout Time"
                      outlined
                      rounded
                      class="FontSize"
                      v-model="time_setting.auto_logout_time"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                    <v-select
                      multiple
                      :items="itemsssss"
                      label="Weekly Off "
                      outlined
                      rounded
                      class="FontSize"
                      v-model="time_setting.itemsssss"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0 mt-n4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="time_setting.holidaydate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          class="mt-4 FontSize"
                          rounded
                          outlined
                          v-model="time_setting.holidaydate"
                          label="Holiday Dates"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="time_setting.holidaydate"
                        no-title
                        scrollable
                        multiple
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(time_setting.holidaydate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="3" class="pb-0"> </v-col>
                  <v-toolbar dense class="elevation-0 mt-12">
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loadingATTENDANCE_SETTINGS"
                      small
                      class="gradient-bg white--text ml-2"
                      @click="validateMethod('ATTENDANCE_SETTINGS')"
                      ><v-icon small class="mr-2">mdi-content-save</v-icon
                      >Save</v-btn
                    >
                  </v-toolbar>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold black--text"
              expand-icon="mdi-menu-down"
              >Ticket Settings
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="formTS">
                <v-row cols="12" sm="12" xs="12" md="12">
                  <v-col cols="12" sm="12" xs="12" md="6">
                    <v-row>
                      <v-col cols="12" sm="12" xs="12" md="4" class="pb-0">
                        <b class="FontSize">Ticket Count :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="pb-0">
                        <v-text-field
                          dense
                          outlined
                          class="FontSize field_height field_label_size maxWidthSmall"
                          label="Ticket Count"
                          v-model="ticket_settings.active_ticket_count"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="pb-0">
                        <b class="FontSize">Sort Ticket By :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="pb-0">
                        <v-select
                          dense
                          :items="sort_ticket_by"
                          outlined
                          class="FontSize field_height field_label_size maxWidthSmall"
                          label="Sort Ticket By"
                          v-model="ticket_settings.sort_ticket_by"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="pb-0">
                        <b class="FontSize">Schedule Service Dates:</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="pb-0">
                        <v-select
                          dense
                          :items="scheduled_service_dates_items"
                          outlined
                          class="FontSize field_height field_label_size maxWidthSmall"
                          label="Schedule Date(s)"
                          v-model="ticket_settings.scheduled_service_dates"
                          multiple
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Dealer Ticket :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable Dealer Ticket Creation"
                          v-model="ticket_settings.enable_to_rise_ticket"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Ticket Visibility :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable Manual Teritorry Tagging"
                          v-model="
                            ticket_settings.enable_manual_territory_tagging
                          "
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Create Ticket :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable Service Representatives To Create Ticket"
                          v-model="ticket_settings.enable_ticket_creation"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Close Ticket :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable Service Representatives To Close Ticket"
                          v-model="ticket_settings.enable_ticket_close"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Re-open Ticket :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Re-Open Ticket"
                          v-model="ticket_settings.reopen_ticket"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <v-select
                          dense
                          outlined
                          label="Duration"
                          class="FontSize maxWidthSmall"
                          :items="reopen_ticket_durationItems"
                          v-model="ticket_settings.reopen_ticket_duration"
                          v-if="
                            ticket_settings.reopen_ticket != false &&
                            ticket_settings.reopen_ticket != undefined
                          "
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Ticket Component :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable to raise Request for Ticket Component"
                          v-model="
                            ticket_settings.enable_ticket_components_request
                          "
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Default Customer Type :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0 mt-2">
                        <v-radio-group
                          v-model="ticket_settings.default_customer_type"
                          class="font-weight-bold mt-n2"
                        >
                          <v-row
                            ><v-col class="ml-2">
                              <v-radio
                                label="Individual"
                                value="INDIVIDUAL"
                              ></v-radio>
                            </v-col>
                            <v-col>
                              <v-radio
                                label="Business"
                                value="BUSINESS"
                              ></v-radio> </v-col
                          ></v-row>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Access Control :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enable Access Control"
                          v-model="ticket_settings.is_access_control_enable"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <b class="FontSize">Attachment Mandatory :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Yes"
                          v-model="ticket_settings.is_attachment_mandatory"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" md="4" xs="12" sm="12">
                        <v-autocomplete
                          dense
                          outlined
                          class="mt-n2 FontSize"
                          label="No.of Attachements"
                          :items="number_of_attachments_required_items"
                          v-model="
                            ticket_settings.number_of_attachments_required
                          "
                          v-if="
                            ticket_settings.is_attachment_mandatory != false &&
                            ticket_settings.is_attachment_mandatory != undefined
                          "
                        >
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" xs="12" md="7">
                        <b class="FontSize"
                          >Allow Proxy Phone Number to Get OTP :</b
                        >
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="3">
                        <v-checkbox
                          class="mt-n1"
                          v-model="ticket_settings.allow_otp_proxy"
                        >
                        </v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="7">
                        <b class="FontSize"
                          >Auto Approval of Requested Components :</b
                        >
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="5">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="
                            auto_approval_for_own_stock_component_request
                          "
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize">Enable Verify Serial Number :</b>
                      </v-col>
                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="verify_serial_number"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize"
                          >Customer Category Mandatory while Creating Ticket
                          :</b
                        >
                      </v-col>

                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="is_customer_category_mandatory"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mb-3">
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize"
                          >Enable To Add Payment Details For Tickets (No
                          Warranty/Extended Warranty) :</b
                        >
                      </v-col>

                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="enable_payment_option"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mb-3">
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize">Enable/Disable FOC:</b>
                      </v-col>

                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="enable_disable_foc"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mb-3">
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize">Enable/Disable Cabinet:</b>
                      </v-col>
                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="enable_disable_cabinet"
                        />
                      </v-col>
                    </v-row>
                    <!-- <v-row no-gutters class="mb-3">
                      <v-col cols="12" md="7" sm="12" xs="12">
                        <b class="FontSize">Enable/Disable Dealer Product Fleet:</b>
                      </v-col>
                      <v-col cols="12" md="1" xs="12" sm="12">
                        <v-checkbox
                          class="mt-n1 ml-3"
                          v-model="enableDisableDealerProdFleet"
                        />
                      </v-col>
                    </v-row> -->
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="6">
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="6">
                        <b class="FontSize"
                          >Enable to edit warranty deatils :</b
                        >
                      </v-col>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <v-checkbox
                          class="mt-n1"
                          v-model="enable_edit_warranty_details"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="6">
                        <b class="FontSize">Enable to edit Serial Number :</b>
                      </v-col>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <v-checkbox
                          class="mt-n1"
                          v-model="enable_edit_serial_number"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="6">
                        <b class="FontSize">Start Service at Work Place:</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="1">
                        <v-checkbox
                          class="mt-n1"
                          v-model="start_service_at_workplace"
                        >
                        </v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4">
                        <v-text-field
                          dense
                          outlined
                          type="number"
                          class="FontSize"
                          label="Distance in Meters"
                          v-model="location_validation"
                          v-if="
                            this.start_service_at_workplace != false &&
                            this.start_service_at_workplace != undefined
                          "
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="6">
                        <b class="FontSize">End Service at Work Place:</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="1">
                        <v-checkbox
                          class="mt-n1"
                          v-model="end_service_at_workplace"
                        >
                        </v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4">
                        <v-text-field
                          type="number"
                          v-if="
                            this.end_service_at_workplace != false &&
                            this.end_service_at_workplace != undefined
                          "
                          dense
                          class="FontSize"
                          outlined
                          label="Distance in Meters"
                          v-model="end_location_validation"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="6">
                        <b class="FontSize">Close Ticket After Work Start :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="1">
                        <v-checkbox
                          class="mt-n1"
                          v-model="ticket_close_after_work_start"
                        >
                        </v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" md="4" sm="12" xs="12">
                        <b class="FontSize">Product Repair Settings</b>
                      </v-col>
                      <v-col cols="12" md="6" sm="12" xs="12">
                        <v-autocomplete
                          outlined
                          dense
                          class="FontSize"
                          :items="product_repair_setting_items"
                          v-model="
                            ticket_settings.product_repair_or_replacement
                          "
                        >
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" xs="12" md="4" class="pb-0">
                        <b class="FontSize">Ticket History Visibility :</b>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0 mt-2">
                        <v-checkbox
                          dense
                          label="Enterprise Manager"
                          v-model="manager"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enterprise Agent"
                          v-model="agent"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Enterprise Technician"
                          v-model="representative"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Dealer Owner"
                          v-model="dealer_owner"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Dealer Agent"
                          v-model="dealer_agent"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Dealer Technician"
                          v-model="dealer_representative"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Partner Owner"
                          v-model="service_partner"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Partner Agent"
                          v-model="partner_agent"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="Partner Technician"
                          v-model="partner_representative"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="NSM"
                          v-model="nsm"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="4" class="py-0">
                      </v-col>
                      <v-col cols="12" sm="12" xs="12" md="8" class="py-0">
                        <v-checkbox
                          dense
                          class="my-0"
                          label="RSM"
                          v-model="rsm"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <div class="FontSize mt-5"><b> RFS Rights </b></div>
                <v-row>
                  <v-col cols="12" md="5" xs="12" sm="12">
                    <v-data-table
                      dense
                      :items="user_typeItems"
                      :headers="UserType_headers"
                      item-text="text"
                      item-value="value"
                      class="TableValFontsize"
                    >
                      <template v-slot:[`item.type`]="{ item }">
                        <div class="FontSize">{{ item.text }}</div>
                      </template>
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn
                          x-small
                          icon
                          color="green"
                          @click="addUserTypeDialogMethod(item, index)"
                          ><v-icon>mdi-plus-circle</v-icon></v-btn
                        >
                      </template></v-data-table
                    >
                  </v-col>
                  <v-col cols="0" md="2"></v-col>
                  <v-col cols="12" md="5" xs="12" sm="12">
                    <v-data-table
                      dense
                      :items="duplicate_typeItems"
                      :headers="UserType_headers"
                      item-text="text"
                      item-value="value"
                      class="TableValFontsize"
                    >
                      <template v-slot:[`item.type`]="{ item }">
                        <div>{{ item.text }}</div>
                      </template>
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn
                          x-small
                          icon
                          color="red"
                          @click.stop="delete_Duplicate_Method(item, index)"
                          ><v-icon>mdi-minus-circle</v-icon></v-btn
                        >
                      </template></v-data-table
                    >
                  </v-col>
                </v-row>
                <v-toolbar dense class="elevation-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loadingTICKET_SETTINGS"
                    small
                    class="gradient-bg white--text ml-2"
                    @click="validateMethod('TICKET_SETTINGS')"
                    ><v-icon small class="mr-2">mdi-content-save</v-icon
                    >Save</v-btn
                  >
                </v-toolbar>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Feedback URL
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col class="ml-6" cols="12" md="3">
                    <v-checkbox
                      label="Enable Feeback URL"
                      v-model="feedback_url_enable"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="7">
                    <v-text-field
                      outlined
                      dense
                      v-model="feedback_url"
                      class="mt-6 FontSize"
                      label="Feedback Url"
                      v-if="
                        feedback_url_enable != false &&
                        feedback_url_enable != undefined
                      "
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-btn
                      class="primary mt-6"
                      small
                      :loading="isLoading"
                      @click="saveSettingsMethod('FEEDBACK_URL')"
                    >
                      <v-icon small class="mx-2">mdi-content-save</v-icon>
                      Save</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Territory Classification
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="territoryForm">
                  <v-row>
                    <v-col cols="12" sm="12" xs="12" md="5">
                      <v-text-field
                        v-model="Territory_Name"
                        dense
                        label="Territory Name"
                        outlined
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" xs="12" md="2">
                      <v-select
                        v-model="selection"
                        :items="options"
                        label="Select Option"
                        dense
                        outlined
                        :rules="[(v) => !!v || 'Required']"
                      ></v-select>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="12"
                      xs="12"
                      md="3"
                      v-if="selection === 'Hours'"
                    >
                      <v-select
                        dense
                        outlined
                        label="Hours"
                        v-model="Time_Values"
                        :items="TimeArray"
                        :rules="[(v) => !!v || 'Required']"
                      ></v-select>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="12"
                      xs="12"
                      md="3"
                      v-if="selection === 'Days'"
                    >
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        nudge-width="150"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="formattedDay"
                            label="Select Day"
                            readonly
                            dense
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            :rules="[(v) => !!v || 'Required']"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          :picker-date="baseDate"
                          :min="startDate"
                          :max="endDate"
                          show-current="false"
                          no-title
                          scrollable
                          @input="updateFormattedDay"
                          class="Date_Custom mt-3"
                          width="350"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            class="mt-n8"
                            @click="menu = false"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" xs="12" md="1">
                      <v-btn
                        small
                        color="primary"
                        :loading="TerritoryLoading"
                        @click.stop="CreatePincodeTypeMethod()"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </v-col>

                    <!-- <v-col cols="12" sm="12" xs="12" md="3" class="pb-0"> </v-col>
                  <v-toolbar dense class="elevation-0 mt-12">
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loadingATTENDANCE_SETTINGS"
                      small
                      class="gradient-bg white--text ml-2"
                      ><v-icon small class="mr-2">mdi-content-save</v-icon
                      >Save</v-btn
                    >
                  </v-toolbar> -->
                  </v-row></v-form
                >

                <v-col
                  cols="12"
                  md="6"
                  xs="12"
                  sm="12"
                  class="d-flex justify-center"
                >
                  <v-data-table
                    dense
                    class="mt-2"
                    :headers="TerritoriesHeaders"
                    :items="Pincodes_Items"
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <v-btn
                        icon
                        x-small
                        variant="flat"
                        @click.stop="edit_Territory_Method(item, 'EDIT')"
                        ><v-icon color="green">mdi-pencil</v-icon></v-btn
                      >

                      <v-btn
                        icon
                        x-small
                        variant="flat"
                        @click.stop="ListPincodesHistoryDialogMethod(item)"
                        ><v-icon color="primary">mdi-information</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        x-small
                        variant="flat"
                        @click.stop="deleteTerritoryClassMethod(item, index)"
                        ><v-icon color="red">mdi-delete</v-icon></v-btn
                      >
                    </template>
                  </v-data-table>
                </v-col>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Distance Variation
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mx-3 mt-2">
                  <v-col cols="12" md="3">
                    <b class="FontSize">Distance Variation :</b>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Distance in KMs"
                      v-model="distance_variation"
                    >
                    </v-text-field>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="primary mr-4 mt-3"
                    small
                    :loading="isLoading_distance_variation"
                    @click="saveSettingsMethod('DISTANCE_VARIATION')"
                    ><v-icon small color="white" class="ma-2"
                      >mdi-content-save</v-icon
                    >Save</v-btn
                  >
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Master Category Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" sm="12" xs="12" md="4" class="pb-0">
                    <v-form ref="formMC">
                      <v-select
                        dense
                        outlined
                        :rules="[(v) => !!v || 'Required']"
                        class="FontSize field_height field_label_size"
                        label="Select Master Categories"
                        :items="GetAllMasterCategoriesList"
                        v-model="masterCategorySettings.category_id"
                        item-text="category_name"
                        item-value="category_id"
                      ></v-select>
                    </v-form>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="2" class="pl-0 pb-0">
                    <v-tooltip color="primary" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          v-on="on"
                          v-bind="attrs"
                          class="gradient-bg white--text ml-2"
                          @click="validateMCMethod()"
                          ><v-icon>mdi-plus</v-icon></v-btn
                        >
                      </template>
                      <span class="white--text">Add Master Category</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="12" class="py-0">
                    <v-data-table
                      dense
                      class="elevation-0"
                      :headers="masterCategoryHeaders"
                      :items="masterCategoryItems"
                      :footer-props="{
                        'items-per-page-options': [100, 200, 500],
                      }"
                      :items-per-page="100"
                    >
                      >
                      <template v-slot:[`item.sl_no`]="{ item }">
                        <div class="FontSize">
                          {{ masterCategoryItems.indexOf(item) + 1 }}
                        </div>
                      </template>
                      <template v-slot:[`item.master_category_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.master_category_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.Actions`]="{ item }">
                        <v-tooltip color="primary" bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              small
                              v-on="on"
                              v-bind="attrs"
                              @click="
                                masterCategoryItems.splice(
                                  masterCategoryItems.indexOf(item),
                                  1
                                )
                              "
                              color="red"
                              ><v-icon small>mdi-delete</v-icon></v-btn
                            >
                          </template>
                          <span class="white--text"
                            >Delete Master Category</span
                          >
                        </v-tooltip>
                      </template>
                    </v-data-table>
                    <v-toolbar dense class="elevation-0">
                      <v-spacer></v-spacer>
                      <v-btn
                        :loading="loadingMASTER_CATEGORY_SETTINGS"
                        small
                        class="gradient-bg white--text ml-2"
                        @click="validateMethod('MASTER_CATEGORY_SETTINGS')"
                        ><v-icon small class="mr-2">mdi-content-save</v-icon
                        >Save</v-btn
                      >
                    </v-toolbar>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Category Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="formC">
                  <v-row>
                    <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                      <v-select
                        dense
                        outlined
                        class="FontSize field_height field_label_size"
                        label="Select Master Categories"
                        :items="masterCategoryItems"
                        item-text="master_category_name"
                        item-value="master_category_id"
                        v-model="categorySettings.master_category_id"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" xs="12" md="3" class="pb-0">
                      <v-select
                        dense
                        outlined
                        class="FontSize field_height field_label_size"
                        label="Select Categories"
                        item-text="category_name"
                        item-value="category_id"
                        v-model="categorySettings.category_id"
                        :items="GetCategoriesByMasterCategoryList"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" xs="12" md="2" class="pl-0 pb-0">
                      <v-tooltip color="primary" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            small
                            v-on="on"
                            v-bind="attrs"
                            class="gradient-bg white--text"
                            @click="validateCMethod()"
                            ><v-icon>mdi-plus</v-icon></v-btn
                          >
                        </template>
                        <span class="white--text">Add Master Category</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-form>
                <v-row>
                  <v-col cols="12" sm="12" xs="12" md="12" class="py-0">
                    <v-data-table
                      dense
                      class="elevation-0"
                      :headers="categoryHeaders"
                      :items="categoryItems"
                      :footer-props="{
                        'items-per-page-options': [100, 200, 500],
                      }"
                      :items-per-page="100"
                    >
                      <template v-slot:[`item.sl_no`]="{ item }">
                        <div class="FontSize">
                          {{ categoryItems.indexOf(item) + 1 }}
                        </div>
                      </template>
                      <template v-slot:[`item.master_category_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.master_category_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.category_name`]="{ item }">
                        <div class="FontSize">{{ item.category_name }}</div>
                      </template>
                      <template v-slot:[`item.Actions`]="{ item }">
                        <v-tooltip color="primary" bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              small
                              v-on="on"
                              v-bind="attrs"
                              @click="
                                categoryItems.splice(
                                  categoryItems.indexOf(item),
                                  1
                                )
                              "
                              color="red"
                              ><v-icon small>mdi-delete</v-icon></v-btn
                            >
                          </template>
                          <span class="white--text">Delete Category</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                    <v-toolbar dense class="elevation-0">
                      <v-spacer></v-spacer>
                      <v-btn
                        :loading="loadingCATEGORY_SETTINGS"
                        small
                        class="gradient-bg white--text ml-2"
                        @click="validateMethod('CATEGORY_SETTINGS')"
                        ><v-icon small class="mr-2">mdi-content-save</v-icon
                        >Save</v-btn
                      >
                    </v-toolbar>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Close Ticket Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-checkbox
                      label="Enable Close Ticket Location Type"
                      v-model="is_close_ticket_location_enable"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      label="Ticket Location Type"
                      :items="ticket_location_type_items"
                      class="FontSize mt-4 WidthVariation1"
                      v-if="is_close_ticket_location_enable != false"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-checkbox
                      label="Closure Type"
                      v-model="is_clouser_type_enable"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      label="Ticket Closure Type"
                      :items="closure_type_items"
                      class="FontSize WidthVariation1 mt-4"
                      v-if="is_clouser_type_enable != false"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-select
                      v-model="is_otp_send_to"
                      class="mt-n3 FontSize WidthVariation1"
                      label="Send OTP while closing Ticket to"
                      :items="send_otp_to_items"
                      :rules="[(v) => !!v || 'Required']"
                      outlined
                      dense
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="3" xs="12" sm="12">
                    <v-checkbox
                      label="Training Provided to"
                      class="mt-n3"
                      v-model="is_training_provided_to"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-toolbar flat>
                  <v-spacer />
                  <v-btn
                    :loading="loading_enable_location_btn_while_close_ticket"
                    small
                    class="primary white--text mr-4"
                    @click="validateMethod('CLOSE_LOCATION_ENABLE')"
                    ><v-icon small class="mr-2">mdi-content-save</v-icon>Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Escalation Notification
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-checkbox
                      label="Enable Escalation Notification"
                      v-model="escalation_notification_enable"
                      class="ml-6"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-select
                      v-if="this.escalation_notification_enable == true"
                      outlined
                      dense
                      v-model="escalation_day"
                      :items="escalation_day_items"
                      class="FontSize WidthVariation1 mt-3"
                      label="Days"
                    >
                    </v-select>
                  </v-col>
                  <!-- <v-col cols="12" md="4" sm="12" xs="12">
                    <v-btn
                      :loading="loading_escalation_enable"
                      small
                      class="primary white--text mt-3"
                      @click="validateMethod('ESCALATION')"
                      ><v-icon small class="mr-2">mdi-content-save</v-icon>Save
                    </v-btn>
                  </v-col> -->
                </v-row>
                <v-row>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-checkbox
                      label="Enable To Select Users"
                      v-model="enable_user_select"
                      class="ml-6"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-select
                      v-if="enable_user_select"
                      outlined
                      dense
                      v-model="escalation_user"
                      :items="escalation_user_items"
                      multiple
                      class="FontSize WidthVariation1 mt-3"
                      label="Select Users"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip x-small v-if="index === 0">
                          <span>{{ escalation_user[0] }}</span>
                        </v-chip>
                        <span
                          v-if="index === 0 && escalation_user.length > 1"
                          class="grey--text text-caption"
                        >
                          (+{{ escalation_user.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-btn
                      :loading="loading_escalation_enable"
                      small
                      class="primary white--text mt-3"
                      @click="validateMethod('ESCALATION')"
                      ><v-icon small class="mr-2">mdi-content-save</v-icon>Save
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Ticket Discard
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-checkbox
                      label="Enable Ticket Discard"
                      v-model="ticket_discard"
                      class="ml-6"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12"></v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-btn
                      :loading="loading_discard_ticket_btn"
                      small
                      class="primary white--text mt-3"
                      @click="validateMethod('TICKET_DISCARD')"
                    >
                      <v-icon small class="mr-2">mdi-content-save</v-icon>Save
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Ticket Workflow
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-checkbox
                      label="Ticket Accept or Reject"
                      v-model="enable_ticket_accept"
                      class="ml-6 font-weight-bold"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      label="Days / Hours"
                      v-model="days_or_hours"
                      :items="days_or_hours_items"
                      v-if="enable_ticket_accept != false"
                      class="WidthVariation1 FontSize mt-3"
                      :rules="
                        enable_ticket_accept == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-combobox
                      dense
                      outlined
                      v-model="ticket_accept_time"
                      label="Ticket Accept Time *"
                      v-if="enable_ticket_accept != false"
                      class="WidthVariation1 FontSize mt-3"
                      :items="
                        days_or_hours == 'DAYS'
                          ? ticket_accept_time_items
                          : ticket_accept_time_items_hours
                      "
                      :rules="
                        enable_ticket_accept == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" md="1" sm="12" xs="12"></v-col>
                </v-row>
                <v-row class="mt-n10">
                  <v-col cols="12">
                    <v-checkbox
                      class="ml-6 font-weight-bold"
                      label="Enable Close Ticket Workflow"
                      v-model="enable_ticket_close_workflow"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-checkbox
                      label="Organization Higher Level"
                      v-if="enable_ticket_close_workflow != false"
                      v-model="organization_ticket_close_enable"
                      class="ml-11 mt-n9 font-weight-bold"
                    ></v-checkbox>
                    <v-checkbox
                      label="Representative"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        organization_ticket_close_enable != false
                      "
                      v-model="organization_representative_ticket_close_enable"
                      class="ml-16 mt-n5"
                    ></v-checkbox>
                    <v-checkbox
                      label="RSM"
                      class="ml-16 mt-n5"
                      v-model="organization_RSM_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        organization_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      label="NSM"
                      class="ml-16 mt-n5"
                      v-model="organization_NSM_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        organization_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      class="ml-16 mt-n5"
                      label="Service Co-Ordinator"
                      v-model="organization_coordinater_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        organization_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      label="Admin Level"
                      class="ml-16 mt-n5"
                      v-model="organization_higher_level_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        organization_ticket_close_enable != false
                      "
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-checkbox
                      label="Service Partner Higher Level"
                      v-if="enable_ticket_close_workflow != false"
                      v-model="service_partner_ticket_close_enable"
                      class="ml-11 mt-n9 font-weight-bold"
                    ></v-checkbox>
                    <v-checkbox
                      class="ml-16 mt-n5"
                      label="Representative"
                      style="margin-left: 50px"
                      v-model="
                        service_partner_representative_ticket_close_enable
                      "
                      v-if="
                        enable_ticket_close_workflow != false &&
                        service_partner_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      class="ml-16 mt-n5"
                      label="Service Co-Ordinator"
                      v-model="service_partner_agent_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        service_partner_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      label="Admin Level"
                      class="ml-16 mt-n5"
                      v-model="service_partner_higher_level_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        service_partner_ticket_close_enable != false
                      "
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-checkbox
                      label="Dealer Higher Level"
                      v-model="dealer_ticket_close_enable"
                      class="ml-11 mt-n9 font-weight-bold"
                      v-if="enable_ticket_close_workflow != false"
                    ></v-checkbox>
                    <v-checkbox
                      class="ml-16 mt-n5"
                      label="Representative"
                      v-model="dealer_representative_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        dealer_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      class="ml-16 mt-n5"
                      label="Service Co-Ordinator"
                      v-model="dealer_agent_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        dealer_ticket_close_enable != false
                      "
                    ></v-checkbox>
                    <v-checkbox
                      label="Admin Level"
                      class="ml-16 mt-n5"
                      v-model="dealer_higher_level_ticket_close_enable"
                      v-if="
                        enable_ticket_close_workflow != false &&
                        dealer_ticket_close_enable != false
                      "
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-toolbar class="elevation-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    :loading="loading_enable_ticket_accept_btn"
                    class="primary white--text mt-10 mr-6 mb-12"
                    @click="validateMethod('TICKET_WORKFLOW')"
                  >
                    <v-icon small class="mr-2">mdi-content-save</v-icon>Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Auto Convert Support and Support Type
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-checkbox
                      label="Auto Convert Support and Support Type after Support End Date Complete"
                      v-model="is_enabled_to_update_shceduled_service"
                      class="ml-6 font-weight-bold"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      label="Support *"
                      v-model="support_type"
                      :items="support_type_items"
                      class="WidthVariation1 FontSize mt-3"
                      v-if="
                        is_enabled_to_update_shceduled_service != false &&
                        is_enabled_to_update_shceduled_service != undefined
                      "
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      label="Support Type *"
                      v-model="warranty_type"
                      item-text="setting_name"
                      item-value="setting_name"
                      :items="GetAllAMCTypeList"
                      class="WidthVariation1 FontSize mt-3"
                      v-if="
                        is_enabled_to_update_shceduled_service != false &&
                        is_enabled_to_update_shceduled_service != undefined
                      "
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="1" sm="12" xs="12"></v-col>
                </v-row>
                <v-toolbar class="elevation-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    :loading="btn_update_support_and_support_type"
                    class="primary white--text mt-10 mr-6 mb-12"
                    @click="validateMethod('UPDATE_SUPPORT_AND_SUPPORT_TYPE')"
                  >
                    <v-icon small class="mr-2">mdi-content-save</v-icon>Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Workflow Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="form_workflow_settings">
                  <v-row no-gutters>
                    <v-col cols="12" md="2" sm="12" xs="12" class="mt-5 ml-6">
                      <b class="FontSize">COMPONENTS</b>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-checkbox v-model="workflow_enabled"></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        v-model="approver"
                        class="FontSize mt-4 mr-2"
                        :items="approver_items"
                        label="Component Approver *"
                        v-if="this.workflow_enabled != false"
                        :rules="
                          this.workflow_enabled == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        this.approver == 'SPECIFIC_USERS' ||
                        this.approver == 'REPORTING_MANAGER_AND_SPECIFIC_USER'
                      "
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="Users *"
                        item-value="user_id"
                        item-text="user_name"
                        class="FontSize mt-4"
                        v-model="approver_ids"
                        :items="GetAllUsersList"
                        v-if="this.workflow_enabled != false"
                        :rules="
                          this.approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12"></v-col>
                  </v-row>
                  <v-row class="mt-n4" no-gutters>
                    <v-col cols="12" md="2" sm="12" xs="12" class="mt-5 ml-6">
                      <b class="FontSize">PRODUCT FLEET</b>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-checkbox
                        v-model="enable_product_fleet_workflow"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="approver_items"
                        v-model="product_fleet_approver"
                        label="Product Fleet Approver *"
                        v-if="this.enable_product_fleet_workflow != false"
                        :rules="
                          this.enable_product_fleet_workflow == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        this.product_fleet_approver == 'SPECIFIC_USERS' ||
                        this.product_fleet_approver ==
                          'REPORTING_MANAGER_AND_SPECIFIC_USER'
                      "
                    >
                      <v-autocomplete
                        dense
                        outlined
                        label="Users *"
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="product_fleet_approver_id"
                        v-if="enable_product_fleet_workflow != false"
                        :rules="
                          this.product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="2" sm="12" xs="12" class="mt-5 ml-6">
                      <b style="font-size: 14px">Quotations</b>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-checkbox
                        v-model="enable_workflow_for_quotation"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="approver_items"
                        v-model="quotation_approver"
                        label="Quotations Approver *"
                        v-if="this.enable_workflow_for_quotation != false"
                        :rules="
                          this.enable_workflow_for_quotation == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        this.quotation_approver == 'SPECIFIC_USERS' ||
                        this.quotation_approver ==
                          'REPORTING_MANAGER_AND_SPECIFIC_USER'
                      "
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="User *"
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="quotation_approver_ids"
                        v-if="enable_workflow_for_quotation != false"
                        :rules="
                          this.product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="2" sm="12" xs="12" class="mt-5 ml-6">
                      <b style="font-size: 14px">Quotation MRF</b>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-checkbox
                        v-model="enable_workflow_for_quotation_mrf"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="approver_items"
                        v-model="quotation_mrf_approver"
                        label="Quotation MRF Approver *"
                        v-if="enable_workflow_for_quotation_mrf != false"
                        :rules="
                          enable_workflow_for_quotation_mrf == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        this.quotation_mrf_approver == 'SPECIFIC_USERS' ||
                        this.quotation_mrf_approver ==
                          'REPORTING_MANAGER_AND_SPECIFIC_USER'
                      "
                      class="pb-0"
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="User *"
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="quotation_mrf_approver_ids"
                        v-if="enable_workflow_for_quotation_mrf != false"
                        :rules="
                          this.product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      sm="12"
                      xs="12"
                      class="mt-5 ml-6"
                    >
                      <b style="font-size: 14px">Product Replacement</b>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12" xs="12">
                      <v-checkbox
                        v-model="enable_workflow_for_fgr"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="fgr_approver_items"
                        v-model="fgr_approver"
                        label="Product Replacement Approver *"
                        v-if="enable_workflow_for_fgr != false"
                        :rules="
                          enable_workflow_for_fgr == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      sm="12"
                      xs="12"
                      v-if="
                        fgr_approver ===
                          'TECHNICAL_MANAGERS_AND_SPECIFIC_USER' ||
                        fgr_approver === 'TECHNICAL_MANAGERS'
                      "
                      class="pb-0"
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="
                        Technical Managers
                        "
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="fgrTechManagers"
                        v-model="fgr_tech_manager_approver_ids"
                        v-if="enable_workflow_for_fgr != false"
                        :rules="
                          product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      class="pt-0"
                      cols="12"
                      lg="2"
                      md="2"
                      sm="12"
                      xs="12"
                      v-if="
                        fgr_approver == 'SPECIFIC_USERS' ||
                        fgr_approver == 'REPORTING_MANAGER_AND_SPECIFIC_USER' ||
                        fgr_approver === 'TECHNICAL_MANAGERS_AND_SPECIFIC_USER'
                      "
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="Specific Users *"
                        item-value="user_id"
                        class="FontSize mt-4 ml-2"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="fgr_approver_ids"
                        v-if="enable_workflow_for_fgr != false"
                        :rules="
                          product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      sm="12"
                      xs="12"
                      class="mt-5 ml-6"
                    >
                      <b style="font-size: 14px">FOC</b>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12" xs="12">
                      <v-checkbox
                        v-model="enable_workflow_for_foc"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="fgr_approver_items"
                        v-model="foc_approver"
                        label="FOC Approver *"
                        v-if="enable_workflow_for_foc != false"
                        :rules="
                          enable_workflow_for_foc == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      sm="12"
                      xs="12"
                      v-if="
                        foc_approver ===
                          'TECHNICAL_MANAGERS_AND_SPECIFIC_USER' ||
                        foc_approver === 'TECHNICAL_MANAGERS'
                      "
                      class="pb-0"
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="
                        Technical Managers
                        "
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="focTechManagers"
                        v-model="foc_tech_manager_approver_ids"
                        v-if="enable_workflow_for_foc != false"
                        :rules="
                          product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      class="pt-0"
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        foc_approver == 'SPECIFIC_USERS' ||
                        foc_approver == 'REPORTING_MANAGER_AND_SPECIFIC_USER' ||
                        foc_approver === 'TECHNICAL_MANAGERS_AND_SPECIFIC_USER'
                      "
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="Specific Users *"
                        item-value="user_id"
                        class="FontSize mt-4 ml-2"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="foc_approver_ids"
                        v-if="enable_workflow_for_foc != false"
                        :rules="
                          product_fleet_approver == 'SPECIFIC_USERS'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="2" sm="12" xs="12" class="mt-5 ml-6">
                      <b style="font-size: 14px">Payout</b>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-checkbox v-model="enable_payout"></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="text"
                        item-value="value"
                        class="FontSize mt-4 mr-2"
                        :items="approver_items"
                        v-model="payout_approver"
                        label="Payout Approver *"
                        v-if="enable_payout != false"
                        :rules="
                          enable_payout == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="
                        payout_approver == 'SPECIFIC_USERS' ||
                        payout_approver == 'REPORTING_MANAGER_AND_SPECIFIC_USER'
                      "
                      class="pb-0"
                    >
                      <v-autocomplete
                        dense
                        multiple
                        outlined
                        label="User *"
                        item-value="user_id"
                        class="FontSize mt-4"
                        item-text="user_name"
                        :items="GetAllUsersList"
                        v-model="payout_approver_ids"
                        v-if="enable_payout != false"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
                <v-toolbar class="elevation-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    :loading="btn_loading_workflow_settings"
                    class="primary white--text mt-10 mr-6 mb-12"
                    @click="validateMethod('WORK_FLOW')"
                  >
                    <v-icon small class="mr-2">mdi-content-save</v-icon>Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Custom Ticket ID
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-n4">
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-checkbox
                      label="Enable Custom Ticket ID"
                      v-model="enable_to_generate_custome_based_ticket_id"
                      class="ml-6 font-weight-bold"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                  >
                    <v-checkbox
                      label="Enable Organization Prefix"
                      class="ml-6 font-weight-bold"
                      v-model="enable_organization_prefix"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                  >
                    <v-text-field
                      outlined
                      dense
                      :disabled="
                        enable_organization_prefix == false ||
                        enable_organization_prefix == undefined
                      "
                      class="FontSize mt-4"
                      hint="Min 1, Max 3 Chars"
                      v-model="organization_prefix_value"
                      :rules="
                        this.enable_organization_prefix == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      label="Prefix Value"
                      :maxlength="3"
                      @keyup="callmethodUppercase(organization_prefix_value)"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                  >
                    <v-checkbox
                      label="Enable Call Type"
                      class="ml-6 font-weight-bold"
                      v-model="enable_call_type"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_call_type == false ||
                        enable_call_type == undefined
                      "
                      label="Call Type Prefix Chars"
                      :rules="
                        this.enable_call_type == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="call_type_prefix"
                      :items="call_type_prefix_chars_items"
                      class="FontSize mt-4 mr-10"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-checkbox
                      label="Enable Category Prefix"
                      class="ml-6 font-weight-bold"
                      v-model="enable_category_prefix"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_category_prefix == false ||
                        enable_category_prefix == undefined
                      "
                      label="Category Prefix Chars"
                      :rules="
                        this.enable_category_prefix == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="category_prefix"
                      :items="category_prefix_items"
                      class="FontSize mt-4 mx-6"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-checkbox
                      label="Enable Product Prefix"
                      class="font-weight-bold"
                      v-model="enable_product_prefix"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_product_prefix == false ||
                        enable_product_prefix == undefined
                      "
                      label="Product Prefix Chars"
                      :rules="
                        this.enable_product_prefix == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="product_prefix"
                      :items="product_prefix_items"
                      class="FontSize mt-4 mr-10"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10 ml-6 mr-n6"
                  >
                    <v-checkbox
                      label="Enable Product Fleet Prefix"
                      class="font-weight-bold"
                      v-model="enable_product_fleet_prefix"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_product_fleet_prefix == false ||
                        enable_product_fleet_prefix == undefined
                      "
                      label="Product Fleet Prefix Chars"
                      :rules="
                        this.enable_product_fleet_prefix == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="product_fleet_prefix"
                      :items="product_fleet_prefix_items"
                      class="FontSize mt-4 mx-6"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-checkbox
                      label="Enable Date of Ticket"
                      class="font-weight-bold"
                      v-model="enable_date_of_ticket_register"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-checkbox
                      label="Enable Ticket Sequence"
                      class="font-weight-bold ml-6"
                      v-model="enable_ticket_sequence"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10 ml-6 mr-n6"
                  >
                    <v-checkbox
                      label="Enable Ticket Sequence Reset"
                      class="font-weight-bold"
                      v-model="enable_ticket_sequence_reset"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_ticket_sequence_reset == false ||
                        enable_ticket_sequence_reset == undefined
                      "
                      label="Ticket Sequence Reset By"
                      :rules="
                        this.enable_ticket_sequence_reset == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="ticket_sequence_reset"
                      :items="ticket_sequence_reset_items"
                      class="FontSize mt-4 mx-6"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    xs="12"
                    sm="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-checkbox
                      label="Enable Ticket Seperator"
                      class="font-weight-bold"
                      v-model="enable_ticket_separator"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      :disabled="
                        enable_ticket_separator == false ||
                        enable_ticket_separator == undefined
                      "
                      label="Seperator"
                      v-model="ticket_separator"
                      :items="ticket_separator_items"
                      class="FontSize mt-4 mr-10"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                    sm="12"
                    xs="12"
                    v-if="enable_to_generate_custome_based_ticket_id == true"
                    class="mt-n10 ml-6"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      label="Ticket ID Sequence"
                      multiple
                      :rules="
                        this.enable_to_generate_custome_based_ticket_id == true
                          ? [(v) => !!v || 'Required']
                          : []
                      "
                      v-model="ticket_create_sequence"
                      :items="ticket_create_sequence_items"
                      class="FontSize mt-4 mr-12"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-toolbar class="elevation-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    :loading="btn_custom_ticket_id"
                    class="primary white--text mt-10 mr-6 mb-12"
                    @click="validateMethod('UPDATE_CUSTOME_BASED_TICKET_ID')"
                  >
                    <v-icon small class="mr-2">mdi-content-save</v-icon>Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Custom Report Builder</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <ReportDownloadFields @clicked="reportsFieldsEmit" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
                >Bank Account Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="bank_details_form">
                  <v-row no-gutters class="mt-n4 FontSize">
                    <v-col cols="12" md="3" sm="12" xs="12" class="mt-3">
                      <b class="mt-3">Bank Name * :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        :rules="[(v) => !!v || 'Required']"
                        v-model="bank_name"
                        dense
                        outlined
                        class="FontSize"
                        label="Bank Name *"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12" class="mt-3">
                      <b class="mt-3 ml-3">Bank Address :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        v-model="bank_address"
                        dense
                        outlined
                        class="FontSize"
                        label="Bank Address"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <b class="mt-4">Bank Account Holder Name * :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        :rules="[(v) => !!v || 'Required']"
                        v-model="account_holder"
                        dense
                        outlined
                        class="FontSize"
                        label="Account Holder Name *"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12" class="pl-3">
                      <b class="mt-4">Bank Account Number :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        :rules="[(v) => !!v || 'Required']"
                        v-model="account_id"
                        dense
                        outlined
                        class="FontSize"
                        label="Account Number *"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12" class="mt-3">
                      <b class="mt-2">IFSC Code :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        :rules="[(v) => !!v || 'Required']"
                        v-model="ifsc"
                        dense
                        outlined
                        class="FontSize"
                        label="IFSC Code *"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12" class="mt-3 pl-3">
                      <b class="mt-2">Branch :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        :rules="[(v) => !!v || 'Required']"
                        v-model="branch"
                        dense
                        outlined
                        class="FontSize"
                        label="Branch *"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col class="mt-3" cols="12" md="3" sm="12" xs="12">
                      <b>GST NO :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize"
                        label="GST Number"
                        v-model="tax_id"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <b class="ml-3">Pan Number :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize"
                        label="Pan Number"
                        v-model="pan_no"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <b>UPI ID :</b>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        v-model="upiId"
                        dense
                        outlined
                        label="UPI ID"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
                <v-toolbar class="elevation-0">
                  <v-spacer />
                  <v-btn
                    small
                    :loading="loading_bank_details_btn"
                    class="primary white--text"
                    @click="validateMethod('BANK_DETAILS')"
                    >Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          v-if="
            $store.getters.get_current_user_details.organization_details
              .enable_quotation_generation === true
          "
          class="mb-4 ml-3 mr-3"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Quotation Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="quotation_settings_form">
                  <v-row no-gutters class="mt-n4 FontSize">
                    <v-col cols="12" md="4" sm="12" xs="12" class="mt-3">
                      <v-checkbox
                        class="ml-4"
                        color="primary"
                        label="Enable Terms & Conditions while Generating Quotation"
                        v-model="enable_terms_and_conditions"
                      >
                      </v-checkbox>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      xs="12"
                      sm="12"
                      class="d-flex justify-end"
                    >
                      <v-textarea
                        rows="3"
                        outlined
                        dense
                        class="FontSize"
                        v-if="enable_terms_and_conditions == true"
                        label="Terms & Conditions *"
                        v-model="terms_and_conditions"
                        :rules="
                          enable_terms_and_conditions == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <v-checkbox
                        class="ml-4"
                        color="primary"
                        label="Enable Discount"
                        v-model="enable_discount"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        v-if="enable_discount == true"
                        class="FontSize mt-4"
                        v-model="maximum_discount"
                        type="number"
                        label="Disount % *"
                        :rules="
                          enable_discount == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      >
                      </v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" md="3" sm="12" xs="12">
                      <v-checkbox
                        class="ml-4"
                        color="primary"
                        label="Enable to QR Code"
                        v-model="enable_payment_qr_code"
                      >
                      </v-checkbox>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-card
                        align="center"
                        @click="uploadQrCode()"
                        class="elevation-1 ml-6 mr-3"
                      >
                        <v-fab-transition v-if="qr_url != null && qr_url != ''">
                          <v-btn
                            absolute
                            top
                            right
                            x-small
                            fab
                            color="red"
                            class="mr-4"
                            @click.stop="(qr_url = null), (uploaded_qr = false)"
                          >
                            <v-icon x-small>mdi-close</v-icon>
                          </v-btn>
                        </v-fab-transition>
                        <v-img
                          v-if="qr_url != null && qr_url != ''"
                          :src="qr_url"
                          :lazy-src="qr_url"
                          height="45"
                          max-width="180"
                          class="mt-4"
                        ></v-img>
                        <div v-else>
                          <input
                            ref="qr-upload-input"
                            accept="image/*"
                            class="qr-upload-input"
                            type="file"
                            @change="upload_qr_code"
                          />
                          <v-icon>mdi-upload</v-icon>
                          <div align="center">Upload QR Code</div>
                        </div>
                      </v-card>
                    </v-col> -->
                  </v-row>
                </v-form>
                <div class="mt-5">
                  <v-row>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <strong> <span>Service Details: </span></strong>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                      class="d-flex justify-end"
                    >
                      <v-btn
                        color="primary"
                        dense
                        @click="
                          AddServiceDetailsDialogMethod({}, undefined, 'ADD')
                        "
                        >Add Service<v-icon>mdi-plus</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </div>
                <v-data-table
                  v-if="
                    $store.getters.get_current_user_details.organization_details
                      .quotation_service_charges
                  "
                  :headers="quotationServiceHeader"
                  :items="
                    $store.getters.get_current_user_details.organization_details
                      .quotation_service_charges
                  "
                  :no-data-text="
                    $store.getters.get_current_user_details.organization_details
                      .quotation_service_charges.length === 0
                      ? 'No data available'
                      : ''
                  "
                  :item-per-page="5"
                >
                  <template v-slot:[`item.actions`]="{ item, index }">
                    <div style="display: flex">
                      <div>
                        <v-btn
                          icon
                          @click="
                            AddServiceDetailsDialogMethod(item, index, 'EDIT')
                          "
                          ><v-icon color="primary" size="17"
                            >mdi-pencil</v-icon
                          ></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          icon
                          @click="
                            AddServiceDetailsDialogMethod(item, index, 'DELETE')
                          "
                          ><v-icon color="red" size="17"
                            >mdi-delete</v-icon
                          ></v-btn
                        >
                      </div>
                    </div>
                  </template>
                </v-data-table>
                <v-toolbar class="elevation-0">
                  <v-spacer />
                  <v-btn
                    small
                    :loading="loading_quotation_settings_btn"
                    class="primary white--text"
                    @click="saveQuotationDetails()"
                    >Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          v-if="
            $store.getters.get_current_user_details.organization_details
              .enable_quotation_generation === true
          "
          class="mb-4 ml-3 mr-3"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Purchase Order Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="quotation_settings_form">
                  <v-row no-gutters class="mt-n4 FontSize">
                    <v-col cols="12" md="4" sm="12" xs="12" class="mt-3">
                      <v-checkbox
                        class="ml-4"
                        color="primary"
                        label="Enable Terms & Conditions while Generating PO"
                        v-model="enable_po_terms_and_conditions"
                      >
                      </v-checkbox>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      xs="12"
                      sm="12"
                      class="d-flex justify-end"
                    >
                      <v-textarea
                        rows="3"
                        outlined
                        dense
                        class="FontSize"
                        v-if="enable_po_terms_and_conditions == true"
                        label="Terms & Conditions *"
                        v-model="po_terms_and_conditions"
                        :rules="
                          enable_po_terms_and_conditions == true
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <!-- <v-checkbox
                        class="ml-4"
                        color="primary"
                        label="Enable Narration"
                        v-model="enable_narration"
                      ></v-checkbox> -->
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize mt-4"
                        v-model="po_narration"
                        label="Narration*"
                        :rules="[(v) => !!v || 'Required']"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>

                <v-toolbar class="elevation-0">
                  <v-spacer />
                  <v-btn
                    small
                    :loading="loading_quotation_settings_btn"
                    class="primary white--text"
                    @click="saveSettingsMethod('PO_DETAILS')"
                    >Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Product Replacement
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-model="enableFgrTC"
                  label="Enable Product Replacement T&C"
                />
                <div v-if="enableFgrTC">
                  <v-textarea
                    v-model="fgrTermsCond"
                    dense
                    outlined
                    label="Product Replacement Terms and Conditions"
                  ></v-textarea>
                  <v-textarea
                    v-model="customerTermsCond"
                    dense
                    outlined
                    label="Customer Terms and Conditions"
                  ></v-textarea>
                  <v-textarea
                    v-model="dealerTermsCond"
                    dense
                    outlined
                    label="Dealer Terms and Conditions"
                  ></v-textarea>
                </div>
                <v-toolbar class="elevation-0">
                  <v-spacer />
                  <v-btn
                    small
                    :loading="loading_quotation_settings_btn"
                    class="primary white--text"
                    @click="saveSettingsMethod('PRODUCT_REPLACEMENT_DETAILS')"
                    >Save
                  </v-btn>
                </v-toolbar>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>

        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Payout Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="billPeriodFrom"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedFromBillDate"
                      label="Bill Period From Date*"
                      outlined
                      dense
                      class="FontSize field_label_size field_height maxWidthSmall"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="billPeriodFrom" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="saveDate1">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="billPeriodTo"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedToBillDate"
                      label="Bill Period To Date*"
                      outlined
                      dense
                      class="FontSize field_label_size field_height maxWidthSmall"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="billPeriodTo" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="saveDate2">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- <v-text-field
                  v-model="gstCallCharges"
                  type="number"
                  dense
                  outlined
                  label="GST Call Charges*"
                  class="FontSize field_label_size field_height maxWidthSmall"
                ></v-text-field>
                <v-text-field
                  v-model="gstSparePart"
                  type="number"
                  dense
                  outlined
                  label="GST Spare Part*"
                  class="FontSize field_label_size field_height maxWidthSmall"
                ></v-text-field> -->
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    small
                    :loading="loading_bank_details_btn"
                    class="primary white--text"
                    @click="validateMethod('PAYOUT')"
                    >Save
                  </v-btn>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
      </v-row>
    </v-card>
  </div>
</template>
<script>
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true;
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ReportDownloadFields from "@/components/MasterSettings/Cards/ReportDownloadFields.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import {
  Update_Enterprise_Details,
  CreatePincodeType,
} from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllMasterCategories } from "@/mixins/MastersSetting/GetAllMasterCategories.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllCategoriesByMasterCategories } from "@/mixins/MastersSetting/GetAllCategoriesByMasterCategories.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import AddServiceDetails from "@/components/MasterSettings/Dialogs/Organizations/AddServiceDetailsDialog.vue";
import EditTerritoryDialog from "@/components/MasterSettings/Dialogs/Territories/TerritoriesEdit.vue";
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
import ListPincodesHistoryDialog from "@/components/MasterSettings/Dialogs/Territories/Dialogs/GetPincodesHistory.vue";

import DeleteTerritoryClassification from "@/components/MasterSettings/Dialogs/Organizations/DeleteTerritoryClassDialog.vue";
import { GetAllEscalationNotifications } from "@/mixins/MastersSetting/GetAllEscalationNotification.js";
export default {
  mixins: [
    GetAllUsers,
    GenerateS3URL,
    GetCurrentUser,
    GetAllMasterCategories,
    GetAllOrganizationSetting,
    GetAllCategoriesByMasterCategories,
    GetAllOrganizationSettingsTypesInMS,
    ListPincodeTypesMixins,
    GetAllEscalationNotifications,
  ],
  components: {
    Overlay,
    Snackbar,
    ReportDownloadFields,
    AddServiceDetails,
    EditTerritoryDialog,
    ListPincodesHistoryDialog,
    DeleteTerritoryClassification,
  },
  data() {
    return {
      gstSparePart: "",
      gstCallCharges: "",
      menu1: false,
      billPeriodFrom: "",
      menu2: false,
      billPeriodTo: "",
      fgrTermsCond: "",
      customerTermsCond: "",
      dealerTermsCond: "",
      enableFgrTC: false,
      url: "",
      qr_url: "",
      approver: "",
      org_address: "",
      approver_ids: [],
      module_name: "",
      feedback_url: "",
      support_type: "",
      warranty_type: "",
      product_prefix: "",
      category_prefix: "",
      days_or_hours: "Day",
      call_type_prefix: "",
      ticket_separator: "",
      account_holder: "",
      bank_name: "",
      bank_address: "",
      account_id: "",
      ifsc: "",
      tax_id: "",
      branch: "",
      pan_no: "",
      quotation_approver: "",
      quotation_mrf_approver: "",
      fgr_approver: "",
      foc_approver: "",
      quotation_approver_ids: [],
      quotation_mrf_approver_ids: [],
      fgr_approver_ids: [],
      foc_approver_ids: [],
      fgr_tech_manager_approver_ids: [],
      foc_tech_manager_approver_ids: [],
      is_otp_send_to: "BOTH",
      ticket_accept_time: "",
      location_validation: "",
      product_fleet_prefix: "",
      escalation_day: "ONE_DAY",
      distance_variation: "1.2",
      ticket_sequence_reset: "",
      organization_logo_url: "",
      product_fleet_approver: "",
      end_location_validation: "",
      product_fleet_approver_id: "",
      organization_prefix_value: "",
      terms_and_conditions: "",
      po_terms_and_conditions: "",
      po_narration: "",
      callCenterContNum: "",
      maximum_discount: 0,
      escalation_user: "",
      escalation_user_items: [],
      enable_user_select: false,
      nsm: false,
      rsm: false,
      menu: false,
      agent: false,
      manager: false,
      isLoading: false,
      renderComp: true,
      dealer_agent: false,
      loading_quotation_settings_btn: false,
      dealer_owner: false,
      partner_agent: false,
      representative: false,
      ticket_discard: false,
      enablecomponent: false,
      service_partner: false,
      enable_call_type: false,
      workflow_enabled: false,
      enable_discount: false,
      enable_payment_qr_code: false,
      enable_terms_and_conditions: false,
      enable_po_terms_and_conditions: false,
      enable_narration: false,
      enable_workflow_for_quotation: false,
      enable_workflow_for_quotation_mrf: false,
      enable_workflow_for_fgr: false,
      enable_workflow_for_foc: false,
      loading_bank_details_btn: false,
      feedback_url_enable: false,
      verify_serial_number: false,
      btn_custom_ticket_id: false,
      enable_ticket_accept: false,
      dealer_representative: false,
      enable_product_prefix: false,
      loadingTICKET_SETTINGS: false,
      enable_category_prefix: false,
      enable_ticket_sequence: false,
      partner_representative: false,
      is_clouser_type_enable: false,
      loadingOrganizationLogo: false,
      enable_ticket_separator: false,
      is_training_provided_to: false,
      loadingCATEGORY_SETTINGS: false,
      end_service_at_workplace: false,
      loading_escalation_enable: false,
      loadingATTENDANCE_SETTINGS: false,
      start_service_at_workplace: false,
      enable_edit_warranty_details: false,
      enable_edit_serial_number: false,
      loading_discard_ticket_btn: false,
      enable_organization_prefix: false,
      dealer_ticket_close_enable: false,
      enable_product_fleet_prefix: false,
      loadingDEFAULT_CUSTOMER_TYPE: false,
      enable_ticket_sequence_reset: false,
      enable_ticket_close_workflow: false,
      isLoading_distance_variation: false,
      ticket_close_after_work_start: false,
      enable_product_fleet_workflow: false,
      btn_loading_workflow_settings: false,
      escalation_notification_enable: false,
      enable_date_of_ticket_register: false,
      is_customer_category_mandatory: false,
      loadingMASTER_CATEGORY_SETTINGS: false,
      is_close_ticket_location_enable: false,
      organization_ticket_close_enable: true,
      loading_enable_ticket_accept_btn: false,
      dealer_agent_ticket_close_enable: false,
      btn_update_support_and_support_type: false,
      service_partner_ticket_close_enable: false,
      organization_RSM_ticket_close_enable: false,
      organization_NSM_ticket_close_enable: false,
      is_enabled_to_update_shceduled_service: false,
      dealer_higher_level_ticket_close_enable: false,
      dealer_representative_ticket_close_enable: false,
      service_partner_agent_ticket_close_enable: false,
      enable_to_generate_custome_based_ticket_id: false,
      organization_coordinater_ticket_close_enable: false,
      organization_higher_level_ticket_close_enable: false,
      loading_enable_location_btn_while_close_ticket: false,
      organization_representative_ticket_close_enable: false,
      service_partner_higher_level_ticket_close_enable: false,
      service_partner_representative_ticket_close_enable: false,
      payout_approver: "",
      enable_payout: false,
      payout_approver_ids: [],
      enable_payment_option: false,
      enable_disable_foc: false,
      enable_disable_cabinet: false,
      enableDisableDealerProdFleet: false,
      EditTerritoryDialog: false,
      ListPincodesHistoryDialog: false,
      deleteTerrClassDialog: false,
      files: [],
      categoryItems: [],
      GetAllUsersList: [],
      GetAllAMCTypeList: [],
      masterCategoryItems: [],
      ticket_create_sequence: [],
      ticket_create_sequence_items: [],
      product_prefix_items: [1, 2, 3],
      category_prefix_items: [1, 2, 3],
      ticket_accept_time_items: [1, 2, 3],
      product_fleet_prefix_items: [1, 2, 3],
      call_type_prefix_chars_items: [1, 2, 3],
      reopen_ticket_durationItems: [24, 48, 72],
      GetCategoriesByMasterCategoryListFilter: [],
      number_of_attachments_required_items: [1, 2, 3, 4, 5],
      ticket_accept_time_items_hours: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ],
      AutoMaticLogoutTime: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],

      scheduled_service_dates_items: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
      ticket_sequence_reset_items: [
        { text: "Day", value: "DAY" },
        { text: "Month", value: "MONTH" },
        { text: "Year", value: "YEAR" },
      ],
      ticket_separator_items: [
        { text: "-", value: "-" },
        { text: "_", value: "_" },
        { text: "/", value: "/" },
        { text: "*", value: "*" },
        { text: "^", value: "^" },
      ],
      escalation_day_items: [
        { text: "One Day", value: "ONE_DAY" },
        { text: "Two Days", value: "TWO_DAYS" },
        { text: "Three Days", value: "THREE_DAYS" },
      ],
      ticket_location_type_items: [
        { text: "EX STATION", value: "EX_STATION" },
        { text: "HEAD QUARTER", value: "HEAD_QUARTER" },
        { text: "OUT STATION", value: "OUT_STATION" },
        { text: "OTHERS", value: "OTHERS" },
      ],
      send_otp_to_items: [
        { text: "Both Customer & Technician", value: "BOTH" },
        { text: "Only Technician", value: "TECHNICIAN" },
        { text: "Only Customer", value: "CUSTOMER" },
      ],
      closure_type_items: [
        { text: "OVERCALL RESOLUTION", value: "OVERCALL_RESOLUTION" },
        { text: "CENTER VISIT", value: "CENTER_VISIT" },
      ],
      days_or_hours_items: [
        { text: "Days", value: "DAYS" },
        { text: "Hours", value: "HOURS" },
      ],
      approver_items: [
        {
          text: "REPORTING MANAGER",
          value: "REPORTING_MANAGER",
        },
        {
          text: "ADMIN",
          value: "ADMIN",
        },
        {
          text: "SPECIFIC USERS",
          value: "SPECIFIC_USERS",
        },
        {
          text: "REPORTING MANAGER AND SPECIFIC USER",
          value: "REPORTING_MANAGER_AND_SPECIFIC_USER",
        },
        {
          text: "REPORTING AND SECONDARY MANAGER",
          value: "REPORTING_AND_SECONDARY_MANAGER",
        },
      ],
      fgr_approver_items: [
        {
          text: "REPORTING MANAGER",
          value: "REPORTING_MANAGER",
        },
        {
          text: "ADMIN",
          value: "ADMIN",
        },
        {
          text: "SPECIFIC USERS",
          value: "SPECIFIC_USERS",
        },
        {
          text: "REPORTING MANAGER AND SPECIFIC USER",
          value: "REPORTING_MANAGER_AND_SPECIFIC_USER",
        },
        {
          text: "REPORTING AND SECONDARY MANAGER",
          value: "REPORTING_AND_SECONDARY_MANAGER",
        },
        {
          text: "TECHNICAL MANAGERS",
          value: "TECHNICAL_MANAGERS",
        },
        {
          text: "TECHNICAL MANAGERS AND SPECIFIC USER",
          value: "TECHNICAL_MANAGERS_AND_SPECIFIC_USER",
        },
      ],
      support_type_items: [
        { text: "Guarantee", value: "GUARANTEE" },
        { text: "Warranty", value: "WARRANTY" },
        { text: "Contract", value: "AMC" },
        { text: "Extended Warranty", value: "EXTENDED_WARRANTY" },
        { text: "No Warranty", value: "NO_WARRANTY" },
      ],
      product_repair_setting_items: [
        { text: "Product Repair", value: "product_repair" },
        { text: "Product Replace", value: "product_replace" },
        { text: "Repair & Replace", value: "both" },
      ],
      itemsssss: [
        { text: "SUN", value: "SUNDAY" },
        { text: "MON ", value: "MONDAY" },
        { text: "TUE", value: "TUESDAY" },
        { text: "WED", value: "WEDNESDAY" },
        { text: "THU", value: "THURSDAY" },
        { text: "FRI ", value: "FRIDAY" },
        { text: "SAT", value: "SATURDAY" },
      ],
      masterCategoryHeaders: [
        { text: "#", value: "sl_no" },
        { text: "Category Name", value: "master_category_name" },
        { text: "Actions", value: "Actions" },
      ],
      categoryHeaders: [
        { text: "#", value: "sl_no" },
        { text: "Master Category Name", value: "master_category_name" },
        { text: "Category Name", value: "category_name" },
        { text: "Actions", value: "Actions" },
      ],
      sort_ticket_by: [
        { text: "PREFERED VISIT DATE", value: "PREFERED_VISIT_DATE" },
        { text: "CREATION DATE", value: "CREATION_DATE" },
        { text: "MODIFIED DATE", value: "MODIFIED_DATE" },
      ],
      holidaydate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      StoreObj: {},
      SnackBarComponent: {},
      masterCategorySettings: {
        master_category_id: "",
      },
      categorySettings: {
        category_id: "",
        master_category_id: "",
      },
      auto_approval_for_own_stock_component_request: false,
      ticket_settings: {
        default_customer_type: "INDIVIDUAL",
        product_repair_or_replacement: "both",
        scheduled_service_dates: 0,
        number_of_attachments_required: 2,
        reopen_ticket: false,
        sort_ticket_by: null,
        allow_otp_proxy: false,
        active_ticket_count: null,
        enable_ticket_close: false,
        reopen_ticket_duration: null,
        enable_to_rise_ticket: false,
        enable_ticket_creation: false,
        is_attachment_mandatory: false,
        is_access_control_enable: false,
        enable_manual_territory_tagging: false,
        enable_ticket_components_request: false,
      },
      territoryObj: {},
      time_setting: {
        auto_logout_time: "",
        week_days: null,
        holidaydate: null,
      },
      quotationServiceHeader: [
        { text: "Service Name", value: "service_name" },
        { text: "Service GST", value: "service_gst" },
        { text: "Service Cost", value: "service_cost" },
        { text: "Actions", value: "actions" },
      ],
      AddServiceDetailsDialog: false,
      PrevData: [],
      addedServiceData: [],
      orgContNumber: "",
      modifiedOrgContNumber: "",
      orgEmailId: "",
      fgrTechManagers: [],
      focTechManagers: [],
      user_typeItems: [
        { text: "MANAGER", value: "MANAGER" },
        { text: "ADMIN", value: "ADMIN" },
        { text: "Service Co-Ordinator", value: "AGENT" },
        { text: "STORE MANAGER", value: "STORE_MANAGER" },
        { text: "OWNER", value: "OWNER" },
        { text: "MANAGEMENT", value: "MANAGEMENT" },
        { text: "NSM", value: "NSM" },
        { text: "RSM", value: "RSM" },
      ],
      UserType_headers: [
        {
          text: "Type",
          value: "type",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ],
      duplicate_typeItems: [],
      upiId: "",
      Territory_Name: "",
      options: ["Hours", "Days"],
      selection: "Hours",
      menu: false,
      time: null,
      formattedTime: "",
      date: null,
      formattedDay: "",
      baseDate: "2025-01-01",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      TerritoryLoading: false,
      Pincodes_Items: [],
      TerritoriesHeaders: [
        {
          text: "Territory Type",
          value: "pincode_territory_type",
        },
        {
          text: "Estimated Time",
          value: "estimated_time",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      ActionObj: {},
      ActionOobj: {},
      Time_Values: "",
    };
  },
  watch: {
  fgr_approver_ids(val) {
    console.log("SPECIF_ID", val)
  },
    fgr_approver(val) {
      if (
        val === "TECHNICAL_MANAGERS_AND_SPECIFIC_USER" ||
        val === "TECHNICAL_MANAGERS"
      ) {
        this.fgrTechManagers = this.GetAllUsersList.map((item) => {
          if (item.user_type === "STORE_MANAGER") {
            return item;
          }
        });
      }
    },
    foc_approver(val) {
      if (
        val === "TECHNICAL_MANAGERS_AND_SPECIFIC_USER" ||
        val === "TECHNICAL_MANAGERS"
      ) {
        this.focTechManagers = this.GetAllUsersList.map((item) => {
          if (item.user_type === "STORE_MANAGER") {
            return item;
          }
        });
      }
    },
    orgContNumber(val) {
      if (val) {
        if (val.includes(",")) {
          const separatedWithComma = val.split(",");
          this.modifiedOrgContNumber = separatedWithComma.join(" , ");
        } else {
          this.modifiedOrgContNumber = val;
        }
      }
    },
    enable_ticket_sequence(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Sequence",
          value: "SEQUENCE",
        });
      } else if (val == false) {
        let index_sequence = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "SEQUENCE"
        );
        this.ticket_create_sequence_items.splice(index_sequence, 1);
      }
    },
    enable_date_of_ticket_register(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({ text: "Date", value: "DATE" });
      } else if (val == false) {
        let index_date = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "DATE"
        );
        this.ticket_create_sequence_items.splice(index_date, 1);
      }
    },
    enable_call_type(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Call Type",
          value: "CALL_TYPE",
        });
      } else if (val == false) {
        let index_call_type = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "CALL_TYPE"
        );
        this.ticket_create_sequence_items.splice(index_call_type, 1);
      }
    },
    enable_category_prefix(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Category",
          value: "CATEGORY",
        });
      } else if (val == false) {
        let index_categorey = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "CATEGORY"
        );
        this.ticket_create_sequence_items.splice(index_categorey, 1);
      }
    },
    enable_product_prefix(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Product",
          value: "PRODUCT",
        });
      } else if (val == false) {
        let index_product = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "PRODUCT"
        );
        this.ticket_create_sequence_items.splice(index_product, 1);
      }
    },
    enable_product_fleet_prefix(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Product Fleet",
          value: "PRODUCT_FLEET",
        });
      } else if (val == false) {
        let index_product_fleet = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "PRODUCT_FLEET"
        );
        this.ticket_create_sequence_items.splice(index_product_fleet, 1);
      }
    },
    enable_organization_prefix(val) {
      if (val == true) {
        this.ticket_create_sequence_items.push({
          text: "Organization",
          value: "ORG",
        });
      } else if (val == false) {
        let index_org_name = this.ticket_create_sequence_items.findIndex(
          (item) => item.value === "ORG"
        );
        this.ticket_create_sequence_items.splice(index_org_name, 1);
      }
    },
    support_type(val) {
      if (val != undefined) {
        this.GetAllAMCTypeMethod("ACTIVE", val);
      }
    },
    GetAllOrganizationSettingsTypesObject(cal) {
      this.updated_items = cal.work_flow_modules;
      this.ticket_settings.scheduled_service_dates =
        cal.scheduled_service_dates;
    },
    "ticket_settings.reopen_ticket"(val) {
      if (val == false) {
        this.ticket_settings.reopen_ticket_duration = "";
      }
    },
    "ticket_settings.sort_ticket_by"(val) {
      if (val == false) {
        this.ticket_settings.sort_ticket_by = "";
      }
    },
    "categorySettings.master_category_id"(val) {
      this.GetCategoriesByMasterCategoryMethod(val);
    },
  },
  computed: {
    TimeArray() {
      let Time_Value = [];
      for (let i = 1; i <= 24; i++) {
        if (i === 1) {
          Time_Value.push(`${i} Hour`);
        } else {
          Time_Value.push(`${i} Hours`);
        }
      }
      return Time_Value;
    },

    formattedFromBillDate() {
      if (!this.billPeriodFrom) return "";
      const [year, month, day] = this.billPeriodFrom.split("-");
      return `${day}-${month}-${year}`;
    },

    formattedToBillDate() {
      if (!this.billPeriodTo) return "";
      const [year, month, day] = this.billPeriodTo.split("-");
      return `${day}-${month}-${year}`;
    },
  },
  async mounted() {
    await this.GetAllEscalationNotificationMethod("ACTIVE");
    console.log("CHECK_ESC", this.GetAllEscalationNotificationList);
    this.escalation_user_items = this.GetAllEscalationNotificationList.flatMap(
      (item) => (item.users_to_notify ? item.users_to_notify : [])
    );
    // this.escalation_user_items = items.map(item => item.replace(/,|"/g, "").trim());
    await this.GetAllUsersMethod(undefined, "ACTIVE");
    this.GetAllOrganizationSettingsTypesMethod(this.status);
    this.GetCategoriesByMasterCategoryMethod(this.status);
    this.GetAllMasterCategoriesMethod(this.status);
    await this.ListPincodeTypes();
    this.feedback_url_enable =
      this.$store.getters.get_current_user_details.organization_details
        .feedback_url_enable != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .feedback_url_enable
        : false;
    this.feedback_url =
      this.$store.getters.get_current_user_details.organization_details.feedback_url;
    this.distance_variation =
      this.$store.getters.get_current_user_details.organization_details.distance_variation;
    this.is_close_ticket_location_enable =
      this.$store.getters.get_current_user_details.organization_details
        .is_close_ticket_location_enable != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .is_close_ticket_location_enable
        : false;
    this.is_clouser_type_enable =
      this.$store.getters.get_current_user_details.organization_details
        .is_clouser_type_enable != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .is_clouser_type_enable
        : false;
    this.is_otp_send_to =
      this.$store.getters.get_current_user_details.organization_details
        .is_otp_send_to != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .is_otp_send_to
        : "BOTH";
    this.is_training_provided_to =
      this.$store.getters.get_current_user_details.organization_details.is_training_provided_to;
    this.escalation_notification_enable =
      this.$store.getters.get_current_user_details.organization_details.escalation_notification_enable;
    this.escalation_day =
      this.$store.getters.get_current_user_details.organization_details.escalation_day;
    try {
      this.enable_user_select =
        this.$store.getters.get_current_user_details.organization_details
          .is_enabled_to_share_escalation_notification_to_user || false;
      this.escalation_user =
        this.$store.getters.get_current_user_details.organization_details
          .escalation_notified_selected_users || "";
    } catch (error) {
      console.log("Error555", error);
    }
    this.ticket_discard =
      this.$store.getters.get_current_user_details.organization_details.ticket_discard;
    this.enable_ticket_accept =
      this.$store.getters.get_current_user_details.organization_details
        .enable_ticket_accept != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_ticket_accept
        : false;
    this.enable_ticket_close_workflow =
      this.$store.getters.get_current_user_details.organization_details.enable_ticket_close_workflow;
    this.dealer_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.dealer_ticket_close_enable;
    this.dealer_representative_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.dealer_representative_ticket_close_enable;
    this.service_partner_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.service_partner_ticket_close_enable;
    this.service_partner_representative_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.service_partner_representative_ticket_close_enable;
    this.service_partner_agent_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.service_partner_agent_ticket_close_enable;
    this.service_partner_higher_level_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.service_partner_higher_level_ticket_close_enable;
    this.organization_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_ticket_close_enable;
    this.organization_representative_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_representative_ticket_close_enable;
    this.organization_RSM_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_RSM_ticket_close_enable;
    this.organization_NSM_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_NSM_ticket_close_enable;
    this.organization_coordinater_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_coordinater_ticket_close_enable;
    this.organization_higher_level_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.organization_higher_level_ticket_close_enable;
    this.dealer_higher_level_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.dealer_higher_level_ticket_close_enable;
    this.dealer_agent_ticket_close_enable =
      this.$store.getters.get_current_user_details.organization_details.dealer_agent_ticket_close_enable;
    this.enable_edit_serial_number =
      this.$store.getters.get_current_user_details.organization_details
        .enable_edit_serial_number != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_edit_serial_number
        : false;
    this.enable_edit_warranty_details =
      this.$store.getters.get_current_user_details.organization_details
        .enable_edit_warranty_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_edit_warranty_details
        : false;
    this.callCenterContNum =
      this.$store.getters.get_current_user_details.organization_details.call_center_contact_number;
    this.start_service_at_workplace =
      this.$store.getters.get_current_user_details.organization_details
        .start_service_at_workplace != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .start_service_at_workplace
        : false;
    this.end_service_at_workplace =
      this.$store.getters.get_current_user_details.organization_details
        .end_service_at_workplace != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .end_service_at_workplace
        : false;
    this.ticket_close_after_work_start =
      this.$store.getters.get_current_user_details.organization_details.ticket_close_after_work_start;
    this.location_validation =
      this.$store.getters.get_current_user_details.organization_details.location_validation;
    this.end_location_validation =
      this.$store.getters.get_current_user_details.organization_details.end_location_validation;
    this.ticket_accept_time = this.getTicketAcceptTime();
    this.is_enabled_to_update_shceduled_service =
      this.$store.getters.get_current_user_details.organization_details.is_enabled_to_update_shceduled_service;
    this.enable_to_generate_custome_based_ticket_id =
      this.$store.getters.get_current_user_details.organization_details
        .enable_to_generate_custome_based_ticket_id != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_to_generate_custome_based_ticket_id
        : undefined;
    this.enable_organization_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .enable_organization_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_organization_prefix
        : undefined;
    this.enable_call_type =
      this.$store.getters.get_current_user_details.organization_details
        .enable_call_type != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_call_type
        : undefined;
    this.enable_category_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .enable_category_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_category_prefix
        : undefined;
    this.enable_product_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .enable_product_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_product_prefix
        : undefined;
    this.enable_product_fleet_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .enable_product_fleet_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_product_fleet_prefix
        : undefined;
    this.enable_date_of_ticket_register =
      this.$store.getters.get_current_user_details.organization_details
        .enable_date_of_ticket_register != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_date_of_ticket_register
        : undefined;
    this.enable_ticket_sequence_reset =
      this.$store.getters.get_current_user_details.organization_details
        .enable_ticket_sequence_reset != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_ticket_sequence_reset
        : undefined;
    this.enable_ticket_sequence =
      this.$store.getters.get_current_user_details.organization_details
        .enable_ticket_sequence != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_ticket_sequence
        : undefined;
    this.ticket_sequence_reset =
      this.$store.getters.get_current_user_details.organization_details
        .ticket_sequence_reset != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .ticket_sequence_reset
        : undefined;
    this.ticket_separator =
      this.$store.getters.get_current_user_details.organization_details
        .ticket_separator != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .ticket_separator
        : undefined;
    this.ticket_create_sequence =
      this.$store.getters.get_current_user_details.organization_details
        .ticket_create_sequence != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .ticket_create_sequence
        : undefined;
    this.enable_ticket_separator =
      this.$store.getters.get_current_user_details.organization_details
        .enable_ticket_separator != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_ticket_separator
        : undefined;
    this.call_type_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .call_type_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .call_type_prefix
        : undefined;
    this.category_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .category_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .category_prefix
        : undefined;
    this.product_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .product_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .product_prefix
        : undefined;
    this.product_fleet_prefix =
      this.$store.getters.get_current_user_details.organization_details
        .product_fleet_prefix != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .product_fleet_prefix
        : undefined;
    this.organization_prefix_value =
      this.$store.getters.get_current_user_details.organization_details
        .organization_prefix_value != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .organization_prefix_value
        : undefined;
    this.verify_serial_number =
      this.$store.getters.get_current_user_details.organization_details
        .verify_serial_number != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .verify_serial_number
        : false;
    this.is_customer_category_mandatory =
      this.$store.getters.get_current_user_details.organization_details
        .is_customer_category_mandatory != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .is_customer_category_mandatory
        : false;
    this.enable_payment_option =
      this.$store.getters.get_current_user_details.organization_details
        .enable_payment_details_for_tickets != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_payment_details_for_tickets
        : false;
    this.enable_disable_foc =
      this.$store.getters.get_current_user_details.organization_details
        .enable_foc_for_ticket != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_foc_for_ticket
        : false;
    this.enable_disable_cabinet =
      this.$store.getters.get_current_user_details.organization_details
        .enable_cabinet_for_tech != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_cabinet_for_tech
        : false;
    this.enableDisableDealerProdFleet =
      this.$store.getters.get_current_user_details.organization_details
        .disable_productfleet_for_dealer != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .disable_productfleet_for_dealer
        : false;
    this.support_type =
      this.$store.getters.get_current_user_details.organization_details.support_type;
    this.warranty_type =
      this.$store.getters.get_current_user_details.organization_details.warranty_type;
    this.enable_terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_terms_and_conditions
        : false;

    this.enable_po_terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions_for_fgr != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_terms_and_conditions_for_fgr
        : false;

    this.enableFgrTC =
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions_for_fgr || false;

    this.customerTermsCond =
      this.$store.getters.get_current_user_details.organization_details
        .customer_terms_and_conditions || undefined;
    this.dealerTermsCond =
      this.$store.getters.get_current_user_details.organization_details
        .dealer_terms_and_conditions || undefined;
    this.fgrTermsCond =
      this.$store.getters.get_current_user_details.organization_details
        .product_replacement_terms_and_conditions || undefined;

    this.terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .terms_and_conditions != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .terms_and_conditions
        : false;

    this.po_terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .po_terms_and_conditions != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .po_terms_and_conditions
        : false;

    this.po_narration =
      this.$store.getters.get_current_user_details.organization_details
        .po_narration != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .po_narration
        : false;
    this.enable_discount =
      this.$store.getters.get_current_user_details.organization_details
        .enable_discount != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_discount
        : false;
    this.maximum_discount =
      this.$store.getters.get_current_user_details.organization_details
        .maximum_discount != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .maximum_discount
        : 0;
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].approver != undefined
      ) {
        this.approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[0].approver;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[1].approver != undefined
      ) {
        this.product_fleet_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[1].approver;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].approver_ids != undefined &&
        typeof this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].approver_ids != "string" &&
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].approver_ids.length != 0
      ) {
        this.approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[0].approver_ids;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[1].approver_id != undefined
      ) {
        this.product_fleet_approver_id =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[1].approver_id;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].workflow_enabled != undefined
      ) {
        this.workflow_enabled =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[0].workflow_enabled;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[1].workflow_enabled != undefined
      ) {
        this.enable_product_fleet_workflow =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[1].workflow_enabled;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[0].module_name != undefined
      ) {
        this.module_name =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[0].module_name;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[2].workflow_enabled != undefined
      ) {
        this.enable_workflow_for_quotation =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[2].workflow_enabled;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[3].workflow_enabled != undefined
      ) {
        this.enable_workflow_for_quotation_mrf =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[3].workflow_enabled;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[4].workflow_enabled != undefined
      ) {
        this.enable_workflow_for_fgr =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[4].workflow_enabled;
      }
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[5].workflow_enabled != undefined
      ) {
        this.enable_workflow_for_foc =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[5].workflow_enabled;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[2].approver != undefined
      ) {
        this.quotation_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[2].approver;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[3].approver != undefined
      ) {
        this.quotation_mrf_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[3].approver;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[4].approver != undefined
      ) {
        this.fgr_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[4].approver;
        this.fgr_tech_manager_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[4].technical_manager_ids;
      }
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[5].approver != undefined
      ) {
        this.foc_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[5].approver;
        this.foc_tech_manager_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[5].technical_manager_ids;
      }
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[6].approver != undefined
      ) {
        this.enable_payout =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[6].workflow_enabled;
        this.payout_approver =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[6].approver;
        this.payout_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[6].approver_ids;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[2].approver_ids != undefined &&
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[2].approver_ids.length != 0
      ) {
        this.quotation_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[2].approver_ids;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[3].approver_ids != undefined &&
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[3].approver_ids.length != 0
      ) {
        this.quotation_mrf_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[3].approver_ids;
      }
    }
    if (
      this.$store.getters.get_current_user_details.organization_details
        .workflow_settings != undefined
    ) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[4].approver_ids != undefined &&
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[4].approver_ids.length != 0
      ) {
        this.fgr_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[4].approver_ids;
      }
      if (
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[5].approver_ids != undefined &&
        this.$store.getters.get_current_user_details.organization_details
          .workflow_settings[5].approver_ids.length != 0
      ) {
        this.foc_approver_ids =
          this.$store.getters.get_current_user_details.organization_details.workflow_settings[5].approver_ids;
      }
    }
    this.auto_approval_for_own_stock_component_request =
      this.$store.getters.get_current_user_details.organization_details
        .auto_approval_for_own_stock_component_request != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .auto_approval_for_own_stock_component_request
        : false;
    this.days_or_hours =
      this.$store.getters.get_current_user_details.organization_details
        .ticket_accept_time != undefined
        ? this.$store.getters.get_current_user_details.organization_details.ticket_accept_time.includes(
            "DAYS"
          )
          ? "DAYS"
          : "HOURS"
        : "";
    this.account_holder =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.account_holder != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.account_holder
          : undefined
        : undefined;
    this.bank_name =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.bank_name != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.bank_name
          : undefined
        : undefined;
    this.bank_address =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.bank_address != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.bank_address
          : undefined
        : undefined;
    this.account_id =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.account_id != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.account_id
          : undefined
        : undefined;
    this.ifsc =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.ifsc != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.ifsc
          : undefined
        : undefined;
    this.branch =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.branch != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.branch
          : undefined
        : undefined;
    this.tax_id =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.tax_id != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.tax_id
          : undefined
        : undefined;
    this.pan_no =
      this.$store.getters.get_current_user_details.organization_details
        .bank_details != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .bank_details.pan_no != undefined
          ? this.$store.getters.get_current_user_details.organization_details
              .bank_details.pan_no
          : undefined
        : undefined;
    this.upiId =
      this.$store.getters.get_current_user_details.organization_details.bank_details.upi_id;
    this.billPeriodFrom =
      this.$store.getters.get_current_user_details.organization_details.bank_details.bill_period_from_date;
    this.billPeriodTo =
      this.$store.getters.get_current_user_details.organization_details.bank_details.bill_period_to_date;
    this.gstCallCharges =
      this.$store.getters.get_current_user_details.organization_details.gst_call_charges;
    this.gstSparePart =
      this.$store.getters.get_current_user_details.organization_details.gst_spare_part;
    const matchedElements = [];
    this.duplicate_typeItems =
      this.$store.getters.get_current_user_details.organization_details.rights_of_rfs
        .map((item) => {
          const matchedElement = this.user_typeItems.find(
            (element) => element.value == item
          );
          if (matchedElement) {
            matchedElements.push(matchedElement.value);
          }
          return matchedElement;
        })
        .filter((el) => el !== undefined);
    this.user_typeItems = this.user_typeItems.filter(
      (element) => !matchedElements.includes(element.value)
    );

    // this.GetAllUsersList =
  },
  methods: {
    saveDate1() {
      this.$refs.menu1.save(this.billPeriodFrom);
      this.menu1 = false;
    },

    saveDate2() {
      this.$refs.menu2.save(this.billPeriodTo);
      this.menu2 = false;
    },
    reportsFieldsEmit(Status_Message, status) {
      this.renderComp = false;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: status == "SUCCESS" ? "green" : "red",
          Top: true,
          SnackbarText: Status_Message,
        };
        this.renderComp = true;
      });
    },

    AddServiceDetailsDialogMethod(item, index, action) {
      this.AddServiceDetailsDialog = true;
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.StoreObj.item_index = index;
      this.PrevData =
        this.$store.getters.get_current_user_details.organization_details
          .quotation_service_charges == undefined
          ? []
          : this.$store.getters.get_current_user_details.organization_details
              .quotation_service_charges;
    },
    callmethodUppercase(organization_prefix_value) {
      this.organization_prefix_value = organization_prefix_value.toUpperCase();
    },
    copyFormUrlCustomer() {
      const textToCopy =
        `https://webform.servicewrk.com/$${this.$store.getters.get_current_user_details.organization_details.organization_name}`.includes(
          " "
        )
          ? `https://webform.servicewrk.com/$${this.$store.getters.get_current_user_details.organization_details.organization_name}`.replaceAll(
              " ",
              "_"
            )
          : `https://webform.servicewrk.com/$${this.$store.getters.get_current_user_details.organization_details.organization_name}`;
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.renderComp = false;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Customer Web form url copied !!!",
        };
        this.renderComp = true;
      });
    },
    async saveOrgLogo() {
      if (this.url != undefined && this.url != "" && this.url != null) {
        this.uploadMediaToS3();
      } else {
        this.saveSettingsMethod("ORGANIZATION_LOGO");
      }
    },
    async saveQuotationDetails() {
      if (
        this.qr_url != undefined &&
        this.qr_url != null &&
        this.qr_url != ""
      ) {
        this.uploadQrCodeToS3();
      } else {
        this.saveSettingsMethod("QUOTATION_DETAILS");
      }
    },
    checkImagePresent() {
      if (this.url == null || this.url == "" || this.url == undefined) {
        this.handleUpload();
      }
    },
    uploadQrCode() {
      if (
        this.qr_url == null ||
        this.qr_url == "" ||
        this.qr_url == undefined
      ) {
        this.handleQrUpload();
      }
    },
    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },
    handleQrUpload() {
      this.$refs["qr-upload-input"].click();
    },
    upload_qr_code(e) {
      this.selectedQrFile = e.target.files[0];
      this.qr_url = URL.createObjectURL(this.selectedQrFile);
    },
    handleClick(e) {
      this.selectedFile = e.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);
    },
    getTicketAcceptTime() {
      let ticketAcceptTime =
        this.$store.getters.get_current_user_details.organization_details
          .ticket_accept_time;
      if (ticketAcceptTime != undefined) {
        let SplittedWord = ticketAcceptTime.split("_");
        return SplittedWord[1];
      }
    },
    async uploadQrCodeToS3() {
      this.loading_quotation_settings_btn = true;
      if (this.selectedQrFile != undefined && this.selectedQrFile != "") {
        let result = await this.GenerateS3URLMethods(
          `${
            this.$store.getters.get_current_user_details.organization_id
          }/QR_CODE/${new Date().getTime()}_${this.selectedQrFile.name}`,
          this.selectedQrFile
        );
        this.qr_code = result.profile_pic_url;
      } else {
        this.qr_code = this.qr_url;
      }
      this.saveSettingsMethod("QUOTATION_DETAILS");
    },
    async uploadMediaToS3() {
      this.loadingOrganizationLogo = true;
      if (this.selectedFile != undefined) {
        let result = await this.GenerateS3URLMethods(
          `${
            this.$store.getters.get_current_user_details.organization_id
          }/PROFILE_PIC/${new Date().getTime()}_${this.selectedFile.name}`,
          this.selectedFile
        );
        this.org_logo = result.profile_pic_url;
      } else {
        this.org_logo = this.url;
      }
      this.saveSettingsMethod("ORGANIZATION_LOGO");
    },
    validateMethod(action) {
      switch (action) {
        case "TICKET_SETTINGS":
          if (
            this.ticket_settings.active_ticket_count != undefined &&
            this.ticket_settings.active_ticket_count != null &&
            this.ticket_settings.active_ticket_count != ""
          ) {
            if (this.ticket_settings.reopen_ticket == true) {
              if (
                this.ticket_settings.reopen_ticket_duration != undefined &&
                this.ticket_settings.reopen_ticket_duration != null &&
                this.ticket_settings.reopen_ticket_duration != ""
              ) {
                this.saveSettingsMethod(action, this.ticket_settings);
              } else {
                this.renderComp = false;
                this.$nextTick(() => {
                  this.SnackBarComponent = {
                    SnackbarVmodel: true,
                    SnackbarColor: "red",
                    Top: true,
                    SnackbarText: "Please Select Reopen Ticket Duration",
                  };
                  this.renderComp = true;
                });
              }
            }
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Please Add Ticket Count",
              };
              this.renderComp = true;
            });
          }
          break;
        case "WORK_FLOW":
          if (this.$refs.form_workflow_settings.validate()) {
            this.saveSettingsMethod(action, this.work_flow);
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Please Select Mandatory Fields..!",
              };
              this.renderComp = true;
            });
          }
          break;
        case "UPDATE_CUSTOME_BASED_TICKET_ID":
          if (
            this.ticket_create_sequence != [] &&
            this.ticket_create_sequence != undefined
          ) {
            if (
              this.enable_organization_prefix == false ||
              this.enable_organization_prefix == undefined
            ) {
              if (this.ticket_create_sequence.includes("ORG")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "ORG";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_call_type == false ||
              this.enable_call_type == undefined
            ) {
              if (this.ticket_create_sequence.includes("CALL_TYPE")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "CALL_TYPE";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_category_prefix == false ||
              this.enable_category_prefix == undefined
            ) {
              if (this.ticket_create_sequence.includes("CATEGORY")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "CATEGORY";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_product_fleet_prefix == false ||
              this.enable_product_fleet_prefix == undefined
            ) {
              if (this.ticket_create_sequence.includes("PRODUCT_FLEET")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "PRODUCT_FLEET";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_product_prefix == false ||
              this.enable_product_prefix == undefined
            ) {
              if (this.ticket_create_sequence.includes("PRODUCT")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "PRODUCT";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_date_of_ticket_register == false ||
              this.enable_date_of_ticket_register == undefined
            ) {
              if (this.ticket_create_sequence.includes("DATE")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "DATE";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
            if (
              this.enable_ticket_sequence == false ||
              this.enable_ticket_sequence == undefined
            ) {
              if (this.ticket_create_sequence.includes("SEQUENCE")) {
                const sequenceListArray = this.ticket_create_sequence;
                const stringToRemove = "SEQUENCE";
                const newArray = sequenceListArray.filter(
                  (item) => item != stringToRemove
                );
                this.ticket_create_sequence = newArray;
              }
            }
          }
          this.saveSettingsMethod(action, this.update_custome_based_ticket_id);
          break;
        case "UPDATE_SUPPORT_AND_SUPPORT_TYPE":
          this.saveSettingsMethod(action, this.update_support_and_support_type);
          break;
        case "FEEDBACK_URL":
          this.saveSettingsMethod(action, this.feedback_url);
          break;
        case "DISTANCE_VARIATION":
          this.saveSettingsMethod(action, this.distance_variation);
          break;
        case "ORGANIZATION_LOGO":
          this.saveSettingsMethod(action, this.masterCategoryItems);
          break;
        case "MASTER_CATEGORY_SETTINGS":
          this.saveSettingsMethod(action, this.masterCategoryItems);
          break;
        case "CATEGORY_SETTINGS":
          this.saveSettingsMethod(action, this.categoryItems);
          break;
        case "ATTENDANCE_SETTINGS":
          this.saveSettingsMethod(action, this.time_setting);
          break;
        case "CLOSE_LOCATION_ENABLE":
          this.saveSettingsMethod(action, this.is_close_ticket_location_enable);
          break;
        case "TICKET_WORKFLOW":
          if (this.enable_ticket_close_workflow == true) {
            if (
              this.service_partner_ticket_close_enable == true ||
              this.organization_ticket_close_enable == true ||
              this.dealer_ticket_close_enable == true
            ) {
              this.saveSettingsMethod(action, this.enable_ticket_accept);
            } else {
              this.renderComp = false;
              this.$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "red",
                  Top: true,
                  SnackbarText: "Please Select Atleast one level",
                };
                this.renderComp = true;
              });
            }
          } else {
            this.saveSettingsMethod(action, this.enable_ticket_accept);
          }
          break;
        case "ESCALATION":
          this.saveSettingsMethod(action, this.escalation_day);
          break;
        case "TICKET_DISCARD":
          this.saveSettingsMethod(action, this.ticket_discard);
          break;
        case "BANK_DETAILS":
          if (this.$refs.bank_details_form.validate()) {
            this.saveSettingsMethod(action);
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill Mandatory Details *",
              };
              this.renderComp = true;
            });
          }
          break;
        case "QUOTATION_DETAILS":
          if (this.$refs.quotation_settings_form.validate()) {
            this.saveSettingsMethod(action);
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill Mandatory Details *",
              };
              this.renderComp = true;
            });
          }
          break;
        case "PAYOUT":
          if (
            this.gstCallCharges &&
            this.gstSparePart &&
            this.formattedToBillDate &&
            this.formattedFromBillDate
          ) {
            this.saveSettingsMethod(action);
          } else {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill Mandatory Details*",
              };
              this.renderComp = true;
            });
          }
          break;
      }
    },
    validateCMethod() {
      if (this.$refs.formC.validate()) {
        if (
          this.categoryItems.filter(
            (item) => item.category_id == this.categorySettings.category_id
          ).length == 0
        ) {
          let categoryObject = {
            master_category_id: this.categorySettings.master_category_id,
            master_category_name: this.masterCategoryItems.filter(
              (item) =>
                item.master_category_id ==
                this.categorySettings.master_category_id
            )[0].master_category_name,
            category_id: this.categorySettings.category_id,
            category_name: this.GetCategoriesByMasterCategoryList.filter(
              (item) => item.category_id == this.categorySettings.category_id
            )[0].category_name,
          };
          this.categoryItems.push(categoryObject);
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Category Name Already Exists",
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Select Master Category",
          };
          this.renderComp = true;
        });
      }
    },
    async saveSettingsMethod(action, settings) {
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          setting_action: action,
        };
        switch (action) {
          case "UPDATE_CUSTOME_BASED_TICKET_ID":
            if (
              this.ticket_create_sequence != [] &&
              this.ticket_create_sequence.length != 0
            ) {
              this.btn_custom_ticket_id = true;
              inputParams.enable_to_generate_custome_based_ticket_id =
                this.enable_to_generate_custome_based_ticket_id;
              inputParams.enable_organization_prefix =
                this.enable_organization_prefix != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_organization_prefix
                  : undefined;
              inputParams.organization_prefix_value =
                this.organization_prefix_value != "" &&
                this.organization_prefix_value != null &&
                this.organization_prefix_value != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.organization_prefix_value
                  : undefined;
              inputParams.enable_call_type =
                this.enable_call_type != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_call_type
                  : undefined;
              inputParams.enable_category_prefix =
                this.enable_category_prefix != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_category_prefix
                  : undefined;
              inputParams.enable_product_prefix =
                this.enable_product_prefix != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_product_prefix
                  : undefined;
              inputParams.enable_product_fleet_prefix =
                this.enable_product_fleet_prefix != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_product_fleet_prefix
                  : undefined;
              inputParams.call_type_prefix =
                this.call_type_prefix != "" &&
                this.call_type_prefix != undefined &&
                this.call_type_prefix != null &&
                this.enable_to_generate_custome_based_ticket_id != false &&
                this.enable_call_type != false
                  ? this.call_type_prefix
                  : undefined;
              inputParams.category_prefix =
                this.category_prefix != "" &&
                this.category_prefix != undefined &&
                this.category_prefix != null &&
                this.enable_to_generate_custome_based_ticket_id != false &&
                this.enable_category_prefix != false
                  ? this.category_prefix
                  : undefined;
              inputParams.product_prefix =
                this.product_prefix != "" &&
                this.product_prefix != undefined &&
                this.product_prefix != null &&
                this.enable_to_generate_custome_based_ticket_id != false &&
                this.enable_product_prefix != false
                  ? this.product_prefix
                  : undefined;
              inputParams.product_fleet_prefix =
                this.product_fleet_prefix != "" &&
                this.product_fleet_prefix != undefined &&
                this.product_fleet_prefix != null &&
                this.enable_to_generate_custome_based_ticket_id != false &&
                this.enable_product_fleet_prefix != false
                  ? this.product_fleet_prefix
                  : undefined;
              inputParams.enable_date_of_ticket_register =
                this.enable_date_of_ticket_register != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_date_of_ticket_register
                  : undefined;
              inputParams.enable_ticket_sequence_reset =
                this.enable_ticket_sequence_reset != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_ticket_sequence_reset
                  : undefined;
              inputParams.enable_ticket_sequence =
                this.enable_ticket_sequence != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_ticket_sequence
                  : undefined;
              inputParams.ticket_sequence_reset =
                this.ticket_sequence_reset != "" &&
                this.ticket_sequence_reset != null &&
                this.ticket_sequence_reset != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.ticket_sequence_reset
                  : undefined;
              inputParams.enable_ticket_separator =
                this.enable_ticket_separator != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.enable_ticket_separator
                  : undefined;
              inputParams.ticket_separator =
                this.ticket_separator != "" &&
                this.ticket_separator != null &&
                this.ticket_separator != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.ticket_separator
                  : undefined;
              inputParams.ticket_create_sequence =
                this.ticket_create_sequence != [] &&
                this.ticket_create_sequence != null &&
                this.ticket_create_sequence != undefined &&
                this.enable_to_generate_custome_based_ticket_id != false
                  ? this.ticket_create_sequence
                  : undefined;
            }
            break;
          case "WORK_FLOW":
            this.btn_loading_workflow_settings = true;
            inputParams.enable_workflow_for_quotation =
              this.enable_workflow_for_quotation != undefined
                ? this.enable_workflow_for_quotation
                : false;
            inputParams.workflow_settings = [
              {
                workflow_enabled: this.workflow_enabled,
                module_name: "COMPONENTS",
                approver:
                  this.workflow_enabled != false ? this.approver : undefined,
                approver_ids:
                  this.workflow_enabled != false &&
                  (this.approver == "SPECIFIC_USERS" ||
                    this.approver == "REPORTING_MANAGER_AND_SPECIFIC_USER")
                    ? this.approver_ids
                    : undefined,
              },
              {
                module_name: "PRODUCT_FLEET",
                workflow_enabled: this.enable_product_fleet_workflow,
                approver:
                  this.enable_product_fleet_workflow != false
                    ? this.product_fleet_approver
                    : undefined,
                approver_id:
                  this.enable_product_fleet_workflow != false &&
                  (this.product_fleet_approver == "SPECIFIC_USERS" ||
                    this.product_fleet_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER")
                    ? this.product_fleet_approver_id
                    : undefined,
              },
              {
                module_name: "QUOTATION",
                workflow_enabled: this.enable_workflow_for_quotation,
                approver:
                  this.enable_workflow_for_quotation != false
                    ? this.quotation_approver
                    : undefined,
                approver_ids:
                  this.enable_workflow_for_quotation != false &&
                  (this.quotation_approver == "SPECIFIC_USERS" ||
                    this.quotation_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER")
                    ? this.quotation_approver_ids
                    : undefined,
              },
              {
                module_name: "QUOTATION_MRF",
                workflow_enabled: this.enable_workflow_for_quotation_mrf,
                approver:
                  this.enable_workflow_for_quotation_mrf != false
                    ? this.quotation_mrf_approver
                    : undefined,
                approver_ids:
                  this.enable_workflow_for_quotation_mrf != false &&
                  (this.quotation_mrf_approver == "SPECIFIC_USERS" ||
                    this.quotation_mrf_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER")
                    ? this.quotation_mrf_approver_ids
                    : undefined,
              },
              {
                module_name: "FGR",
                workflow_enabled: this.enable_workflow_for_fgr,
                approver:
                  this.enable_workflow_for_fgr != false
                    ? this.fgr_approver
                    : undefined,
                approver_ids:
                  this.enable_workflow_for_fgr != false &&
                  (this.fgr_approver == "SPECIFIC_USERS" ||
                    this.fgr_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER" ||
                    this.fgr_approver ===
                      "TECHNICAL_MANAGERS_AND_SPECIFIC_USER")
                    ? this.fgr_approver_ids
                    : undefined,
                technical_manager_ids:
                  this.fgr_approver == "TECHNICAL_MANAGERS" ||
                  this.fgr_approver === "TECHNICAL_MANAGERS_AND_SPECIFIC_USER"
                    ? this.fgr_tech_manager_approver_ids
                    : undefined,
              },
              {
                module_name: "FOC",
                workflow_enabled: this.enable_workflow_for_foc,
                approver:
                  this.enable_workflow_for_foc != false
                    ? this.foc_approver
                    : undefined,
                approver_ids:
                  this.enable_workflow_for_foc != false &&
                  (this.foc_approver == "SPECIFIC_USERS" ||
                    this.foc_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER" ||
                    this.foc_approver ===
                      "TECHNICAL_MANAGERS_AND_SPECIFIC_USER")
                    ? this.foc_approver_ids
                    : undefined,
                technical_manager_ids:
                  this.foc_approver == "TECHNICAL_MANAGERS" ||
                  this.foc_approver === "TECHNICAL_MANAGERS_AND_SPECIFIC_USER"
                    ? this.foc_tech_manager_approver_ids
                    : undefined,
              },
              {
                module_name: "PAYOUT",
                workflow_enabled: this.enable_payout,
                approver:
                  this.enable_payout != false
                    ? this.payout_approver
                    : undefined,
                approver_ids:
                  this.enable_payout != false &&
                  (this.payout_approver == "SPECIFIC_USERS" ||
                    this.payout_approver ==
                      "REPORTING_MANAGER_AND_SPECIFIC_USER")
                    ? this.payout_approver_ids
                    : undefined,
              },
            ];
            break;
          case "UPDATE_SUPPORT_AND_SUPPORT_TYPE":
            this.btn_update_support_and_support_type = true;
            inputParams.is_enabled_to_update_shceduled_service =
              this.is_enabled_to_update_shceduled_service;
            inputParams.support_type =
              this.is_enabled_to_update_shceduled_service == true
                ? this.support_type
                : undefined;
            inputParams.warranty_type =
              this.is_enabled_to_update_shceduled_service == true
                ? this.warranty_type
                : undefined;
            break;
          case "ORGANIZATION_LOGO":
            this.loadingOrganizationLogo = true;
            inputParams.enable_component_inventory = this.enablecomponent;
            inputParams.organization_logo_url =
              this.org_logo != undefined ? this.org_logo : undefined;
            inputParams.organization_address = this.org_address;
            inputParams.organization_contact_numbers =
              this.modifiedOrgContNumber;
            inputParams.organization_email_id = this.orgEmailId;
            break;
          case "FEEDBACK_URL":
            this.isLoading = true;
            inputParams.feedback_url_enable = this.feedback_url_enable;
            this.feedback_url != ""
              ? (inputParams.feedback_url = this.feedback_url)
              : undefined;
            break;
          case "DISTANCE_VARIATION":
            this.isLoading_distance_variation = true;
            inputParams.distance_variation = this.distance_variation;
            break;
          case "ATTENDANCE_SETTINGS":
            this.loadingATTENDANCE_SETTINGS = true;
            inputParams.automatic_log_out_time = settings.auto_logout_time;
            inputParams.weekly_offs = settings.itemsssss;
            inputParams.holiday_dates = settings.holidaydate;
            break;
          case "TICKET_SETTINGS":
            this.loadingTICKET_SETTINGS = true;
            inputParams.active_ticket_count = settings.active_ticket_count;
            inputParams.enable_ticket_creation =
              settings.enable_ticket_creation;
            inputParams.rights_of_rfs = this.duplicate_typeItems.map(
              (item) => item.value
            );
            inputParams.enable_ticket_close = settings.enable_ticket_close;
            inputParams.default_customer_type = settings.default_customer_type;
            inputParams.reopen_ticket = settings.reopen_ticket;
            inputParams.enable_ticket_components_request =
              settings.enable_ticket_components_request;
            inputParams.is_access_control_enable =
              settings.is_access_control_enable;
            inputParams.allow_otp_proxy = settings.allow_otp_proxy;
            inputParams.auto_approval_for_own_stock_component_request =
              this.auto_approval_for_own_stock_component_request;
            inputParams.ticket_close_after_work_start =
              this.ticket_close_after_work_start;
            inputParams.end_service_at_workplace =
              this.end_service_at_workplace;
            inputParams.verify_serial_number = this.verify_serial_number;
            inputParams.is_customer_category_mandatory =
              this.is_customer_category_mandatory;
            inputParams.enable_payment_details_for_tickets =
              this.enable_payment_option;
            inputParams.enable_foc_for_ticket = this.enable_disable_foc;
            inputParams.enable_cabinet_for_tech = this.enable_disable_cabinet;
            inputParams.disable_productfleet_for_dealer =
              this.enableDisableDealerProdFleet;
            inputParams.enable_edit_warranty_details =
              this.enable_edit_warranty_details;
            inputParams.enable_edit_serial_number =
              this.enable_edit_serial_number;
            inputParams.start_service_at_workplace =
              this.start_service_at_workplace;
            inputParams.location_validation =
              this.start_service_at_workplace != undefined &&
              this.start_service_at_workplace != false
                ? this.location_validation
                : undefined;
            inputParams.end_location_validation =
              this.end_service_at_workplace != undefined &&
              this.end_service_at_workplace != false
                ? this.end_location_validation
                : undefined;
            inputParams.product_repair_or_replacement =
              settings.product_repair_or_replacement;
            inputParams.is_attachment_mandatory =
              settings.is_attachment_mandatory;
            inputParams.number_of_attachments_required =
              settings.is_attachment_mandatory != true
                ? undefined
                : settings.number_of_attachments_required;
            inputParams.sort_ticket_by = settings.sort_ticket_by;
            inputParams.enable_dealer_ticket_creation =
              settings.enable_to_rise_ticket;
            inputParams.enable_manual_territory_tagging =
              settings.enable_manual_territory_tagging;
            inputParams.scheduled_service_dates =
              settings.scheduled_service_dates;
            inputParams.ticket_history_visibility = {
              manager: this.manager,
              agent: this.agent,
              nsm: this.nsm,
              rsm: this.rsm,
              representative: this.representative,
              service_partner: this.service_partner,
              partner_agent: this.partner_agent,
              partner_representative: this.partner_representative,
              dealer_agent: this.dealer_agent,
              dealer_owner: this.dealer_owner,
              dealer_representative: this.dealer_representative,
            };
            if (settings.reopen_ticket == true) {
              inputParams.reopen_ticket_duration =
                settings.reopen_ticket_duration;
            }
            break;
          case "MASTER_CATEGORY_SETTINGS":
            this.loadingMASTER_CATEGORY_SETTINGS = true;
            inputParams.master_category_ids = settings.map(
              (item) => item.master_category_id
            );
            break;
          case "CATEGORY_SETTINGS":
            this.loadingCATEGORY_SETTINGS = true;
            inputParams.category_ids = settings.map((item) => item.category_id);
            break;
          case "CLOSE_LOCATION_ENABLE":
            this.loading_enable_location_btn_while_close_ticket = true;
            inputParams.is_close_ticket_location_enable =
              this.is_close_ticket_location_enable;
            inputParams.is_clouser_type_enable = this.is_clouser_type_enable;
            inputParams.is_training_provided_to = this.is_training_provided_to;
            inputParams.is_otp_send_to = this.is_otp_send_to;
            break;
          case "TICKET_WORKFLOW":
            this.loading_enable_ticket_accept_btn = true;
            inputParams.enable_ticket_accept = this.enable_ticket_accept;
            inputParams.ticket_accept_time =
              this.enable_ticket_accept == true
                ? this.days_or_hours + "_" + this.ticket_accept_time
                : undefined;
            inputParams.enable_ticket_close_workflow =
              this.enable_ticket_close_workflow;
            inputParams.dealer_ticket_close_enable =
              this.enable_ticket_close_workflow == false
                ? undefined
                : this.enable_ticket_close_workflow;
            inputParams.dealer_representative_ticket_close_enable =
              this.dealer_ticket_close_enable != false
                ? this.dealer_representative_ticket_close_enable
                : undefined;
            inputParams.dealer_agent_ticket_close_enable =
              this.dealer_ticket_close_enable != false
                ? this.dealer_agent_ticket_close_enable
                : undefined;
            inputParams.service_partner_ticket_close_enable =
              this.enable_ticket_close_workflow == false
                ? false
                : this.service_partner_ticket_close_enable;
            inputParams.service_partner_representative_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.service_partner_ticket_close_enable == false
                ? undefined
                : this.service_partner_representative_ticket_close_enable;
            inputParams.service_partner_agent_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.service_partner_ticket_close_enable == false
                ? undefined
                : this.service_partner_agent_ticket_close_enable;
            inputParams.service_partner_higher_level_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.service_partner_ticket_close_enable == false
                ? undefined
                : this.service_partner_higher_level_ticket_close_enable;
            inputParams.dealer_ticket_close_enable =
              this.enable_ticket_close_workflow == false
                ? false
                : this.dealer_ticket_close_enable;
            inputParams.organization_ticket_close_enable =
              this.enable_ticket_close_workflow == false
                ? false
                : this.organization_ticket_close_enable;
            inputParams.organization_representative_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.organization_ticket_close_enable == false
                ? undefined
                : this.organization_representative_ticket_close_enable;
            inputParams.organization_RSM_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.organization_ticket_close_enable == false
                ? undefined
                : this.organization_RSM_ticket_close_enable;
            inputParams.organization_NSM_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.organization_ticket_close_enable == false
                ? undefined
                : this.organization_NSM_ticket_close_enable;
            inputParams.organization_coordinater_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.organization_ticket_close_enable == false
                ? undefined
                : this.organization_coordinater_ticket_close_enable;
            inputParams.organization_higher_level_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.organization_ticket_close_enable == false
                ? undefined
                : this.organization_higher_level_ticket_close_enable;
            inputParams.dealer_higher_level_ticket_close_enable =
              this.enable_ticket_close_workflow == false ||
              this.enable_dealer_ticket_creation == false
                ? undefined
                : this.dealer_higher_level_ticket_close_enable;
            break;
          case "ESCALATION":
            this.loading_escalation_enable = true;
            inputParams.escalation_notification_enable =
              this.escalation_notification_enable;
            inputParams.escalation_day =
              this.escalation_notification_enable == true
                ? this.escalation_day
                : undefined;
            inputParams.is_enabled_to_share_escalation_notification_to_user =
              this.enable_user_select;
            inputParams.escalation_notified_selected_users =
              this.enable_user_select === true
                ? this.escalation_user
                : undefined;
            break;
          case "TICKET_DISCARD":
            this.loading_discard_ticket_btn = true;
            inputParams.ticket_discard = this.ticket_discard;
            break;
          case "QUOTATION_DETAILS":
            this.loading_quotation_settings_btn = true;
            inputParams.enable_terms_and_conditions =
              this.enable_terms_and_conditions != undefined
                ? this.enable_terms_and_conditions
                : false;
            inputParams.terms_and_conditions =
              this.terms_and_conditions != undefined &&
              this.terms_and_conditions != null &&
              this.terms_and_conditions != "" &&
              this.enable_terms_and_conditions == true
                ? this.terms_and_conditions
                : undefined;
            inputParams.enable_discount =
              this.enable_discount != undefined ? this.enable_discount : false;
            inputParams.maximum_discount =
              this.enable_discount == true &&
              this.maximum_discount != undefined &&
              this.maximum_discount != ""
                ? parseInt(this.maximum_discount)
                : undefined;
            inputParams.enable_payment_qr_code =
              this.enable_payment_qr_code != undefined
                ? this.enable_payment_qr_code
                : false;
            inputParams.payment_qr_code_s3_url =
              this.qr_code != undefined &&
              this.qr_code != null &&
              this.qr_code != ""
                ? this.qr_code
                : undefined;
            break;
          case "PO_DETAILS":
            inputParams.enable_terms_and_conditions_for_po =
              this.enable_po_terms_and_conditions;
            inputParams.po_terms_and_conditions =
              this.po_terms_and_conditions != undefined &&
              this.po_terms_and_conditions != null &&
              this.po_terms_and_conditions != "" &&
              this.enable_po_terms_and_conditions == true
                ? this.po_terms_and_conditions
                : undefined;
            inputParams.po_narration = this.po_narration || undefined;
            break;
          case "PRODUCT_REPLACEMENT_DETAILS":
            inputParams.enable_terms_and_conditions_for_fgr = this.enableFgrTC;

            inputParams.customer_terms_and_conditions = this.enableFgrTC
              ? this.customerTermsCond
              : undefined;
            inputParams.dealer_terms_and_conditions = this.enableFgrTC
              ? this.dealerTermsCond
              : undefined;
            inputParams.product_replacement_terms_and_conditions = this
              .enableFgrTC
              ? this.fgrTermsCond
              : undefined;
            break;
          case "PAYOUT":
            inputParams.bill_period_from_date = this.formattedFromBillDate;
            inputParams.bill_period_to_date = this.formattedToBillDate;
            inputParams.gst_call_charges = parseFloat(
              parseFloat(this.gstCallCharges).toFixed(2)
            );
            inputParams.gst_spare_part = parseFloat(
              parseFloat(this.gstSparePart).toFixed(2)
            );
            break;

          case "BANK_DETAILS":
            this.loading_bank_details_btn = true;
            inputParams.bank_details = {
              account_holder: this.account_holder,
              bank_name: this.bank_name,
              account_id: this.account_id,
              ifsc: this.ifsc,
              branch: this.branch,
              bank_address:
                this.bank_address != undefined &&
                this.bank_address != "" &&
                this.bank_address != null
                  ? this.bank_address
                  : undefined,
              tax_id:
                this.tax_id != undefined &&
                this.tax_id != "" &&
                this.tax_id != null
                  ? this.tax_id
                  : undefined,
              pan_no:
                this.pan_no != undefined &&
                this.pan_no != "" &&
                this.pan_no != null
                  ? this.pan_no
                  : undefined,
              upi_id: this.upiId,
            };
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Update_Enterprise_Details, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_Enterprise_Details);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.GetAllOrganizationSettingsTypesMethod();
          this.GetCurrentUser();
        }
        this.isLoading = false;
        this.loading_bank_details_btn = false;
        this.btn_custom_ticket_id = false;
        this.loadingTICKET_SETTINGS = false;
        this.loadingOrganizationLogo = false;
        this.loadingCATEGORY_SETTINGS = false;
        this.loading_escalation_enable = false;
        this.loading_discard_ticket_btn = false;
        this.loadingATTENDANCE_SETTINGS = false;
        this.isLoading_distance_variation = false;
        this.loadingDEFAULT_CUSTOMER_TYPE = false;
        this.btn_loading_workflow_settings = false;
        this.loadingMASTER_CATEGORY_SETTINGS = false;
        this.loading_enable_ticket_accept_btn = false;
        this.btn_update_support_and_support_type = false;
        this.loading_quotation_settings_btn = false;
        this.loading_enable_location_btn_while_close_ticket = false;
      } catch (error) {
        this.loading_quotation_settings_btn = false;
        this.loading_bank_details_btn = false;
        this.btn_custom_ticket_id = false;
        this.loadingTICKET_SETTINGS = false;
        this.loadingOrganizationLogo = false;
        this.loadingCATEGORY_SETTINGS = false;
        this.loading_escalation_enable = false;
        this.loading_discard_ticket_btn = false;
        this.loadingATTENDANCE_SETTINGS = false;
        this.isLoading_distance_variation = false;
        this.loadingDEFAULT_CUSTOMER_TYPE = false;
        this.btn_loading_workflow_settings = false;
        this.loadingMASTER_CATEGORY_SETTINGS = false;
        this.loading_enable_ticket_accept_btn = false;
        this.btn_update_support_and_support_type = false;
        this.loading_enable_location_btn_while_close_ticket = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    validateMCMethod() {
      if (this.$refs.formMC.validate()) {
        if (
          this.masterCategoryItems.filter(
            (item) =>
              item.category_id == this.masterCategorySettings.category_id
          ).length == 0
        ) {
          let masterCategoryObject = {
            master_category_id: this.masterCategorySettings.category_id,
            master_category_name: this.GetAllMasterCategoriesList.filter(
              (item) =>
                item.category_id == this.masterCategorySettings.category_id
            )[0].category_name,
          };
          this.masterCategoryItems.push(masterCategoryObject);
          this.$refs.formMC.reset();
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Category Name Already Exists",
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Select Master Category",
          };
          this.renderComp = true;
        });
      }
    },

    addUserTypeDialogMethod(item, index) {
      this.user_typeItems.splice(index, 1);
      this.duplicate_typeItems.push(item);
    },
    delete_Duplicate_Method(item, index) {
      this.duplicate_typeItems.splice(index, 1);
      this.user_typeItems.push(item);
    },

    async AddServiceDetailsDialogEmit(Toggle, array) {
      this.AddServiceDetailsDialog = false;
      if (Toggle === 2) {
        try {
          const result = await API.graphql(
            graphqlOperation(Update_Enterprise_Details, {
              input: {
                updater_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                terms_and_conditions: this.terms_and_conditions,
                setting_action: "QUOTATION_DETAILS",

                maximum_discount: this.maximum_discount,
                quotation_service_charges: array,
                enable_discount: this.enable_discount,
                enable_terms_and_conditions: this.enable_terms_and_conditions,
              },
            })
          );
          await this.GetCurrentUser();
        } catch (error) {
          console.log("Error", error);
        }
      }
    },
    async CreatePincodeTypeMethod() {
      if (this.$refs.territoryForm.validate()) {
        try {
          this.TerritoryLoading = true;
          let inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            pincode_territory_type: this.Territory_Name,
            estimated_time: (this.selection = "Days"
              ? this.formattedDay
              : this.Time_Values),
          };
          let result = await API.graphql(
            graphqlOperation(CreatePincodeType, {
              input: inputParams,
            })
          );
          let ResultObj = JSON.parse(result.data.CreatePincodeType);
          if (ResultObj.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "primary",
                Top: true,
                SnackbarText: ResultObj.Status_Message,
              };
              this.renderComp = true;
            });
            this.Territory_Name = "";
            this.ListPincodeTypes();
          }
          console.log("ressult", result);
          this.TerritoryLoading = false;
        } catch (error) {
          this.TerritoryLoading = false;
          console.log("error", error);
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please fill required fields",
          };
          this.renderComp = true;
        });
      }
    },

    ListPincodesHistoryDialogMethod(item) {
      this.ActionObj = item;
      this.ListPincodesHistoryDialog = true;
    },

    ListPincodesHistoryDialogEmit() {
      this.ListPincodesHistoryDialog = false;
    },

    EditTerritoriesEmit(Toggle) {
      this.ActionObj = {};
      this.EditTerritoryDialog = false;
      if (Toggle == 2) {
        this.ListPincodeTypes();
      }
    },
    edit_Territory_Method(item, action) {
      this.ActionObj = item;
      this.ActionObj.action = action;
      this.EditTerritoryDialog = true;
    },
    updateFormattedDay() {
      if (this.date) {
        const day =
          Math.floor(
            (new Date(this.date) - new Date(this.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        this.formattedDay = `${day} Days`;
      }
    },

    deleteTerritoryClassMethod(item, index) {
      this.territoryObj = item;
      console.log("CHECK_TERR_ITEM", item);
      this.deleteTerrClassDialog = true;
    },

    DeleteTerrClassDialogEmit(Toggle) {
      this.deleteTerrClassDialog = false;
      if (Toggle === 2) {
        this.ListPincodeTypes();
      }
    },
  },
};
</script>

<style>
.Date_Custom .theme--light.v-date-picker-table th {
  display: none !important;
}
.Date_Custom .v-date-picker-header__weekday {
  display: none !important;
}
.Date_Custom .v-date-picker-header {
  display: none !important;
}
.v-date-picker.Date_Custom .v-date-picker-table {
  margin-top: 0 !important;
}

.v-date-picker.Date_Custom .v-date-picker-header__icon {
  display: none !important;
}
</style>
