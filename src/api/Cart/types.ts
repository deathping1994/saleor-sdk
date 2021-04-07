import {
  ICheckoutModelLine,
  ICheckoutModelPrice,
  ICheckoutModelPriceValue,
} from "../../helpers/LocalStorageHandler";

export type IItems = ICheckoutModelLine[] | null | undefined;
export type ITotalPrice = ICheckoutModelPrice | null | undefined;
export type ISubtotalPrice = ICheckoutModelPrice | null | undefined;
export type IShippingPrice = ICheckoutModelPriceValue | null | undefined;
export type IDiscount = ICheckoutModelPriceValue | null | undefined;
export type IMrp = ICheckoutModelPriceValue | null | undefined;
export type INetPrice = ICheckoutModelPriceValue | null | undefined;
export type IItemDiscount = ICheckoutModelPriceValue | null | undefined;
export type IOfferDiscount = ICheckoutModelPriceValue | null | undefined;
