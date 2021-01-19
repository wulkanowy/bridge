import gql from 'graphql-tag';

export default gql`mutation Login($promptId: String!, $host: String!, $username: String!, $password: String!) {
  login(host: $host, password: $password, username: $username, promptId: $promptId) {
    students {
      studentId
      name
    }
  }
}
`;
