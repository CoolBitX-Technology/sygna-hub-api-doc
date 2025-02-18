<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Google SSO Configurations</div>
      <div class="text-body2">Only required if you want to enable Google login.</div>
      <div class="text-body2">Please refer to: <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank">https://developers.google.com/identity/protocols/oauth2</a></div>
    </div>
  </q-banner>

  <q-input
    type="string"
    v-model="googleSSO.id"
    label="ID"
  />

  <q-input
    v-model="googleSSO.secret" 
    :type="isPwd ? 'password' : 'text'"
    label="Secret"
  >
    <template v-slot:append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
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
    const { googleSSO } = storeToRefs(useGeneratorStore());      
    return {
      googleSSO,
      isPwd: ref(true),
    };
  },
};
</script>