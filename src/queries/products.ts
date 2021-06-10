import gql from "graphql-tag";

import { pageInfo } from "../fragments/pageInfo";
import {
  baseProductFragment,
  productFragment,
  productPricingFragment,
  productVariantFragment,
  selectedAttributeFragment,
} from "../fragments/products";

export const productList = gql`
  ${baseProductFragment}
  ${productPricingFragment}
  ${pageInfo}
  query ProductList(
    $after: String
    $first: Int!
    $sortBy: ProductOrder
    $filter: ProductFilterInput
  ) {
    products(after: $after, first: $first, sortBy: $sortBy, filter: $filter) {
      edges {
        node {
          ...BaseProduct
          ...ProductPricingField
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const productListCache = gql`
  ${baseProductFragment}
  ${productPricingFragment}
  ${pageInfo}
  query ProductListCache(
    $after: String
    $first: Int!
    $sortBy: ProductOrder
    $filter: ProductFilterInput
  ) {
    products(after: $after, first: $first, sortBy: $sortBy, filter: $filter) {
      edges {
        node {
          ...BaseProduct
          ...ProductPricingField
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const productDetails = gql`
  ${productFragment}
  query ProductDetails($id: ID, $slug: String) {
    product(id: $id, slug: $slug) {
      ...ProductDetails
    }
  }
`;
// export const productCacheDetails = gql`
//   ${productFragment}
//   query ProductDetailsCache($id: ID, $slug: String) {
//     product(id: $id, slug: $slug) {
//       ...ProductDetails
//     }
//   }
// `;

export const productCacheDetails = gql`
  ${baseProductFragment}
  ${selectedAttributeFragment}
  ${productVariantFragment}
  ${productPricingFragment}
  query ProductDetailsCache($id: ID!) {
    product(id: $id) {
      ...BaseProduct
      ...ProductPricingField
      descriptionJson
      metadata {
        key
        value
      }
      weight {
        unit
        value
      }
      category {
        id
        name
        slug
        products(first: 3) {
          edges {
            node {
              ...BaseProduct
              ...ProductPricingField
              variants {
                ...ProductVariantFields
              }
              metadata {
                key
                value
              }

              isAvailable
              isAvailableForPurchase
              availableForPurchase
            }
          }
        }
      }
      images {
        alt
        url
      }
      attributes {
        ...SelectedAttributeFields
      }
      variants {
        ...ProductVariantFields
      }
      seoDescription
      seoTitle
      isAvailable
      isAvailableForPurchase
      availableForPurchase
    }

    productOffers(productId: $id)
  }
`;
export const variantsProducts = gql`
  query VariantsProducts($ids: [ID]) {
    productVariants(ids: $ids, first: 100) {
      edges {
        node {
          id
          product {
            id
            productType {
              isShippingRequired
            }
          }
        }
      }
    }
  }
`;
