<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Backend Server Configurations</div>
    </div>
  </q-banner>

  <!-- 
  - callback_host
  - enable_rotate_log
    Log File (if enable_rotate_log is set to true)
        - file_name
        - max_size
        - max_backups
        - max_age
  - enable_cors
  - allow_origins (only show it if enable_cors is true) -->

  <q-input
    clearable
    type="string"
    v-model="backend.callbackHost"
    label="Callback Host *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the callback host']"
  />
  <!-- hint='This URL endpoint is used by the Sygna (Bridge) server to send the request to you, e.g., "permission request", "permission". Upon bringing up the Sygna Hub docker, the "callback_host" will be applied to the four callback endpoint URLs of the VASP on the Sygna server: callback_permission_request_url, callback_txid_url, callback_validate_addr_url, and callback_vasp_server_health_check_url. If the "callback_host" is updated, the VASP needs to restart the docker for the host on the Sygna (Bridge) server to be refreshed automatically (estimated from version 1.21.0). https (SSL/TLS) is required' -->

  <q-select
    v-model="backend.enableCors"
    :options="corsOptions"
    emit-value
    map-options
    label="Enable Cors"
    hint="cors"
  />


  <!-- allow_origins -->
  <!-- 會是一個 list，想用 add 之類的方式呈現 -->

  <!-- <div v-if="enableCors === true">
    <q-input
      clearable
      v-model="callbackHost"
      label="Origins *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please input the callback host']"
    >
    </q-input>
  </div> -->

  <q-select
    v-model="backend.enableRotateLog"
    :options="rotateLogOptions"
    emit-value
    map-options
    label="Enable Rotate Log"
    hint="Old log will automatically be compressed if this option is set to true."
  />

  <!-- Log File -->
  <!-- <div v-if="enableCors === true">
    <q-input
      clearable
      v-model="callbackHost"
      label="Callback Host *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please input the callback host']"
    >
    </q-input>
  </div> -->
</template>
  
<script>
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { backend } = storeToRefs(useGeneratorStore());      
    return {
      backend,
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
      ]
    };
  },
};
</script>