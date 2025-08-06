import { CartItem, Product } from "../../types";

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
};

export default productModel;
