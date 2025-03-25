<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Registration Information</div>
    </div>
  </q-banner>

  <q-input
    ref="vaspCodeRef"
    type="string"
    v-model="vaspCode"
    label="Vasp Code *"
    lazy-rules
    :rules="[
      (val) => (!!val) || 'Please input the VASP code',
      (val) => (/^[A-Z]{8}$/.test(val)) || 'VASP code must be 8 uppercase letters',
    ]"
    :data-section="'settings'"
    :data-field="'vasp_code'"
  />

  <q-input
    ref="licenseKeyRef"
    type="string"
    v-model="licenseKey"
    label="License Key (API Key) *"
    lazy-rules
    :rules="[
      (val) => (!!val) || 'Please input the license key',
      (val) => (/^[a-fA-F0-9]{64}$/.test(val)) || 'Invalid license key',
    ]"
    hint="You can retrieve the license key in the registration success email."
    :data-section="'settings'"
    :data-field="'license_key'"
  />
</template>

<script>
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { vaspCode, licenseKey } = storeToRefs(useGeneratorStore());      
    return { vaspCode, licenseKey };
  },
};
</script>