import gql from 'graphql-tag';

export const getViewerQuery = gql`query GetViewer {
  viewer {
    login
    id
  }
}
`;

export interface Viewer {
  login: string;
  id: string;
}

export interface GetViewerQueryResult {
  viewer: Viewer
}
