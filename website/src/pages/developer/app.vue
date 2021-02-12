<template>
  <v-app v-if="loginStateLoading">
    <v-container class="d-flex align-center justify-center fill-height">
      <v-progress-circular indeterminate color="primary" :size="96" />
    </v-container>
  </v-app>
  <developer-signed-out v-else-if="loginState === null" />
  <v-app v-else>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Developer</v-app-bar-title>
      <v-spacer />
      <v-app-bar-title>
        {{ loginState.name }} | {{ loginState.login }}
      </v-app-bar-title>
      <v-btn icon>
        <v-img :src="loginState.avatarUrl" :width="48" />
      </v-btn>
    </v-app-bar>
    <router-view />
  </v-app>
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
import { LoginState } from '@/graphql/generated';
import { sdk } from '@/pages/authenticate-prompt/sdk';

@Component({
  name: 'DeveloperApp',
  components: { DeveloperSignedOut },
})
export default class DeveloperApp extends Vue {
  loginStateLoading = true;

  loginState: LoginState | null = null;

  async created() {
    this.loginState = (await sdk.GetLoginState()).loginState;
    this.loginStateLoading = false;
  }
}
</script>
