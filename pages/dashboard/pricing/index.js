import UnauthorizedLayer from "../../../components/UnauthorizedLayer";
import Layout from "./../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import Router from "next/router";

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
  notification,
  Input
} from "antd";
import PriceCard from "./priceCard";
const PricingPage = () => {
  const [loadScreen, setLoadScreen] = useState(true);
  const [priceList, setPriceList] = useState([]);
  const [issupportSected, setSupportSelecetd] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceValue, setDevicevalue] = useState(1);
  const [api, contextHolder] = notification.useNotification();

  const handleOk = () => {
    setIsModalOpen(false);
    openNotificationWithIcon("success");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Notification Title",
      description: "User  will be redirect to stripe payment page . ",
    });
    setTimeout(() => {
      Router.push("payment");
    }, 2000);
  };

  useEffect(() => {
    fetch(`${process.env.API_URL}/plans/getPriceConfig`)
      .then((res) => res.json())
      .then((data) => {
        if (data.accomplished) {
          setPriceList(data.response);
          setLoadScreen(false);
        }
      })
      .catch((error) => {
        console.error(error);
        handle_error(error);
        setPriceList(false);
      });
  }, []);

  return (
    <Layout>
      {contextHolder}

      {loadScreen ? (
        <Spin
          size={"large"}
          style={{
            display: "block",
            margin: "48px auto",
          }}
        />
      ) : (
        <Row>
          <Col span={8}>
            <Space value="large">
              {" "}
              <div
                style={{
                  padding: "19px",
                  fontWeight: "bolder",
                  fontSize: "x-large",
                }}
              >
                {" "}
                Find a plan that's right for you !!{" "}
              </div>{" "}
            </Space>
          </Col>
          <Col span={8} offset={8}>
            <div style={{ padding: "21px" }}>
              <Space value="large" align="baseline" size={20}>
                <div style={{ fontWeight: "700px" }}> Include Support</div>
                <Switch
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  defaultChecked
                  onChange={setSupportSelecetd}
                />
              </Space>
            </div>
          </Col>
        </Row>
      )}
      {priceList.length != 0 ? (
        <div className="site-card-wrapper">
          {issupportSected == true ? (
            <Row gutter={16}>
              {priceList.map((data) => {
                return (
                  <Col span={6} key={data._id}>
                    {data.isSupport ? (
                      <Badge.Ribbon text="Live Support" dot="false">
                        <Card hoverable bordered={false}>
                          <PriceCard
                            values={data}
                            showModal={(event) => setIsModalOpen(true)}
                          />
                        </Card>
                      </Badge.Ribbon>
                    ) : (
                      <Card hoverable bordered={false}>
                        <PriceCard
                          values={data}
                          showModal={(event) => setIsModalOpen(true)}
                        />
                      </Card>
                    )}
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row gutter={16}>
              {priceList.map((data) => {
                return (
                  data.isSupport == false && (
                    <Col span={6} key={data._id}>
                      <Card hoverable bordered={false}>
                        <PriceCard
                          values={data}
                          showModal={(event) => setIsModalOpen(true)}
                        />
                      </Card>
                    </Col>
                  )
                );
              })}
            </Row>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h4>No available Plans </h4>
        </div>
      )}
      <Space direction="vertical">
        <Modal
          title="Payment Confirmation"
          visible={isModalOpen}
          onOk={(event) => handleOk(event)}
          onCancel={handleCancel}
        >
          <Row gutter={16}>
            <Input.Group compact>
              <Input
                disabled
                style={{ width: "40%" }}
                defaultValue=" Enter No of Devices"
              />
              <InputNumber
                defaultValue={1}
                value={deviceValue}
                min={1}
                onChange={(value) => setDevicevalue(value)}
                max={100}
                style={{ width: "50%" }}
              />
            </Input.Group>
          </Row>
        </Modal>
      </Space>
    </Layout>
  );
};

export default PricingPage;
