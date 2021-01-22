<template>
  <dialog-app>
    <v-card outlined>
      <v-card-title>Podczas autoryzacji wystąpił błąd</v-card-title>
      <v-card-text>
        <v-alert text type="error">
          {{ errorMessage }}<br>
          <code
            v-if="errorDescription !== null"
            class="d-block mt-3 py-2 px-sm-3"
          >
            {{ errorDescription }}
          </code>
        </v-alert>
        Skontaktuj się z twórcą aplikacji w celu rozwiązania problemu
      </v-card-text>
    </v-card>
  </dialog-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DialogApp from '@/compontents/dialog-app.vue';

@Component({
  name: 'PromptErrorApp',
  components: { DialogApp },
})
export default class PromptErrorApp extends Vue {
  errorCode: string | null = null;

  errorDescription: string | null = null;

  get errorMessage() {
    if (this.errorCode === 'invalid_request') return 'Niepoprawny format zapytania';
    if (this.errorCode === 'internal') return 'Błąd serwera';
    if (this.errorCode === 'unknown_application') return 'Nie znaleziono aplikacji';
    if (this.errorCode === 'unknown_redirect_uri') return 'Niepoprawne URI przekierowania';
    return 'Nieznany błąd';
  }

  async created() {
    const searchParams = new URLSearchParams(window.location.search);
    this.errorCode = searchParams.get('code');
    this.errorDescription = searchParams.get('description');
  }
}
</script>
