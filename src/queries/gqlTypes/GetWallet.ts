/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWallet
// ====================================================

export interface GetWallet_wallet {
  __typename: "WalletType";
  /**
   * The ID of the object.
   */
  id: string;
  amount: number;
}

export interface GetWallet {
  wallet: GetWallet_wallet | null;
}
