<template>
  <v-app>
    <div>
      <div class="text-h4 text-center mt-8 mx-2">
        <span class="primary--text">Wulkanowy</span> Bridge<br>
        <span class="text--secondary">Developer Console</span>
      </div>
    </div>
    <v-main class="px-4">
      <v-sheet max-width="500" class="mx-auto mt-12" color="transparent">
        <v-btn block large dark :href="signInUrl">
          <v-icon left>mdi-login</v-icon>
          <v-spacer />
          Sign in with GitHub
          <v-spacer />
        </v-btn>
        <v-btn block outlined href="/" class="mt-2">
          <v-icon left>mdi-arrow-left</v-icon>
          <v-spacer />
          Go back
          <v-spacer />
        </v-btn>
        <v-divider class="my-8 mx-4" />
        <v-btn block color="primary" outlined href="https://github.com/wulkanowy/bridge/wiki">
          <v-icon left>mdi-book</v-icon>
          <v-spacer />
          Documentation
          <v-spacer />
        </v-btn>
        <v-btn class="mt-2" block color="primary" outlined href="https://github.com/wulkanowy/bridge">
          <v-icon left>mdi-github</v-icon>
          <v-spacer />
          Source code
          <v-spacer />
        </v-btn>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'DeveloperSignedOut',
})
export default class DeveloperSignedOut extends Vue {
  get signInUrl() {
    const url = new URL('/api/website/developer/sign-in/github', window.location.toString());
    url.searchParams.set('return_to', this.$route.path);
    return url.toString();
  }
}
</script>
