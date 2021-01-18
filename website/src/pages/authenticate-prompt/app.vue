<template>
  <v-app class="authenticate-prompt-app">
    <div>
      <div class="text-h4 text-center mt-8">
        <span class="primary--text">Wulkanowy</span> Bridge
      </div>
    </div>
    <v-main class="px-4">
      <v-sheet max-width="500" class="mx-auto mt-16" color="transparent">
        <v-alert type="error" text v-if="!promptId">
          Brak wymaganego parametru <code>prompt_id</code>
        </v-alert>
        <v-alert type="error" text v-else-if="promptInfoError">
          Nie udało się wczytać danych
          <template #append>
            <v-btn text color="error" @click="loadPromptInfo">
              Spróbuj ponownie
            </v-btn>
          </template>
        </v-alert>
        <div class="d-flex align-center justify-center mt-16 mb-16" v-else-if="!promptInfo">
          <v-progress-circular indeterminate :size="96" color="primary" />
        </div>
        <template v-else>
          <div class="pb-1 text--secondary">
            Krok <span class="primary--text">{{ step }}/5</span>
          </div>
          <v-card outlined>
            <div class="d-flex justify-center mn-16 avatar__wrapper">
              <v-badge
                :color="promptInfo.application.verified ? 'green' : 'grey'"
                offset-x="64"
                offset-y="16"
                bottom
                :content="promptInfo.application.verified ? 'Zweryfikowana' : 'Niezweryfikowana'"
                :value="step === 1"
              >
                <transition name="scale">
                  <v-sheet
                    v-if="step === 1"
                    width="128"
                    height="128"
                    class="avatar-sheet mx-4 overflow-hidden"
                    outlined
                  >
                    <v-sheet
                      class="fill-height d-flex align-center justify-center"
                      :color="promptInfo.application.iconColor"
                    >
                      <v-img
                        :src="promptInfo.application.iconUrl"
                        width="80"
                        height="80"
                        aspect-ratio="1"
                        contain
                      >
                        <template v-slot:placeholder>
                          <div class="fill-height d-flex align-center justify-center">
                            <v-icon :size="80">
                              mdi-help
                            </v-icon>
                          </div>
                        </template>
                      </v-img>
                    </v-sheet>
                  </v-sheet>
                </transition>
              </v-badge>
            </div>
            <v-window :value="step">
              <v-window-item :value="1">
                <div>
                  <div class="pt-16">
                    <h2 class="text-subtitle-1 text--secondary mt-6 mb-2 px-4">
                      Aplikacja
                      <span class="text--primary">{{ promptInfo.application.name }}</span>
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
                    <v-divider />
                  </div>
                  <v-card-actions>
                    <v-btn color="primary" text outlined :href="denyUrl">
                      Odmów
                    </v-btn>
                    <v-spacer />
                    <v-btn color="primary" @click="beginLogin">
                      Dalej
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-window-item>
              <v-window-item :value="2">
                <div>
                  <v-card-actions>
                    <v-btn color="primary" text outlined @click="goBack">
                      Wróć
                    </v-btn>
                    <v-spacer />
                    <v-btn color="primary">
                      Zaloguj się
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-window-item>
            </v-window>
          </v-card>
        </template>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<style lang="scss">
  .authenticate-prompt-app {
    background-color: #f7f7f7 !important;

    .avatar-sheet {
      border-radius: 50%;
    }

    .fill-height {
      height: 100%;
    }

    .avatar__wrapper {
      position: absolute;
      top: -64px;
      width: 100%;
    }

    .scale-enter-active, .scale-leave-active {
      transition: transform 0.3s;
    }
    .scale-enter, .scale-leave-to {
      transform: scale(0);
    }
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/graphql/generated';

export enum StudentsMode {
  None = 'none',
  One = 'one',
  Many = 'many',
}

export interface PromptInfo {
  scopes: string[];
  studentsMode: StudentsMode;
  application: {
    name: string;
    iconUrl: string | null;
    iconColor: string;
    verified: boolean;
  };
}

@Component({
  name: 'AuthenticatePromptApp',
})
export default class AuthenticatePromptApp extends Vue {
  promptInfo: PromptInfo | null = null;

  promptId: string | null = null;

  promptInfoError = false;

  step = 1;

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
    if (this.promptInfo === null) return undefined;
    return this.scopeDescriptions
      .filter(({ key }) => this.promptInfo?.scopes?.includes(key) ?? false);
  }

  get denyUrl() {
    if (!this.promptId) return undefined;
    return `/api/website/deny?prompt_id=${this.promptId}`;
  }

  async loadPromptInfo() {
    this.promptInfoError = false;
    this.promptInfo = null;

    if (!this.promptId) return;

    const client = new GraphQLClient('/api/website/graphql');
    const sdk = getSdk(client);

    try {
      const { promptInfo } = await sdk.GetPromptInfo({
        promptId: this.promptId,
      });
      this.promptInfo = promptInfo;
    } catch (error) {
      console.error(error);
      this.promptInfoError = true;
    }
  }

  async created() {
    const searchParams = new URLSearchParams(window.location.search);
    this.promptId = searchParams.get('prompt_id');
    if (!this.promptId) return;
    await this.loadPromptInfo();
  }

  goBack() {
    this.step -= 1;
  }

  beginLogin() {
    this.step = 2;
  }
}
</script>
