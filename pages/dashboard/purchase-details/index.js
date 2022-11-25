import Layout from "../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Space, Modal, Descriptions, Spin } from "antd";
import UpgradePage from "../upgrade-plan/index";
import { useRouter } from "next/router";
import { secure_axios } from "../../../helpers/auth";
import MakePayment from "../../../components/stripe/index";

const PaymentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [size, setSize] = useState("large"); // default is 'middle'
  const [planDetails, setPlanDetails] = useState(null);
  const [queryParams, setQueryParams] = useState(null);

  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = (params) => {
    setIsModalOpen(false);

    // console.log("upgrade",params, queryParams);
    // router.push({
    //   pathname: `stripe-payment/${params.id}`,
    //   query: params,
    // });
  };
  const handleClick = (params) => {
    setIsModalOpen(false);
    router.push({
      pathname: `stripe-payment/${params.id}`,
      query: params,
    });
  };
  useEffect(() => {
    createPaymentMethod(router.query);
    setQueryParams(router.query);
  }, [router.query]);

  const createPaymentMethod = (data) => {
    console.log(data);
    if (data.payment_intent) {
      const dataToPass = {
        paymentId: data.payment_intent,
        paymentStatus: data.redirect_status,
        payment_intent_client_secret: data.redirect_status,
        planId: data.planid,
        deviceValue: data.dvalue,
      };
      secure_axios(`/plans/createPayment`, dataToPass, router, (res) => {
        if (res.accomplished) {
          if (res.accomplished) {
            console.log(res);
            var getUserDetails = {
              docId: res.response.response._id,
            };
            getUserDetail(getUserDetails);
          }
        } else {
          handle_error(res);
        }
      });
    } else if ((data.frompage = "list-page" && data.docId)) {
      console.log("list page", data);
      getUserDetail(data);
    }
  };

  const getUserDetail = (data) => {
    secure_axios(
      `/plans/getPurchasePlanDetails`,
      { id: data.docId },
      router,
      (res) => {
        if (res.accomplished) {
          if (res.accomplished) {
            console.log(res);
            setPlanDetails(res.response.response);
          } else {
            handle_error(res);
          }
        }
      }
    );
  };

  return (
    <Layout>
       {planDetails == null && 
          <Spin
            size={"large"}
            style={{
              display: "block",
              margin: "48px auto",
            }}
          />
        }
      <Space direction="vertical">
        {planDetails && 
          <Card
            title="Subscription"
            extra={
              planDetails && (
                <Button type="primary" icon={<DownloadOutlined />} size={size}>
                  Download
                </Button>
              )
            }
            style={{ width: "100%" }}
          >
            
            <Descriptions>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Current Plan"
              >
                {planDetails.plan_info.name}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Next Payment Date"
              >
                {planDetails.validityStart}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Payment Id"
              >
                {planDetails.paymentId}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Amount"
              >
                ${planDetails.amount}{" "}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="  Devices"
              >
                {planDetails.plan_info.devices}
              </Descriptions.Item>

              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="No of  Devices"
              >
                {planDetails.noOfdevices}{" "}
              </Descriptions.Item>

              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Live Support"
              >
                {planDetails.plan_info.isSupport
                  ? "Available"
                  : "Not Available"}{" "}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Duraition"
              >
                {planDetails.plan_info.hours}{" "}
              </Descriptions.Item>

              {planDetails.plan_info.canUpgrade && (
                <Descriptions.Item
                  contentStyle={{ fontWeight: "600" }}
                  label=""
                >
                  {" "}
                  <a onClick={(event) => showModal()}>Upgrade Plans</a>
                </Descriptions.Item>
              )}
              {planDetails.isUpgraded && (
                <Descriptions.Item
                  contentStyle={{ fontWeight: "600" }}
                  label="Upgrade Payment Id"
                >
                  {" "}
                  {planDetails.upgradePaymentId}
                </Descriptions.Item>
              )}
            </Descriptions>
            
          </Card>
        }
       
      </Space>
      <Modal
        title="Upgrade To Pro"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <UpgradePage handleCancel={(event) => handleClick(event)} />
      </Modal>
    </Layout>
  );
};

export default PaymentPage;
