<template>
  <q-banner class="q-mb-md" dense>
    <template v-slot:avatar>
      <q-icon name="info" color="primary" />
    </template>
    <div>
      <div class="text-h6">Database Configurations</div>
    </div>
  </q-banner>

  <q-select
    v-model="db.driver"
    :options="driverOptions"
    emit-value
    map-options
    label="Driver *"
  />

  <q-input
    type="string"
    v-model="db.host"
    label="Host *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the host']"
  />

  <q-input
    type="number"
    v-model="db.port"
    label="Port *"
    lazy-rules
    :rules="[(val) => (val > 0) || 'Please input the port']"
  />

  <q-input
    type="string"
    v-model="db.user"
    label="User *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the user']"
  />

  <q-input
    v-model="db.password" 
    :type="isPwd ? 'password' : 'text'"
    label="Password *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the password']"
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
    v-model="db.name"
    label="DB name *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the DB name']"
  />
</template>

<script>
import { ref } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { db } = storeToRefs(useGeneratorStore());      
    return {
      db,
      driverOptions: [
        {
          label: 'postgres',
          value: 'postgres'
        },
        {
          label: 'mysql',
          value: 'mysql'
        }
      ],
      isPwd: ref(true),
    };
  },
};
</script>