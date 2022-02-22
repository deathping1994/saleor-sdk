import gql from "graphql-tag";

import { userFragment } from "../fragments/auth";

export const getUserDetailsQuery = gql`
  ${userFragment}
  query UserDetails {
    me {
      ...User
    }
  }
`;

// export const getUserMetaDetailsQuery = gql`
//   ${userFragment}
//   query UserMetaDetails($id: ID, $userType: String, $companyId: ID) {
//     userMeta(id: $id, userType: $userType, companyId: $companyId, first: 1) {
//       edges {
//         node {
//           id
//           user {
//             ...User
//           }
//           company {
//             id
//             companyName
//           }
//           department
//           designation
//           access
//           categories(first: 100) {
//             edges {
//               node {
//                 id
//                 name
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;
