import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/app/app-store";
import { vouchersActions } from "@/features/vouchers/vouchers.slice";

export const useVoucher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { code, voucher, discountAmount, message, isValidating } = useSelector(
    (state: RootState) => state.vouchers,
  );

  useEffect(() => {
    return () => {
      dispatch(vouchersActions.voucherReset());
    };
  }, [dispatch]);

  const setCode = useCallback(
    (next: string) => {
      dispatch(vouchersActions.voucherCodeChanged(next));
    },
    [dispatch],
  );

  const apply = useCallback(
    (subtotal: number) => {
      dispatch(
        vouchersActions.voucherValidateRequested({
          code: code.trim(),
          subtotal,
        }),
      );
    },
    [dispatch, code],
  );

  const reset = useCallback(() => {
    dispatch(vouchersActions.voucherReset());
  }, [dispatch]);

  return {
    code,
    voucher,
    discountAmount,
    message,
    isValidating,
    setCode,
    apply,
    reset,
  };
};
