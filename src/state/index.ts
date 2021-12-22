import round from "lodash/round";

import { ApolloClientManager } from "../data/ApolloClientManager";
import { PaymentGateway } from "../fragments/gqlTypes/PaymentGateway";
import { User } from "../fragments/gqlTypes/User";
import { NamedObservable } from "../helpers";
import {
  ICheckoutModel,
  IPaymentModel,
  IWishlistModel,
  LocalStorageEvents,
  LocalStorageHandler,
  LocalStorageItems,
} from "../helpers/LocalStorageHandler";
import { JobsManager } from "../jobs";
import { Config } from "../types";
import { ISaleorStateSummeryPrices, StateItems } from "./types";
import { AuthJobsEvents } from "../jobs/Auth";
// import { BROWSER_NO_CREDENTIAL_API_MESSAGE } from "../api/Auth";

export interface SaleorStateLoaded {
  user: boolean;
  signInToken: boolean;
  checkout: boolean;
  payment: boolean;
  summaryPrices: boolean;
}

const defaultSaleorStateLoaded = {
  checkout: false,
  payment: false,
  signInToken: false,
  summaryPrices: false,
  user: false,
};

export const dummyAddress = {
  city: "delhi",
  companyName: "dummy",
  country: {
    code: "IN",
    country: "India",
  },
  countryArea: "Delhi",
  firstName: "dummy",
  id: "1",
  lastName: "dummy",
  phone: "7894561230",
  postalCode: "110006",
  streetAddress1: "dummy",
  streetAddress2: "dummy",
};

export const dummyEmail = "dummy@dummy.com";

export class SaleorState extends NamedObservable<StateItems> {
  user?: User | null;

  signInToken?: string | null;

  signInTokenRefreshing?: boolean;

  signInTokenVerifying?: boolean;

  checkout?: ICheckoutModel;

  promoCode?: string;

  selectedShippingAddressId?: string;

  selectedBillingAddressId?: string;

  payment?: IPaymentModel | null;

  summaryPrices?: ISaleorStateSummeryPrices;

  // Should be changed it in future to shop object containing payment gateways besides all the shop data
  availablePaymentGateways?: PaymentGateway[] | null;

  loaded: SaleorStateLoaded;

  wishlist?: IWishlistModel;

  private apolloClientManager: ApolloClientManager;

  private jobsManager: JobsManager;

  private localStorageHandler: LocalStorageHandler;

  constructor(
    config: Config,
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager,
    jobsManager: JobsManager
  ) {
    super();
    this.localStorageHandler = localStorageHandler;
    this.apolloClientManager = apolloClientManager;
    this.jobsManager = jobsManager;

    this.loaded = defaultSaleorStateLoaded;
    this.onSignInTokenUpdate(LocalStorageHandler.getSignInToken());

    this.subscribeStateToChanges();
    this.initializeState(config);
  }

