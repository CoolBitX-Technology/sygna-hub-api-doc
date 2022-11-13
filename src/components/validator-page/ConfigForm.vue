<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <div class="q-pa-lg">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          id="bundle-product-config-form"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              dense
              label="App Setting"
              default-opened
            >
              <q-expansion-item
                :header-inset-level="1"
                expand-separator
                dense
                label="VASP Infomation"
                default-opened
              >
                <div class="q-pa-lg">
                  <q-input
                    clearable
                    v-model="config.settings.vaspCode"
                    label="VASP Code *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please type your VASP code',
                    ]"
                  />
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.licenseKey"
                    label="License Key *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your lincense key',
                    ]"
                    hint="license key retrieved when complete hub registration"
                  />
                </div>
              </q-expansion-item>
              <q-expansion-item
                :header-inset-level="1"
                expand-separator
                dense
                label="Admin User"
                default-opened
              >
                <div class="q-pa-lg">
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.adminAccount"
                    label="Admin User Account *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your admin user account',
                    ]"
                    hint="license key retrieved when complete hub registration"
                  />
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.adminPassword"
                    label="Admin User Password *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your admin user password',
                    ]"
                    hint="license key retrieved when complete hub registration"
                  />
                </div>
              </q-expansion-item>
              <q-expansion-item
                :header-inset-level="1"
                expand-separator
                dense
                label="Other"
                default-opened
              >
                <div class="q-pa-lg">
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.jwtSecret"
                    label="JWT Secret *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your jwt secret',
                    ]"
                    hint="signing key for JWT token, you should keep this value in secret place"
                  />
                  <q-input
                    clearable
                    type="number"
                    v-model="config.settings.accessTokenExpireSec"
                    label="Access Token Expire Time (seconds) *"
                    lazy-rules
                    step="1"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your expire time',
                    ]"
                    hint="JWT token will expire after {this value} seconds"
                  />
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.webhookURL"
                    label="Webhook URL"
                    lazy-rules
                    hint="If this url has been provided, the events notification will be sent to the webhook_url"
                  />
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.dataEncryptionKey"
                    label="Data Encryption Key *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your data encryption Key',
                    ]"
                    hint="an encryption key used to encrypt service credential, should be a 32 character long hex string"
                  />
                  <q-input
                    clearable
                    type="text"
                    v-model="config.settings.concurrency"
                    label="concurrency *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your concurrency',
                    ]"
                    hint="limit maximum concurrent requests processed by backend, more requests will be"
                  />
                </div>
              </q-expansion-item>
            </q-expansion-item>
            <q-expansion-item
              expand-separator
              dense
              label="Database"
              default-opened
            >
              <div class="q-pa-lg">
                <label>Driver：</label>
                <div class="q-gutter-sm">
                  <q-radio
                    v-model="config.db.driver"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="postgres"
                    label="PostgreSQL"
                  />
                  <q-radio
                    v-model="config.db.driver"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="mysql"
                    label="MySQL"
                  />
                </div>

                <div class="q-gutter-md row items-start">
                  <q-input
                    class="col-5"
                    clearable
                    type="text"
                    v-model="config.db.host"
                    label="Host *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your db host',
                    ]"
                  />
                  <q-input
                    class="col-5"
                    clearable
                    type="text"
                    v-model="config.db.host"
                    label="Port *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your db host',
                    ]"
                  />
                </div>
                <div class="q-gutter-md row items-start">
                  <q-input
                    class="col-5"
                    clearable
                    type="text"
                    v-model="config.db.user"
                    label="User *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your db user',
                    ]"
                  />
                  <q-input
                    class="col-5"
                    clearable
                    type="text"
                    v-model="config.db.password"
                    label="Password *"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Please type your db password',
                    ]"
                  />
                </div>

                <q-input
                  clearable
                  type="text"
                  v-model="config.db.name"
                  label="Name *"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Please type your db name',
                  ]"
                />
              </div>
            </q-expansion-item>
          </q-list>

          <q-separator color="secondary" />
          <div class="q-gutter-xs">
            <q-btn
              label="Export"
              type="submit"
              color="primary"
              form="bundle-product-config-form"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="secondary"
              class="q-ml-sm"
              form="bundle-product-config-form"
            />
          </div>
        </q-form>
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

<script lang="ts">
// import { useQuasar } from 'quasar';
import { useValidatorStore } from 'src/stores/validator';
import { storeToRefs } from 'pinia';
import { toSnakeCase } from 'src/utils/index';
import { computed, ref } from 'vue';
import yaml from 'js-yaml';

const validator = useValidatorStore();
const { config } = storeToRefs(useValidatorStore());
const result = computed(() => {
  return yaml.dump(toSnakeCase(config.value));
});
export default {
  setup() {
    return {
      splitterModel: ref(65),
      config,
      result,
      onSubmit() {
        return;
      },

      onReset() {
        validator.config.settings.vaspCode = null;
        validator.config.settings.licenseKey = null;
      },
    };
  },
};
</script>
