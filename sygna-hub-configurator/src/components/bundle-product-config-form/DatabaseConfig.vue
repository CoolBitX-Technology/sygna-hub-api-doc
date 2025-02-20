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
    ref="dbHostRef"
    type="string"
    v-model="db.host"
    label="Host *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the host']"
  />

  <q-input
    ref="dbPortRef"
    type="number"
    v-model="db.port"
    label="Port *"
    lazy-rules
    :rules="[(val) => (val > 0) || 'Please input the port']"
  />

  <q-input
    ref="dbUserRef"
    type="string"
    v-model="db.user"
    label="User *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the user']"
  />

  <q-input
    ref="dbPasswordRef"
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
    ref="dbNameRef"
    type="string"
    v-model="db.name"
    label="DB name *"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please input the DB name']"
  />
</template>

<script>
import { ref, watch } from 'vue';
import { useGeneratorStore } from 'src/stores/generator';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const { db } = storeToRefs(useGeneratorStore());
    const driverOptions = [
      {
        label: 'postgres',
        value: 'postgres',
        defaultPort: 5432,
      },
      {
        label: 'mysql',
        value: 'mysql',
        defaultPort: 3306,
      }
    ];
    
    watch(() => db.value.driver, (newDriver) => {
      const selectedDriver = driverOptions.find(option => option.value === newDriver);
      if (selectedDriver) {
        db.value.port = selectedDriver.defaultPort;
      }
    });
    return {
      db,
      driverOptions,
      isPwd: ref(true),
    };
  },
};
</script>