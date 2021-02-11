<template>
<!--  <v-app>-->
<!--    <v-app-bar app color="primary" dark>-->
<!--      <v-app-bar-title>Developer</v-app-bar-title>-->
<!--      <v-spacer />-->
<!--      <v-btn icon>-->
<!--        <v-icon>mdi-account</v-icon>-->
<!--      </v-btn>-->
<!--    </v-app-bar>-->
<!--    <router-view />-->
<!--  </v-app>-->
  <developer-signed-out />
</template>

<style lang="scss">
  .v-card__text, .v-card__title {
    word-break: normal;
  }

  .no-basis {
    flex-basis: 0;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DeveloperSignedOut from '@/pages/developer/views/signed-out.vue';

@Component({
  name: 'DeveloperApp',
  components: { DeveloperSignedOut },
})
export default class DeveloperApp extends Vue {

}
</script>
