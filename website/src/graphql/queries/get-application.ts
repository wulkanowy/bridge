import gql from 'graphql-tag';

export default gql`query GetApplication($id: String!) {
  application(id: $id) {
    name
    iconUrl
    iconColor
    homepage
    verified
  }
}`;
