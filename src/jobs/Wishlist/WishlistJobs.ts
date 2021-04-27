import { ApolloClientManager } from "../../data/ApolloClientManager";
import { LocalStorageHandler } from "../../helpers/LocalStorageHandler";
import { JobsHandler } from "../JobsHandler";

export enum ErrorCartTypes {
  "SET_CART_ITEM",
}

export class WishlistJobs extends JobsHandler<{}> {
  private apolloClientManager: ApolloClientManager;

  private localStorageHandler: LocalStorageHandler;

  constructor(
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    super();
    this.localStorageHandler = localStorageHandler;
    this.apolloClientManager = apolloClientManager;
  }

  getWishlist = async () => {
    const { data, error } = await this.apolloClientManager.getWishlistItems(20);
    this.localStorageHandler.setWishlist({
      items: data?.items.edges.map(edge => edge.node.product),
    });

    return { data, error };
  };

  addItemInWishlist = async ({ productId }: { productId: string }) => {
    const { data, error } = await this.apolloClientManager.addWishlistItems(
      productId
    );

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
