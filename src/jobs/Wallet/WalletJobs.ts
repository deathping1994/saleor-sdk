import { ApolloClientManager } from "../../data/ApolloClientManager";
// import { LocalStorageHandler } from "../../helpers/LocalStorageHandler";
import { JobsHandler } from "../JobsHandler";

export enum ErrorCartTypes {
  "SET_CART_ITEM",
}

export class WalletJobs extends JobsHandler<{}> {
  private apolloClientManager: ApolloClientManager;

  // private localStorageHandler: LocalStorageHandler;

  constructor(
    // localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    super();
    // this.localStorageHandler = localStorageHandler;
    this.apolloClientManager = apolloClientManager;
  }

  getWallet = async () => {
    const { data, error } = await this.apolloClientManager.getWalletAmount();
    if (error) {
      return {
        dataError: {
          error,
        },
      };
    }

    return { data };
  };
}
