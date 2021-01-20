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
  };
}

export interface Student {
  studentId: string;
  name: string;
}
