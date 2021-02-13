import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  promptInfo: PromptInfo;
  applications: Array<Application>;
  application: Maybe<Application>;
  loginState: Maybe<LoginState>;
};

export type QueryPromptInfoArgs = {
  promptId: Scalars['String'];
};

export type QueryApplicationArgs = {
  id: Scalars['String'];
};

export type PromptInfo = {
  __typename?: 'PromptInfo';
  id: Scalars['String'];
  scopes: Array<Scalars['String']>;
  studentsMode: StudentsMode;
  application: PromptInfoApplication;
};

export enum StudentsMode {
  None = 'None',
  One = 'One',
  Many = 'Many'
}

export type PromptInfoApplication = {
  __typename?: 'PromptInfoApplication';
  name: Scalars['String'];
  iconUrl: Maybe<Scalars['String']>;
  iconColor: Scalars['String'];
  verified: Scalars['Boolean'];
  developer: GitHubUser;
  homepage: Maybe<Scalars['String']>;
};

export type GitHubUser = {
  __typename?: 'GitHubUser';
  login: Scalars['String'];
  name: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Application = {
  __typename?: 'Application';
  id: Scalars['String'];
  name: Scalars['String'];
  iconUrl: Maybe<Scalars['String']>;
  iconColor: Scalars['String'];
};

export type LoginState = {
  __typename?: 'LoginState';
  name: Maybe<Scalars['String']>;
  login: Scalars['String'];
  avatarUrl: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: CreateUserResult;
  login: LoginResult;
  setSymbol: SetSymbolResult;
  createApplication: Application;
};

export type MutationCreateUserArgs = {
  email: Scalars['String'];
  promptId: Scalars['String'];
};

export type MutationLoginArgs = {
  captchaResponse: Scalars['String'];
  host: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  promptId: Scalars['String'];
};

export type MutationSetSymbolArgs = {
  symbol: Scalars['String'];
  promptId: Scalars['String'];
};

export type MutationCreateApplicationArgs = {
  name: Scalars['String'];
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  success: Scalars['Boolean'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  symbols: Array<Scalars['String']>;
};

export type SetSymbolResult = {
  __typename?: 'SetSymbolResult';
  students: Array<LoginStudent>;
  registered: Scalars['Boolean'];
};

export type LoginStudent = {
  __typename?: 'LoginStudent';
  studentId: Scalars['Int'];
  name: Scalars['String'];
};

export type CreateApplicationMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateApplicationMutation = (
  { __typename?: 'Mutation' }
  & { createApplication: (
    { __typename?: 'Application' }
    & Pick<Application, 'id'>
  ); }
);

export type CreateUserMutationVariables = Exact<{
  promptId: Scalars['String'];
  email: Scalars['String'];
}>;

export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'CreateUserResult' }
    & Pick<CreateUserResult, 'success'>
  ); }
);

export type LoginMutationVariables = Exact<{
  promptId: Scalars['String'];
  host: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  captchaResponse: Scalars['String'];
}>;

export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'symbols'>
  ); }
);

export type SetSymbolMutationVariables = Exact<{
  promptId: Scalars['String'];
  symbol: Scalars['String'];
}>;

export type SetSymbolMutation = (
  { __typename?: 'Mutation' }
  & { setSymbol: (
    { __typename?: 'SetSymbolResult' }
    & Pick<SetSymbolResult, 'registered'>
    & { students: Array<(
      { __typename?: 'LoginStudent' }
      & Pick<LoginStudent, 'studentId' | 'name'>
    )>; }
  ); }
);

export type GetApplicationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetApplicationsQuery = (
  { __typename?: 'Query' }
  & { applications: Array<(
    { __typename?: 'Application' }
    & Pick<Application, 'id' | 'name' | 'iconUrl' | 'iconColor'>
  )>; }
);

export type GetLoginStateQueryVariables = Exact<{ [key: string]: never }>;

export type GetLoginStateQuery = (
  { __typename?: 'Query' }
  & { loginState: Maybe<(
    { __typename?: 'LoginState' }
    & Pick<LoginState, 'name' | 'avatarUrl' | 'login'>
  )>; }
);

