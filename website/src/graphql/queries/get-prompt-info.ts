import gql from 'graphql-tag';

export default gql`query GetPromptInfo($promptId: String!) {
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
}`;
