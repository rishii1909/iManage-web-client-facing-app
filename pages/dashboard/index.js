import {
  CheckSquareFilled,
  CloseSquareFilled,
  LoadingOutlined,
  LoginOutlined,
  MinusCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Empty,
  message,
  PageHeader,
  Row,
  Spin,
  Statistic,
  Tag,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { handle_error, secure_axios } from "../../helpers/auth";
import styles from "./dashboard.module.css";
import Dashboard from "./layout/layout";

const dict_two_states = {
  0: "Up",
  1: "Down",
  [-1]: "Inactive",
};

const dict_three_states = {
  0: "OK",
  1: "Warning",
  2: "Failure",
  [-1]: "Inactive",
};

const Pie = dynamic(() => import("@ant-design/charts").then((mod) => mod.Pie), {
  ssr: false,
});

const DashboardIndex = () => {
  const router = useRouter();

  const [dashboard, setDashboard] = useState({});
  const [twoStates_lvl_1, setTwoStates_lvl_1] = useState([]);
  const [threeStates_lvl_1, setThreeStates_lvl_1] = useState([]);
  const [loaded_two_states, setLoaded_two_states] = useState(false);
  const [loaded_three_states, setLoaded_three_states] = useState(false);
  const [level_2, setLevel_2] = useState([]);
  const [level_3, setLevel_3] = useState([]);
  const [level_2_state, setLevel_2_state] = useState(null);
  const [level_3_state, setLevel_3_state] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [calibrate_show, setCalibrate_show] = useState(false);

  const ref_level_2 = useRef(null);
  const ref_level_3 = useRef(null);

  const [redirectingToAggCharts, setRedirectingToAggCharts] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  function calibrate() {
    setLoaded_two_states(false);
    setLoaded_three_states(false);
    secure_axios("/monitors/dashboard/calibrate", {}, router, (response) => {
      try {
        console.log(response);
        if (response.accomplished) {
          message.success(response.response.message);
          fetchDashboard();
        } else {
          message.error(response.response);
        }
      } catch (error) {}
    });
  }

  function fetchDashboard() {
    secure_axios("/monitors/dashboard/showcase/v3", {}, router, (response) => {
      try {
        console.log(response);
        if (response.accomplished) {
          if (response.response == []) {
            setTwoStates_lvl_1([]);
            setLoaded_two_states(true);
            setThreeStates_lvl_1([]);
            setLoaded_three_states(true);
            return message.info("No monitors found.");
          }
          setDashboard(response.response);
          const two_keys = Object.keys(response.response.level_1.two_states);
          const three_keys = Object.keys(
            response.response.level_1.three_states
          );
          const two_states = [];
          const three_states = [];
          console.log(three_keys);
          let three_sum = 0;
          let two_sum = 0;
          three_keys.forEach((key) => {
            const monitors = response.response.level_1.three_states[key];
            three_sum += monitors;
            dict_three_states[key] &&
              three_states.push({
                type: dict_three_states[key],
                monitors: monitors,
                // code : key,
                key: key,
              });
          });
          two_keys.forEach((key) => {
            const monitors = response.response.level_1.two_states[key];
            two_sum += monitors;
            dict_two_states[key] &&
              two_states.push({
                type: dict_two_states[key],
                monitors: monitors,
                // code : key,
                key: key,
              });
          });
          setTwoStates_lvl_1(two_sum > 0 ? two_states : []);
          setLoaded_two_states(true);
          setThreeStates_lvl_1(three_sum > 0 ? three_states : []);
          setLoaded_three_states(true);
        }
      } catch (error) {
        console.log(error);
        setTwoStates_lvl_1([]);
        setLoaded_two_states(true);
        setThreeStates_lvl_1([]);
        setLoaded_three_states(true);
      }
    });
  }

  function level_two(state) {
    setActiveState(state);
    const dash = dashboard.level_2[`${state == 2 ? "two" : "three"}_states`];
    const two_keys = Object.keys(dash);
    const two_keys_arr = [];
    two_keys.forEach((key) => {
      const current = dash[key];
      const states_arr = [];
      let monitors_count = 0;
      for (const code in current) {
        if (Object.hasOwnProperty.call(current, code)) {
          const monitors = current[code];
          monitors_count += monitors;
          states_arr.push({
            type: state == 2 ? dict_two_states[code] : dict_three_states[code],
            monitors: monitors,
          });
        }
      }
      two_keys_arr.push({
        key: key,
        states: states_arr,
        count: monitors_count,
      });
    });
    console.log(two_keys_arr);
    setLevel_2(two_keys_arr);
    setLevel_2_state(state);
    setLevel_3([]);
    ref_level_2.current.scrollIntoView();
  }

  function level_three(key) {
    setLevel_3_state(key);
    // return console.log(dashboard.level_3)
    const dash =
      dashboard.level_3[`${level_2_state == 2 ? "two" : "three"}_states`][key];
    const monitors = [];
    for (const monitor_key in dash) {
      if (Object.hasOwnProperty.call(dash, monitor_key)) {
        const monitor = dash[monitor_key];
        monitor.ref = monitor_key;
        // if(level_2_state == 2 && monitor.monitor_status == 1) monitor.monitor_status = 2;
        if (activeState == 2) {
          switch (monitor.monitor_status) {
            case 0:
              monitor.color = "#3f8600";
              monitor.color_faded = "#ecf3e6";
              monitor.symbol = <CheckSquareFilled />;
              monitor.verbose = "Up";
              break;

            case 1:
              monitor.color = "#cf1322";
              monitor.color_faded = "#fae7e9";
              monitor.symbol = <CloseSquareFilled />;
              monitor.verbose = "Down";
              break;

            default:
              monitor.color = "#a020f0";
              monitor.color_faded = "#f6e9fe";
              monitor.symbol = <MinusCircleFilled />;
              monitor.verbose = "Inactive";
              break;
          }
        } else {
          switch (monitor.monitor_status) {
            case 0:
              monitor.color = "#3f8600";
              monitor.color_faded = "#ecf3e6";
              monitor.symbol = <CheckSquareFilled />;
              monitor.verbose = "OK";
              break;

            case 1:
              monitor.color = "#eed202";
              monitor.color_faded = "#fdfbe6";
              monitor.symbol = <WarningFilled />;
              monitor.verbose = "Warning";
              break;

            case 2:
              monitor.color = "#cf1322";
              monitor.color_faded = "#fae7e9";
              monitor.symbol = <CloseSquareFilled />;
              monitor.verbose = "Failure";
              break;

            default:
              monitor.color = "#a020f0";
              monitor.color_faded = "#f6e9fe";
              monitor.symbol = <MinusCircleFilled />;
              monitor.verbose = "Inactive";
              break;
          }
        }
        monitors.push(monitor);
      }
    }
    setLevel_3(monitors);
    ref_level_3.current.scrollIntoView();
  }

  let config_two_states = {
    appendPadding: 0,
    data: twoStates_lvl_1,
    angleField: "monitors",
    colorField: "type",
    color: ({ type }) => {
      if (type === "Up") {
        return "#3d8468";
      }
      if (type === "Down") {
        return "#c61c32";
      }
      return "#454545";
    },
    radius: 0.8,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
    onReady: (plot) => {
      plot.on("plot:click", ({ data }) => {
        level_two(2);
      });
    },
  };

  let config_three_states = {
    appendPadding: 0,
    data: threeStates_lvl_1,
    angleField: "monitors",
    colorField: "type",
    color: ({ type }) => {
      if (type === "OK") {
        return "#3d8468";
      }
      if (type === "Warning") {
        return "#FFB20F";
      }
      if (type === "Failure") {
        return "#c61c32";
      }
      return "#454545";
    },
    radius: 0.8,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
    onReady: (plot) => {
      plot.on("plot:click", ({ data }) => {
        level_two(3);
      });
    },
  };

  function level_2_config(host) {
    return {
      data: host.states,
      appendPadding: 0,
      angleField: "monitors",
      colorField: "type",
      color: ({ type }) => {
        switch (level_2_state) {
          case 2:
            if (type === "Up") {
              return "#3d8468";
            }
            if (type === "Down") {
              return "#c61c32";
            }
            break;

          case 3:
            if (type === "OK") {
              return "#3d8468";
            }
            if (type === "Warning") {
              return "#FFB20F";
            }
            if (type === "Failure") {
              return "#c61c32";
            }

          default:
            break;
        }
        return "#454545";
      },
      radius: 1,
      innerRadius: 0.5,
      label: {
        type: "inner",
        offset: "-50%",
        labelHeight: 28,
        content: "",
      },
      interactions: [{ type: "element-active" }],
      statistic: {
        title: true,
        content: {
          style: {
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "16px",
            fontWeight: "600",
          },
          content: `${host.count} monitor${host.count > 1 ? "s" : ""}`,
        },
      },
    };
  }

  const redirectMonitor = (monitor_ref) => {
    setRedirectingToAggCharts(monitor_ref);
    secure_axios(
      `/monitors/enumerate/monitor`,
      {
        monitor_ref,
      },
      router,
      ({ response }) => {
        const device_id = response.metadata.device_id;
        const monitor_type = response.metadata.monitor_type;
        const monitor_id = response.metadata._id;
        router.push(
          `/dashboard/devices/user/${device_id}/view/${monitor_type}/${monitor_id}/?tab=monitor_aggregates`
        );
      }
    );
  };

  return (
    <Dashboard>
      <div style={{ display: "flex", flexFlow: "column" }}>
        <div>
          <Row style={{ paddingTop: "1.6em" }}>
            <Col xl={12} md={24}>
              <PageHeader style={{ padding: "0px" }} title="2 state monitors" />
              <p>
                Monitors that have either Up/Down monitor log states for
                detection.
              </p>

              <div className={styles["pie-wrapper"]}>
                {twoStates_lvl_1 && twoStates_lvl_1.length > 0 ? (
                  <Pie
                    {...config_two_states}
                    style={{
                      opacity: twoStates_lvl_1 ? "1" : "0.4",
                      width: "100%",
                    }}
                  ></Pie>
                ) : loaded_two_states ? (
                  <Empty description={"No monitors to show"}></Empty>
                ) : (
                  <Spin size="large" style={{ position: "absolute" }}></Spin>
                )}
              </div>
            </Col>
            <Col xl={12} md={24}>
              <PageHeader style={{ padding: "0px" }} title="3 state monitors" />
              <p>
                Monitors that have one of OK/Warning/Failure monitor log states
                for detection.
              </p>

              <div className={styles["pie-wrapper"]}>
                {threeStates_lvl_1 && threeStates_lvl_1.length > 0 ? (
                  <Pie
                    {...config_three_states}
                    style={{
                      opacity: threeStates_lvl_1 ? "1" : "0.4",
                      width: "100%",
                    }}
                  ></Pie>
                ) : loaded_three_states ? (
                  <Empty description={"No monitors to show"}></Empty>
                ) : (
                  <Spin size="large" style={{ position: "absolute" }}></Spin>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        {level_2.length > 0 && (
          <>
            <Divider />
            <PageHeader
              style={{ padding: "0px" }}
              title={level_2_state + " state monitors"}
            />
          </>
        )}
        <Row
          justify="space-evenly"
          align="top"
          style={{ paddingTop: "1em" }}
          ref={ref_level_2}
        >
          {level_2.map((host) => (
            <>
              <Col
                span={6}
                className={styles["monitor_box"]}
                onClick={() => level_three(host.key)}
              >
                <h3 style={{ textAlign: "center", paddingRight: "12%" }}>
                  {host.key}
                </h3>
                <Pie
                  {...level_2_config(host)}
                  // width={250}
                  // height={220}

                  data={host.states}
                  style={{ margin: "0px" }}
                />
              </Col>
            </>
          ))}
        </Row>
      </div>
      <div>
        {level_3.length > 0 && (
          <>
            <Divider />
            <PageHeader style={{ padding: "0px" }} title={level_3_state} />
          </>
        )}
        <Row
          justify="space-between"
          align="top"
          style={{
            paddingTop: "2em",
            gridGap: "16px",
            justifyContent: "center",
          }}
          ref={ref_level_3}
        >
          {level_3.map((monitor) => (
            <>
              <Col
                onClick={() => {
                  redirectMonitor(monitor.ref);
                }}
                style={{
                  border: `2px solid lightGray`,
                  borderRadius: "5px",
                  cursor: "pointer",
                  opacity: monitor.ref === redirectingToAggCharts ? 0.45 : 1,
                }}
              >
                <div
                  className={styles["monitor_box"]}
                  style={{
                    backgroundColor: monitor.color_faded,
                    padding: "1.6em 1.6em",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(black, 0.6)",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    {monitor.label ? monitor.label : "iManage monitor"}
                  </div>

                  <Statistic
                    // title={monitor.label}
                    prefix={monitor.symbol}
                    valueStyle={{ color: monitor.color }}
                    value={monitor.verbose}
                  />
                  <br></br>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tag>{monitor.ref}</Tag>
                    {monitor.ref === redirectingToAggCharts ? (
                      <LoadingOutlined />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Col>
            </>
          ))}
        </Row>

        <Divider></Divider>

        <div
          onMouseEnter={() => setCalibrate_show(true)}
          onMouseLeave={() => setCalibrate_show(false)}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{ margin: "0 1em", opacity: `${calibrate_show ? 1 : 0.4}` }}
          >
            Deleted monitors visible in the dashboard ?
          </div>
          <Button
            type="primary"
            style={{
              maxWidth: `${calibrate_show ? "200px" : "0px"}`,
              opacity: `${calibrate_show ? "1" : "0"}`,
              transition: "0.3s ease-in",
              overflow: "hidden",
            }}
            icon={<LoginOutlined />}
            onClick={() => calibrate()}
          >
            Calibrate
          </Button>
        </div>
      </div>
      {/* {threeStates.length > 0 && <Pie {...config_three_states} ></Pie>} */}
    </Dashboard>
  );
};

export default DashboardIndex;
