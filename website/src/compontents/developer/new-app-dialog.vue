<template>
  <v-dialog v-model="value" max-width="450" :persistent="loading">
    <template #activator="{ on }">
      <slot :on="on" name="activator" />
    </template>
    <v-card>
      <v-form @submit.prevent="submit">
        <v-card-title>
          Create new application
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            label="Application name"
            hint="Users will see this name"
            persistent-hint
            autofocus
            outlined
            counter="32"
            :counter-value="(v) => v.trim().length"
            v-model="name"
          />
          <v-alert type="error" class="mb-0 mt-2" :value="error">
            An error occured
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="value = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            type="submit"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { sdk } from '@/pages/authenticate-prompt/sdk';

@Component({
  name: 'NewAppDialog',
})
export default class NewAppDialog extends Vue {
  value = false;

  name = '';

  loading = false;

  error = false;

  @Watch('value')
  valueChanged(value: boolean) {
    if (!value) this.name = '';
  }

  get valid() {
    return this.name.trim().length >= 3 && this.name.trim().length <= 32;
  }

  async submit() {
    if (!this.valid || this.loading) return;
    this.loading = true;
    this.error = false;
    try {
      const result = await sdk.CreateApplication({
        name: this.name.trim(),
      });
      await this.$router.push(`/apps/${result.createApplication.id}`);
      this.value = false;
    } catch (error) {
      console.error(error);
      this.error = true;
    }
    this.loading = false;
  }
}
</script>t
