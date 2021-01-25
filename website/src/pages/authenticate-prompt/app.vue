<template>
  <dialog-app class="authenticate-prompt-app">
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
      <v-card outlined>
        <div class="d-flex justify-center mn-16 avatar__wrapper">
          <v-badge
            :color="promptInfo.application.verified ? 'green' : 'grey'"
            offset-x="64"
            offset-y="16"
            bottom
            :content="promptInfo.application.verified ? 'Zweryfikowana' : 'Niezweryfikowana'"
            :value="step === 'overview'"
          >
            <transition name="scale">
              <v-sheet
                v-if="step === 'overview'"
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
          <v-window-item value="overview">
            <overview-window
              :promptInfo="promptInfo"
              @next="toLoginWindow"
            />
          </v-window-item>
          <v-window-item value="login" eager>
            <login-window
              ref="loginWindow"
              :prompt-info="promptInfo"
              @login="login"
              @back="loginBack"
            />
          </v-window-item>
          <v-window-item value="symbols" eager>
            <symbols-window
              v-if="symbols !== null"
              ref="symbolsWindow"
              :prompt-info="promptInfo"
              :symbols="symbols"
              @back="toLoginWindow"
              @set-symbol="setSymbol"
            />
          </v-window-item>
          <v-window-item value="email" eager>
            <email-window
              ref="emailWindow"
              :prompt-info="promptInfo"
              @back="toSymbolsWindow"
              @create="createUser"
            />
          </v-window-item>
          <v-window-item value="students">
            <students-window
              v-if="students !== null"
              :prompt-info="promptInfo"
              :students="students"
              @back="toSymbolsWindow"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </template>
  </dialog-app>
</template>

<style lang="scss">
  .authenticate-prompt-app {
    .avatar-sheet {
      border-radius: 50% !important;
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
import { Component, Ref, Vue } from 'vue-property-decorator';
import OverviewWindow from '@/compontents/authenticate-prompt-windows/overview-window.vue';
import { PromptInfo, Student } from '@/types';
import LoginWindow from '@/compontents/authenticate-prompt-windows/login-window.vue';
import StudentsWindow from '@/compontents/authenticate-prompt-windows/students-window.vue';
import { sdk } from '@/pages/authenticate-prompt/sdk';
import DialogApp from '@/compontents/dialog-app.vue';
import EmailWindow from '@/compontents/authenticate-prompt-windows/email-window.vue';
import SymbolsWindow from '@/compontents/authenticate-prompt-windows/symbols-window.vue';
import IsEmail from 'isemail';

@Component({
  name: 'AuthenticatePromptApp',
  components: {
    SymbolsWindow,
    EmailWindow,
    LoginWindow,
    OverviewWindow,
    StudentsWindow,
    DialogApp,
  },
})
export default class AuthenticatePromptApp extends Vue {
  @Ref() readonly loginWindow!: LoginWindow

  @Ref() readonly emailWindow!: EmailWindow

  @Ref() readonly symbolsWindow!: SymbolsWindow

  promptInfo: PromptInfo | null = null;

  promptId: string | null = null;

  promptInfoError = false;

  students: Student[] | null = null;

  username: string | null = null;

  symbols: string[] | null = null;

  step = 'overview';

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
    this.step = 'login';
    this.loginWindow.reset();
    this.symbols = null;
    this.username = null;
  }

  toSymbolsWindow() {
    this.students = null;
    this.step = 'symbols';
    if (this.symbolsWindow) this.symbolsWindow.reset();
  }

  loginBack() {
    this.step = 'overview';
  }

  async login(
    { username, symbols }: {
      symbols: string[];
      username: string;
    },
  ) {
    this.username = username;
    this.symbols = symbols;
    this.step = 'symbols';
    if (this.symbolsWindow) this.symbolsWindow.reset();
  }

  async setSymbol({ students, registered }: {students: Student[]; registered: boolean}) {
    this.students = students;
    if (registered) this.step = 'students';
    else {
      if (this.username && IsEmail.validate(this.username)) this.emailWindow.reset(this.username);
      else this.emailWindow.reset();
      this.step = 'email';
    }
  }

  async createUser() {
    this.step = 'students';
  }
}
</script>
