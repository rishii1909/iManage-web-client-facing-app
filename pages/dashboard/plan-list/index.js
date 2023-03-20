import Layout from "../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { secure_axios } from "../../../helpers/auth";
import { Router, useRouter } from "next/router";
import {
  Col,
  Row,
  Spin,
  Card,
  Switch,
  Space,
  Badge,
  InputNumber,
  Modal,
  Input,
  Button,
} from "antd";
import PriceCard from "./priceCard";
import { loadStripe } from "@stripe/stripe-js";
import styles from "./price.module.css";

const stripePromise = loadStripe(process.env.STRIPE_PK_KEY);

const PricingPage = () => {
  const [loadScreen, setLoadScreen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);

  const [userDetils, setUserDetails] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [issupportSected, setSupportSelecetd] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceValue, setDevicevalue] = useState(1);
  const router = useRouter();

  const handleOk = () => {
    setIsModalOpen(false);
    setLoading(true);

    router.push({
      pathname: `stripe-payment/${selectedCard}`,
      query: { deviceValue: deviceValue, frompage: "list-page" },
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log(router.query, "PLAN LIST ");
    if (router.query.stripe == "true") {
      secure_axios(
        `/stripe/checkout-success`,
        router.query,
        router,
        (response) => {
          //show success message;
          if (response.accomplished) {
            if (response.accomplished) {
              secure_axios(
                `/plans/getUserPurchaseDetails`,
                {},
                router,
                (res) => {
                  if (res.accomplished) {
                    if (res.accomplished) {
                      console.log(res);
                      if (res.response)
                        if (res.response.paymentDone) {
                          router.push({
                            pathname: `purchase-details`,
                            query: {
                              frompage: "list-page",
                              docId: res.response.response._id,
                            },
                          });
                        }
                    }
                  } else {
                    handle_error(res);
                  }
                }
              );
            }
          } else {
            handle_error(response);
          }
        }
      );
    }
  }, [router.query]);

  useEffect(() => {
    secure_axios(`/plans/getUserPurchaseDetails`, {}, router, (res) => {
      if (res.accomplished) {
        if (res.accomplished) {
          console.log(res);
          if (res.response)
            if (res.response.paymentDone) {
              router.push({
                pathname: `purchase-details`,
                query: {
                  frompage: "list-page",
                  docId: res.response.response._id,
                },
              });
            }
        }
      } else {
        handle_error(res);
      }
    });
    secure_axios(`/plans/getPriceConfig`, {}, router, (response) => {
      if (response.accomplished) {
        if (response.accomplished) {
          setPriceList(response.response);
          setLoadScreen(false);
        }
      } else {
        handle_error(response);
        setPriceList(false);
      }
    });
  }, []);

  return (
    <Layout>
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
                            setSelectedCard={(id) => setSelectedCard(id)}
                            setCardDetails={(ele) => setCardDetails(ele)}
                            showModal={(event) => setIsModalOpen(true)}
                          />
                        </Card> 
                      </Badge.Ribbon>
                    ) : (
                      <Card hoverable bordered={false}>
                        <PriceCard
                          values={data}
                          setSelectedCard={(id) => setSelectedCard(id)}
                          setCardDetails={(ele) => setCardDetails(ele)}
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
                          setSelectedCard={(id) => setSelectedCard(id)}
                          setCardDetails={(ele) => setCardDetails(ele)}
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
          footer={null}
        >
          <form
            name="stripeform"
            action="http://localhost:5002/stripe/create-checkout-session"
            method="POST"
          >
            <input
              type="hidden"
              id="deviceValue"
              name="deviceValue"
              value={deviceValue}
            />
            <input
              type="hidden"
              id="selectedCard"
              name="selectedCard"
              value={selectedCard}
            />
            {cardDetails != null &&
              Object.keys(cardDetails).map((key) => (
                <input type="hidden" name={key} value={cardDetails[`${key}`]} />
              ))}
            <input
              type="hidden"
              id="cardDetails"
              name="cardDetails"
              value={JSON.stringify(cardDetails)}
            />

            <Row gutter={16}>
              <Input.Group compact>
                <Input
                  disabled
                  style={{ width: "60%" }}
                  defaultValue=" Enter No of Devices"
                />
                <InputNumber
                  defaultValue={1}
                  value={deviceValue}
                  min={1}
                  onChange={(value) => setDevicevalue(value)}
                  max={100}
                  style={{ width: "40%" }}
                />
              </Input.Group>
            </Row>
            <Row>
              <Col span={6} offset={6}></Col>
              <Col span={6} offset={6}>
                <button
                  key="submit"
                  type="submit"
                  className={styles["primary_button"]}
                >
                  Submit
                </button>
              </Col>
            </Row>
          </form>
        </Modal>
      </Space>
    </Layout>
  );
};

export default PricingPage;
