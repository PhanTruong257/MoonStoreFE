import { Result } from "antd";

import { ShipperShell } from "@/features/shipper/components/shipper-shell";

export const ShipperPendingPage = () => (
  <ShipperShell>
    <Result
      status="info"
      title="Đang chờ xét duyệt"
      subTitle="Đơn đăng ký shipper của bạn đang được admin xem xét. Vui lòng chờ thông báo qua email."
    />
  </ShipperShell>
);
