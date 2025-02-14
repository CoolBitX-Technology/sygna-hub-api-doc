<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <div class="row">
        <q-list>
          <q-item-label header>Configuration Steps</q-item-label>
          <q-item
            v-for="(step, index) in steps"
            :key="index"
            clickable
            v-ripple
            @click="goToStep(index)"
            :active="currentStep === index"
            active-class="bg-primary text-white"
          >
            <q-item-section>{{ step.label }}</q-item-section>
          </q-item>
        </q-list>

        <q-page class="q-pa-md">
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <component :is="currentComponent" />

            <q-btn
              v-if="isLastStep"
              label="Generate config.yml"
              color="primary"
              @click="handleSubmit"
            />
          </q-form>
        </q-page>
      </div>
    </template>

    <template v-slot:after>
      <div class="q-pa-md">
        <q-input
          inputStyle="min-height: 100vh;"
          class="full-height full-width"
          v-model="result"
          type="textarea"
          readonly
        />
      </div>
    </template>
  </q-splitter>
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
      { component: RegistrationInfo, label: 'Registration' },
      { component: BackendConfig, label: 'Backend' },
      { component: FrontendConfig, label: 'Frontend' },
      { component: DatabaseConfig, label: 'Database' },
      { component: EmailConfig, label: 'Email' },
      { component: SecurityConfig, label: 'Security' },
      { component: AdminConfig, label: 'Admin' },
      { component: GoogleLoginConfig, label: 'Google Login' },
      { component: AdvancedConfig, label: 'Advanced' },
    ];
    const currentStep = ref(0);

    const currentComponent = computed(() => steps[currentStep.value].component);
    const isLastStep = computed(() => currentStep.value === steps.length - 1);
    const result = computed(() => {
      return transformData(generator.$state);
    });

    function goToStep(index) {
      currentStep.value = index;
    }

    const transformData = (data) => {
      const { host, port, ...restEmailService } = data.emailService;
      const { logFile, ...restBackend } = data.backend;
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
          ...restBackend,
          allow_origins: data.backend.allowOrigins.filter(origin => origin !== ''),
        },
        google_login: {
          ...data.googleSSO,
        },
        log_file: {
          ...logFile,
        },
        email_service: {
          host: `${host}:${port}`,
          ...restEmailService,
        },
        frontend: {
          url: data.frontendUrl,
        }
      };

      return yaml.dump(toSnakeCase(transformedData));
    }

    
    function handleSubmit() {   
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

      const yamlString = transformData(generator.$state);
      downloadYAML(yamlString);
    }

    return {
      splitterModel: ref(65),
      currentComponent,
      currentStep,
      steps,
      goToStep,
      isLastStep,
      handleSubmit,
      result,
    };
  },
};
</script>