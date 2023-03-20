import {
  CheckSquareFilled,
  CloseSquareFilled,
  PieChartOutlined,
  TableOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  PageHeader,
  Row,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
} from "antd";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { handle_error } from "../../helpers/auth";
import styles from "./dashboard.module.css";
import Layout from "./layout/layout";

const num_status_dict = {
  0: "Up",
  1: "Warning",
  2: "Down",
};

const color_type_dict = {
  Up: "#3D8468",
  0: "#3D8468",
  Warning: "#FFB20F",
  1: "#FFB20F",
  Down: "#C61C32",
  2: "#C61C32",
};

const prefix_type_dict = {
  Up: <CheckSquareFilled />,
  0: <CheckSquareFilled />,
  Warning: <WarningFilled />,
  1: <WarningFilled />,
  Down: <CloseSquareFilled />,
  2: <CloseSquareFilled />,
};

const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), {
  ssr: false,
});

const getPieConfig = (data, onReady) => ({
  appendPadding: 0,
  data,
  angleField: "value",
  colorField: "type",
  color: ({ type }) => {
    if (type === "Up") {
      return "#3D8468";
    }

    if (type === "Down") {
      return "#C61C32";
    }

    return "#FFB20F";
  },
  radius: 0.8,
  label: {
    type: "inner",
    offset: "-30%",
    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    style: {
      fontSize: 14,
      textAlign: "center",
    },
  },
  interactions: [
    {
      type: "element-active",
    },
  ],
  onReady,
});

