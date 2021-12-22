import { LocalStorageManager } from "../../data";
import { ErrorListener } from "../../helpers";
import { ICheckoutModel } from "../../helpers/LocalStorageHandler";
import { JobsManager } from "../../jobs";
import { ErrorCartTypes } from "../../jobs/Cart";
import { SaleorState, SaleorStateLoaded } from "../../state";
import { ISaleorStateSummeryPrices, StateItems } from "../../state/types";
import { ApolloClientManager } from "../../data/ApolloClientManager";
import { sortCheckoutLines } from "./utils";

import {
  ICashbackDiscount,
  ICashbackRecieve,
  IDiscount,
  IItemDiscount,
  IItems,
  IMrp,
  INetPrice,
  IOfferDiscount,
  IPrepaidDiscount,
  IShippingPrice,
  ISubtotalPrice,
  ITotalPrice,
} from "./types";

export class SaleorCartAPI extends ErrorListener {
  loaded: boolean;

  items: IItems;

  totalPrice: ITotalPrice;

  subtotalPrice: ISubtotalPrice;

  shippingPrice: IShippingPrice;

  discount?: IDiscount;

  mrp?: IMrp;

  netPrice?: INetPrice;

  itemDiscount?: IItemDiscount;

  offerDiscount?: IOfferDiscount;

  prepaidDiscount?: IPrepaidDiscount;

  cashbackDiscount?: ICashbackDiscount;

  cashbackRecieve?: ICashbackRecieve;

  private apolloClientManager: ApolloClientManager;

  private jobsManager: JobsManager;

  private localStorageManager: LocalStorageManager;

  private saleorState: SaleorState;

  constructor(
    localStorageManager: LocalStorageManager,
    apolloClientManager: ApolloClientManager,
    saleorState: SaleorState,
    jobsManager: JobsManager
  ) {
    super();
    this.saleorState = saleorState;
    this.localStorageManager = localStorageManager;
    this.apolloClientManager = apolloClientManager;
    this.jobsManager = jobsManager;

    this.loaded = false;

    this.jobsManager.attachErrorListener("cart", this.fireError);

    this.saleorState.subscribeToChange(
      StateItems.CHECKOUT,
      (checkout: ICheckoutModel) => {
        this.items = checkout?.lines
          ?.filter(line => line.quantity > 0)
          .sort(sortCheckoutLines);
      }
    );
    this.saleorState.subscribeToChange(
      StateItems.SUMMARY_PRICES,

      (checkoutWithSummaryPrices: {
        summaryPrices: ISaleorStateSummeryPrices;
        checkout: ICheckoutModel;
      }) => {
        const {
          totalPrice,
          subtotalPrice,
          shippingPrice,
          discount,
          mrp,
          netPrice,
          itemDiscount,
          offerDiscount,
          prepaidDiscount,
          cashbackDiscount,
          cashbackRecieve,
        } = checkoutWithSummaryPrices.summaryPrices || {};
        this.totalPrice = totalPrice;
        this.subtotalPrice = subtotalPrice;
        this.shippingPrice = shippingPrice;
        this.discount = discount;
        this.mrp = mrp;
        this.netPrice = netPrice;
        this.itemDiscount = itemDiscount;
        this.offerDiscount = offerDiscount;
        this.prepaidDiscount = prepaidDiscount;
        this.cashbackDiscount = cashbackDiscount;
        this.cashbackRecieve = cashbackRecieve;
        this.items = checkoutWithSummaryPrices.checkout?.lines
          ?.filter(line => line.quantity > 0)
          .sort(sortCheckoutLines);
      }
    );
    this.saleorState.subscribeToChange(
      StateItems.LOADED,
      (loaded: SaleorStateLoaded) => {
        this.loaded = loaded.checkout && loaded.summaryPrices;
      }
    );
  }

  addItem = async (variantId: string, quantity: number) => {
    // 1. save in local storage
    this.localStorageManager.addItemToCart(variantId, quantity);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      // console.log("in sdk", data);

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      const { data, error } = await this.jobsManager.addToQueue(
        "cart",
        "setCartItem"
      );

      // console.log("in sdk", data, error);
      if (error) {
        this.localStorageManager.removeItemFromCart(variantId);
        return {
          error,
        };
      }

      return {
        data,
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  removeItem = async (variantId: string, quantity: number) => {
    // 1. save in local
    this.localStorageManager.removeItemFromCart(variantId);
    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      const { error } = await this.jobsManager.addToQueue(
        "cart",
        "setCartItem"
      );
      if (error) {
        this.localStorageManager.addItemToCart(variantId, quantity);
        return {
          error,
        };
      }
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  subtractItem = async (variantId: string) => {
    // 1. save in local storage
    this.localStorageManager.subtractItemFromCart(variantId);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      const { error } = await this.jobsManager.addToQueue(
        "cart",
        "setCartItem"
      );
      if (error) {
        return {
          error,
        };
      }
      return {
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };

  updateItem = async (
    variantId: string,
    quantity: number,
    prevQuantity: number
  ) => {
    // 1. save in local storage
    this.localStorageManager.updateItemInCart(variantId, quantity);

    // 2. save online if possible (if checkout id available)
    if (this.saleorState.checkout?.lines) {
      const {
        data,
        error,
      } = await this.apolloClientManager.getRefreshedCheckoutLines(
        this.saleorState.checkout.lines
      );

      if (error) {
        this.fireError(error, ErrorCartTypes.SET_CART_ITEM);
      } else {
        this.localStorageManager.getHandler().setCheckout({
          ...this.saleorState.checkout,
          lines: data,
        });
      }
    }
    if (this.saleorState.checkout?.id) {
      const { data, error } = await this.jobsManager.addToQueue(
        "cart",
        "setCartItem"
      );
      if (error) {
        this.localStorageManager.updateItemInCart(variantId, prevQuantity);
        return {
          error,
        };
      }
      return {
        data,
        error,
        pending: true,
      };
    }
    return {
      pending: false,
    };
  };
}
