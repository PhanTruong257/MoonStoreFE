import { Button, Card, Form } from "antd";

import { useShipperApply } from "./use-shipper-apply";
import styles from "./shipper-apply-page.module.scss";

export const ShipperApplyPage = () => {
  const { submitting, handleApply } = useShipperApply();

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <p className={styles.title}>Đăng ký làm Shipper</p>
        <p className={styles.subtitle}>
          Nhấn đăng ký để bắt đầu quy trình xét duyệt.
        </p>
        <Form layout="vertical" onFinish={handleApply}>
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
