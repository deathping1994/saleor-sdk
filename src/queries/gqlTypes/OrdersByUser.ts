/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL query operation: OrdersByUser
// ====================================================

export interface OrdersByUser_me_orders_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
}

export interface OrdersByUser_me_orders_edges_node_lines_thumbnail {
  __typename: "Image";
  /**
   * Alt text for an image.
   */
  alt: string | null;
  /**
   * The URL of the image.
   */
  url: string;
}

export interface OrdersByUser_me_orders_edges_node_lines_thumbnail2x {
  __typename: "Image";
  /**
   * The URL of the image.
   */
  url: string;
}

export interface OrdersByUser_me_orders_edges_node_lines_totalPrice_net {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_totalPrice_gross {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_totalPrice {
  __typename: "TaxedMoney";
  /**
   * Amount of money without taxes.
   */
  net: OrdersByUser_me_orders_edges_node_lines_totalPrice_net;
  /**
   * Amount of money including taxes.
   */
  gross: OrdersByUser_me_orders_edges_node_lines_totalPrice_gross;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_weight {
  __typename: "Weight";
  /**
   * Weight unit.
   */
  unit: WeightUnitsEnum;
  /**
   * Weight value.
   */
  value: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_discount_net {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_discount {
  __typename: "TaxedMoney";
  /**
   * Amount of money without taxes.
   */
  net: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_discount_net;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange_start_net {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange_start {
  __typename: "TaxedMoney";
  /**
   * Amount of money without taxes.
   */
  net: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange_start_net;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  /**
   * Lower bound of a price range.
   */
  start: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange_start | null;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted_start_net {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  /**
   * Amount of money without taxes.
   */
  net: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted_start_net;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  /**
   * Lower bound of a price range.
   */
  start: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted_start | null;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product_pricing {
  __typename: "ProductPricingInfo";
  /**
   * The discount amount if in sale (null otherwise).
   */
  discount: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_discount | null;
  /**
   * The discounted price range of the product variants.
   */
  priceRange: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRange | null;
  /**
   * The undiscounted price range of the product variants.
   */
  priceRangeUndiscounted: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing_priceRangeUndiscounted | null;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant_product {
  __typename: "Product";
  name: string;
  /**
   * Lists the storefront product's pricing, the current price and discounts, only meant for displaying.
   */
  pricing: OrdersByUser_me_orders_edges_node_lines_variant_product_pricing | null;
}

export interface OrdersByUser_me_orders_edges_node_lines_variant {
  __typename: "ProductVariant";
  weight: OrdersByUser_me_orders_edges_node_lines_variant_weight | null;
  name: string;
  product: OrdersByUser_me_orders_edges_node_lines_variant_product;
}

export interface OrdersByUser_me_orders_edges_node_lines {
  __typename: "OrderLine";
  /**
   * The main thumbnail for the ordered product.
   */
  thumbnail: OrdersByUser_me_orders_edges_node_lines_thumbnail | null;
  /**
   * The main thumbnail for the ordered product.
   */
  thumbnail2x: OrdersByUser_me_orders_edges_node_lines_thumbnail2x | null;
  productName: string;
  quantity: number;
  /**
   * Price of the order line.
   */
  totalPrice: OrdersByUser_me_orders_edges_node_lines_totalPrice | null;
  /**
   * A purchased product variant. Note: this field may be null if the variant has been removed from stock at all.
   */
  variant: OrdersByUser_me_orders_edges_node_lines_variant | null;
}

export interface OrdersByUser_me_orders_edges_node {
  __typename: "Order";
  /**
   * List of order lines.
   */
  lines: (OrdersByUser_me_orders_edges_node_lines | null)[];
}

export interface OrdersByUser_me_orders_edges {
  __typename: "OrderCountableEdge";
  /**
   * The item at the end of the edge.
   */
  node: OrdersByUser_me_orders_edges_node;
}

export interface OrdersByUser_me_orders {
  __typename: "OrderCountableConnection";
  /**
   * Pagination data for this connection.
   */
  pageInfo: OrdersByUser_me_orders_pageInfo;
  edges: OrdersByUser_me_orders_edges[];
}

export interface OrdersByUser_me {
  __typename: "User";
  /**
   * List of user's orders.
   */
  orders: OrdersByUser_me_orders | null;
}

export interface OrdersByUser {
  /**
   * Return the currently authenticated user.
   */
  me: OrdersByUser_me | null;
}

export interface OrdersByUserVariables {
  perPage: number;
  after?: string | null;
}
