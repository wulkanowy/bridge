import gql from 'graphql-tag';

export default gql`mutation ModifyApplication($id: String!, $name: String!, $homepage: String) {
  modifyApplication(id: $id, name: $name, homepage: $homepage) {
    name
    iconUrl
    iconColor
    homepage
    verified
  }
}
`;