  /**
   * Subscribes to particular changes occuring in data sources like apollo cache or local storage.
   * Every update in data source will result in update of respective class member.
   */
  private subscribeStateToChanges = () => {
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.CHECKOUT,
      this.onCheckoutUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.PAYMENT,
      this.onPaymentUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.TOKEN,
      this.onSignInTokenUpdate
    );

    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.WISHLIST,
      this.onWishlistUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageEvents.CLEAR,
      this.onClearLocalStorage
    );
    this.apolloClientManager.subscribeToUserChange(this.onUserUpdate);
    this.jobsManager.attachEventListener("auth", (event, value) => {
      if (event === AuthJobsEvents.SIGN_IN_TOKEN_REFRESHING) {
        this.onSignInTokenRefreshUpdate(value);
      }
    });
  };

  /**
   * Initialize class members with cached or fetched data.
   */
  private initializeState = async (config: Config) => {
    /**
     * Before making any fetch, first try to verify token if it exists.
     */
    // console.log("create checkout 1", LocalStorageHandler.getCheckout()?.id);

    if (LocalStorageHandler.getSignInToken()) {
      this.onSignInTokenVerifyingUpdate(true);
      await this.verityToken();
    }
    if (!LocalStorageHandler.getCheckout()?.id) {
      // console.log("create checkout 2", LocalStorageHandler.getCheckout()?.id);
      await this.jobsManager.run("checkout", "createCheckout", {
        email: dummyEmail,
        lines: [],
        shippingAddress: dummyAddress,
      });
    }
    this.onSignInTokenVerifyingUpdate(false);

    /**
     * Proceed with state initialization.
     */
    if (config.loadOnStart.auth) {
      await this.jobsManager.run("auth", "provideUser", undefined);
    }
    if (config.loadOnStart.checkout) {
      await this.jobsManager.run("checkout", "provideCheckout", {
        isUserSignedIn: !!this.user,
      });
      this.onPaymentUpdate(LocalStorageHandler.getPayment());
    }
    if (config.loadOnStart.wishlist) {
      if (this.user)
        await this.jobsManager.run("wishlist", "getWishlist", undefined);
    }
  };

  private verityToken = async () => {
    const { data, dataError } = await this.jobsManager.run(
      "auth",
      "verifySignInToken",
      undefined
    );

    if (dataError || !data?.isValid) {
      await this.jobsManager.run("auth", "signOut", undefined);
      // try {
      //   if (navigator.credentials?.preventSilentAccess) {
      //     await navigator.credentials.preventSilentAccess();
      //   }
      // } catch (credentialsError) {
      //   // eslint-disable-next-line no-console
      //   console.warn(BROWSER_NO_CREDENTIAL_API_MESSAGE, credentialsError);
      // }
    }
  };

  private onLoadedUpdate = (newLoaded: Partial<SaleorStateLoaded>) => {
    this.loaded = {
      ...this.loaded,
      ...newLoaded,
    };
    this.notifyChange(StateItems.LOADED, this.loaded);
  };

  private onClearLocalStorage = () => {
    this.onSignInTokenUpdate(null);
    this.onUserUpdate(null);
    this.onCheckoutUpdate();
    this.onPaymentUpdate();
    this.onWishlistUpdate();
  };

  private onSignInTokenUpdate = (token: string | null) => {
    this.signInToken = token;
    this.notifyChange(StateItems.SIGN_IN_TOKEN, this.signInToken);
    this.onLoadedUpdate({
      signInToken: true,
    });
  };

  private onSignInTokenVerifyingUpdate = (tokenVerifying: boolean) => {
    this.signInTokenVerifying = tokenVerifying;
    this.notifyChange(
      StateItems.SIGN_IN_TOKEN_VERIFYING,
      this.signInTokenVerifying
    );
  };

  private onSignInTokenRefreshUpdate = (tokenRefreshing: boolean) => {
    this.signInTokenRefreshing = tokenRefreshing;
    this.notifyChange(
      StateItems.SIGN_IN_TOKEN_REFRESHING,
      this.signInTokenRefreshing
    );
  };

  private onUserUpdate = (user: User | null) => {
    this.user = user;
    this.notifyChange(StateItems.USER, this.user);
    this.onLoadedUpdate({
      user: true,
    });
  };

  private onCheckoutUpdate = (checkout?: ICheckoutModel) => {
    this.checkout = checkout;
    console.log("onCheckoutUpdate", checkout);
    this.notifyChange(StateItems.CHECKOUT, this.checkout);

    this.calculateSummaryPrices(checkout)
      .then(res => {
        console.log("promise resolved");
        console.log(res);
        this.summaryPrices = res;
        console.log("summary prices", this.summaryPrices);

        console.log("in then promise checkout", checkout);
        const checkoutWithSummaryPrices = {
          checkout: this.checkout,
          summaryPrices: this.summaryPrices,
        };
        console.log(
          "in then promise checkoutWithSummaryPrices",
          checkoutWithSummaryPrices
        );

        this.notifyChange(StateItems.SUMMARY_PRICES, checkoutWithSummaryPrices);
      })
      .finally(() => {
        console.log("in finally promise checkout", checkout);

        this.onLoadedUpdate({
          checkout: true,
          summaryPrices: true,
        });
      });
  };

  private onWishlistUpdate = (wishlist?: IWishlistModel) => {
    this.wishlist = wishlist;
    this.notifyChange(StateItems.WISHLIST, this.wishlist);
  };

  private onPaymentUpdate = (payment?: IPaymentModel | null) => {
    this.payment = payment;
    this.notifyChange(StateItems.PAYMENT, this.payment);
    this.onLoadedUpdate({
      payment: true,
    });
  };

  private getCouponPrepaidDiscount = async (token: any) => {
    // console.log({ token });
    const { data, dataError } = await this.jobsManager.run(
      "checkout",
      "getCheckoutDiscounts",
      { token }
    );

    // console.log("in getCouponPrepaidDiscount", { data, dataError });

    if (dataError) {
      return {
        error: {
          dataError,
        },
      };
    }
    if (data && data.checkoutDiscounts)
      return {
        data: {
          cashbackDiscount: data.checkoutDiscounts.cashbackDiscout || 0,
          couponDiscount: data.checkoutDiscounts.couponDiscount || 0,
          prepaidDiscount: data.checkoutDiscounts.prepaidDiscount || 0,
        },
      };
    return {
      data: {
        cashbackDiscount: 0,
        couponDiscount: 0,
        prepaidDiscount: 0,
      },
    };
  };

  private getCashbackRecieveAmount = async (token: any) => {
    const { data, dataError } = await this.jobsManager.run(
      "checkout",
      "getCashbackRecieveAmount",
      { token }
    );
    if (dataError) {
      return {
        error: {
          dataError,
        },
      };
    }
    if (data && data.cashback)
      return {
        data: {
          cashbackRecieve: data.cashback.amount || 0,
        },
      };
    return {
      data: {
        cashbackRecieve: 0,
      },
    };
  };

  private async calculateSummaryPrices(
    checkout?: ICheckoutModel
  ): Promise<ISaleorStateSummeryPrices> {
    const freeGiftProductsRegex = /free-gift-products(-[0-9])*/;

    const items = checkout?.lines?.filter(
      line =>
        line.variant.product?.category?.slug &&
        !freeGiftProductsRegex.test(line.variant.product?.category?.slug)
    );

    if (items && items.length && items[0].quantity > 0) {
      const { data, error } =
        checkout?.token &&
        (await this.getCouponPrepaidDiscount(checkout?.token));

      const { data: cashbackRecieveData, error: cashbackRecieveError } =
        checkout?.token &&
        (await this.getCashbackRecieveAmount(checkout?.token));

      const prepaidAmount = error
        ? 0
        : round(parseFloat(data?.prepaidDiscount), 2);
      const cashbackAmount = error
        ? 0
        : round(parseFloat(data?.cashbackDiscount), 2);
      const cashbackRecieveAmount = cashbackRecieveError
        ? 0
        : round(parseFloat(cashbackRecieveData?.cashbackRecieve), 2);

      const shippingMethod = checkout?.shippingMethod;
      const promoCodeDiscount = checkout?.promoCodeDiscount?.discount;
      const firstItemTotalPrice = items[0].totalPrice;
      const firstItemMrpAmount =
        items[0].variant.product?.metadata.filter(
          metaitem => metaitem?.key === "listprice"
        )[0]?.value ||
        items[0].variant.pricing?.priceUndiscounted?.gross.amount;

      const firstItemMrp = { amount: firstItemMrpAmount, currency: "INR" };

      if (firstItemTotalPrice) {
        const shippingPrice = {
          ...shippingMethod?.price,
          amount: shippingMethod?.price?.amount || 0,
          currency:
            shippingMethod?.price?.currency ||
            firstItemTotalPrice.gross.currency,
        };

        const itemsNetPrice = items.reduce(
          (accumulatorPrice, line) =>
            accumulatorPrice + (line.totalPrice?.net.amount || 0),
          0
        );
        const itemsGrossPrice = items.reduce(
          (accumulatorPrice, line) =>
            accumulatorPrice + (line.totalPrice?.gross?.amount || 0),
          0
        );

        const itemsMrp = items.reduce(
          (accumulatorPrice, line) =>
            accumulatorPrice +
            (parseInt(
              line.variant.product?.metadata.filter(
                metaitem => metaitem?.key === "listPrice"
              )[0]?.value!,
              10
            ) ||
              line.variant.pricing?.priceUndiscounted?.gross.amount ||
              0) *
              line.quantity,
          0
        );

        const itemsMyNetPrice = items.reduce(
          (accumulatorPrice, line) =>
            accumulatorPrice +
            (line.variant.pricing?.priceUndiscounted?.gross.amount || 0) *
              line.quantity,
          0
        );

        const discount = {
          ...promoCodeDiscount,
          amount: promoCodeDiscount?.amount || 0,
          currency:
            promoCodeDiscount?.currency || firstItemTotalPrice.gross.currency,
        };

        const subtotalPrice = {
          ...firstItemTotalPrice,
          gross: {
            ...firstItemTotalPrice.gross,
            amount: round(
              itemsGrossPrice -
                discount.amount +
                prepaidAmount +
                cashbackAmount,
              2
            ),
          },
          net: {
            ...firstItemTotalPrice.net,
            amount: round(
              itemsNetPrice - discount.amount + prepaidAmount + cashbackAmount,
              2
            ),
          },
        };

        const totalPrice = {
          ...subtotalPrice,
          gross: {
            ...subtotalPrice.gross,
            amount: round(
              itemsGrossPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
          net: {
            ...subtotalPrice.net,
            amount: round(
              itemsNetPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
        };

        const mrp = {
          ...firstItemMrp,
          amount: round(itemsMrp, 2),
        };

        const netPrice = {
          amount: itemsMyNetPrice,
          currency: "INR",
        };

        const itemDiscount = {
          amount: mrp.amount - netPrice.amount,
          currency: "INR",
        };

        const offerDiscount = {
          amount: netPrice.amount - subtotalPrice.net.amount,
          currency: "INR",
        };

        const prepaidDiscount = {
          amount: prepaidAmount,
          currency: "INR",
        };

        const cashbackDiscount = {
          amount: cashbackAmount,
          currency: "INR",
        };

        const cashbackRecieve = {
          amount: cashbackRecieveAmount,
          currency: "INR",
        };

        // console.log({ prepaidDiscount });

        return new Promise(resolve => {
          resolve({
            cashbackDiscount,
            cashbackRecieve,
            discount,
            itemDiscount,
            mrp,
            netPrice,
            offerDiscount,
            prepaidDiscount,
            shippingPrice,
            subtotalPrice,
            totalPrice,
          });
        });
      }
    }
    return {};
  }
}
