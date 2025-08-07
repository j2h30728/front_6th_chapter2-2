import { ProductWithUI } from "../App";

/**
 * 상품의 최대 할인율을 계산
 */
export function getMaxDiscountRate(product: ProductWithUI): number {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate));
}

/**
 * 상품의 최대 할인율을 퍼센트로 변환
 */
export function getMaxDiscountPercentage(product: ProductWithUI): number {
  return Math.round(getMaxDiscountRate(product) * 100);
}

/**
 * 재고 상태에 따른 텍스트 반환
 */
export function getStockStatusText(
  remainingStock: number,
  isLowStock: boolean
): string {
  if (isLowStock) {
    return `품절임박! ${remainingStock}개 남음`;
  }
  if (remainingStock > 5) {
    return `재고 ${remainingStock}개`;
  }
  return "";
}

/**
 * 상품의 버튼 텍스트 반환
 */
export function getProductButtonText(isOutOfStock: boolean): string {
  return isOutOfStock ? "품절" : "장바구니 담기";
}

/**
 * 상품의 버튼 variant 반환
 */
export function getProductButtonVariant(
  isOutOfStock: boolean
): "ghost" | "black" {
  return isOutOfStock ? "ghost" : "black";
}
