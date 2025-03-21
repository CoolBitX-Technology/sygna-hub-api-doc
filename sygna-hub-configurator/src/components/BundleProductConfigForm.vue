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
          <q-form
            ref="form"
            @submit.prevent="handleSubmit"
            @validation-error="handleValidationError"
            @focusin="handleFocus"
            class="q-gutter-md"
          >
            <q-btn
              label="Generate config.yml"
              color="primary"
              @click="handleSubmit"
            />
            <template v-for="(step, index) in steps" :key="index">
              <div v-show="currentStep === index">
                <component :is="step.component" :ref="(el) => (stepRefs[index] = el)" />
              </div>
            </template>
          </q-form>
        </q-page>
      </div>
    </template>

    <template v-slot:after>
      <div class="q-pa-md scroll-container">
        <div v-for="(value, section) in transformedConfig" :key="section">
          <div v-if="comments[section].comment">
            # {{ comments[section].comment }}
          </div>
          <div>{{ section }}:</div>

          <div v-for="(fieldValue, field) in value" :key="field" style="margin-left: 2ch;">
            <div v-if="comments[section][field]">
              <div v-for="(line, index) in comments[section][field].split('\n')" :key="index">
                # {{ line }}
              </div>
            </div>
            <div :id="`${section}-${field}`">
              {{ field }}: {{ fieldValue }}
            </div>
          </div>

          <br/>
        </div>
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
import { toSnakeCase, comments, genConfigYamlString } from 'src/utils/index';

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
    const form = ref(null);
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

    const isLastStep = computed(() => currentStep.value === steps.length - 1);
    const transformedConfig = computed(() => transformData(generator.$state));

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
        },
        // Hard code for now. There is another ticket SYGN-3040 related to TRISA.
        trisa_server: {
          url: 'http://localhost:8081',
          host: '0.0.0.0',
          port: 443,
          restful_port: 8081,
        },
        shyft_server: {
          rpc_url: 'ws://shyft-realy:8545',
        }
      };
      return toSnakeCase(transformedData);
    }

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

    const stepRefs = ref([]);
    function findErrorComponentIndex(error) {
      if (!error.label) return 0;

      for (let i = 0; i < stepRefs.value.length; i++) {
        const stepComponent = stepRefs.value[i];
        if (!stepComponent) continue;

        const inputs = stepComponent.$refs || {};
        for (const key in inputs) {
          // TODO:
          // 找出是哪個 stepComponent 有問題，用 label 來當判斷標準的話，可能會有問題。
          // 現在 workaround 是先讓每個 field 的 label 都不同
          // 之後如果有較好的方法再來改這邊
          if (inputs[key]?.label === error.label) {
            return i;
          }
        }
      }

      return 0;
    }

    function handleValidationError(errors) {
      const index = findErrorComponentIndex(errors);
      currentStep.value = index;
    }

    async function handleSubmit() {
      const valid = await form.value.validate();
      if (!valid) {
        return;
      }

      const transformedConfig = transformData(generator.$state);
      const yamlString = genConfigYamlString(transformedConfig);
      downloadYAML(yamlString);
    }

    const scrollToPreview = ((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        const header = document.querySelector('.q-header');
        const scrollContainer = document.querySelector('.scroll-container');

        let toOffsetTop = element.offsetTop;

        const offset = header.getBoundingClientRect().bottom -
          scrollContainer.getBoundingClientRect().top;
        // The header blocks part of the scroll container content.
        // Need to adjust the scroll position.
        if (offset > 0) {
          toOffsetTop -= offset;
        }

        scrollContainer.scrollTo({
          top: toOffsetTop,
          behavior: 'smooth',
        });
      }
    });

    const handleFocus = ((event) => {
      const target = event.target;
      let sectionId ;
      let fieldId;
      
      if (target.tagName === 'input') {
        sectionId = target.dataset.section;
        fieldId = target.dataset.field;
      } else {
        // target of q-select is not <input> element.
        // need to query its child elements
        const qFieldControlElement = target.closest('.q-field__control');
        if (qFieldControlElement) {
          sectionId = qFieldControlElement.querySelector('[data-section]').dataset.section;;
          fieldId = qFieldControlElement.querySelector('[data-field]').dataset.field;;
        }
      }
      
      if (sectionId && fieldId) {
        scrollToPreview(`${sectionId}-${fieldId}`);
      }
    });

    return {
      splitterModel: ref(65),
      currentStep,
      steps,
      goToStep,
      isLastStep,
      handleSubmit,
      form,
      handleValidationError,
      stepRefs,
      comments,
      transformedConfig,
      handleFocus,
    };
  },
};
</script>

<style>
.scroll-container {
  max-height: 100vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>