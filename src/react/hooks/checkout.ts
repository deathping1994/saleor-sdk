import { GET_LOCAL_CHECKOUT } from "../../apollo/queries";
import {
  GetLocalCheckoutQuery,
  GetLocalCheckoutQueryVariables,
} from "../../apollo/types";
import { hookFactory } from "../helpers/hookFactory";
import { hookStateFactory } from "../helpers/hookStateFactory";

export const useCheckout = hookFactory("checkout");

export const useCheckoutState = () => {
  const { data } = hookStateFactory<
    GetLocalCheckoutQuery,
    GetLocalCheckoutQueryVariables
  >(GET_LOCAL_CHECKOUT);
  console.log("useCheckoutState sdk 10", data);
  if (!data) {
    throw new Error(
      "Cache query result is undefined. Invalid cache configuration."
    );
  }

  return {
    checkout: data.localCheckout,
    loaded: true,

    promoCodeDiscount: {
      voucherCode: data.localCheckout?.voucherCode,
      discount: data.localCheckout?.discount,
      discountName: data.localCheckout?.discountName,
    },

    availableShippingMethods: data.localCheckout?.availableShippingMethods,

    availablePaymentGateways: data.localCheckout?.availablePaymentGateways,

    useCashback: data.useCashback,
    checkoutLoading: data.checkoutLoading,
  };
};