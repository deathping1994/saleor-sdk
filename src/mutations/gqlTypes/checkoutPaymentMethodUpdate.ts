/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CheckoutErrorCode } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL mutation operation: checkoutPaymentMethodUpdate
// ====================================================

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_discount {
  __typename: "Money";
  /**
   * Amount of money.
   */
  amount: number;
  /**
   * Currency code.
   */
  currency: string;
}

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_availablePaymentGateways_config {
  __typename: "GatewayConfigLine";
  /**
   * Gateway config key.
   */
  field: string;
  /**
   * Gateway config value for key.
   */
  value: string | null;
}

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_availablePaymentGateways {
  __typename: "PaymentGateway";
  /**
   * Payment gateway ID.
   */
  id: string;
  /**
   * Payment gateway name.
   */
  name: string;
  /**
   * Payment gateway client configuration.
   */
  config: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_availablePaymentGateways_config[];
  /**
   * Payment gateway supported currencies.
   */
  currencies: (string | null)[];
}

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout {
  __typename: "Checkout";
  /**
   * The ID of the object.
   */
  id: string;
  discount: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_discount | null;
  /**
   * List of available payment gateways.
   */
  availablePaymentGateways: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout_availablePaymentGateways[];
}

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkoutErrors {
  __typename: "CheckoutError";
  /**
   * Name of a field that caused the error. A value of `null` indicates that the
   * error isn't associated with a particular field.
   */
  field: string | null;
  /**
   * The error message.
   */
  message: string | null;
  /**
   * The error code.
   */
  code: CheckoutErrorCode;
}

export interface checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate {
  __typename: "UpdatePaymentMethod";
  /**
   * A checkout instance.
   */
  checkout: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkout | null;
  checkoutErrors: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate_checkoutErrors[];
}

export interface checkoutPaymentMethodUpdate {
  /**
   * Create a new banner
   */
  checkoutPaymentMethodUpdate: checkoutPaymentMethodUpdate_checkoutPaymentMethodUpdate | null;
}

export interface checkoutPaymentMethodUpdateVariables {
  checkoutId: string;
  gatewayId: string;
}
