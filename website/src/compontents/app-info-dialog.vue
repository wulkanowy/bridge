<template>
  <v-dialog v-model="value" max-width="450">
    <template #activator="{ on: dialogOn }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltipOn }">
          <v-card
            class="d-inline-block px-1"
            color="primary--text"
            rounded
            flat
            v-on="{ ...dialogOn, ...tooltipOn }"
            link
          >
            {{ promptInfo.application.name }}
          </v-card>
        </template>
        Kliknij aby zobaczyć informacje o aplikacji
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>
        Informacje o aplikacji
      </v-card-title>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle class="text-overline">
              Nazwa aplikacji
            </v-list-item-subtitle>
            <v-list-item-title>
              {{ promptInfo.application.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="promptInfo.application.homepage"
          :href="promptInfo.application.homepage"
          target="_blank"
          rel="noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle class="text-overline">
              Strona domowa
            </v-list-item-subtitle>
            <v-list-item-title>
              {{ promptInfo.application.homepage }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :href="promptInfo.application.owner.url"
          target="_blank"
          rel="noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle class="text-overline">
              Twórca
            </v-list-item-subtitle>
            <v-list-item-title v-if="promptInfo.application.owner.name">
              {{ promptInfo.application.owner.name }}
              <span class="text--secondary">
                ({{ promptInfo.application.owner.login }})
              </span>
            </v-list-item-title>
            <v-list-item-title v-else>
              {{ promptInfo.application.owner.login }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-alert
        color="green"
        icon="mdi-check"
        text
        class="mx-2"
        v-if="promptInfo.application.verified"
      >
        Aplikacja zweryfikowana
      </v-alert>
      <v-alert
        color="grey darken-2"
        icon="mdi-close"
        text
        class="mx-2"
        v-else
      >
        Aplikacja nie została zweryfikowana
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="value = false">Zamknij</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PromptInfo } from '@/types';

@Component({
  name: 'AppInfoDialog',
})
export default class AppInfoDialog extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  value = false;
}
</script>
