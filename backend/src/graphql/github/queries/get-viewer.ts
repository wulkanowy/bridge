import gql from 'graphql-tag';

export const getViewerQuery = gql`query GetViewer {
  viewer {
    login
    name
    avatarUrl
    id
  }
}
`;

export interface Viewer {
  login: string;
  name: string | null;
  avatarUrl: string;
  id: string;
}

export interface GetViewerQueryResult {
  viewer: Viewer
}
