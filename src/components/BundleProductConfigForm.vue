<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit.prevent="handleNext" class="q-gutter-md">
      <component :is="currentComponent" />

      <div class="q-gutter-xs">
        <q-btn
          v-if="!isLastStep"
          label="Next"
          color="primary"
          type="submit"
        />
        <q-btn
          v-else
          label="Generate config.yml"
          color="primary"
          @click="handleSubmit"
        />
        <q-btn
          label="Back"
          @click="handleBack"
          color="secondary"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import RegistrationInfo from './bundle-product-config-form/RegistrationInfo.vue';
import BackendConfig from './bundle-product-config-form/BackendConfig.vue';
import FrontendConfig from './bundle-product-config-form/FrontendConfig.vue';
import DatabaseConfig from './bundle-product-config-form/DatabaseConfig.vue';
import { useGeneratorStore } from 'src/stores/generator';

export default {
  components: { RegistrationInfo, BackendConfig, FrontendConfig, DatabaseConfig },

  setup() {
    const generator = useGeneratorStore();
    const steps = [RegistrationInfo, BackendConfig, FrontendConfig, DatabaseConfig];
    const currentStep = ref(0);

    const currentComponent = computed(() => steps[currentStep.value]);
    const isLastStep = computed(() => currentStep.value === steps.length - 1);

    async function handleNext() {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++;
      }
    }

    function handleBack() {
      if (currentStep.value > 0) {
        currentStep.value--;
      } else {
        generator.prevStep();
      }
    }

    function handleSubmit() {
      // generator.nextStep(); // 回到主框架的 Step 3
      console.log('State values on submit:', {
        vaspCode: generator.vaspCode,
        licenseKey: generator.licenseKey,
        backend: generator.backend,
        db: generator.db,
      });
    }

    return {
      currentComponent,
      currentStep,
      isLastStep,
      handleNext,
      handleBack,
      handleSubmit,
    };
  },
};
</script>