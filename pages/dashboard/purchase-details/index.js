import Layout from "../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Space, Modal, Descriptions, Spin,
  message,
 } from "antd";
import UpgradePage from "../upgrade-plan/index";
import DowngradePage from "../downgrade-plan/index";

import { useRouter } from "next/router";
import { secure_axios } from "../../../helpers/auth";
import MakePayment from "../../../components/stripe/index";

const PaymentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [size, setSize] = useState("large"); // default is 'middle'
  const [planDetails, setPlanDetails] = useState(null);
  const [queryParams, setQueryParams] = useState(null);
  const [upgradeType, setUpgradeType] = useState("upgrade");

  const router = useRouter();

  const showModal = (type) => {
    setIsModalOpen(true);
    setUpgradeType(type);
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
    if (upgradeType == "downgrade") {
      console.log("Downgrade Params", params);
      downgradePlan(params);
    } else {
      router.push({
        pathname: `upgrade-plan/${params.id}`,
        query: params,
      });
    }
  };
  useEffect(() => {
    console.log(router.query, "PAYMENT API ");
    if (router.query.fromPage == "upgrade") {
      upgradePaymentMethod(router.query);
    } else {
      createPaymentMethod(router.query);
    }
    setQueryParams(router.query);
  }, [router.query]);

  const createPaymentMethod = (data) => {
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

  const upgradePaymentMethod = (data) => {
    if (data.payment_intent) {
      const dataToPass = {
        paymentId: data.payment_intent,
        paymentStatus: data.redirect_status,
        payment_intent_client_secret: data.redirect_status,
        planId: data.planid,
        upgradePlan: true,
      };
      secure_axios(`/plans/upgradePayment`, dataToPass, router, (res) => {
        if (res.accomplished) {
          if (res.accomplished) {
            console.log(res);
            var getUserDetails = {
              docId: res.response.updatePurchase._id,
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

  const downgradePlan = (params) => {
    //downgradePlan
    if (params.id) {
      const dataToPass = {
        planId: params.id,
        upgradePlan: false,
      };
      secure_axios(`/plans/downgradePlan`, dataToPass, router, (res) => {
        if (res.accomplished) {
          if (res.accomplished) {
            console.log(res);
            var getUserDetails = {
              docId: res.response.updatePurchase._id,
            };
            getUserDetail(getUserDetails);
            message.success(res.response.message);

          }
        } else {
          handle_error(res);
        }
      });
    }
  };
  return (
    <Layout>
      {planDetails == null && (
        <Spin
          size={"large"}
          style={{
            display: "block",
            margin: "48px auto",
          }}
        />
      )}
      <Space direction="vertical">
        {planDetails && planDetails.plan_info && (
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
                {planDetails.validityEnd}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Payment Id"
              >
                {planDetails.transactions_info.subscriptionId}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Plan Price"
              >
                {planDetails.isUpgraded && "Additional "}
                { planDetails.plan_info.price}{" "}
              </Descriptions.Item>
              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="No of    Devices"
              >
                {planDetails.transactions_info.quantity}
              </Descriptions.Item>

              <Descriptions.Item
                contentStyle={{ fontWeight: "600", color: "green" }}
                label="Payment Status"
              >
                {planDetails.transactions_info.paymentStatus}{" "}
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
                  <a onClick={(event) => showModal("upgrade")}>Upgrade My Plan</a>
                </Descriptions.Item>
              )}
              {/* {planDetails.isUpgraded && (
                <Descriptions.Item
                  contentStyle={{ fontWeight: "600" }}
                  label="Upgrade Payment Id"
                >
                  {" "}
                  {planDetails.upgradePaymentId}
                </Descriptions.Item>
              )} */}
              {planDetails.isUpgraded && (
                <Descriptions.Item
                  contentStyle={{ fontWeight: "600" }}
                  label=""
                >
                  {" "}
                  <a onClick={(event) => showModal("downgrade")}>
                    Downgrade My Plan
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Space>
      <Modal
        title={
          upgradeType == "upgrade" ? "Upgrade to Pro" : "Downgrade to Lite"
        }
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {upgradeType == "upgrade" && (
          <UpgradePage handleCancel={(event) => handleClick(event)} />
        )}
        {upgradeType == "downgrade" && (
          <DowngradePage handleCancel={(event) => handleClick(event)} />
        )}
      </Modal>
    </Layout>
  );
};

export default PaymentPage;
