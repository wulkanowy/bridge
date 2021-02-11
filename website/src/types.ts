export interface VForm extends HTMLFormElement {
  validate(): boolean;
  resetValidation(): void;
}

export enum StudentsMode {
  None = 'None',
  One = 'One',
  Many = 'Many',
}

export interface PromptInfo {
  id: string;
  scopes: string[];
  studentsMode: StudentsMode;
  application: {
    name: string;
    iconUrl: string | null;
    iconColor: string;
    verified: boolean;
    homepage: string | null;
    developer: {
      login: string;
      name: string | null;
      url: string;
    };
  };
}

export interface Student {
  studentId: string;
  name: string;
}
