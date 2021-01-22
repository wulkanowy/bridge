import gql from 'graphql-tag';

export default gql`query GetPromptInfo($promptId: String!) {
  promptInfo(promptId: $promptId) {
    id
    scopes
    studentsMode
    application {
      name
      iconUrl
      iconColor
      verified
      homepage
      owner {
        login
        name
        url
      }
    }
  }
}
`;
