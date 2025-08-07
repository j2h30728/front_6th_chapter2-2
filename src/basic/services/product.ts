import { CartItem, Product, ValidationResult } from "../../types";
import cartModel from "../models/cart";
import productModel from "../models/product";
import { formatters } from "../utils";
import { VALIDATION_LIMITS } from "../utils/constants";
import { isValidNumericInput } from "../utils/validators";

export type ProductOperationResult =
  | {
      value: Product[];
      message: string;
      status: "success";
    }
  | {
      message: string;
      status: "error";
    };

const productService = {
  addNewItem: ({
    products,
    product,
  }: {
    products: Product[];
    product: Omit<Product, "id">;
  }): ProductOperationResult => {
    const newProduct = productModel.createProduct(product);
    return {
      value: [...products, newProduct],
      message: "상품이 추가되었습니다.",
      status: "success",
    };
  },

  updateProduct: ({
    products,
    productId,
    updates,
  }: {
    products: Product[];
    productId: string;
    updates: Partial<Product>;
  }): ProductOperationResult => {
    const updatedProducts = productModel.updateItem({
      products,
      productId,
      updates,
    });
    return {
      value: updatedProducts,
      message: "상품이 수정되었습니다.",
      status: "success",
    };
  },

  deleteProduct: ({
    products,
    productId,
  }: {
    products: Product[];
    productId: string;
  }): ProductOperationResult => {
    return {
      value: productModel.removeItem({ products, productId }),
      message: "상품이 삭제되었습니다.",
      status: "success",
    };
  },

  searchProduct: <T extends Product & { description?: string }>({
    products,
    searchTerm,
  }: {
    products: T[];
    searchTerm: string;
  }): T[] => {
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filteredProducts;
  },

  getRemainingStock: ({
    product,
    cart,
  }: {
    product: Product;
    cart: CartItem[];
  }): number => {
    const cartItem = cartModel.findItem({ cart, productId: product.id });
    const remaining = product.stock - (cartItem?.quantity || 0);

    return Math.max(0, remaining);
  },

  getStockStatus: <P extends Product>({
    product,
    cart,
  }: {
    product: P;
    cart: CartItem[];
  }): {
    remainingStock: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  } => {
    const remainingStock = productService.getRemainingStock({ product, cart });
    return {
      remainingStock,
      isLowStock: remainingStock <= 5 && remainingStock > 0,
      isOutOfStock: remainingStock <= 0,
    };
  },

  validateProductPrice(productPrice: string): ValidationResult {
    if (productPrice === "") {
      return {
        isValid: true,
        message: "",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    if (!isValidNumericInput(productPrice)) {
      return {
        isValid: false,
        message: "가격은 숫자만 입력 가능합니다.",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    const price = parseInt(productPrice);
    if (price < VALIDATION_LIMITS.PRODUCT.MIN_VALUE) {
      return {
        isValid: false,
        message: "가격은 0보다 커야 합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    return { isValid: true, message: "", value: price };
  },

  validateProductStock(stockValue: string): ValidationResult {
    if (stockValue === "") {
      return {
        isValid: true,
        message: "",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    if (!isValidNumericInput(stockValue)) {
      return {
        isValid: false,
        message: "재고는 숫자만 입력 가능합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    const stock = parseInt(stockValue);

    if (stock < VALIDATION_LIMITS.PRODUCT.MIN_STOCK) {
      return {
        isValid: false,
        message: "재고는 0보다 커야 합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    if (stock > VALIDATION_LIMITS.PRODUCT.MAX_STOCK) {
      return {
        isValid: false,
        message: "재고는 9999개를 초과할 수 없습니다",
        value: VALIDATION_LIMITS.PRODUCT.MAX_STOCK,
      };
    }

    return { isValid: true, message: "", value: stock };
  },
};

export default productService;
