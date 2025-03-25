<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Email Configurations</div>
      <div class="text-body2">If you want to use email protocol and private wallet ownership, need to configure this part.</div>
    </div>
  </q-banner>

  <q-input
    type="string"
    v-model="emailService.host"
    label="Host"
    hint="Hostname of your email service."
    :data-section="'email_service'"
    :data-field="'host'"
  />

  <q-input
    type="number"
    v-model="emailService.port"
    label="Port"
    hint="Port of your email service."
    :data-section="'email_service'"
    :data-field="'host'"
  />

  <q-input
    type="string"
    v-model="emailService.account"
    label="Email Service Account"
    hint="Please enter your email service account credentials (e.g., AWS IAM user name and password)."
    :data-section="'email_service'"
    :data-field="'account'"
  />

  <q-input
    v-model="emailService.password" 
    :type="isPwd ? 'password' : 'text'"
    label="Email Service Password"
    hint="Please enter your email service account credentials (e.g., AWS IAM user name and password)."
    :data-section="'email_service'"
    :data-field="'password'"
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
    :data-section="'email_service'"
    :data-field="'subject_prefix'"
  />

  <q-select
    v-model="emailService.encryptionMode"
    :options="encryptionModeOptions"
    emit-value
    map-options
    label="Encryption Mode"
    :data-section="'email_service'"
    :data-field="'encryption_mode'"
  />

  <!-- 自動帶入 account? -->
  <q-input
    v-if="enableTLS"
    type="string"
    v-model="emailService.fromEmail"
    label="From email"
    hint="The email address of your sender."
    :data-section="'email_service'"
    :data-field="'from_email'"
  />

  <q-input
    v-else
    type="string"
    v-model="emailService.displayName"
    label="Sender name"
    hint="The name of the sender, which would be useless if you enable TLS."
    :data-section="'email_service'"
    :data-field="'display_name'"
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