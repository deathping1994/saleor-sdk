/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserMetaAccess } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL query operation: UserMetaDetails
// ====================================================

export interface UserMetaDetails_userMeta_edges_node_user_metadata {
  __typename: "MetadataItem";
  /**
   * Key of a metadata item.
   */
  key: string;
  /**
   * Value of a metadata item.
   */
  value: string;
}

export interface UserMetaDetails_userMeta_edges_node_user_defaultShippingAddress_country {
  __typename: "CountryDisplay";
  /**
   * Country code.
   */
  code: string;
  /**
   * Country name.
   */
  country: string;
}

export interface UserMetaDetails_userMeta_edges_node_user_defaultShippingAddress {
  __typename: "Address";
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  /**
   * Shop's default country.
   */
  country: UserMetaDetails_userMeta_edges_node_user_defaultShippingAddress_country;
  countryArea: string;
  phone: string | null;
  /**
   * Address is user's default billing address.
   */
  isDefaultBillingAddress: boolean | null;
  /**
   * Address is user's default shipping address.
   */
  isDefaultShippingAddress: boolean | null;
}

export interface UserMetaDetails_userMeta_edges_node_user_defaultBillingAddress_country {
  __typename: "CountryDisplay";
  /**
   * Country code.
   */
  code: string;
  /**
   * Country name.
   */
  country: string;
}

export interface UserMetaDetails_userMeta_edges_node_user_defaultBillingAddress {
  __typename: "Address";
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  /**
   * Shop's default country.
   */
  country: UserMetaDetails_userMeta_edges_node_user_defaultBillingAddress_country;
  countryArea: string;
  phone: string | null;
  /**
   * Address is user's default billing address.
   */
  isDefaultBillingAddress: boolean | null;
  /**
   * Address is user's default shipping address.
   */
  isDefaultShippingAddress: boolean | null;
}

export interface UserMetaDetails_userMeta_edges_node_user_addresses_country {
  __typename: "CountryDisplay";
  /**
   * Country code.
   */
  code: string;
  /**
   * Country name.
   */
  country: string;
}

export interface UserMetaDetails_userMeta_edges_node_user_addresses {
  __typename: "Address";
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  /**
   * Shop's default country.
   */
  country: UserMetaDetails_userMeta_edges_node_user_addresses_country;
  countryArea: string;
  phone: string | null;
  /**
   * Address is user's default billing address.
   */
  isDefaultBillingAddress: boolean | null;
  /**
   * Address is user's default shipping address.
   */
  isDefaultShippingAddress: boolean | null;
}

export interface UserMetaDetails_userMeta_edges_node_user {
  __typename: "User";
  /**
   * The ID of the object.
   */
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  /**
   * List of public metadata items. Can be accessed without permissions.
   */
  metadata: (UserMetaDetails_userMeta_edges_node_user_metadata | null)[];
  defaultShippingAddress: UserMetaDetails_userMeta_edges_node_user_defaultShippingAddress | null;
  defaultBillingAddress: UserMetaDetails_userMeta_edges_node_user_defaultBillingAddress | null;
  /**
   * List of all user's addresses.
   */
  addresses: (UserMetaDetails_userMeta_edges_node_user_addresses | null)[] | null;
}

export interface UserMetaDetails_userMeta_edges_node_company {
  __typename: "CompanyType";
  /**
   * The ID of the object.
   */
  id: string;
  companyName: string | null;
}

export interface UserMetaDetails_userMeta_edges_node_categories_edges_node {
  __typename: "Category";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
}

export interface UserMetaDetails_userMeta_edges_node_categories_edges {
  __typename: "CategoryCountableEdge";
  /**
   * The item at the end of the edge.
   */
  node: UserMetaDetails_userMeta_edges_node_categories_edges_node;
}

export interface UserMetaDetails_userMeta_edges_node_categories {
  __typename: "CategoryCountableConnection";
  edges: UserMetaDetails_userMeta_edges_node_categories_edges[];
}

export interface UserMetaDetails_userMeta_edges_node {
  __typename: "UserMetaType";
  /**
   * The ID of the object.
   */
  id: string;
  user: UserMetaDetails_userMeta_edges_node_user | null;
  company: UserMetaDetails_userMeta_edges_node_company | null;
  department: string | null;
  designation: string | null;
  access: UserMetaAccess | null;
  categories: UserMetaDetails_userMeta_edges_node_categories;
}

export interface UserMetaDetails_userMeta_edges {
  __typename: "UserMetaTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: UserMetaDetails_userMeta_edges_node | null;
}

export interface UserMetaDetails_userMeta {
  __typename: "UserMetaTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (UserMetaDetails_userMeta_edges | null)[];
}

export interface UserMetaDetails {
  userMeta: UserMetaDetails_userMeta | null;
}

export interface UserMetaDetailsVariables {
  id?: string | null;
  userType?: string | null;
  companyId?: string | null;
}
