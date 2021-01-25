import gql from 'graphql-tag';

export default gql`mutation Login($promptId: String!, $host: String!, $username: String!, $password: String!, $captchaResponse: String!) {
  login(host: $host, password: $password, username: $username, promptId: $promptId, captchaResponse: $captchaResponse) {
    symbols
  }
}
`;
