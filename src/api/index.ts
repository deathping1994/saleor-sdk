import ApolloClient from "apollo-client";

import { defaultConfig } from "../config";
import { LocalStorageManager } from "../data";
import { ApolloClientManager } from "../data/ApolloClientManager";
import { LocalStorageHandler } from "../helpers/LocalStorageHandler";
import { JobsManager } from "../jobs";
import { SaleorState } from "../state";
import { ConfigInput } from "../types";
import { AuthAPI } from "./Auth";
import APIProxy from "./APIProxy";
import { SaleorCartAPI } from "./Cart";
import { SaleorCheckoutAPI } from "./Checkout";
import { CollectionsAPI } from "./collections/collections";
import { CategoriesAPI } from "./categories/categories";
import { ProductsAPI } from "./products/products";
import { SaleorWishlistAPI } from "./Wishlist";

export * from "./Checkout";
export * from "./Cart";

export class SaleorAPI {
  auth: AuthAPI;

  checkout: SaleorCheckoutAPI;

  cart: SaleorCartAPI;

  wishlist: SaleorWishlistAPI;

  categories: CategoriesAPI;

  collections: CollectionsAPI;

  products: ProductsAPI;

  /**
   * @deprecated Please do not use it anymore. Reference to API Proxy will be removed in future.
   * Now it just exists for legacy React hooks, which also will be removed.
   */
  legacyAPIProxy: APIProxy;

  constructor(
    client: ApolloClient<any>,
    apiProxy: APIProxy,
    config: ConfigInput,
    onStateUpdate?: () => any
  ) {
    this.legacyAPIProxy = apiProxy;
    const finalConfig = {
      ...defaultConfig,
      ...config,
      loadOnStart: {
        ...defaultConfig.loadOnStart,
        ...config?.loadOnStart,
      },
    };

    const localStorageHandler = new LocalStorageHandler();
    const apolloClientManager = new ApolloClientManager(client);
    const jobsManager = new JobsManager(
      localStorageHandler,
      apolloClientManager
    );
    const saleorState = new SaleorState(
      finalConfig,
      localStorageHandler,
      apolloClientManager,
      jobsManager
    );
    const localStorageManager = new LocalStorageManager(
      localStorageHandler,
      saleorState
    );

    if (onStateUpdate) {
      saleorState.subscribeToNotifiedChanges(onStateUpdate);
    }

    this.auth = new AuthAPI(saleorState, jobsManager, finalConfig);
    this.checkout = new SaleorCheckoutAPI(saleorState, jobsManager);
    this.cart = new SaleorCartAPI(
      localStorageManager,
      apolloClientManager,
      saleorState,
      jobsManager
    );
    this.wishlist = new SaleorWishlistAPI(
      localStorageManager,
      apolloClientManager,
      saleorState,
      jobsManager
    );

    this.categories = new CategoriesAPI(client);
    this.collections = new CollectionsAPI(client);
    this.products = new ProductsAPI(client);

    this.legacyAPIProxy.attachAuthListener(authenticated => {
      if (!authenticated) {
        localStorageHandler.setCheckout({});
        localStorageHandler.setPayment({});
        localStorageHandler.setJobs(null);
      }
    });
  }
}
