<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Email Configurations</div>
      <div class="text-body2">TBC If you want to use email protocol and private wallet ownership, need to configure this part.</div>
    </div>
  </q-banner>

  <q-input
    type="string"
    v-model="emailService.host"
    label="Host"
  />

  <q-input
    type="number"
    v-model="emailService.port"
    label="Port"
  />

  <q-input
    type="string"
    v-model="emailService.account"
    label="Email address of sender"
    hint="Please input the AWS IAM user name if you want to use AWS SES to send the email."
  />

  <q-input
    v-model="emailService.password" 
    :type="isPwd ? 'password' : 'text'"
    label="Email password of sender"
    hint="Please input the AWS IAM password if you want to use AWS SES to send the email."
  >
    <template v-slot:append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>

  <q-input
    type="string"
    v-model="emailService.subjectPrefix"
    label="Subject Prefix"
  />

  <q-select
    v-model="emailService.encryptionMode"
    :options="encryptionModeOptions"
    emit-value
    map-options
    label="Encryption Mode"
  />

  <!-- 自動帶入 account? -->
  <q-input
    v-if="enableTLS"
    type="string"
    v-model="emailService.fromEmail"
    label="From email"
    hint="TBC need a more detailed description?"
  />

  <q-input
    v-else
    type="string"
    v-model="emailService.displayName"
    label="Sender name"
  />
</template>

<script>
import { ref, computed } from 'vue';
import { useGeneratorStore, EmailEncryptionMode } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { emailService } = storeToRefs(useGeneratorStore());      

    const enableTLS = computed(() => {
      return emailService.value.encryptionMode !== EmailEncryptionMode.None;
    });

    return {
      emailService,
      enableTLS,
      encryptionModeOptions: [
        {
          label: 'None',
          value: EmailEncryptionMode.None,
        },
        {
          label: 'SSL/TLS',
          value: EmailEncryptionMode.SSLTLS,
        },
        {
          label: 'STARTTLS',
          value: EmailEncryptionMode.StartTLS,
        }
      ],
      isPwd: ref(true),
    };
  },
};
</script>