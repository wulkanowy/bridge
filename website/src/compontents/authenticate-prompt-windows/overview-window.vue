<template>
  <div>
    <div class="pt-16">
      <h2 class="text-subtitle-1 text--secondary mt-6 mb-2 px-4">
        Aplikacja
        <app-info-dialog :prompt-info="promptInfo" />
        chce uzyskać dostęp do twojego konta VULCAN UONET+ przez Wulkanowy Bridge
      </h2>
      <v-subheader>Uprawnienia aplikacji</v-subheader>
      <v-list subheader>
        <v-list-item v-for="item in scopeItems" :key="item.key">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle !== undefined">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-alert color="info" text class="mb-2 mx-2">
        <span class="font-weight-medium">{{ promptInfo.application.name }}</span>
        nie zobaczy twojego hasła
        <template #append>
          <!-- TODO: Implement -->
          <v-btn text color="info">Więcej</v-btn>
        </template>
      </v-alert>
    </div>
    <v-card-actions>
      <v-btn color="primary" text outlined :href="denyUrl">
        Odmów
      </v-btn>
      <v-spacer />
      <v-btn color="primary" @click="next">
        Dalej
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PromptInfo } from '@/types';
import AppInfoDialog from '@/compontents/app-info-dialog.vue';

@Component({
  name: 'OverviewWindow',
  components: { AppInfoDialog },
})
export default class OverviewWindow extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  readonly scopeDescriptions: {
    key: string;
    title: string;
    subtitle?: string;
    icon: string;
  }[] = [
    {
      key: 'timetable',
      title: 'Plan lekcji',
      icon: 'mdi-timetable',
    },
    {
      key: 'grades',
      title: 'Oceny i punkty',
      subtitle: 'Oceny cząstkowe, końcowe, opisowe oraz punkty',
      icon: 'mdi-numeric-6-box-multiple-outline',
    },
    {
      key: 'notes',
      title: 'Uwagi i pochwały',
      icon: 'mdi-note-text-outline',
    },
    {
      key: 'achievements',
      title: 'Osiągnięcia',
      icon: 'mdi-trophy-outline',
    },
  ]

  get scopeItems() {
    return this.scopeDescriptions
      .filter(({ key }) => this.promptInfo.scopes.includes(key));
  }

  get denyUrl() {
    return `/api/website/deny?prompt_id=${this.promptInfo.id}`;
  }

  next() {
    this.$emit('next');
  }
}
</script>
