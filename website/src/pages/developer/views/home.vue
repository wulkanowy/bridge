<template>
  <v-container class="home-container">
    <div class="text-h4 my-8">
      Your applications
    </div>
    <div class="applications">
      <v-card
        link
        outlined
        class="d-flex flex-column align-center justify-center text-center"
        color="primary--text"
        to="/new-app"
      >
        <v-icon color="primary" :size="64">mdi-plus</v-icon>
        <div class="text-h5 my-2">New app</div>
      </v-card>
      <v-card
        v-for="i in 18"
        :key="i"
        outlined
        link
        class="d-flex flex-column align-center justify-center py-2 text-center"
        :style="{
          'color': '#aaee00'
        }"
      >
        <app-icon
          color="#aaee00"
          url="https://i.imgur.com/lhgyAa5.png"
          class="mx-2"
        />
        <div class="text-h5 my-2 text--secondary">{{ i }}th app</div>
      </v-card>
    </div>
  </v-container>
</template>

<style lang="scss">
  .home-container {
    max-width: 1100px;

    .applications {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-auto-rows: minmax(160px, 1fr);
      grid-gap: 10px;
    }
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppIcon from '@/pages/app-icon.vue';

@Component({
  name: 'DeveloperHome',
  components: { AppIcon },
})
export default class DeveloperHome extends Vue {

}
</script>
