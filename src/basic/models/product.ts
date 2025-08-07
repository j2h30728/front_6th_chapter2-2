import { CartItem, Product, ValidationResult } from "../../types";
import { VALIDATION_LIMITS } from "../utils/constants";
import { isValidNumericInput } from "../utils/validators";

const productModel = {
  /**
   * 상품의 남은 재고 계산 (장바구니에 담긴 수량 제외)
   * @param product - 재고를 확인할 상품 정보
   * @param cart - 장바구니 정보 (이미 담긴 수량 확인용)
   * @returns 남은 재고 수량 (최소 0)
   */
  getRemainingStock({
    product,
    cart,
  }: {
    product: Product;
    cart: CartItem[];
  }): number {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return Math.max(0, remaining);
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

export default productModel;
