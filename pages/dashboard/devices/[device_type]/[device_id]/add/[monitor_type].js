import { Form, Button, message, Select, Breadcrumb, Tabs, List, Switch, Divider } from "antd"

const { Option } = Select;
import Device_dashboard from "../../../Device_dashboard"
import { useState, useEffect } from 'react';
import { handle_error, secure_axios } from '../../../../../../helpers/auth'
import { useRouter } from "next/router";
import Link from "next/link";
import { snmp, types } from "../../../../../../helpers/devices/dict";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import { capitalizeFirstLetter, monitor_types } from "../../../../../../helpers/format";
import { DownOutlined, PlusCircleFilled, PlusOutlined, PlusSquareFilled, UpOutlined } from "@ant-design/icons";
import DetailsPanel from "../../../../../../components/monitor_panels";
import { Collapse } from 'antd';
import RightAlignedButtonWrapper from "../../../../../../components/ui/RetentionSchedulePanel";
import RetentionSchedulePanel from "../../../../../../components/monitors/RetentionSchedulePanel";
import NotificationRulesPanel from "../../../../../../components/monitors/NotificationRules";
import NotificationTemplatePanel from "../../../../../../components/monitors/NotificationTemplate";
import dynamic from 'next/dynamic'
import AssignAdminsPanel from "../../../../../../components/monitors/AssignAdmins";

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
]


const { Panel } = Collapse;
const { TabPane } = Tabs;


