<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Developer</v-app-bar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'DeveloperApp',
})
export default class DeveloperApp extends Vue {

}
</script>
