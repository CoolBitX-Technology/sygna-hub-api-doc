<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Advanced Configurations</div>
    </div>
  </q-banner>
  
  <q-input
    ref="concurrencyRef"
    type="number"
    v-model="advanced.concurrency"
    label="Concurrency *"
    lazy-rules
    :rules="[(val) => (val !== '') || 'Please input the concurrency']"
    hint="Limit the maximum concurrent requests processed by Sygna Hub backend server. Use a positive value to enable it; set 0 or negative value to disable."
    :data-section="'settings'"
    :data-field="'concurrency'"
  />

  <div>
    <q-select
      v-model="advanced.workType"
      :options="workTypeOptions"
      emit-value
      map-options
      label="Container Work Type *"
      :data-section="'settings'"
      :data-field="'work_type'"
    />
    <div v-html="formattedWorkTypeHint" class="hint-text"></div>
  </div>

  <q-input
    ref="transactionConcurrencyRef"
    type="number"
    v-model="advanced.transactionConcurrency"
    label="Transaction Concurrency *"
    lazy-rules
    :rules="[(val) => (val <= advanced.concurrency) || 'Please input the valid transaction concurrency']"
    hint='Limit the maximum concurrent "POST /transactions" requests processed by Sygna Hub backend server. This value must be equal to or lower than the overall concurrency limit. Setting it too high may reduce capacity for other API requests.'
    :data-section="'settings'"
      :data-field="'transaction_concurrency'"
  />

  <div>
    <q-input
      type="string"
      v-model="advanced.webhookUrl"
      label="Webhook URL"
      :data-section="'settings'"
      :data-field="'webhook_url'"
    />
    <div v-html="formattedWebhookUrlHint" class="hint-text"></div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useGeneratorStore, ContainerWorkType } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { advanced } = storeToRefs(useGeneratorStore());      
    const workTypeHint = `
      <li>Select "Default" if the container is used to address API-related and cronjob-related service at the same time.</li>
      <li>Select "API" if the container is used to address API-related service.</li>
      <li>Select "Cronjob" if the container is used to address cronjob-related service.</li>
    `
    const formattedWorkTypeHint = computed(() => workTypeHint);
    const webhookUrlHint = 'The event notifications will be sent to this URL. Please check <a href="https://github.com/CoolBitX-Technology/sygna-hub-api-doc/tree/master?tab=readme-ov-file#webhook-events" target="_blank">webhook events documentation</a> for all available events.';
    const formattedWebhookUrlHint = computed(() => webhookUrlHint);

    return {
      advanced,
      workTypeOptions: [
      {
          label: 'Default',
          value: ContainerWorkType.Default,
        },
        {
          label: 'API',
          value: ContainerWorkType.API,
        },
        {
          label: 'Cronjob',
          value: ContainerWorkType.Cronjob,
        }
      ],
      formattedWorkTypeHint,
      formattedWebhookUrlHint,
    };
  },
};
</script>

<style scoped>
.hint-text {
  color: #6e6e6e;  /* 這是 Quasar 默認的 hint 顏色，根據需要調整 */
}
</style>