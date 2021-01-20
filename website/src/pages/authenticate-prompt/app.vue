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
            Krok <span class="primary--text">{{ step }}/3</span>
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
                <overview-window
                  :promptInfo="promptInfo"
                  @next="toLoginWindow"
                />
              </v-window-item>
              <v-window-item :value="2" eager>
                <login-window
                  ref="loginWindow"
                  :prompt-info="promptInfo"
                  @login="login"
                  @back="loginBack"
                />
              </v-window-item>
              <v-window-item :value="3">
                <students-window
                  v-if="students !== null"
                  :prompt-info="promptInfo"
                  :students="students"
                  @back="toLoginWindow"
                />
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

    .v-card__text, .v-card__title {
      word-break: normal;
    }
  }
</style>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import OverviewWindow from '@/compontents/authenticate-prompt-windows/overview-window.vue';
import { PromptInfo, Student } from '@/types';
import LoginWindow from '@/compontents/authenticate-prompt-windows/login-window.vue';
import StudentsWindow from '@/compontents/authenticate-prompt-windows/students-window.vue';
import { sdk } from '@/pages/authenticate-prompt/sdk';

@Component({
  name: 'AuthenticatePromptApp',
  components: { LoginWindow, OverviewWindow, StudentsWindow },
})
export default class AuthenticatePromptApp extends Vue {
  @Ref() readonly loginWindow!: LoginWindow

  promptInfo: PromptInfo | null = null;

  promptId: string | null = null;

  promptInfoError = false;

  students: Student[] | null = null;

  step = 1;

  async loadPromptInfo() {
    this.promptInfoError = false;
    this.promptInfo = null;

    if (!this.promptId) return;

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

  toLoginWindow() {
    this.step = 2;
    this.loginWindow.reset();
    this.students = null;
  }

  loginBack() {
    this.step = 1;
  }

  login({ students }: { students: Student[] }) {
    this.students = students;
    this.step = 3;
  }
}
</script>
