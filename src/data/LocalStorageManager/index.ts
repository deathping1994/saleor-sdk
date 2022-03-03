import { SaleorState } from "../../state";
import { LocalStorageHandler } from "../../helpers/LocalStorageHandler/LocalStorageHandler";
import { Wishlist_wishlist_items_edges_node_product } from "../../queries/gqlTypes/Wishlist";
import { IAddItem } from "../../api/Cart/types";

export class LocalStorageManager {
  private handler: LocalStorageHandler;

  private saleorState: SaleorState;

  constructor(handler: LocalStorageHandler, saleorState: SaleorState) {
    this.handler = handler;
    this.saleorState = saleorState;
  }

  getHandler = () => {
    return this.handler;
  };

  addItemToCart = (variantId: string, quantity: number) => {
    const lines = this.saleorState.checkout?.lines || [];
    let variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    const newVariantQuantity = variantInCheckout
      ? variantInCheckout.quantity + quantity
      : quantity;
    if (variantInCheckout) {
      variantInCheckout.quantity = newVariantQuantity;
      alteredLines.push(variantInCheckout);
    } else {
      variantInCheckout = {
        quantity,
        variant: {
          id: variantId,
        },
      };
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  addItemsToCart = (variantArray: IAddItem[]) => {
    const lines = this.saleorState.checkout?.lines || [];
    console.log("lines: ", lines);
    const variantsInCheckoutWithUpdatedQuantity = lines.filter(lineVariant => {
      const thisVariantInCheckout = variantArray.find(
        variant => variant.variantId === lineVariant.variant.id
      );
      console.log(
        "variantsInCheckoutWithUpdatedQuantity: ",
        variantsInCheckoutWithUpdatedQuantity
      );
      if (thisVariantInCheckout?.variantId) {
        console.log("thisVariantInCheckout: ", thisVariantInCheckout);
        return {
          quantity: thisVariantInCheckout?.quantity
            ? thisVariantInCheckout?.quantity + lineVariant.quantity
            : lineVariant.quantity,
          variant: {
            id: thisVariantInCheckout?.variantId,
          },
        };
      }
      return false;
    });

    const alteredLines = lines.filter(
      lineVariant =>
        !variantArray.find(
          variant => variant.variantId !== lineVariant.variant.id
        )
    );

    console.log("alteredLines", alteredLines);
    const updatedCheckoutLines = [
      ...alteredLines,
      ...variantsInCheckoutWithUpdatedQuantity,
    ];

    console.log("updatedCheckoutLines", updatedCheckoutLines);
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: updatedCheckoutLines,
        }
      : {
          lines: updatedCheckoutLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  removeItemFromCart = (variantId: string) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    if (variantInCheckout) {
      variantInCheckout.quantity = 0;
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  subtractItemFromCart = (variantId: string) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantFromCart = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    const newVariantQuantity = variantFromCart
      ? variantFromCart.quantity - 1
      : 0;
    if (variantFromCart) {
      variantFromCart.quantity = newVariantQuantity;
      alteredLines.push(variantFromCart);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  updateItemInCart = (variantId: string, quantity: number) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    if (variantInCheckout) {
      variantInCheckout.quantity = quantity;
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  addItemInWishlist = (
    productList: Wishlist_wishlist_items_edges_node_product[] | null | undefined
  ) => {
    // const items = this.saleorState.wishlist?.items;
    // items?.push(product);
    const wishlist = { items: productList };
    this.handler.setWishlist(wishlist);
  };

  // removeItemInWishlist = (productId: string) => {
  //   const items = this.saleorState.wishlist?.items;
  //   const updatedItems = items?.filter(item => item.id !== productId);
  //   const wishlist = { items: updatedItems };
  //   this.handler.setWishlist(wishlist);
  // };
}
