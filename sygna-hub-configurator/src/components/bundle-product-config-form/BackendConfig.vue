<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Backend Server Configurations</div>
    </div>
  </q-banner>

  <div>
    <q-input
      ref="callbackHostRef"
      type="string"
      v-model="backend.callbackHost"
      label="Callback Host *"
      lazy-rules
      :rules="[
        (val) => (!!val) || 'Please input the callback host',
        (val) => (/^https:\/\/.*/.test(val)) || 'https (SSL/TLS) is required',
      ]"
    />
    <div v-html="formattedCallbackHostHint" class="hint-text"></div>
  </div>

  <q-select
    v-model="backend.enableCors"
    :options="corsOptions"
    emit-value
    map-options
    label="Enable Cors"
  />

  <div v-if="backend.enableCors">
    <div class="row items-center q-mb-sm">
      <div class="text-grey-7">Allow Origins</div>
      <q-btn color="primary"  @click="addOrigin" icon="add" round class="q-ml-md" />
    </div>
  
    <div v-for="(origin, index) in backend.allowOrigins" :key="index" class="row items-center q-mb-sm">
      <q-input v-model="backend.allowOrigins[index]" label="Origin URL" />
      <q-btn icon="delete" color="negative" flat round @click="removeOrigin(index)" />
    </div>
  </div>

  <q-select
    v-model="backend.enableRotateLog"
    :options="rotateLogOptions"
    emit-value
    map-options
    label="Enable Rotate Log"
    hint="Old log will automatically be compressed if this option is set to true."
  />

  <div v-if="backend.enableRotateLog">
    <q-input
      type="string"
      v-model="backend.logFile.fileName"
      label="Log File Path"
      hint="Path for log file, you can set this value to relative or absolute path."
    />

    <q-input
      type="number"
      v-model="backend.logFile.maxSize"
      label="Log File Max Size (MB)"
      hint="Max size for single log file. If you set to zero, default value is 100 MB."
    />

    <q-input
      type="number"
      v-model="backend.logFile.maxBackups"
      label="Log File Max Backups"
      hint="Max number of old log files to retain. If you set to zero, old logs will never be deleted."
    />

    <q-input
      type="number"
      v-model="backend.logFile.maxAge"
      label="Log File Max Age (days)"
      hint="Max number of days to retain log files. If you set to zero, old logs will never be deleted."
    />
  </div>
</template>
  
<script>
import { computed } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { backend } = storeToRefs(useGeneratorStore());      
    const callbackHostHint = `
      <li>This URL endpoint is used by the Sygna Bridge server to send the request to you, e.g., "permission request", "permission".</li>
      <li>If updated, the VASP must restart the container to refresh the URL on the Sygna Bridge server.</li>
      <li>https (SSL/TLS) is required.</li>
    `;
    const formattedCallbackHostHint = computed(() => callbackHostHint);

    const addOrigin = () => {
      backend.value.allowOrigins.push('');
    }
    const removeOrigin = (index) => {
      backend.value.allowOrigins.splice(index, 1);
    }

    return {
      backend,
      addOrigin,
      removeOrigin,
      formattedCallbackHostHint,
      corsOptions: [
        {
          label: 'true',
          value: true
        },
        {
          label: 'false',
          value: false
        }
      ],
      rotateLogOptions: [
        {
          label: 'true',
          value: true
        },
        {
          label: 'false',
          value: false
        }
      ],
    };
  },
};
</script>

<style scoped>
.hint-text {
  color: #6e6e6e;  /* 這是 Quasar 默認的 hint 顏色，根據需要調整 */
}
</style>