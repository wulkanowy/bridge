import gql from 'graphql-tag';

export default gql`mutation SetSymbol($promptId: String!, $symbol: String!) {
  setSymbol(promptId: $promptId, symbol: $symbol) {
    students {
      studentId
      name
    }
    registered
  }
}
`;
