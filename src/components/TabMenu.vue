<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 800px">
      <q-tabs v-model="tab" class="text-white" inline-label>
        <q-route-tab
          to="/generator"
          name="generator"
          icon="build"
          label="Generator"
        />
        <q-route-tab
          to="/validator"
          name="validator"
          icon="construction"
          label="Validator"
        />
        <q-route-tab
          to="/ai"
          name="ai"
          icon="auto_fix_high"
          label="AI build up"
          disable=""
        />
      </q-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      tab: ref('generator'),
    };
  },
};
</script>
