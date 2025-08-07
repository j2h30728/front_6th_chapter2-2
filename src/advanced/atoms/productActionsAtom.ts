import { atom } from "jotai";
import { ProductWithUI } from "../App";
import productService from "../services/product";
import { productsAtom } from "./productAtom";
import { notificationActionsAtom } from "./notificationAtom";

type ProductAction =
  | { type: "ADD_PRODUCT"; payload: Omit<ProductWithUI, "id"> }
  | {
      type: "UPDATE_PRODUCT";
      payload: { productId: string; updates: Partial<ProductWithUI> };
    }
  | { type: "DELETE_PRODUCT"; payload: string };

export const productActionsAtom = atom(
  (get) => get(productsAtom),
  (get, set, action: ProductAction) => {
    const products = get(productsAtom);

    switch (action.type) {
      case "ADD_PRODUCT": {
        const result = productService.addNewItem({
          products,
          product: action.payload,
        });

        if (result.status === "success") {
          set(productsAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        }
        break;
      }

      case "UPDATE_PRODUCT": {
        const result = productService.updateProduct({
          products,
          productId: action.payload.productId,
          updates: action.payload.updates,
        });

        if (result.status === "success") {
          set(productsAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        }
        break;
      }

      case "DELETE_PRODUCT": {
        const result = productService.deleteProduct({
          products,
          productId: action.payload,
        });

        if (result.status === "success") {
          set(productsAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        }
        break;
      }
    }
  }
);
