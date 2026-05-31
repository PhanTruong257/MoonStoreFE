import { Button, Card, Form, Select } from "antd";

import { VEHICLE_TYPE_OPTIONS } from "@/const/shipper.const";
import { useShipperApply } from "./use-shipper-apply";
import styles from "./shipper-apply-page.module.scss";

export const ShipperApplyPage = () => {
  const { submitting, handleApply } = useShipperApply();

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <p className={styles.title}>Đăng ký làm Shipper</p>
        <p className={styles.subtitle}>
          Điền thông tin phương tiện để bắt đầu nhận đơn giao hàng.
        </p>
        <Form layout="vertical" onFinish={handleApply}>
          <Form.Item
            label="Loại phương tiện"
            name="vehicleType"
            rules={[{ required: true, message: "Vui lòng chọn phương tiện." }]}
          >
            <Select options={VEHICLE_TYPE_OPTIONS} placeholder="Chọn phương tiện" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Gửi đơn đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
