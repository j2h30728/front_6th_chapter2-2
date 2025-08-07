import { useReducer, useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { ProductWithUI } from "../App";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import cartService from "../services/cart";
import orderService from "../services/order";

type CartState = {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: ProductWithUI }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "SET_SELECTED_COUPON"; payload: Coupon | null }
  | { type: "COMPLETE_ORDER" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      // ProductWithUI → Product 변환
      const productData: Product = {
        id: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        stock: action.payload.stock,
        discounts: action.payload.discounts,
      };

      const result = cartService.addItemToCart({
        cart: state.cart,
        product: productData,
      });

      if (result.status === "success") {
        return {
          ...state,
          cart: result.value,
        };
      }
      return state; // 에러 시 상태 변경 없음
    }

    case "REMOVE_FROM_CART": {
      const result = cartService.removeItemFromCart({
        cart: state.cart,
        productId: action.payload,
      });

      if (result.status === "success") {
        return {
          ...state,
          cart: result.value,
        };
      }
      return state;
    }

    case "UPDATE_QUANTITY": {
      const result = cartService.updateItemQuantity({
        cart: state.cart,
        productId: action.payload.productId,
        newQuantity: action.payload.quantity,
      });

      if (result.status === "success") {
        return {
          ...state,
          cart: result.value,
        };
      }
      return state;
    }

    case "SET_SELECTED_COUPON": {
      return {
        ...state,
        selectedCoupon: action.payload,
      };
    }

    case "COMPLETE_ORDER": {
      const result = orderService.completeOrder({
        cart: state.cart,
      });

      if (result.status === "success") {
        return {
          cart: [],
          selectedCoupon: null,
        };
      }
      return state; // 에러 시 상태 변경 없음
    }

    default:
      return state;
  }
}

// 커스텀 훅
export function useCart() {
  // 기존 localStorage 구조와 호환성을 위해 cart 배열만 저장
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // reducer는 내부적으로만 사용
  const [reducerState, reducerDispatch] = useReducer(cartReducer, {
    cart,
    selectedCoupon,
  });

  // localStorage와 reducer 상태 동기화
  const syncCart = useCallback(
    (newCart: CartItem[]) => {
      setCart(newCart);
      return newCart;
    },
    [setCart]
  );

  // 액션 디스패치 함수들
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      // ProductWithUI → Product 변환
      const productData: Product = {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        discounts: product.discounts,
      };

      const result = cartService.addItemToCart({
        cart,
        product: productData,
      });

      if (result.status === "success") {
        syncCart(result.value);
        reducerDispatch({ type: "ADD_TO_CART", payload: product });
      }

      return result;
    },
    [cart, syncCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const result = cartService.removeItemFromCart({
        cart,
        productId,
      });

      if (result.status === "success") {
        syncCart(result.value);
        reducerDispatch({ type: "REMOVE_FROM_CART", payload: productId });
      }

      return result;
    },
    [cart, syncCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const result = cartService.updateItemQuantity({
        cart,
        productId,
        newQuantity: quantity,
      });

      if (result.status === "success") {
        syncCart(result.value);
        reducerDispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, quantity },
        });
      }

      return result;
    },
    [cart, syncCart]
  );

  const updateSelectedCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
    reducerDispatch({ type: "SET_SELECTED_COUPON", payload: coupon });
  }, []);

  const completeOrder = useCallback(() => {
    const result = orderService.completeOrder({
      cart,
    });

    if (result.status === "success") {
      syncCart([]);
      setSelectedCoupon(null);
      reducerDispatch({ type: "COMPLETE_ORDER" });
    }

    return result;
  }, [cart, syncCart]);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedCoupon: updateSelectedCoupon,
    completeOrder,
  };
}
