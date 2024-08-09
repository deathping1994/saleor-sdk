// import { LocalStorageManager } from "../../data";
import { ErrorListener } from "../../helpers";
// import { IWishlistModel } from "../../helpers/LocalStorageHandler";
import { JobsManager } from "../../jobs";
import { SaleorState, SaleorStateLoaded } from "../../state";
import { StateItems } from "../../state/types";
// import { ApolloClientManager } from "../../data/ApolloClientManager";

// import { IWishlistItems } from "./types";

export class SaleorWalletAPI extends ErrorListener {
  loaded: boolean;

  //   amount: number;

  //   private apolloClientManager: ApolloClientManager;

  private jobsManager: JobsManager;

  //   private localStorageManager: LocalStorageManager;

  private saleorState: SaleorState;

  constructor(
    // localStorageManager: LocalStorageManager,
    // apolloClientManager: ApolloClientManager,
    saleorState: SaleorState,
    jobsManager: JobsManager
  ) {
    super();
    this.saleorState = saleorState;
    // this.localStorageManager = localStorageManager;
    // this.apolloClientManager = apolloClientManager;
    this.jobsManager = jobsManager;

    this.loaded = false;

    this.jobsManager.attachErrorListener("cart", this.fireError);

    // this.saleorState.subscribeToChange(
    //   StateItems.WISHLIST,
    //   (wishlist: IWishlistModel) => {
    //     this.amount = wishlist?.items;
    //   }
    // );

    this.saleorState.subscribeToChange(
      StateItems.LOADED,
      (loaded: SaleorStateLoaded) => {
        this.loaded = loaded.checkout && loaded.summaryPrices;
      }
    );
  }

  // addItemInWishlist = async (productId: string) => {
  //   // 1. save in local storage

  //   // 2. save online if possible (if checkout id available)
  //   const { data } = await this.apolloClientManager.addWishlistItems(productId);

  //   this.localStorageManager.addItemInWishlist(
  //     data ? data[0]?.wishlist.items.edges.map(edge => edge.node.product) : []
  //   );
  // };

  getWalletAmount = async () => {
    const { data, dataError } = await this.jobsManager.run(
      "wallet",
      "getWallet",
      undefined
    );
    return {
      data,
      dataError,
    };
  };
}