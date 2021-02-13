import gql from 'graphql-tag';

export default gql`query GetApplications {
  applications {
    id
    name
    iconUrl
    iconColor
  }
}`;
