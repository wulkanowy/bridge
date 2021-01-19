export enum StudentsMode {
  None = 'none',
  One = 'one',
  Many = 'many',
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
  };
}
