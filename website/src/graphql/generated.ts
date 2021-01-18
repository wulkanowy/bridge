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
  encryptedPrivateKey: Scalars['String'];
  students: Array<LoginResultStudent>;
};

export type LoginResultStudent = {
  __typename?: 'LoginResultStudent';
  studentId: Scalars['Int'];
  name: Scalars['String'];
};

export type GetPromptInfoQueryVariables = Exact<{
  promptId: Scalars['String'];
}>;

export type GetPromptInfoQuery = (
  { __typename?: 'Query' }
  & { promptInfo: (
    { __typename?: 'PromptInfo' }
    & Pick<PromptInfo, 'scopes' | 'studentsMode'>
    & { application: (
      { __typename?: 'PromptInfoApplication' }
      & Pick<PromptInfoApplication, 'name' | 'iconUrl' | 'iconColor' | 'verified'>
    ); }
  ); }
);

export const GetPromptInfoDocument = gql`
    query GetPromptInfo($promptId: String!) {
  promptInfo(promptId: $promptId) {
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
    GetPromptInfo(variables: GetPromptInfoQueryVariables, requestHeaders?: Headers): Promise<GetPromptInfoQuery> {
      return withWrapper(() => client.request<GetPromptInfoQuery>(print(GetPromptInfoDocument), variables, requestHeaders));
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
