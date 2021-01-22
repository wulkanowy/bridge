<template>
  <v-app class="dialog-app">
    <div>
      <div class="text-h4 text-center mt-8 mx-2">
        <span class="primary--text">Wulkanowy</span> Bridge
      </div>
    </div>
    <v-main class="px-4">
      <v-sheet max-width="500" class="mx-auto mt-16" color="transparent">
        <slot />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'DialogApp',
})
export default class DialogApp extends Vue {

}
</script>

<style lang="scss">
  .dialog-app {
    background-color: #f7f7f7 !important;

    .v-card__text, .v-card__title {
      word-break: normal;
    }

    .no-basis {
      flex-basis: 0;
    }
  }
</style>
