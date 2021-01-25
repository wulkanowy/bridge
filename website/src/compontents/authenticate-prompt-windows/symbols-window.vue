<template>
  <div>
    <v-form ref="form" @submit.prevent="submit">
      <v-card-title>Wybierz symbol</v-card-title>
      <v-list subheader>
        <v-list-item-group
          v-model="selectedSymbol"
          color="primary"
          :mandatory="selectedSymbol !== null"
        >
          <v-list-item
            v-for="symbol in symbols"
            :key="symbol"
            :value="symbol"
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-icon v-if="active">$radioOn</v-icon>
                <v-icon v-else>$radioOff</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ symbol }}
                  <span class="text--secondary" v-if="symbols.length === 1">(domyślny)</span>
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
          <v-list-item :value="customSymbolMode">
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-icon v-if="active">$radioOn</v-icon>
                <v-icon v-else>$radioOff</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Własny symbol</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-icon>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-expand-transition>
        <div v-if="selectedSymbol === customSymbolMode">
          <v-text-field
            outlined
            label="Własny symbol"
            v-model="customSymbol"
            class="mx-4 mt-2"
            :readonly="loading"
          />
        </div>
      </v-expand-transition>
      <v-alert type="error" class="mx-2" :value="errorMessage !== null">
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-btn color="primary" text outlined @click="back" :disabled="loading">
          Wróć
        </v-btn>
        <v-spacer />
        <v-btn color="primary" type="submit" :loading="loading" :disabled="!valid">
          Wybierz
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

// This is a JS Symbol, not a diary symbol
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
const customSymbolMode = Symbol('Custom symbol mode');

@Component({
  name: 'SymbolsWindow',
})
export default class SymbolsWindow extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  symbols!: string[];

  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo;

  @Ref('form') form!: VForm;

  selectedSymbol: string | typeof customSymbolMode | null = null;

  readonly customSymbolMode: typeof customSymbolMode = customSymbolMode;

  customSymbol = '';

  loading = false;

  error: 'invalid-symbol' | 'other' | null = null;

  get valid() {
    if (!this.selectedSymbol) return false;
    if (this.selectedSymbol === this.customSymbolMode) {
      if (this.customSymbol.trim() === '') return false;
    }
    return true;
  }

  reset() {
    this.customSymbol = '';
    if (this.symbols?.length === 1) this.selectedSymbol = this.symbols[0];
    else if (this.symbols?.length === 0) this.selectedSymbol = this.customSymbolMode;
    else this.selectedSymbol = null;
    if (this.form) this.form.resetValidation();
  }

  async submit() {
    if (!this.valid || this.loading || !this.selectedSymbol) return;
    this.loading = true;
    this.error = null;
    try {
      const symbol = (this.selectedSymbol === this.customSymbolMode
        ? this.customSymbol
        : this.selectedSymbol
      ).trim();
      const { setSymbol } = await sdk.SetSymbol({
        promptId: this.promptInfo.id,
        symbol,
      });
      this.$emit('set-symbol', {
        students: setSymbol.students,
        registered: setSymbol.registered,
      });
    } catch (error) {
      if (hasErrorCode(error, 'INVALID_SYMBOL')) this.error = 'invalid-symbol';
      else this.error = 'other';
    }
    this.loading = false;
  }

  back() {
    this.$emit('back');
  }

  created() {
    this.reset();
  }

  get errorMessage() {
    if (this.error === null) return null;
    if (this.error === 'invalid-symbol') return 'Błędny symbol';
    return 'Podczas wybierania symbolu wystąpił błąd';
  }
}
</script>
