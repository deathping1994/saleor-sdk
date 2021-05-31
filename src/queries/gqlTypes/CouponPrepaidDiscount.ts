/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CouponPrepaidDiscount
// ====================================================

export interface CouponPrepaidDiscount_checkoutDiscounts {
  __typename: "DiscountsType";
  prepaidDiscount: any | null;
  couponDiscount: any | null;
  cashbackDiscount: any | null;
}

export interface CouponPrepaidDiscount {
  checkoutDiscounts: CouponPrepaidDiscount_checkoutDiscounts | null;
}

export interface CouponPrepaidDiscountVariables {
  token: any;
}