const create_monitor_view = () => {
    const router = useRouter();
    const { device_type, device_id, monitor_type } = router.query;
    const [metaData, setMetaData] = useState({});
    const [accordion, setAccordion] = useState(0);
    const [admins_checked, setAdmins_checked] = useState(false);
    const [device, setDevice] = useState(null);
    const [agent_id, setAgent_id] = useState(null);
    const [form] = Form.useForm();

    if(typeof window !== 'undefined'){
        if(valid_monitors.includes(monitor_type)){
            var MonitorSettingsPanel = dynamic(() => import(`../../../../../../components/monitors/settings/${monitor_type}`))
        }else{
            if( typeof monitor_type !== 'undefined' && typeof window !== 'undefined') router.push('/404')
        }
    }
    useEffect(async () => {
        if(device_id){
            secure_axios(
                '/devices/enumerate/device',
                {device_id : device_id, show_creds : true},
                router,
                (r) => {
                    console.log(r)
                  if(r.accomplished){
                      setDevice(r.response);
                  }else{
                    message.error(r.response.message ? r.response.message : r.response )
                  }
                }
            )
        }
    }, [device_id]);


    const on_finish = async (data) => {
        data.offline_times = {};
        if(Array.isArray(data.offline_time_1)){
            data.offline_times.offline_time_1_start = `${data.offline_time_1[0]['_d'].getMinutes()} ${data.offline_time_1[0]['_d'].getHours()} * * *`
            data.offline_times.offline_time_1_stop = `${data.offline_time_1[1]['_d'].getMinutes()} ${data.offline_time_1[1]['_d'].getHours()} * * *`
        }
        if(Array.isArray(data.offline_time_2)){
            data.offline_times.offline_time_2_start = `${data.offline_time_2[0]['_d'].getMinutes()} ${data.offline_time_2[0]['_d'].getHours()} * * *`
            data.offline_times.offline_time_2_stop = `${data.offline_time_2[1]['_d'].getMinutes()} ${data.offline_time_2[1]['_d'].getHours()} * * *`
        }

        data.retention_schedule = {
            raw_data : data.raw_data,
            daily_aggr : data.daily_aggr,
            weekly_aggr : data.weekly_aggr,
            monthly_aggr : data.monthly_aggr,
            retsch_export : data.retsch_export,
        }

        // return console.log(data, data.proc_name)
        let notification_rules = {};
        if(data.custom == "every"){
            notification_rules = {
                alert_all : true,
                alert_rules : {
                    every : parseInt(data.every_count)
                }
            }
        }else if(data.custom == "custom"){
            notification_rules = {
                alert_all : false,
                alert_rules : {
                    fto : data.fto,
                    wto : data.wto,
                    otow : data.otow,
                    owtof : data.owtof,
                    owtof_count : data.owtof_count,
                    otow_count : data.otow_count,
                }
            }
        }else{
            notification_rules = {
                alert_all : true,
                alert_rules : {
                    every : 1
                }
            }
        }
        const merged = {...data, ...(device.creds), notification_rules};
        if(data.host) merged.host = data.host;
        if(data.password) merged.password = data.password;
        if(data.username) merged.username = data.username;
        merged.type = monitor_type;
        merged.device_id = device_id
        // return console.log(merged);
        const loading = message.loading("Creating monitor...", 0);
        if(data.template_name){
            await secure_axios('/notifs/create', {
                name : data.template_name,
                header : data.template_header,
                body : data.template_body
            },
            router,
            (response) => {
                if(response.accomplished){
                    merged.notification_template = response._id;
                    secure_axios(`/monitors/create/${device_type}`, merged, router, (response) => {
                        console.log(response)
                        if(response.accomplished){
                            message.success("Monitor created successfully!")
                            // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
                            // loading.then(() => {
                            // })
                            // Router.push('/dashboard/devices')
                        }else{
                            handle_error(response);
                        }
                        loading();
                    })
                }
            })
        }else{
            await secure_axios(`/monitors/create/${device_type}`, merged, router, (response) => {
                console.log(response)
                if(response.accomplished){
                    message.success("Monitor created successfully!")
                    router.push(`/dashboard/devices/${device_type}/${device_id}`)
                    // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
                    // loading.then(() => {
                    // })
                    // Router.push('/dashboard/devices')
                }else{
                    handle_error(response);
                }
                loading();
            })
        }
        
        
    }

    const on_finish_failed = () => {
        message.error('Submit failed!');
    };
    
    const [auth, setAuth] = useState(null);
    const [passphrase, setpassphrase] = useState(false);

    const layout = {
        labelCol: { offset : 1, span: 4},
        wrapperCol: { offset: 4, span: 10 },
      };
      const tailLayout = {
        wrapperCol: { offset: 16, span : 4 },
      };


    return (
        <Device_dashboard subdomain='Add Device'>
            <Breadcrumb>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href={`/dashboard/devices?device_tab=${"device_type"}`}>Devices</Link>
                </Breadcrumb.Item>
                <BreadcrumbItem>{capitalizeFirstLetter(device_type)}</BreadcrumbItem>
                {/* <Breadcrumb.Item>{device && device.name ? device.name : ""}</Breadcrumb.Item> */}
            </Breadcrumb>
            
            <Tabs>
                <TabPane tab="Monitor" key="monitor">
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
                        layout='horizontal'
                        onFinish={on_finish}
                        onFinishFailed={on_finish_failed}
                        autoComplete='off'
                        labelAlign="left"
                        labelCol={{span: 5}}
                        requiredMark={false}
                        // onFieldsChange={(fields)=>console.log(fields)}
                        style={{
                            display: 'flex',
                            justifyContent : 'center',
                            flexFlow : 'column'
                        }}
                    >
                        <Collapse defaultActiveKey={accordion}>
                            <Panel forceRender header="Details" key={0}>
                                { (device_type && device) && 
                                <DetailsPanel 
                                device_type={device_type} 
                                monitor_type={monitor_type ? monitor_types[monitor_type] : ""}
                                device_name={device && device.name}
                                agentCallback={setAgent_id}
                                >
                                </DetailsPanel> }
                                <RightAlignedButtonWrapper>
                                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion([0,1])}>Next</Button> */}
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Settings" key={1}>
                                {MonitorSettingsPanel && 
                                    <MonitorSettingsPanel
                                        hostname={device ? device.host : ""}
                                        device_id={device_id}
                                        device_type={device_type} 
                                        monitor_type={monitor_type ? monitor_types[monitor_type] : ""}
                                        device_name={device && device.name}
                                        agent_id={agent_id}
                                        form={form}
                                    />
                                }
                                <RightAlignedButtonWrapper>
                                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(0)}>Previous</Button> */}
                                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion([0,1,2])}>Next</Button> */}
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Retention Schedule" key={2}>
                                <RetentionSchedulePanel form={form} />
                                <RightAlignedButtonWrapper>
                                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(1)}>Previous</Button> */}
                                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion()}>Next</Button> */}
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Notification Template" key={3}>
                                <NotificationTemplatePanel/>
                                <RightAlignedButtonWrapper>
                                    {/* <Button icon={<UpOutlined/>} onClick={()=>setAccordion(2)}>Previous</Button> */}
                                    {/* <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(4)}>Next</Button> */}
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Notification Rules" key={4}>
                                <NotificationRulesPanel form={form} />
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
                        <Divider/>
                        <RightAlignedButtonWrapper>
                            <Button type="primary" htmlType="submit" icon={<PlusSquareFilled/>}> Create Monitor</Button>
                        </RightAlignedButtonWrapper>
                    </Form>
                </TabPane>

            </Tabs>
            
        </Device_dashboard>
    )
}   


export default create_monitor_view