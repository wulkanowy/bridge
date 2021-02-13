<template>
  <v-container class="application-container" v-if="applicationError">
    <v-alert type="error">
      Failed to load application info
      <template #append>
        <v-btn light @click="loadApplication">Retry</v-btn>
      </template>
    </v-alert>
  </v-container>
  <v-container class="application-container" v-else-if="application === null">
    <v-skeleton-loader type="image" class="mb-4" />
    <v-skeleton-loader type="image" class="mb-4" />
  </v-container>
  <v-container class="application-container" v-else>
    <div class="mb-4 d-flex align-center">
      <div>
        <v-badge
          :color="application.verified ? 'green' : 'grey'"
          offset-x="48"
          offset-y="16"
          bottom
          :content="application.verified ? 'Verified' : 'Not verified'"
        >
          <app-icon
            large
            :color="application.iconColor"
            :url="application.iconUrl"
          />
        </v-badge>
      </div>
      <div class="text-h5 ml-4 text-right grow">{{ application.name }}</div>
    </div>
    <v-card outlined class="mb-4">
      <v-form @submit.prevent="modifyApp">
      <v-card-title>App information</v-card-title>
      <v-card-text class="pb-0">
        <v-text-field
          label="App name"
          outlined
          v-model="nameInput"
          :error-messages="nameError"
          counter="32"
          :counter-value="(v) => v.trim().length"
        />
        <v-text-field
          label="Homepage URL (optional)"
          outlined
          v-model="homepageInput"
          :error-messages="homepageError"
        />
      </v-card-text>
      <v-card-actions class="px-4">
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!appInfoValid"
          type="submit"
          :loading="appModifyLoading"
        >
          Save
        </v-btn>
      </v-card-actions>
      </v-form>
      <v-divider />
      <v-card-title>Icon</v-card-title>
      <v-card-text>
        Not implemented yet
      </v-card-text>
      <v-card-actions class="px-4">
        <v-spacer />
        <v-btn color="primary" outlined disabled>Remove icon</v-btn>
        <v-btn color="primary" disabled>Upload</v-btn>
      </v-card-actions>
      <v-divider />
      <v-card-text>
        <v-alert type="warning" text :value="application.verified">
          You will lose the verified badge
          if you change the app information
          or upload a new icon
        </v-alert>
        Users will see your GitHub profile information,
        including your name <b>({{ loginState.name || 'not set' }})</b>,
        login <b>({{ loginState.login }})</b>, avatar and profile URL
      </v-card-text>
    </v-card>
    <v-card outlined class="mb-4">
      <v-card-title>Client IDs</v-card-title>
    </v-card>
    <v-card outlined class="mb-4">
      <v-card-title>Danger zone</v-card-title>
    </v-card>
  </v-container>
</template>

<style lang="scss">
  .application-container {
    max-width: 700px;
  }
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppIcon from '@/pages/app-icon.vue';
import { GetApplicationQuery, LoginState } from '@/graphql/generated';
import { sdk } from '@/graphql/sdk';

@Component({
  name: 'DeveloperApplication',
  components: { AppIcon },
})
export default class DeveloperApplication extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  loginState!: LoginState

  application: GetApplicationQuery['application'] | null = null;

  applicationError = false;

  nameInput = '';

  homepageInput = '';

  appModifyLoading = false;

  appModifyError = false;

  get id(): string {
    return this.$route.params.appId;
  }

  get nameError(): string | null {
    if (this.nameInput.trim() === '') return 'The name is required';
    if (this.nameInput.trim().length < 3) return 'Name too short';
    if (this.nameInput.trim().length > 32) return 'Name too long';
    return null;
  }

  get homepageError(): string | null {
    if (this.homepageInput.trim() === '') return null;
    let url: URL;
    try {
      url = new URL(this.homepageInput.trim());
    } catch {
      return 'Invalid URL';
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'Protocol should be http: or https:';
    return null;
  }

  get appInfoValid(): boolean {
    if (!this.application) return false;
    if (
      this.nameInput.trim() === this.application.name
      && this.homepageInput.trim() === (this.application.homepage ?? '')
    ) return false;
    return this.nameError === null && this.homepageError === null;
  }

  async loadApplication() {
    this.application = null;
    this.applicationError = false;
    try {
      const result = await sdk.GetApplication({
        id: this.id,
      });
      if (!result.application) {
        console.error('Application not found');
        this.applicationError = true;
      } else {
        this.application = result.application;
        this.updateAppInfoInput();
      }
    } catch (error) {
      console.error(error);
      this.applicationError = true;
    }
  }

  updateAppInfoInput() {
    if (!this.application) return;
    this.nameInput = this.application.name;
    this.homepageInput = this.application.homepage ?? '';
  }

  async created() {
    await this.loadApplication();
  }

  async modifyApp() {
    if (this.appModifyLoading || !this.appInfoValid) return;
    this.appModifyLoading = true;
    this.appModifyError = false;
    let homepage: string | null = this.homepageInput.trim();
    if (homepage === '') homepage = null;
    try {
      const result = await sdk.ModifyApplication({
        id: this.id,
        homepage,
        name: this.nameInput.trim(),
      });
      this.application = result.modifyApplication;
      this.updateAppInfoInput();
    } catch (error) {
      console.error(error);
      this.appModifyError = true;
    }
    this.appModifyLoading = false;
  }
}
</script>
