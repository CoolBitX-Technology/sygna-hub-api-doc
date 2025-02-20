<template>
  <div class="row content-start fit full-width">
    <div style="min-width: 300px">
      <yww-sidebar></yww-sidebar>
    </div>
    <div class="col">
      <q-card class="my-card full-width">
        <config-form v-if="target === 'config.yml'"></config-form>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import ConfigForm from 'src/components/validator-page/ConfigForm.vue';
import YwwSidebar from 'src/components/validator-page/YwwSidebar.vue';
import { storeToRefs } from 'pinia';
import { useValidatorStore } from 'src/stores/validator';
const { target } = storeToRefs(useValidatorStore());
export default {
  components: {
    ConfigForm,
    YwwSidebar,
  },
  setup() {
    return {
      splitterModel: ref(65),
      target,
    };
  },
};
</script>
