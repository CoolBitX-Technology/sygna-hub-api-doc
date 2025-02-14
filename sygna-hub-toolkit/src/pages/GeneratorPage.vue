<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        title="Select Target Config"
        icon="settings"
        :done="step > 1"
      >

        <q-stepper-navigation class="q-gutter-sm">
          <q-btn color="primary" size="md" @click="selectTarget('config.yml')"
            >Hub Bundle Product Config</q-btn
          >
          <q-btn
            color="primary"
            size="md"
            @click="selectTarget('docker-compose.yml')"
            >Docker Compose Config</q-btn
          >
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        :title="`Creating ''${target}''`"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="q-mb-md">
          <q-btn color="negative" outline size="sm" @click="goBack">
            Change Target Config
          </q-btn>
        </div>

        <bundle-product-config-form v-if="target === 'config.yml'" />
        <docker-compose-config-form v-if="target === 'docker-compose.yml'" />
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';
import BundleProductConfigForm from 'src/components/BundleProductConfigForm.vue';
import DockerComposeConfigForm from 'src/components/DockerComposeConfigForm.vue';

export default {
  components: { BundleProductConfigForm, DockerComposeConfigForm },

  setup() {
    const generator = useGeneratorStore();
    const { step, target } = storeToRefs(useGeneratorStore());

    function selectTarget(targetName: string) {
      generator.target = targetName;
      goNext();
    }

    function goNext() {
      generator.nextStep();
    }

    function goBack() {
      generator.prevStep();
    }

    return {
      selectTarget,
      goNext,
      goBack,
      step: ref(step),
      target,
    };
  },
};
</script>
