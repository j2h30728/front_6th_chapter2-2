import { useCallback } from "react";
import { ProductWithUI } from "../App";

export const useCartActions = (
  addToCartFn: (product: ProductWithUI) => {
    status: "error" | "success";
    message: string;
  },
  removeFromCartFn: (productId: string) => {
    status: "error" | "success";
    message: string;
  },
  updateQuantityFn: (
    productId: string,
    newQuantity: number
  ) => { status: "error" | "success"; message: string },
  notification: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  }
) => {
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartFn(product);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
      notification.add("장바구니에 담았습니다", "success");
    },
    [addToCartFn, notification.add]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      const result = removeFromCartFn(productId);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
    },
    [removeFromCartFn, notification.add]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityFn(productId, newQuantity);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
    },
    [updateQuantityFn, notification.add]
  );

  return {
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
  };
};
