<template>
  <div>
    <v-form @submit.prevent="submit">
      <v-card-title class="d-block">Zaloguj się do konta VULCAN UONET+</v-card-title>
      <div class="mx-4">
        <v-select v-model="host" label="Odmiana dziennika" :items="hosts" outlined />
        <v-text-field v-model="username" label="Nazwa użytkownika" outlined />
        <v-text-field v-model="password" type="password" label="Hasło" outlined />
      </div>
      <v-alert type="error" class="mx-2" :value="error === 'invalid-credentials'">
        Dane logowania są nieprawidłowe
      </v-alert>
      <v-alert type="error" class="mx-2" :value="error === 'other'">
        Podczas logowania wystąpił błąd
      </v-alert>
      <v-card-actions>
        <v-btn color="primary" text outlined @click="back" :disabled="loading">
          Wróć
        </v-btn>
        <v-spacer />
        <v-btn color="primary" :loading="loading" type="submit">
          Zaloguj się
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PromptInfo } from '@/types';
import { hasErrorCode, sdk } from '@/pages/authenticate-prompt/sdk';

@Component({
  name: 'LoginWindow',
})
export default class LoginWindow extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  readonly hosts = [
    {
      text: 'Vulcan',
      value: 'vulcan.net.pl',
    },
    {
      text: 'Fakelog',
      value: 'fakelog.cf',
    },
  ]

  host = '';

  username = '';

  password = '';

  loading = false;

  error: 'invalid-credentials' | 'other' | null = null;

  reset() {
    this.host = 'fakelog.cf';
    this.username = '';
    this.password = '';
  }

  async submit() {
    if (this.loading) return;
    this.error = null;
    this.loading = true;
    try {
      const { login } = await sdk.Login({
        promptId: this.promptInfo.id,
        host: this.host,
        username: this.username,
        password: this.password,
      });
      const { students } = login;
      console.log(students);
      this.reset();
    } catch (error) {
      console.error(error);
      this.error = hasErrorCode(error, 'INVALID_VULCAN_CREDENTIALS') ? 'invalid-credentials' : 'other';
    }
    this.loading = false;
  }

  back() {
    if (this.loading) return;
    this.$emit('back');
  }

  created() {
    this.reset();
  }
}
</script>
