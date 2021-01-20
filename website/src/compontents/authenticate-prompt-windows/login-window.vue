<template>
  <div>
    <v-form @submit.prevent="submit" v-model="formValid" ref="form">
      <v-card-title class="d-block">Zaloguj się do konta VULCAN UONET+</v-card-title>
      <div class="mx-4">
        <v-select v-model="host" label="Odmiana dziennika" :items="hosts" outlined />
        <v-text-field
          v-model="username"
          label="Nazwa użytkownika"
          outlined
          :rules="requiredRules"
        />
        <v-text-field
          v-model="password"
          type="password"
          label="Hasło"
          outlined
          :rules="requiredRules"
        />
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
        <v-btn color="primary" :loading="loading" type="submit" :disabled="!formValid">
          Zaloguj się
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { PromptInfo } from '@/types';
import { hasErrorCode, sdk } from '@/pages/authenticate-prompt/sdk';
import { InputValidationRules } from 'vuetify';

interface VForm extends HTMLFormElement {
  validate(): boolean;
  resetValidation(): void;
}

@Component({
  name: 'LoginWindow',
})
export default class LoginWindow extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  @Ref('form') form!: VForm;

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

  readonly requiredRules: InputValidationRules = [
    (v) => v !== '' || 'To pole jest wymagane',
  ]

  formValid = false;

  host = '';

  username = '';

  password = '';

  loading = false;

  error: 'invalid-credentials' | 'other' | null = null;

  reset() {
    this.host = 'fakelog.cf';
    this.username = '';
    this.password = '';
    this.form.resetValidation();
  }

  async submit() {
    if (this.loading || !this.formValid) return;
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
      this.$emit('login', { students });
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

  mounted() {
    this.reset();
  }
}
</script>
