<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Administrator Configurations</div>
      <div class="text-body2">This will only be applied in the very first time when initializing Sygna Hub.</div>
    </div>
  </q-banner>

  <q-input
    type="string"
    v-model="admin.account"
    label="Admin Account *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the admin account']"
    hint="Email address for the first user to login Sygna Hub."
  />

  <q-input
    v-model="admin.password" 
    :type="isPwd ? 'password' : 'text'"
    label="Admin Password *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the admin password']"
    hint='Password should contain at least 6 letters, at least 1 number, at least 1 upper case and at least 1 special character. Special character: ~!@#$%^&*()_+`-={}|[]\:"<>?,./'
    
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
    const { admin } = storeToRefs(useGeneratorStore());      
    return {
      admin,
      isPwd: ref(true),
    };
  },
};
</script>