<template>
  <v-container class="home-container">
    <div class="text-h4 my-8">
      Your applications
    </div>
    <div class="applications">
      <new-app-dialog>
        <template #activator="{ on }">
          <v-card
            outlined
            class="d-flex flex-column align-center justify-center text-center"
            color="primary--text"
            v-on="on"
          >
            <v-icon color="primary" :size="64">mdi-plus</v-icon>
            <div class="text-h5 my-2">New app</div>
          </v-card>
        </template>
      </new-app-dialog>
      <v-card
        v-if="applicationError"
        outlined
        color="red--text"
        class="d-flex flex-column align-center justify-center text-center"
      >
        <div class="text-h6 px-2">Failed to load app list</div>
        <v-btn class="mt-4" color="primary" @click="loadApplications">Retry</v-btn>
      </v-card>
      <v-skeleton-loader type="image" v-else-if="applications === null" height="200" />
      <v-card
        v-else
        v-for="app in applications"
        :key="app.id"
        outlined
        :to="`/apps/${app.id}`"
        class="d-flex flex-column align-center py-2 text-center"
        :style="{
          'color': app.iconColor
        }"
      >
        <app-icon
          :color="app.iconColor"
          :url="app.iconUrl"
          class="mx-2"
        />
        <v-spacer />
        <div class="text-h5 my-2 text--secondary px-2">{{ app.name }}</div>
        <v-spacer />
      </v-card>
    </div>
  </v-container>
</template>

<style lang="scss">
  .home-container {
    max-width: 800px;

    .applications {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
      grid-auto-rows: minmax(200px, 1fr);
      grid-gap: 10px;
    }
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppIcon from '@/pages/app-icon.vue';
import NewAppDialog from '@/compontents/developer/new-app-dialog.vue';
import { GetApplicationsQuery } from '@/graphql/generated';
import { sdk } from '@/graphql/sdk';

@Component({
  name: 'DeveloperHome',
  components: { NewAppDialog, AppIcon },
})
export default class DeveloperHome extends Vue {
  applications: GetApplicationsQuery['applications'] | null = null;

  applicationError = false;

  async loadApplications() {
    this.applications = null;
    this.applicationError = false;
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = await sdk.GetApplications();
      this.applications = result.applications;
    } catch (error) {
      console.error(error);
      this.applicationError = true;
    }
  }

  created() {
    this.loadApplications();
  }
}
</script>
