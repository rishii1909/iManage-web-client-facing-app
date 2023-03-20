import { PlusSquareFilled } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Collapse,
  Divider,
  Form,
  message,
  Select,
  Tabs,
} from "antd";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AssignAdminsPanel from "../../../../../../../components/monitors/AssignAdmins";
import NotificationRulesPanel from "../../../../../../../components/monitors/NotificationRules";
import NotificationTemplatePanel from "../../../../../../../components/monitors/NotificationTemplate";
import RetentionSchedulePanel from "../../../../../../../components/monitors/RetentionSchedulePanel";
import DetailsPanel from "../../../../../../../components/monitor_panels";
import RightAlignedButtonWrapper from "../../../../../../../components/ui/RetentionSchedulePanel";
import { handle_error, secure_axios } from "../../../../../../../helpers/auth";
import {
  capitalizeFirstLetter,
  monitor_types,
} from "../../../../../../../helpers/format";
import Device_dashboard from "../../../../Device_dashboard";

const { Option } = Select;

var valid_monitors = [
  "uptime_monitor",
  "url_monitor",
  "tcp_monitor",
  "cpu_monitor",
  "disk_monitor",
  "file_monitor",
  "service_monitor",
  "snmp_monitor",
  "cron_monitor",
  "inode_monitor",
  "load_monitor",
  "swap_monitor",
  "sql_monitor",
  "performance_monitor",
];

const { Panel } = Collapse;
const { TabPane } = Tabs;