const NewDashboard = () => {
  const [newDashboard, setNewDashboard] = useState(null);

  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [levelTwo, setLevelTwo] = useState(null);
  const [levelThree, setLevelThree] = useState(null);

  const levelTwoRef = useRef();
  const levelThreeRef = useRef();

  useEffect(() => {
    fetch("https://injoi.store/monitors/dashboard/showcase/v3")
      .then((res) => res.json())
      .then((data) => {
        if (data.accomplished) {
          setNewDashboard(data.response);
          setLoadingDashboard(false);
        }

        handle_error(res);
      })
      .catch((error) => {
        console.error(error);
        handle_error(error);
        setLoadingDashboard(false);
      });
  }, []);

  useEffect(() => {
    if (levelTwoRef.current) {
      levelTwoRef.current.scrollIntoView();
    }

    setLevelThree(null);
  }, [levelTwo]);

  useEffect(() => {
    if (levelThreeRef.current) {
      levelThreeRef.current.scrollIntoView();
    }
  }, [levelThree]);

  return (
    <Layout>
      <PageHeader title={"Monitor Dashboard"}>
        {loadingDashboard ? (
          <Spin
            size={"large"}
            style={{
              display: "block",
              margin: "48px auto",
            }}
          />
        ) : newDashboard ? (
          <Row justify={"center"}>
            <Col
              xl={12}
              md={24}
              style={{
                padding: "8px",
              }}
            >
              <h3>Linux Device Statuses</h3>

              <div>
                <Pie
                  {...getPieConfig(
                    [
                      {
                        type: num_status_dict[0],
                        value: newDashboard.level_1.linux[0],
                      },
                      {
                        type: num_status_dict[1],
                        value: newDashboard.level_1.linux[1],
                      },
                      {
                        type: num_status_dict[2],
                        value: newDashboard.level_1.linux[2],
                      },
                    ],
                    (plot) => {
                      plot.on("plot:click", ({ data }) => {
                        setLevelTwo({ title: "Linux", value: "linux" });
                      });
                    }
                  )}
                ></Pie>
              </div>
            </Col>

            <Col
              xl={12}
              md={24}
              style={{
                padding: "8px",
              }}
            >
              <h3>Windows Device Statuses</h3>

              <div>
                <Pie
                  {...getPieConfig(
                    [
                      {
                        type: num_status_dict[0],
                        value: newDashboard.level_1.windows[0],
                      },
                      {
                        type: num_status_dict[1],
                        value: newDashboard.level_1.windows[1],
                      },
                      {
                        type: num_status_dict[2],
                        value: newDashboard.level_1.windows[2],
                      },
                    ],
                    (plot) => {
                      plot.on("plot:click", ({ data }) => {
                        setLevelTwo({ title: "Windows", value: "windows" });
                      });
                    }
                  )}
                ></Pie>
              </div>
            </Col>

            <Col
              xl={12}
              md={24}
              style={{
                padding: "8px",
              }}
            >
              <h3>Network Device Statuses</h3>

              <div>
                <Pie
                  {...getPieConfig(
                    [
                      {
                        type: num_status_dict[0],
                        value: newDashboard.level_1.network[0],
                      },
                      {
                        type: num_status_dict[1],
                        value: newDashboard.level_1.network[1],
                      },
                      {
                        type: num_status_dict[2],
                        value: newDashboard.level_1.network[2],
                      },
                    ],
                    (plot) => {
                      plot.on("plot:click", ({ data }) => {
                        setLevelTwo({ title: "Network", value: "network" });
                      });
                    }
                  )}
                ></Pie>
              </div>
            </Col>
          </Row>
        ) : (
          <div>No data found to display on the dashboard.</div>
        )}
      </PageHeader>

      {levelTwo && (
        <div ref={levelTwoRef}>
          <Divider />

          <PageHeader
            title={`${levelTwo.title} Devices`}
            style={{
              paddingTop: "0px",
            }}
          >
            <Tabs defaultActiveKey={"chart_view"}>
              <Tabs.TabPane
                key={"chart_view"}
                tab={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PieChartOutlined />
                    Chart View
                  </div>
                }
              >
                <Row
                  style={{
                    padding: "24px",
                  }}
                >
                  {Object.keys(newDashboard.level_2[levelTwo.value]).map(
                    (deviceName) => {
                      const deviceData =
                        newDashboard.level_2[levelTwo.value][deviceName];

                      return (
                        <Col
                          span={8}
                          className={styles["monitor_box"]}
                          onClick={() => {
                            setLevelThree({
                              title: `Monitors Under ${deviceName}`,
                              value: deviceName,
                            });
                          }}
                        >
                          <h3 style={{ textAlign: "center" }}>{deviceName}</h3>

                          <Pie
                            {...getPieConfig([
                              {
                                type: num_status_dict[0],
                                value: deviceData[0],
                              },
                              {
                                type: num_status_dict[1],
                                value: deviceData[1],
                              },
                              {
                                type: num_status_dict[2],
                                value: deviceData[2],
                              },
                            ])}
                            width={250}
                            height={250}
                            style={{ margin: "0px" }}
                          />
                        </Col>
                      );
                    }
                  )}
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane
                key={"table_view"}
                tab={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TableOutlined />
                    Table View
                  </div>
                }
              >
                <Table
                  columns={[
                    {
                      key: "deviceName",
                      title: "Hostname",
                      dataIndex: "deviceName",
                      width: "60%",
                    },
                    {
                      key: "up",
                      title: "Up",
                      dataIndex: "monitorsUp",
                      align: "center",
                    },
                    {
                      key: "warning",
                      title: "Warning",
                      dataIndex: "monitorsWarning",
                      align: "center",
                    },
                    {
                      key: "down",
                      title: "Down",
                      dataIndex: "monitorsDown",
                      align: "center",
                    },
                    {
                      title: "Action",
                      // dataIndex: "action",
                      // key: "action",
                      render: (text, record) => {
                        return (
                          <Button
                            onClick={() => {
                              setLevelThree({
                                title: `Monitors Under ${record.deviceName}`,
                                value: record.deviceName,
                              });
                            }}
                          >
                            View Monitors
                          </Button>
                        );
                      },
                      align: "right",
                    },
                  ]}
                  dataSource={Object.keys(
                    newDashboard.level_2[levelTwo.value]
                  ).map((deviceName) => {
                    const deviceData =
                      newDashboard.level_2[levelTwo.value][deviceName];

                    const monitorsUp = deviceData[0];
                    const monitorsWarning = deviceData[1];
                    const monitorsDown = deviceData[2];

                    return {
                      deviceName,
                      monitorsUp,
                      monitorsWarning,
                      monitorsDown,
                    };
                  })}
                >
                  <Table.Column width={"80%"} title={"Hostname"} />
                  <Table.Column
                    title={"Monitors Up"}
                    render={(text, record) => {
                      return <>{record.states[0].monitors}</>;
                    }}
                  />
                </Table>
              </Tabs.TabPane>
            </Tabs>
          </PageHeader>
        </div>
      )}

      {levelThree && (
        <div
          ref={levelThreeRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gridGap: "16px",
          }}
        >
          {Object.keys(newDashboard.level_3[levelThree.value]).map(
            (monitorRef) => {
              const monitorData =
                newDashboard.level_3[levelThree.value][monitorRef];

              return (
                <div
                  style={{
                    width: "280px",
                    padding: "8px",
                    backgroundColor:
                      color_type_dict[monitorData.monitor_status] + "11",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(0, 0, 0)",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      {monitorData.label || "iManage Monitor"}
                    </div>

                    <Statistic
                      valueStyle={{
                        color: color_type_dict[monitorData.monitor_status],
                        fontSize: "14px",
                      }}
                      prefix={prefix_type_dict[monitorData.monitor_status]}
                      value={num_status_dict[monitorData.monitor_status]}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: "24px",
                    }}
                  >
                    <Tag>{monitorRef}</Tag>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </Layout>
  );
};

export default NewDashboard;
