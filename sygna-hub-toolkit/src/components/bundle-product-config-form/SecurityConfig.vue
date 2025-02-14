<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Security Configurations</div>
    </div>
  </q-banner>

  <q-input
    v-model="security.jwtSecret"
    :type="isSecret ? 'password' : 'text'"
    label="JWT Secret *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the JWT secret']"
    hint="Signing key for JWT token, you should keep this value in a secret place."
  >
    <template v-slot:append>
      <q-icon
        :name="isSecret ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isSecret = !isSecret"
      />
    </template>
  </q-input>

  <q-input
    type="number"
    v-model="security.accessTokenExpireSec"
    label="JWT Token Expiry (sec) *"
    lazy-rules
    :rules="[(val) => (val > 0) || 'Please input the exipre duration']"
    hint="JWT token will expire after {this value} seconds."
  />

  <q-input
    v-model="security.dataEncryptionKey"
    :type="isEncryptionKey ? 'password' : 'text'"
    label="Data Encryption Key *"
    lazy-rules
    :rules="[(val) => (val && val.length == 32) || 'Please input the data encryption key and must be a 32-character hex string']"
    hint="Used to encrypt service credentials. Must be a 32-character hex string."
  >
    <template v-slot:append>
      <q-icon
        :name="isEncryptionKey ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isEncryptionKey = !isEncryptionKey"
      />
    </template>
  </q-input>
</template>

<script>
import { ref } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { security } = storeToRefs(useGeneratorStore());      
    return {
      security,
      isSecret: ref(true),
      isEncryptionKey: ref(true),
    };
  },
};
</script>