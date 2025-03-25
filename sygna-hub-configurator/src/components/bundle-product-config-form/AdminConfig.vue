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
    ref="adminAccountRef"
    type="string"
    v-model="admin.account"
    label="Admin Account *"
    lazy-rules
    :rules="[(val) => (!!val) || 'Please input the admin account']"
    hint="Email address for the first user to login Sygna Hub."
    :data-section="'settings'"
    :data-field="'admin_account'"
  />

  <q-input
    ref="adminPasswordRef"
    v-model="admin.password" 
    :type="isPwd ? 'password' : 'text'"
    label="Admin Password *"
    lazy-rules
    :rules="[
      (val) => (!!val) || 'Please input the admin password',
      (val) => (/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(val)) || 'Password must be at least 6 characters long, include 1 number, 1 uppercase letter, and 1 special character.',
      (val) => {
        let slowPtr = 0, fastPtr = 1;
        while (fastPtr < val.length) {
          if (val[slowPtr] === val[fastPtr]) {
            return 'Consecutive characters are not allowed.';
          }
          slowPtr++;
          fastPtr++;
        }
      },
    ]"
    hint='Password must be at least 6 characters long, include 1 number, 1 uppercase letter, and 1 special character. No consecutive identical characters allowed. Special character: ~!@#$%^&*()_+`-={}|[]\:"<>?,./'
    :data-section="'settings'"
    :data-field="'admin_password'"
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