export type GetPromptInfoQueryVariables = Exact<{
  promptId: Scalars['String'];
}>;

export type GetPromptInfoQuery = (
  { __typename?: 'Query' }
  & { promptInfo: (
    { __typename?: 'PromptInfo' }
    & Pick<PromptInfo, 'id' | 'scopes' | 'studentsMode'>
    & { application: (
      { __typename?: 'PromptInfoApplication' }
      & Pick<PromptInfoApplication, 'name' | 'iconUrl' | 'iconColor' | 'verified' | 'homepage'>
      & { developer: (
        { __typename?: 'GitHubUser' }
        & Pick<GitHubUser, 'login' | 'name' | 'url'>
      ); }
    ); }
  ); }
);

export const CreateApplicationDocument = gql`
    mutation CreateApplication($name: String!) {
  createApplication(name: $name) {
    id
  }
}
    `;
export const CreateUserDocument = gql`
    mutation CreateUser($promptId: String!, $email: String!) {
  createUser(promptId: $promptId, email: $email) {
    success
  }
}
    `;
export const LoginDocument = gql`
    mutation Login($promptId: String!, $host: String!, $username: String!, $password: String!, $captchaResponse: String!) {
  login(
    host: $host
    password: $password
    username: $username
    promptId: $promptId
    captchaResponse: $captchaResponse
  ) {
    symbols
  }
}
    `;
export const SetSymbolDocument = gql`
    mutation SetSymbol($promptId: String!, $symbol: String!) {
  setSymbol(promptId: $promptId, symbol: $symbol) {
    students {
      studentId
      name
    }
    registered
  }
}
    `;
export const GetApplicationsDocument = gql`
    query GetApplications {
  applications {
    id
    name
    iconUrl
    iconColor
  }
}
    `;
export const GetLoginStateDocument = gql`
    query GetLoginState {
  loginState {
    name
    avatarUrl
    login
  }
}
    `;
export const GetPromptInfoDocument = gql`
    query GetPromptInfo($promptId: String!) {
  promptInfo(promptId: $promptId) {
    id
    scopes
    studentsMode
    application {
      name
      iconUrl
      iconColor
      verified
      homepage
      developer {
        login
        name
        url
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (sdkFunction) => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateApplication(variables: CreateApplicationMutationVariables, requestHeaders?: Headers): Promise<CreateApplicationMutation> {
      return withWrapper(() => client.request<CreateApplicationMutation>(print(CreateApplicationDocument), variables, requestHeaders));
    },
    CreateUser(variables: CreateUserMutationVariables, requestHeaders?: Headers): Promise<CreateUserMutation> {
      return withWrapper(() => client.request<CreateUserMutation>(print(CreateUserDocument), variables, requestHeaders));
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Headers): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(print(LoginDocument), variables, requestHeaders));
    },
    SetSymbol(variables: SetSymbolMutationVariables, requestHeaders?: Headers): Promise<SetSymbolMutation> {
      return withWrapper(() => client.request<SetSymbolMutation>(print(SetSymbolDocument), variables, requestHeaders));
    },
    GetApplications(variables?: GetApplicationsQueryVariables, requestHeaders?: Headers): Promise<GetApplicationsQuery> {
      return withWrapper(() => client.request<GetApplicationsQuery>(print(GetApplicationsDocument), variables, requestHeaders));
    },
    GetLoginState(variables?: GetLoginStateQueryVariables, requestHeaders?: Headers): Promise<GetLoginStateQuery> {
      return withWrapper(() => client.request<GetLoginStateQuery>(print(GetLoginStateDocument), variables, requestHeaders));
    },
    GetPromptInfo(variables: GetPromptInfoQueryVariables, requestHeaders?: Headers): Promise<GetPromptInfoQuery> {
      return withWrapper(() => client.request<GetPromptInfoQuery>(print(GetPromptInfoDocument), variables, requestHeaders));
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
