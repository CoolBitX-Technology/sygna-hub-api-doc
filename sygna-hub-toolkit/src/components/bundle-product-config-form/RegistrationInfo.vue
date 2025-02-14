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
    type="string"
    v-model="vaspCode"
    label="Vasp Code *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the VASP code']"
  />

  <q-input
    type="string"
    v-model="licenseKey"
    label="License Key (API Key) *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the licence key']"
    hint="You can retrieve the license key in the registration success email."
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