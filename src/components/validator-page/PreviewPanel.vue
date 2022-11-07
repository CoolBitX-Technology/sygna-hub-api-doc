<template>
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

<script>
import { storeToRefs } from 'pinia';
import { useValidatorStore } from 'src/stores/validator';
import { computed } from 'vue';

export default {
  setup() {
    const {
      vaspCode,
      licenseKey,
      webhookURL,
      jwtSecret,
      accessTokenExpireSec,
      dataEncryptionKey,
      adminAccount,
      adminPassword,
      concurrency,
    } = storeToRefs(useValidatorStore());

    const result = computed(() => {
      return [
        'settings:',
        `\twebhook_url: ${webhookURL.value}`,
        `\tjwt_secret: ${jwtSecret.value}`,
        `\taccess_token_expire_sec: ${accessTokenExpireSec.value}`,
      ].join('\n');
    });
    return {
      result,
    };
  },
};
</script>
