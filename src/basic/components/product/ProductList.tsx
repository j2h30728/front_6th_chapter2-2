import { CartItem, Product } from "../../../types";
import { ProductWithUI } from "../../App";
import { formatPrice } from "../../utils/formatters";
import { DefaultImageIcon } from "../icons";
import Button from "../ui/Button";
import productModel from "../../models/product";

export default function ProductList({
  cart,
  products,
  debouncedSearchTerm,
  addToCart,
}: {
  cart: CartItem[];
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: Product) => void;
}) {
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => {
        const remainingStock = productModel.getRemainingStock({
          product,
          cart,
        });
        return (
          <ProductItem
            key={product.id}
            product={product}
            remainingStock={remainingStock}
            addToCart={addToCart}
          />
        );
      })}
    </div>
  );
}

export const ProductItem = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: ProductWithUI;
  remainingStock: number;
  addToCart: (product: Product) => void;
}) => {
  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <DefaultImageIcon className="w-24 h-24 text-gray-300" />
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {remainingStock <= 0
              ? "SOLD OUT"
              : formatPrice(product.price, {
                  currencyDisplay: "narrowSymbol",
                })}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={() => addToCart(product)}
          disabled={remainingStock <= 0}
          variant={remainingStock <= 0 ? "ghost" : "black"}
          className="w-full"
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
};
