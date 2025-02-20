<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Frontend Server Configurations</div>
    </div>
  </q-banner>

  <q-input
    type="string"
    v-model="frontendUrl"
    label="URL"
    lazy-rules
    hint="Used in email protocol and private wallet ownership. Allows the counterparty to access transaction details through the URL."
  />
</template>

<script>
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { frontendUrl } = storeToRefs(useGeneratorStore());      
    return { frontendUrl };
  },
};
</script>