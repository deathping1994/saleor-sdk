import gql from "graphql-tag";

import { orderDetailFragment } from "../fragments/order";
import { invoiceFragment } from "../fragments/invoice";

export const ordersByUser = gql`
  query OrdersByUser($perPage: Int!, $after: String) {
    me {
      orders(first: $perPage, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            lines {
              thumbnail {
                alt
                url
              }
              thumbnail2x: thumbnail(size: 510) {
                url
              }
              productName
              quantity
              totalPrice {
                net {
                  amount
                }
                gross {
                  amount
                }
              }
              variant {
                weight {
                  unit
                  value
                }
                name
                product {
                  name
                  pricing {
                    discount {
                      net {
                        amount
                      }
                    }
                    priceRange {
                      start {
                        net {
                          amount
                        }
                      }
                    }
                    priceRangeUndiscounted {
                      start {
                        net {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const orderDetailsByTokenQuery = gql`
  ${orderDetailFragment}
  query OrderByToken($token: UUID!) {
    orderByToken(token: $token) {
      ...OrderDetail
    }
  }
`;

export const userOrderDetailsByTokenQuery = gql`
  ${orderDetailFragment}
  ${invoiceFragment}
  query UserOrderByToken($token: UUID!) {
    orderByToken(token: $token) {
      ...OrderDetail
      invoices {
        ...InvoiceFragment
      }
    }
  }
`;
