import gql from "graphql-tag";

import {
  checkoutFragment,
  checkoutProductVariantFragment,
} from "../fragments/checkout";

export const checkoutDetails = gql`
  ${checkoutFragment}
  query CheckoutDetails($token: UUID!) {
    checkout(token: $token) {
      ...Checkout
    }
  }
`;

export const userCheckoutDetails = gql`
  ${checkoutFragment}
  query UserCheckoutDetails {
    me {
      id
      checkout {
        ...Checkout
      }
    }
  }
`;

export const checkoutProductVariants = gql`
  ${checkoutProductVariantFragment}
  query CheckoutProductVariants($ids: [ID]) {
    productVariants(ids: $ids, first: 100) {
      edges {
        node {
          ...ProductVariant
        }
      }
    }
  }
`;

export const GetCouponPrepaidDiscount = gql`
  query CouponPrepaidDiscount($token: UUID!) {
    checkoutDiscounts(token: $token) {
      prepaidDiscount
      couponDiscount
      cashbackDiscount
    }
    cashback(checkoutToken: $token) {
      amount
      willAddOn
    }
  }
`;
