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
};

export type QueryPromptInfoArgs = {
  promptId: Scalars['String'];
};

export type PromptInfo = {
  __typename?: 'PromptInfo';
  id: Scalars['String'];
  scopes: Array<Scalars['String']>;
  clientId: Scalars['String'];
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
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResult;
};

export type MutationLoginArgs = {
  host: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  promptId: Scalars['String'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  students: Array<LoginResultStudent>;
};

export type LoginResultStudent = {
  __typename?: 'LoginResultStudent';
  studentId: Scalars['Int'];
  name: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  promptId: Scalars['String'];
  host: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResult' }
    & { students: Array<(
      { __typename?: 'LoginResultStudent' }
      & Pick<LoginResultStudent, 'studentId' | 'name'>
    )>; }
  ); }
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
      & Pick<PromptInfoApplication, 'name' | 'iconUrl' | 'iconColor' | 'verified'>
    ); }
  ); }
);

export const LoginDocument = gql`
    mutation Login($promptId: String!, $host: String!, $username: String!, $password: String!) {
  login(
    host: $host
    password: $password
    username: $username
    promptId: $promptId
  ) {
    students {
      studentId
      name
    }
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
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (sdkFunction) => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Login(variables: LoginMutationVariables, requestHeaders?: Headers): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(print(LoginDocument), variables, requestHeaders));
    },
    GetPromptInfo(variables: GetPromptInfoQueryVariables, requestHeaders?: Headers): Promise<GetPromptInfoQuery> {
      return withWrapper(() => client.request<GetPromptInfoQuery>(print(GetPromptInfoDocument), variables, requestHeaders));
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
