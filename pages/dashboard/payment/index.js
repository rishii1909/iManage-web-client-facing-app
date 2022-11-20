import UnauthorizedLayer from "../../../components/UnauthorizedLayer";
import Layout from "./../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { UserOutlined, DownloadOutlined } from "@ant-design/icons";

import {
  Button,
  Col,
  Divider,
  PageHeader,
  Row,
  Spin,
  Card,
  Switch,
  Space,
  Badge,
  InputNumber,
  Modal,
  Select,
  Option,
  Input,
  Descriptions,
  Checkbox,
} from "antd";
import UpgradePage from "./../upgrade/index";

const PaymentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [size, setSize] = useState("large"); // default is 'middle'
  const [priceList, setPriceList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  useEffect(() => {
    fetch(`${process.env.API_URL}/plans/getPriceConfig`)
      .then((res) => res.json())
      .then((data) => {
        if (data.accomplished) {
          setPriceList([
            data.response.filter((element) => element.name == "Pro")[0],
          ]);
        }
      })
      .catch((error) => {
        setPriceList(false);
      });
  }, []);
  return (
    <Layout>
      {/* <Row>
        <Col span={8}> */}
      <Space direction="vertical">
        <Card
          title="Subscription"
          extra={
            <Button type="primary" icon={<DownloadOutlined />} size={size}>
              Download
            </Button>
          }
          style={{ width: "100%" }}
        >
          <Descriptions>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Current Plan"
            >
              Lite
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Next Payment Date"
            >
              5 Feb,2023
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Payment Method"
            >
              Credit Card
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Amount"
            >
              $2{" "}
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="No of Devices"
            >
              5
            </Descriptions.Item>

            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Active Devices"
            >
              1{" "}
            </Descriptions.Item>

            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Live Support"
            >
              Available{" "}
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={{ fontWeight: "600", color: "green" }}
              label="Duraition"
            >
              3 Hrs{" "}
            </Descriptions.Item>

            <Descriptions.Item contentStyle={{ fontWeight: "600" }} label="">
              {" "}
              <a onClick={(event) => showModal()}>Upgrade Plans</a>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
      <Modal
        title="Upgrade To Pro"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
         
         <UpgradePage  handleCancel={(event)=>handleCancel(event)}/>
      </Modal>
    </Layout>
  );
};

export default PaymentPage;
