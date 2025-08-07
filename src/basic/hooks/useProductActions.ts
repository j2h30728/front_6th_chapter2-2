import { useCallback } from "react";
import { ProductWithUI } from "../App";

export const useProductActions = (
  addProductFn: (newProduct: Omit<ProductWithUI, "id">) => {
    status: "error" | "success";
    message: string;
  },
  updateProductFn: (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => { status: "error" | "success"; message: string },
  deleteProductFn: (productId: string) => {
    status: "error" | "success";
    message: string;
  },
  notification: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  }
) => {
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProductFn(newProduct);
      notification.add(result.message, result.status);
    },
    [addProductFn, notification.add]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProductFn(productId, updates);
      notification.add(result.message, result.status);
    },
    [updateProductFn, notification.add]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      const result = deleteProductFn(productId);
      notification.add(result.message, result.status);
    },
    [deleteProductFn, notification.add]
  );

  return {
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
};
