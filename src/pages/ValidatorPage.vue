<template>
  <q-card class="my-card">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <validator-form></validator-form>
      </template>
      <template v-slot:after>
        <preview-panel></preview-panel>
      </template>
    </q-splitter>
  </q-card>
</template>

<script lang="ts">
import { ref } from 'vue';
import ValidatorForm from 'src/components/validator-page/ValidatorForm.vue';
import PreviewPanel from 'src/components/validator-page/PreviewPanel.vue';

export default {
  components: {
    ValidatorForm,
    PreviewPanel,
  },
  setup() {
    return {
      splitterModel: ref(65),
    };
  },
};
</script>
