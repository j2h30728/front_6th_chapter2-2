import { atom } from "jotai";
import { ProductWithUI } from "../App";
import cartService from "../services/cart";
import orderService from "../services/order";
import { cartAtom } from "./cartAtom";
import { notificationActionsAtom } from "./notificationAtom";

type CartAction =
  | { type: "ADD_TO_CART"; payload: ProductWithUI }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "RESET_CART" };

export const cartActionsAtom = atom(
  (get) => get(cartAtom),
  (get, set, action: CartAction) => {
    const cart = get(cartAtom);

    switch (action.type) {
      case "ADD_TO_CART": {
        const result = cartService.addItemToCart({
          cart,
          product: {
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            stock: action.payload.stock,
            discounts: action.payload.discounts,
          },
        });

        if (result.status === "success") {
          set(cartAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: "장바구니에 담았습니다", type: "success" },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: "error" },
          });
        }
        break;
      }

      case "REMOVE_FROM_CART": {
        const result = cartService.removeItemFromCart({
          cart,
          productId: action.payload,
        });

        if (result.status === "success") {
          set(cartAtom, result.value);
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: "error" },
          });
        }
        break;
      }

      case "UPDATE_QUANTITY": {
        const result = cartService.updateItemQuantity({
          cart,
          productId: action.payload.productId,
          newQuantity: action.payload.quantity,
        });

        if (result.status === "success") {
          set(cartAtom, result.value);
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: "error" },
          });
        }
        break;
      }

      case "RESET_CART": {
        set(cartAtom, []);
        break;
      }
    }
  }
);

// 주문 완료 액션
export const completeOrderAtom = atom(null, (get, set) => {
  const cart = get(cartAtom);

  const result = orderService.completeOrder({ cart });

  if (result.status === "success") {
    set(cartAtom, []);
    set(notificationActionsAtom, {
      type: "ADD",
      payload: { message: "주문이 완료되었습니다!", type: "success" },
    });
  } else {
    set(notificationActionsAtom, {
      type: "ADD",
      payload: { message: result.message, type: "error" },
    });
  }
});
