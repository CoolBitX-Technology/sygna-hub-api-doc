<template>
  <q-list padding class="rounded-borders text-primary">
    <q-item
      clickable
      v-ripple
      :active="target === 'config.yml'"
      @click="target = 'config.yml'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="tune" />
      </q-item-section>

      <q-item-section>config.yml</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="target === 'docker-compose.yml'"
      @click="target = 'docker-compose.yml'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="tune" />
      </q-item-section>

      <q-item-section>docker-compose.yml</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { useValidatorStore } from 'src/stores/validator';
import { storeToRefs } from 'pinia';

const { target } = storeToRefs(useValidatorStore());

export default {
  setup() {
    return {
      target,
    };
  },
};
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
