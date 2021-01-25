<template>
  <div>
    <v-card-title
      v-if="mode === StudentsMode.One"
    >
      Wybierz ucznia
    </v-card-title>
    <v-card-title
      v-else
    >
      Wybierz uczniów
    </v-card-title>
    <v-alert
      v-if="mode === StudentsMode.None"
      type="info"
      text
      class="mx-2"
    >
      Aplikacja nie wymaga dostępu do dzienników uczniów
    </v-alert>
    <v-list v-else subheader>
      <v-list-item-group
        v-model="studentsValue"
        :multiple="mode === StudentsMode.Many"
        color="primary"
      >
        <v-list-item
          v-for="student in students"
          :key="student.studentId"
          :value="student.studentId"
        >
          <template v-slot:default="{ active }">
            <v-list-item-action>
              <v-icon v-if="active">
                {{ mode === StudentsMode.Many ? '$checkboxOn' : '$radioOn' }}
              </v-icon>
              <v-icon v-else>
                {{ mode === StudentsMode.Many ? '$checkboxOff' : '$radioOff' }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ student.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-card-actions>
      <v-btn color="primary" text outlined @click="back">
        Wróć
      </v-btn>
      <v-spacer />
      <v-btn color="primary" :href="allowUrl" type="submit" :disabled="!valid">
        Przydziel dostęp
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PromptInfo, Student, StudentsMode } from '@/types';

@Component({
  name: 'StudentsWindow',
})
export default class StudentsWindow extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  promptInfo!: PromptInfo

  @Prop({
    required: true,
    type: Array,
  })
  students!: Student[]

  readonly StudentsMode = StudentsMode;

  get mode() {
    return this.promptInfo.studentsMode;
  }

  get studentsValue() {
    if (this.mode === StudentsMode.One) {
      return this.pickedStudents[0] ?? undefined;
    }
    return this.pickedStudents;
  }

  set studentsValue(value: string[] | string | undefined) {
    if (value === undefined) this.pickedStudents = [];
    else if (value instanceof Array) this.pickedStudents = value;
    else this.pickedStudents = [value];
  }

  pickedStudents: string[] = [];

  get valid() {
    if (this.mode === StudentsMode.None) return this.pickedStudents.length === 0;
    if (this.mode === StudentsMode.One) return this.pickedStudents.length === 1;
    if (this.mode === StudentsMode.Many) return this.pickedStudents.length >= 1;
    return false;
  }

  get allowUrl() {
    if (!this.valid) return null;
    if (this.mode === StudentsMode.None) return `/api/website/allow?prompt_id=${this.promptInfo.id}`;
    const studentIds = this.pickedStudents.map(encodeURIComponent).join('+');
    return `/api/website/allow?prompt_id=${this.promptInfo.id}&student_ids=${studentIds}`;
  }

  back() {
    this.$emit('back');
  }
}
</script>
