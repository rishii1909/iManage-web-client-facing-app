import Layout from "../layout/layout";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { handle_error } from "../../../helpers/auth";
import { Button, Col, Row, Spin, Card, Space, Table, message } from "antd";
import { secure_axios } from "../../../helpers/auth";

const CardPage = () => {
  const router = useRouter();
  const [priceCard, setPriceCard] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [prorationamount, setProrationamount] = useState(0);
  const [upcomingInvoiceDetails, setUpcomingInvoiceDetails] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (router.query.id != undefined && router.query.frompage == "upgrade") {
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
        `/plans/previewProration`,
        router.query,
        router,
        (response) => {
          if (response.accomplished) {
            if (response.accomplished) {
              if (response.response.proRationAmount.lines.data.length == 3) {
                setInvoiceDetails(
                  response.response.proRationAmount.lines.data.slice(0, 2)
                );
                setProrationamount(
                  response.response.proRationAmount.lines.data[1].amount +
                    response.response.proRationAmount.lines.data[0].amount
                );
                setUpcomingInvoiceDetails(response.response.proRationAmount);
              }
            } else handle_error(response);
          } else {
            handle_error(response);
          }
        }
      );
    } else {
      router.back();
    }
  }, []);

  const upgradePlan = (event) => {
    event.preventDefault();
    setLoader(true);
    secure_axios(
      `/plans/upgradePlan`,
      { planId: priceCard._id },
      router,
      (resp) => {
        setLoader(false);

        if (resp.accomplished) {
          if (resp.response.success) 
          {
            message.success(resp.response.message);
            router.back();
          }
          else {
            message.error(resp.response.message);
            router.back();
          }
        } else {
          handle_error(resp);
        }
      }
    );
  };
  const goBackListingPage = () => {
    router.back();
  };
  const fixedColumns = [
    {
      title: "Description",
      dataIndex: "description",
      fixed: "left",
      width: 500,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      fixed: "left",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      fixed: "left",
      width: 100,
      render: (text) => <a>{text / 100} $</a>,
    },
  ];

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
          <Spin tip="Please wait. Attempting to pay..." spinning={loader}>
            <div className="site-card-wrapper">
              <Card
                style={{ width: "120%" }}
                title="Upgrade Payment  "
                extra={
                  <Button type="link" onClick={(event) => goBackListingPage()}>
                    Back
                  </Button>
                }
                bordered={false}
              >
                <Row>
                  <Col>
                    <Table
                      title={() => (
                        <b>
                          {upcomingInvoiceDetails &&
                            upcomingInvoiceDetails.lines.data[2]
                              .description}{" "}
                          {priceCard.isSupport ? priceCard.hours : ""}
                        </b>
                      )}
                      footer={() => (
                        <Button
                          type="primary"
                          onClick={(event) => upgradePlan(event)}
                        >
                          Pay
                        </Button>
                      )}
                      columns={fixedColumns}
                      dataSource={invoiceDetails}
                      pagination={false}
                      bordered
                      summary={() => (
                        <Table.Summary fixed>
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                              Summary (
                              <b>
                                {" "}
                                {upcomingInvoiceDetails &&
                                  moment
                                    .unix(upcomingInvoiceDetails.period_start)
                                    .format("ll")}{" "}
                                -
                                {upcomingInvoiceDetails &&
                                  moment
                                    .unix(upcomingInvoiceDetails.period_end)
                                    .format("ll")}
                                )
                              </b>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                              {prorationamount / 100}$
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </Spin>
        </Space>
      )}
    </Layout>
  );
};

export default CardPage;
