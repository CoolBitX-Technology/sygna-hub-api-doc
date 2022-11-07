<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      id="bundle-product-config-form"
    >
      <q-input
        clearable
        v-model="vaspCode"
        label="Your Vasp Code *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        clearable
        type="string"
        v-model="licenseKey"
        label="Your License Key *"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type your lincense',
        ]"
        hint="license key retrieved when complete hub registration"
      />
      <q-separator />
      <q-input
        clearable
        type="string"
        v-model="webhookURL"
        label="Your Webhook URL"
        lazy-rules
        hint="If this url has been provided, the events notification will be sent to the webhook_url"
      />
      <div class="q-gutter-xs">
        <q-btn
          label="Submit"
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
        <q-btn
          flat
          @click="goBack()"
          color="primary"
          label="Back"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
// import { useQuasar } from 'quasar';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';
export default {
  setup() {
    // const $q = useQuasar();

    const generator = useGeneratorStore();
    const { vaspCode, licenseKey, webhookURL } = storeToRefs(
      useGeneratorStore()
    );

    return {
      vaspCode,
      licenseKey,
      webhookURL,
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
