<template>
  <div>
    <v-form v-model="valid" ref="form" @submit.prevent="submit">
      <v-card-title>Dodaj adres email</v-card-title>
      <v-card-text>
        <p>
          Dodaj kontaktowy adres email, aby nie utracić dostępu do konta.<br>
          <b>Na ten adres będą wysyłane alerty bezpieczeństwa.</b>
        </p>
        <p>
          Twój email <b>nie</b> będzie używany w celach marketingowych
          i <b>nie</b> zostanie udostępniony aplikacji <b>{{ promptInfo.application.name }}</b>,
          ani żadnym podmiotom trzecim.
        </p>
        <p>
          Podany adres może być inny od adresu używanego w systemie VULCAN.
        </p>
      </v-card-text>
      <v-text-field
        label="Adres email"
        outlined
        type="email"
        class="mx-4"
        v-model="email"
        :rules="emailRules"
      />
      <v-alert type="error" class="mx-2" :value="error">
        Podczas dodawania adresu email wystąpił błąd
      </v-alert>
      <v-card-actions>
        <v-btn text outlined color="primary" @click="back" :disabled="loading">Wróć</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          type="submit"
          :disabled="!valid"
          :loading="loading"
        >
          Zapisz email
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { InputValidationRules } from 'vuetify';
import IsEmail from 'isemail';
import { PromptInfo, VForm } from '@/types';
import { sdk } from '@/pages/authenticate-prompt/sdk';

@Component({
  name: 'EmailWindow',
})
export default class EmailWindow extends Vue {
  @Ref('form') form!: VForm;

  @Prop({
    type: Object,
    required: true,
  })
  promptInfo!: PromptInfo

  valid = false;

  loading = false;

  email = '';

  error = false;

  readonly emailRules: InputValidationRules = [
    (v) => v !== '' || 'To pole jest wymagane',
    (v) => (IsEmail.validate(v) && v.trim() === v) || 'Email jest niepoprawny',
  ];

  reset(defaultValue?: string) {
    this.email = defaultValue ?? '';
    this.form.resetValidation();
  }

  back() {
    this.$emit('back');
  }

  async submit() {
    if (!this.valid || this.loading) return;
    this.loading = true;
    this.error = false;
    try {
      await sdk.CreateUser({
        promptId: this.promptInfo.id,
        email: this.email.trim(),
      });
      this.$emit('create');
    } catch (error) {
      console.error(error);
      this.error = true;
    }
    this.loading = false;
  }
}
</script>
