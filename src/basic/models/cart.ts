import { CartItem, Coupon, Product } from "../../types";

const cartModel = {
  /**
   * 개별 아이템의 할인 적용 후 총액 계산
   * @param item - 아이템 정보
   * @param cart - 장바구니 정보
   * @returns 할인 적용 후 총액
   */
  calculateItemTotal({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    const { price } = item.product;
    const { quantity } = item;
    const discount = cartModel.getMaxApplicableDiscount({ item, cart });

    return Math.round(price * quantity * (1 - discount));
  },

  /**
   * 적용 가능한 최대 할인율 계산
   * @param item - 아이템 정보
   * @param cart - 장바구니 정보
   * @returns 적용 가능한 최대 할인율
   */
  getMaxApplicableDiscount({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  },

  /**
   * 장바구니 총액 계산
   * @param cart - 장바구니 정보
   * @param selectedCoupon - 선택된 쿠폰
   * @returns 할인 적용 후 총액
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
      totalAfterDiscount += cartModel.calculateItemTotal({ item, cart });
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
   * 장바구니 아이템 수량 변경
   * @param cart - 장바구니 정보
   * @param productId - 상품 ID
   * @param newQuantity - 수량
   * @returns 수량 변경 후 장바구니 정보
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
   * 상품 추가
   * @param cart - 장바구니 정보
   * @param product - 상품 정보
   * @returns 상품 추가 후 장바구니 정보
   */
  addItemToCart({ cart, product }: { cart: CartItem[]; product: Product }) {
    const eixstingItem = cart.find((item) => item.product.id === product.id);
    if (eixstingItem) {
      return cartModel.updateCartItemQuantity({
        cart,
        productId: product.id,
        newQuantity: 1,
      });
    }

    return [...cart, { product, quantity: 1 }] as CartItem[];
  },

  /**
   * 상품 제거
   * @param cart - 장바구니 정보
   * @param productId - 상품 ID
   * @returns 상품 제거 후 장바구니 정보
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

  /**
   * 남은 재고 계산
   * @param product - 상품 정보
   * @param cart - 장바구니 정보
   * @returns 남은 재고
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

export default cartModel;
