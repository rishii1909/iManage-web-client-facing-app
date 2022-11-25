import Layout from "../layout/layout";
import React, { useState, useEffect } from "react";
import MakePayment from "../../../components/stripe/index";
import styles from "../plan-list/price.module.css";
import { useRouter } from "next/router";
import { handle_error } from "../../../helpers/auth";
import { Button, Col, Row, Spin, Card, Space, Badge, Typography } from "antd";
import { secure_axios } from "../../../helpers/auth";

const CardPage = () => {
  const { Title } = Typography;
  const router = useRouter();
  const [priceCard, setPriceCard] = useState(null);
  const [deviceValue, setNoOfDevices] = useState(0);
  const [priceTotal, setTotalPrice] = useState(0);
  const [symbol, setSymbol] = useState(process.env.CUR_SYM);

  useEffect(() => {
    console.log("STRIP PAGE",router.query)
     if (router.query.id != undefined && router.query.frompage == "list-page") {
      if (router.query.deviceValue) setNoOfDevices(router.query.deviceValue);

      secure_axios(
        `/plans/getPriceConfig`,
        { id: router.query.id },
        router,
        (response) => {
          if (response.accomplished) {
            if (response.accomplished) {
              setPriceCard(response.response[0]);
            }
          } else {
            handle_error(response);
            setPriceList(false);
          }
        }
      );
      secure_axios(
        `/plans/calculateAmount`,
        router.query,
        router,
        (response) => {
          if (response.accomplished) {
            if (response.accomplished) {
              setTotalPrice(response.response.purchaseAmount);
            } else handle_error(response);
          } else {
            handle_error(response);
          }
        }
      );
      } 
      else if (router.query.id != undefined && router.query.frompage == "upgrade") {
       setNoOfDevices(1);
       secure_axios(
          `/plans/getPriceConfig`,
          { id: router.query.id },
          router,
          (response) => {
            if (response.accomplished) {
              if (response.accomplished) {
                setPriceCard(response.response[0]);
              }
            } else {
              handle_error(response);
              setPriceList(false);
            }
          }
        );
        secure_axios(
          `/plans/calculateAmount`,
          router.query,
          router,
          (response) => {
            if (response.accomplished) {
              if (response.accomplished) {
                setTotalPrice(response.response.purchaseAmount);
              } else handle_error(response);
            } else {
              handle_error(response);
            }
          }
        );
        }  else {
      router.back();
    }
  }, []);

  const goBackListingPage = () => {
    router.back();
  };
  return (
    <Layout>
      {!priceCard ? (
        <Spin
          size={"large"}
          style={{
            display: "block",
            margin: "48px auto",
          }}
        />
      ) : (
        <Space direction="vertical">
          <div className="site-card-wrapper">
            <Card
              style={{ width: "120%" }}
              title="Payment "
              extra={
                <Button type="link" onClick={(event) => goBackListingPage()}>
                  Back
                </Button>
              }
              bordered={false}
            >
              <Row>
                <Col span={10}>
                  <Title level={5}>No of devices entered : {deviceValue}</Title>

                  {priceCard.isSupport ? (
                    <Badge.Ribbon text="Live Support" dot="false">
                      <Card bordered={true}>
                        <div className={styles["cards_wrapper"]}>
                          <div className={styles["pricing_card two"]}>
                            <div className={styles["details"]}>
                              <h2 className={styles["title"]}>
                                {priceCard.name}
                              </h2>
                              <p className={styles["plan_description"]}>
                                {priceCard.devices}
                              </p>

                              <p className={styles["price"]}>
                                {symbol}
                                {priceTotal}
                              </p>
                              <p className={styles["price_description"]}>
                                {priceCard.other}
                              </p>
                              <p className={styles["price_description"]}>
                                {priceCard.hours}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  ) : (
                    <Card bordered={true}>
                      <div className={styles["cards_wrapper"]}>
                        <div className={styles["pricing_card two"]}>
                          <div className={styles["details"]}>
                            <h2 className={styles["title"]}>
                              {priceCard.name}
                            </h2>
                            <p className={styles["plan_description"]}>
                              {priceCard.devices}
                            </p>

                            <p className={styles["price"]}>{priceTotal}</p>
                            <p className={styles["price_description"]}>
                              {priceCard.other}
                            </p>
                            <p className={styles["price_description"]}>
                              {priceCard.hours}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </Col>
                <Col span={10}>
                  <br />
                  {/* <Title level={5}> </Title> */}

                  <MakePayment priceCard={priceCard} />
                </Col>
              </Row>
            </Card>
          </div>
        </Space>
      )}
    </Layout>
  );
};

export default CardPage;
