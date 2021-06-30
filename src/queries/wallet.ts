import gql from "graphql-tag";

export const GetWalletAmount = gql`
  query GetWallet {
    wallet {
      id
      amount
    }
  }
`;
