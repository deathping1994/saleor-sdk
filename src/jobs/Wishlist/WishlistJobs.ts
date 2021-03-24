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
    const { data } = await this.apolloClientManager.getWishlistItems(20);
    this.localStorageHandler.setWishlist({
      items: data?.edges[0].node.wishlist.items.edges.map(
        edge => edge.node.product
      ),
    });
  };
}
