<template>
  <v-sheet
    :width="circleSize"
    :height="circleSize"
    class="app-icon overflow-hidden"
    outlined
  >
    <v-sheet
      class="fill-height d-flex align-center justify-center"
      :color="color"
    >
      <v-img
        :src="url"
        :width="imgSize"
        :height="imgSize"
        aspect-ratio="1"
        contain
      >
        <template v-slot:placeholder>
          <div class="fill-height d-flex align-center justify-center">
            <v-icon :size="imgSize">
              mdi-help
            </v-icon>
          </div>
        </template>
      </v-img>
    </v-sheet>
  </v-sheet>
</template>

<style lang="scss">
  .app-icon {
    border-radius: 50% !important;
  }
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'AppIcon',
})
export default class AppIcon extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  color!: string;

  @Prop({
    type: String,
    required: true,
  })
  url!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  large!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  small!: boolean

  get circleSize() {
    if (this.large) return 128;
    if (this.small) return 64;
    return 96;
  }

  get imgSize() {
    if (this.large) return 80;
    if (this.small) return 40;
    return 60;
  }
}
</script>
