<template>
  <div>
    <v-form @submit.prevent="submit" v-model="formValid" ref="form">
      <v-card-title>Zaloguj się do konta VULCAN UONET+</v-card-title>
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
        <div class="overflow-x-auto">
          <vue-recaptcha
            ref="recaptcha"
            class="d-inline-block"
            :sitekey="captchaSiteKey"
            @verify="captchaVerify"
            @expired="captchaReset()"
            @error="captchaReset()"
          />
        </div>
      </div>
      <v-alert type="error" class="mx-2" :value="errorMessage !== null">
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-btn color="primary" text outlined @click="back" :disabled="loading">
          Wróć
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="loading"
          type="submit"
          :disabled="!formValid || !this.captchaResponse"
        >
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
import { PromptInfo, VForm } from '@/types';
import { hasErrorCode, sdk } from '@/pages/authenticate-prompt/sdk';
import { InputValidationRules } from 'vuetify';
import VueRecaptcha from 'vue-recaptcha';
import { requireEnv } from '@/utils';

@Component({
  name: 'LoginWindow',
  components: {
    VueRecaptcha,
  },
})
export default class LoginWindow extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  @Ref('form') form!: VForm;

  @Ref('recaptcha') recaptcha!: VueRecaptcha;

  readonly captchaSiteKey = requireEnv('VUE_APP_CAPTCHA_SITE_KEY');

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

  captchaResponse: string | null = null;

  loading = false;

  error: 'invalid-credentials' | 'other' | 'captcha' | null = null;

  reset() {
    this.host = 'fakelog.cf';
    this.username = '';
    this.password = '';
    this.form.resetValidation();
    this.recaptcha.reset();
    this.captchaResponse = null;
  }

  captchaVerify(response: string) {
    this.captchaResponse = response;
  }

  captchaReset() {
    this.captchaResponse = null;
  }

  async submit() {
    if (this.loading || !this.formValid || !this.captchaResponse) return;
    this.error = null;
    this.loading = true;
    const username = this.username.trim();
    const host = this.host.trim();
    try {
      const { login } = await sdk.Login({
        promptId: this.promptInfo.id,
        host,
        username,
        password: this.password,
        captchaResponse: this.captchaResponse,
      });
      const { symbols } = login;
      this.$emit('login', { symbols, username });
      this.reset();
    } catch (error) {
      this.recaptcha.reset();
      console.error(error);
      if (hasErrorCode(error, 'INVALID_VULCAN_CREDENTIALS')) this.error = 'invalid-credentials';
      if (hasErrorCode(error, 'CAPTCHA_ERROR')) this.error = 'captcha';
      else this.error = 'other';
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

  get errorMessage() {
    if (this.error === null) return null;
    if (this.error === 'invalid-credentials') return 'Dane logowania są nieprawidłowe';
    if (this.error === 'captcha') return 'Błąd weryfikacji';
    return 'Podczas logowania wystąpił błąd';
  }
}
</script>
