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
    label="Url"
    lazy-rules
    hint="TBC used in email protocol, ownership"
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