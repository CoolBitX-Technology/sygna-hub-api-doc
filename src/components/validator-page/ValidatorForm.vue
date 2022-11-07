<template>
  <div class="q-pa-lg">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      id="bundle-product-config-form"
    >
      <q-list class="rounded-borders">
        <q-expansion-item expand-separator dense label="Setting" default-opened>
          <q-expansion-item
            :header-inset-level="1"
            expand-separator
            dense
            label="VASP Infomation"
            default-opened
          >
            <div class="q-pa-lg">
              <q-input
                clearable
                v-model="vaspCode"
                label="Your Vasp Code *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-input
                clearable
                type="string"
                v-model="licenseKey"
                label="Your License Key *"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please type your lincense',
                ]"
                hint="license key retrieved when complete hub registration"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            :header-inset-level="1"
            expand-separator
            dense
            label="Admin User"
            default-opened
          >
            <div class="q-pa-lg">
              <q-input
                clearable
                type="string"
                v-model="adminAccount"
                label="Your Admin User Account *"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') ||
                    'Please type your admin user account',
                ]"
                hint="license key retrieved when complete hub registration"
              />
              <q-input
                clearable
                type="string"
                v-model="adminPassword"
                label="Your Admin User Password *"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') ||
                    'Please type your admin user password',
                ]"
                hint="license key retrieved when complete hub registration"
              />
            </div>
          </q-expansion-item>
          <q-expansion-item
            :header-inset-level="1"
            expand-separator
            dense
            label="Other"
            default-opened
          >
            <div class="q-pa-lg">
              <q-input
                clearable
                type="string"
                v-model="jwtSecret"
                label="Your JWT Secret *"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') ||
                    'Please type your jwt secret',
                ]"
                hint="license key retrieved when complete hub registration"
              />
              <q-input
                clearable
                type="string"
                v-model="webhookURL"
                label="Your Webhook URL"
                lazy-rules
                hint="If this url has been provided, the events notification will be sent to the webhook_url"
              />
            </div>
          </q-expansion-item>
        </q-expansion-item>
      </q-list>

      <q-separator color="secondary" />
      <div class="q-gutter-xs">
        <q-btn
          label="Export"
          type="submit"
          color="primary"
          form="bundle-product-config-form"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="secondary"
          class="q-ml-sm"
          form="bundle-product-config-form"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
// import { useQuasar } from 'quasar';
import { useValidatorStore } from 'src/stores/validator';
import { storeToRefs } from 'pinia';
export default {
  setup() {
    const generator = useValidatorStore();
    const {
      vaspCode,
      licenseKey,
      webhookURL,
      jwtSecret,
      accessTokenExpireSec,
      dataEncryptionKey,
      adminAccount,
      adminPassword,
      concurrency,
    } = storeToRefs(useValidatorStore());

    return {
      vaspCode,
      licenseKey,
      webhookURL,
      jwtSecret,
      accessTokenExpireSec,
      dataEncryptionKey,
      adminAccount,
      adminPassword,
      concurrency,

      onSubmit() {
        // generator.nextStep();
      },

      onReset() {
        generator.vaspCode = null;
        generator.licenseKey = null;
      },
    };
  },
};
</script>
