import { ApolloClientManager } from "../data/ApolloClientManager";
import { LocalStorageHandler } from "../helpers/LocalStorageHandler";
import { AuthJobs } from "./Auth";
import { CheckoutJobs } from "./Checkout";
import { WalletJobs } from "./Wallet";
import { WishlistJobs } from "./Wishlist";

export interface IJobs {
  auth: AuthJobs;
  checkout: CheckoutJobs;
  wishlist: WishlistJobs;
  wallet: WalletJobs;
}

export class Jobs implements IJobs {
  auth: AuthJobs;

  checkout: CheckoutJobs;

  wishlist: WishlistJobs;

  wallet: WalletJobs;

  constructor(
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    this.auth = new AuthJobs(localStorageHandler, apolloClientManager);
    this.checkout = new CheckoutJobs(localStorageHandler, apolloClientManager);
    this.wishlist = new WishlistJobs(localStorageHandler, apolloClientManager);
    this.wallet = new WalletJobs(apolloClientManager);
  }
}