const create_monitor_view = () => {
  const router = useRouter();
  const { device_type, device_id, monitor_type, monitor_id } = router.query;
  const [metaData, setMetaData] = useState({});
  const [accordion, setAccordion] = useState([0, 1, 2, 3, 4, 5]);
  const [admins_checked, setAdmins_checked] = useState(false);
  const [device, setDevice] = useState(null);
  const [agent_id, setAgent_id] = useState(null);
  const [monitor, setMonitor] = useState(null);
  const [template, setTemplate] = useState(null);
  const [agent, setAgent] = useState(null);
  const [retention_schedule, setRetention_schedule] = useState(null);
  const [form] = Form.useForm();

  const [defaultTabKey, setDefaultTabKey] = useState("");

  useEffect(() => {
    setDefaultTabKey(router.query.tab || "monitor_details");
  }, [router]);

  if (typeof window !== "undefined" && monitor_type) {
    if (valid_monitors.includes(monitor_type)) {
      console.log(monitor_type);
      var MonitorSettingsPanel = dynamic(() =>
        import(
          `../../../../../../../components/monitors/settings/${monitor_type}`
        )
      );
      var MonitorAggregatesPanel = dynamic(() =>
        import(
          `../../../../../../../components/monitors/aggregates/${monitor_type}`
        )
      );
    } else {
      if (typeof monitor_type !== "undefined" && typeof window !== "undefined")
        router.push("/404");
    }
  }
  useEffect(async () => {
    if (form && device_id && monitor_id) {
      secure_axios(
        "/devices/enumerate/device",
        { device_id: device_id, show_creds: true },
        router,
        (r) => {
          console.log(r);
          if (r.accomplished) {
            setDevice(r.response);
          } else {
            message.error(r.response.message ? r.response.message : r.response);
          }
        }
      );

      secure_axios(
        "/monitors/enumerate/monitor",
        { monitor_id },
        router,
        (r) => {
          console.log(r);
          if (r.accomplished) {
            setMonitor(r.response.monitor.response);
            console.log("MONITOR HERE", r.response.monitor.response);
            form.setFieldsValue(r.response.monitor.response);
            setMetaData(r.response.metadata);
            setAgent_id(r.response.metadata.agent_id._id);
            console.log("METADATA", r.response.metadata);
            form.setFieldsValue({ label: r.response.metadata.label });
            const retention_schedule = r.response.metadata.retention_schedule;
            setRetention_schedule(retention_schedule);
            console.log("RETSCHEDULE", retention_schedule);
            setTemplate(r.response.notification_template);
            form.setFieldsValue(r.response.notification_template);
            setAgent(r.response.metadata.agent_id);
          } else {
            handle_error(r);
          }
        }
      );
    }
  }, [form, device_id, monitor_id]);

  const on_finish = async (data) => {
    let notification_rules = {};
    if (data.custom == "every") {
      notification_rules = {
        alert_all: true,
        alert_rules: {
          every: parseInt(data.every_count),
        },
      };
    } else if (data.custom == "custom") {
      notification_rules = {
        alert_all: false,
        alert_rules: {
          fto: data.fto,
          wto: data.wto,
          otow: data.otow,
          owtof: data.owtof,
          owtof_count: data.owtof_count,
          otow_count: data.otow_count,
        },
      };
    } else {
      notification_rules = {
        alert_all: false,
        alert_rules: {
          every: 1,
        },
      };
    }
    const merged = {
      monitor_id,
      ...data,
      ...device.creds,
      notification_rules,
      retention_schedule: {
        raw_data: data.raw_data ? data.raw_data : 1,
        daily_aggr: data.daily_aggr ? data.daily_aggr : 1,
        weekly_aggr: data.weekly_aggr ? data.weekly_aggr : 1,
        monthly_aggr: data.monthly_aggr ? data.monthly_aggr : 1,
      },
    };
    if (data.host) merged.host = data.host;
    merged.type = monitor_type;
    merged.device_id = device_id;
    const loading = message.loading("Updating monitor...", 0);
    if (data.editing_template) {
      await secure_axios(
        "/notifs/create",
        {
          name: data.template_name,
          header: data.template_header,
          body: data.template_body,
        },
        router,
        (response) => {
          if (response.accomplished) {
            merged.notification_template = response._id;
            secure_axios(
              `/monitors/update/${device_type}`,
              merged,
              router,
              (response) => {
                console.log(response);
                if (response.accomplished) {
                  message.success("Monitor updated successfully!");
                  // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
                  // loading.then(() => {
                  // })
                  // Router.push('/dashboard/devices')
                } else {
                  handle_error(response);
                }
                loading();
              }
            );
          } else {
            handle_error(response);
            loading();
          }
        }
      );
    } else {
      await secure_axios(
        `/monitors/update/${device_type}`,
        merged,
        router,
        (response) => {
          console.log(response);
          if (response.accomplished) {
            message.success("Monitor updated successfully!");
            router.push(`/dashboard/devices/${device_type}/${device_id}`);
            // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
            // loading.then(() => {
            // })
            // Router.push('/dashboard/devices')
          } else {
            handle_error(response);
          }
          loading();
        }
      );
    }
  };

  const on_finish_failed = () => {
    message.error("Submit failed!");
  };

  const [auth, setAuth] = useState(null);
  const [passphrase, setpassphrase] = useState(false);

  const layout = {
    labelCol: { offset: 1, span: 4 },
    wrapperCol: { offset: 4, span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 16, span: 4 },
  };

  return (
    <Device_dashboard subdomain="Add Device">
      <Breadcrumb>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/dashboard/devices?device_tab=${"device_type"}`}>
            Devices
          </Link>
        </Breadcrumb.Item>
        <BreadcrumbItem>{capitalizeFirstLetter(device_type)}</BreadcrumbItem>
        {/* <Breadcrumb.Item>{device && device.name ? device.name : ""}</Breadcrumb.Item> */}
      </Breadcrumb>

      {/* <Tabs style={{minHeight : '100vh'}} activeKey="monitor_aggregates"> */}
      {defaultTabKey && (
        <Tabs
          style={{ minHeight: "100vh" }}
          key={defaultTabKey}
          defaultActiveKey={defaultTabKey}
        >
          <TabPane
            tab={`${monitor ? monitor.label : "Monitor"} aggregates`}
            key="monitor_aggregates"
          >
            <div style={{ height: "100%" }}>
              {MonitorAggregatesPanel && (
                <MonitorAggregatesPanel
                  monitor={monitor && monitor}
                  device_id={metaData && metaData.device_id}
                  agent_id={agent && agent._id}
                />
              )}
            </div>
          </TabPane>
          <TabPane tab="Monitor details" key="monitor_details">
            {/* <Link href={`/dashboard/devices/${"device_type"}/${device_id}/monitors/add`}>
                      <Button type="primary" icon={<PlusOutlined/>} >
                        Add a monitor
                      </Button>
                    </Link>
                    <br></br>
                    <br></br> */}
            <Form
              form={form}
              preserve={false}
              colon={false}
              {...layout}
              layout="horizontal"
              onFinish={on_finish}
              onFinishFailed={on_finish_failed}
              autoComplete="off"
              labelAlign="left"
              labelCol={{ span: 5 }}
              requiredMark={false}
              // onFieldsChange={(fields)=>console.log(fields)}
              style={{
                display: "flex",
                justifyContent: "center",
                flexFlow: "column",
              }}
            >
              <Collapse defaultActiveKey={accordion}>
                <Panel forceRender header="Details" key={0}>
                  {device_type && device && (
                    <DetailsPanel
                      device_type={device_type}
                      device_agent={device.type === 2 ? 1 : device.type}
                      form={form}
                      monitor_type={
                        monitor_type ? monitor_types[monitor_type] : ""
                      }
                      host={device.host}
                      device_name={device && device.name}
                      agentCallback={setAgent_id}
                      agent={agent}
                      remote_data={monitor}
                      metadata={metaData}
                    ></DetailsPanel>
                  )}
                  <RightAlignedButtonWrapper>
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion([0,1])}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
                <Panel forceRender header="Settings" key={1}>
                  {MonitorSettingsPanel && (
                    <MonitorSettingsPanel
                      {...(monitor && monitor.url
                        ? { hostname: monitor.url }
                        : {})}
                      device_id={device_id}
                      device_type={device_type}
                      monitor_type={
                        monitor_type ? monitor_types[monitor_type] : ""
                      }
                      device_name={device && device.name}
                      agent_id={agent_id}
                      form={form}
                    />
                  )}
                  <RightAlignedButtonWrapper>
                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(0)}>Previous</Button> */}
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion([0,1,2])}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
                <Panel forceRender header="Log Settings" key={2}>
                  <RetentionSchedulePanel
                    form={form}
                    retention_schedule={{ ...retention_schedule }}
                  />
                  <RightAlignedButtonWrapper>
                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(1)}>Previous</Button> */}
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion()}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
                <Panel forceRender header="Notification Template" key={3}>
                  <NotificationTemplatePanel template_id={template?._id} />
                  <RightAlignedButtonWrapper>
                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(2)}>Previous</Button> */}
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(4)}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
                {/* <Panel forceRender header="Notification Template" key={3}>
                                <NotificationTemplatePanel template_id={template && template._id} />
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(2)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(4)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel> */}
                <Panel forceRender header="Notification Rules" key={4}>
                  <NotificationRulesPanel form={form} monitor={monitor} />
                  <RightAlignedButtonWrapper>
                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(3)}>Previous</Button> */}
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(5)}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
                <Panel forceRender header="Assign Admins" key={5}>
                  <RightAlignedButtonWrapper>
                    {/* <Switch checkedChildren="Assigned" unCheckedChildren="All" onChange={(e)=> setAdmins_checked(e)} checked={admins_checked}></Switch> */}
                  </RightAlignedButtonWrapper>

                  <AssignAdminsPanel form={form} />

                  <RightAlignedButtonWrapper>
                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(4)}>Previous</Button> */}
                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(5)}>Next</Button> */}
                  </RightAlignedButtonWrapper>
                </Panel>
              </Collapse>
              <Divider />
              <RightAlignedButtonWrapper>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusSquareFilled />}
                >
                  {" "}
                  Update Monitor
                </Button>
              </RightAlignedButtonWrapper>
            </Form>
          </TabPane>
        </Tabs>
      )}
    </Device_dashboard>
  );
};

export default create_monitor_view;
