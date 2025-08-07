import { useCallback } from "react";

export const useOrderActions = (
  completeOrderFn: () => { status: "error" | "success"; message: string },
  notification: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  }
) => {
  const handleCompleteOrder = useCallback(() => {
    const result = completeOrderFn();

    if (result.status === "success") {
      notification.add(result.message, result.status);
    } else {
      notification.add(result.message, result.status);
    }
  }, [completeOrderFn, notification.add]);

  return {
    handleCompleteOrder,
  };
};
