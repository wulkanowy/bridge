<template>
  <v-app class="developer-app">
    <v-container class="d-flex align-center justify-center fill-height" v-if="loginStateLoading">
      <v-progress-circular indeterminate color="primary" :size="96" />
    </v-container>
    <developer-signed-out v-else-if="loginState === null" />
    <div v-else>
      <v-app-bar app color="primary" dark>
        <v-btn icon to="/" v-if="$route.name !== 'Home'">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-app-bar-title>Developer</v-app-bar-title>
        <v-spacer />
        <v-menu offset-y nudge-bottom="12" min-width="350">
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar>
                <v-img :src="loginState.avatarUrl" :width="48" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card outlined>
            <v-card-title v-if="loginState.name" class="d-block">
              {{ loginState.name }}
              <span class="text--secondary">
                ({{ loginState.login }})
              </span>
            </v-card-title>
            <v-card-title v-else>
              {{ loginState.login }}
            </v-card-title>
            <v-card-subtitle>Developer account</v-card-subtitle>
            <v-divider />
            <v-card-actions>
              <v-btn
                block
                color="primary"
                outlined
                href="/api/website/developer/sign-out"
              >
                Sign out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<style lang="scss">
  .developer-app {
    background-color: #f7f7f7 !important;
  }

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
