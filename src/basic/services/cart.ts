import { CartItem, Coupon, Product } from "../../types";
import cartModel from "../models/cart";
import discountModel from "../models/discount";
import productModel from "../models/product";
import { VALIDATION_LIMITS } from "../utils/constants";

export interface CartOperationResult {
  success: boolean;
  cart?: CartItem[];
  error?: string;
}

export interface CartTotalResult {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  itemDiscountAmount: number;
  couponDiscountAmount: number;
}

const cartService = {
  calculateItemTotal({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    return discountModel.calculateItemTotal({ item, cart });
  },

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

  addItemToCart: ({
    cart,
    product,
  }: {
    cart: CartItem[];
    product: Product;
  }): CartOperationResult => {
    const remaining = productModel.getRemainingStock({ product, cart });
    const existingQty = cartModel.getItemQuantity({
      cart,
      productId: product.id,
    });
    if (remaining <= 0 || existingQty >= remaining) {
      return {
        success: false,
        error: `재고는 ${product.stock}개까지만 있습니다.`,
      };
    }

    const newCart = existingQty
      ? cartModel.updateItemQuantity({
          cart,
          productId: product.id,
          newQuantity: existingQty + 1,
        })
      : cartModel.addNewItem({ cart, product });

    return { success: true, cart: newCart };
  },

  updateItemQuantity: ({
    cart,
    productId,
    newQuantity,
  }: {
    cart: CartItem[];
    productId: string;
    newQuantity: number;
  }): CartOperationResult => {
    if (newQuantity <= 0) {
      return { success: true, cart: cartModel.removeItem({ cart, productId }) };
    }

    const item = cartModel.findItem({ cart, productId });
    if (!item) return { success: false, error: "상품을 찾을 수 없습니다" };

    if (
      newQuantity >
      productModel.getRemainingStock({ product: item.product, cart })
    ) {
      return {
        success: false,
        error: `재고는 ${item.product.stock}개까지 구매 가능합니다`,
      };
    }

    return {
      success: true,
      cart: cartModel.updateItemQuantity({ cart, productId, newQuantity }),
    };
  },
};

export default cartService;
