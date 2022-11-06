<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        title="Select Target Config"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

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
        <bundle-product-config-form
          v-if="target === 'config.yml'"
        ></bundle-product-config-form>
      </q-step>

      <q-step :name="3" title="Done" icon="assignment_turned_in">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';
import BundleProductConfigForm from 'src/components/BundleProductConfigForm.vue';

export default {
  components: { BundleProductConfigForm },

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
