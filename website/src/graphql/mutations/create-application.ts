import gql from 'graphql-tag';

export default gql`mutation CreateApplication($name: String!) {
  createApplication(name: $name) {
    id
  }
}
`;
