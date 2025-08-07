import Button from "../ui/Button";
import { formatters } from "../../utils/formatters";
import { couponUtils } from "../../utils/couponUtils";

interface PaymentSectionProps {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  completeOrder: () => void;
  className?: string;
}

export default function PaymentSection({
  totalBeforeDiscount,
  totalAfterDiscount,
  completeOrder,
  className = "",
}: PaymentSectionProps) {
  const discountAmount = couponUtils.getDiscountAmount(
    totalBeforeDiscount,
    totalAfterDiscount
  );
  const hasDiscountApplied = couponUtils.hasDiscount(
    totalBeforeDiscount,
    totalAfterDiscount
  );

  return (
    <section
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {formatters.price(totalBeforeDiscount, false)}
          </span>
        </div>
        {hasDiscountApplied && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{formatters.price(discountAmount, false)}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {formatters.price(totalAfterDiscount, false)}
          </span>
        </div>
      </div>

      <Button onClick={completeOrder} variant="yellow" className="w-full mt-4">
        {formatters.price(totalAfterDiscount, false)} 결제하기
      </Button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
}
