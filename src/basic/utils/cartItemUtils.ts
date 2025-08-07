import { CartItem } from "../../types";

export const cartItemUtils = {
  /**
   * 장바구니 아이템 원래 가격 계산
   */
  calculateOriginalPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  },

  /**
   * 장바구니 아이템 할인률 계산
   */
  calculateDiscountRate(
    originalPrice: number,
    calculatedTotal: number
  ): number {
    if (calculatedTotal >= originalPrice) return 0;
    return Math.round((1 - calculatedTotal / originalPrice) * 100);
  },

  /**
   * 장바구니 아이템 할인 적용 여부 확인
   */
  hasDiscount(originalPrice: number, calculatedTotal: number): boolean {
    return calculatedTotal < originalPrice;
  },
};
