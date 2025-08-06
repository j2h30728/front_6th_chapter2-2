import { CartItem, Coupon, Product } from "../../types";
import discountModel from "./discount";

const cartModel = {
  /**
   * 개별 아이템의 할인 적용 후 총액 계산
   * @param item - 아이템 정보
   * @param cart - 장바구니 정보 (대량 구매 할인 계산용)
   * @returns 할인 적용 후 총액
   */
  calculateItemTotal({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    return discountModel.calculateItemTotal({ item, cart });
  },

  /**
   * 장바구니 총액 계산 (할인 전/후)
   * @param cart - 장바구니 정보
   * @param selectedCoupon - 선택된 쿠폰 (null 가능)
   * @returns 할인 전 총액과 할인 후 총액
   */
  calculateCartTotal({
    cart,
    selectedCoupon,
  }: {
    cart: CartItem[];
    selectedCoupon: Coupon | null;
  }): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += this.calculateItemTotal({ item, cart });
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  },

  /**
   * 장바구니 내 특정 상품의 수량을 변경하고 새로운 장바구니 배열 반환
   * @param cart - 장바구니 정보
   * @param productId - 수량을 변경할 상품 ID
   * @param newQuantity - 새로운 수량
   * @returns 수량 변경 후 장바구니 배열
   */
  updateCartItemQuantity({
    cart,
    productId,
    newQuantity,
  }: {
    cart: CartItem[];
    productId: string;
    newQuantity: number;
  }) {
    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
  },

  /**
   * 장바구니에 상품을 추가하거나 기존 상품 수량을 증가시킴
   * @param cart - 장바구니 정보
   * @param product - 추가할 상품 정보
   * @returns 상품 추가 후 장바구니 배열
   */
  addItemToCart({ cart, product }: { cart: CartItem[]; product: Product }) {
    const eixstingItem = cart.find((item) => item.product.id === product.id);
    if (eixstingItem) {
      return this.updateCartItemQuantity({
        cart,
        productId: product.id,
        newQuantity: eixstingItem.quantity + 1,
      });
    }

    return [...cart, { product, quantity: 1 }] as CartItem[];
  },

  /**
   * 장바구니에서 특정 상품을 완전히 제거
   * @param cart - 장바구니 정보
   * @param productId - 제거할 상품 ID
   * @returns 상품 제거 후 장바구니 배열
   */
  removeItemFromCart({
    cart,
    productId,
  }: {
    cart: CartItem[];
    productId: string;
  }): CartItem[] {
    return cart.filter((item) => item.product.id !== productId);
  },
};

export default cartModel;
