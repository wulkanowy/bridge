import gql from 'graphql-tag';

export default gql`mutation CreateUser($promptId: String!, $email: String!) {
  createUser(promptId: $promptId, email: $email) {
    success
  }
}
`;
