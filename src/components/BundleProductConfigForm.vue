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
import EmailConfig from './bundle-product-config-form/EmailConfig.vue';
import SecurityConfig from './bundle-product-config-form/SecurityConfig.vue';
import AdminConfig from './bundle-product-config-form/AdminConfig.vue';
import GoogleLoginConfig from './bundle-product-config-form/GoogleLoginConfig.vue';
import AdvancedConfig from './bundle-product-config-form/AdvancedConfig.vue';
import { useGeneratorStore } from 'src/stores/generator';
import yaml from 'js-yaml';
import { toSnakeCase } from 'src/utils/index';

export default {
  components: {
    RegistrationInfo,
    BackendConfig,
    FrontendConfig,
    DatabaseConfig,
    EmailConfig,
    SecurityConfig,
    AdminConfig,
    GoogleLoginConfig,
    AdvancedConfig,
  },

  setup() {
    const generator = useGeneratorStore();
    const steps = [
      RegistrationInfo,
      BackendConfig,
      FrontendConfig,
      DatabaseConfig,
      EmailConfig,
      SecurityConfig,
      AdminConfig,
      GoogleLoginConfig,
      AdvancedConfig,
    ];
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
      const downloadYAML = (yamlString) => {
        const blob = new Blob([yamlString], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.yml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      // data 轉成 config 要的模式
      const data = generator.$state
      const { host, port, ...restEmailService } = data.emailService;
      const transformedData = {
        settings: {
          vasp_code: data.vaspCode,
          license_key: data.licenseKey,
          ...data.security,
          admin_account: data.admin.account,
          admin_password: data.admin.password,
          ...data.advanced,
        },
        db: {
          ...data.db,
        },
        server: {
          host: '0.0.0.0',
          port: 8088,
          ...data.backend,
          allow_origins: data.backend.allowOrigins.filter(origin => origin !== ''),
        },
        google_login: {
          ...data.googleSSO,
        },
        log_file: {
          not_yet: '',
        },
        email_service: {
          host: `${host}:${port}`,
          ...restEmailService,
        },
        frontend: {
          url: data.frontendUrl,
        }
      };

      const yamlString = yaml.dump(toSnakeCase(transformedData));
      console.log(yamlString);
      downloadYAML(yamlString);
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