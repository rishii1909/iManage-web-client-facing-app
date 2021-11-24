import { PageHeader, Form, Input, Button, Space, message, Select, Checkbox, Breadcrumb, Row, Col, Tabs, List, Slider, Switch, Modal } from "antd"
import styles from "../../device.module.css";

const { Option } = Select;
import Device_dashboard from "../../Device_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios } from '../../../../../helpers/auth'
import { useRouter } from "next/router";
import Link from "next/link";
import { snmp, types } from "../../dict";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import { capitalizeFirstLetter, monitor_types } from "../../../../../helpers/format";
import { DownOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import DetailsPanel from "../../../../../components/monitor_panels";
import { Collapse } from 'antd';
import RightAlignedButtonWrapper from "../../../../../components/ui/RetentionSchedulePanel";
import RetentionSchedulePanel from "../../../../../components/monitors/RetentionSchedulePanel";
import NotificationRulesPanel from "../../../../../components/monitors/NotificationRules";
import NotificationTemplatePanel from "../../../../../components/monitors/NotificationTemplate";
import UrlMonitorSettings from "../../../../../components/monitors/settings/url_monitor";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const dummy_admins = [
    {name : "Admin 1"},
    {name : "Admin 2"},
    {name : "Admin 3"},
]

const device_view = () => {
    const router = useRouter();
    const { device_type, device_id, monitor_id } = router.query;
    const [monitor, setMonitor] = useState(monitor_id);
    const [metaData, setMetaData] = useState({});
    const [accordion, setAccordion] = useState(0);
    const [admins_checked, setAdmins_checked] = useState(false);
    const [form] = Form.useForm();

    useEffect(async () => {
        if(monitor_id){
            const loading = message.loading("Fetching monitor data...");
            await secure_axios(`/monitors/enumerate/monitor`, {monitor_id : monitor_id}, router, (response) => {
                console.log(response)
                const data = response.response
                if(response.accomplished){
                    console.log("monitor : ", data);
                    setMonitors(data.monitors);
                    form.setFieldsValue(data.metadata);
                }else{
                    message.error(data.message ? data.message : data )
                }
                if(data.metadata){
                    delete data.metadata.agent_id;
                    setMetaData(data.metadata);
                    console.log(data.metadata)
                    form.setFieldsValue(data.metadata);
                }
                loading();
            })
        }
    }, [monitor_id]);

    const delete_device = async () => {
        const loading = message.loading("Deleting device...", 0);
        await secure_axios(`/devices/delete/${"device_type"}`, {device_id : 'device_id'}, router, (response) => {
            if(response.accomplished){
                message.success("Device deleted successfully!").then(()=> router.push(`/dashboard/devices?device_tab=${"device_type"}`));
            }else{
                message.error(response.response.message ? response.response.message : response.response )
                // loading.then(() => {
                // })
            }
            loading();
        })
        
    }

    const reset = () => {
        let auth_data = null;
        if(device.password) auth_data = 0;
        if(device.privateKey) auth_data = 1;
        handleAuth(auth_data);
        device.snmp = snmp[device.snmp];
        device.type = types[device.type];
        form.setFieldsValue(device);
    }

    const on_finish = async (data) => {
        console.log(data);
        const loading = message.loading("Creating device...", 0);
        await secure_axios(`/devices/create/${deviceType}`, data, router, (response) => {
            if(response.accomplished){
                // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
                // loading.then(() => {
                // })
                // Router.push('/dashboard/devices')
            }else{
                message.error(response.response.message ? response.response.message : response.response )
                // loading.then(() => {
                // })
            }
            loading();
        })
        
    }

    const on_finish_failed = () => {
        message.error('Submit failed!');
    };
    
    const on_fill = () => {
        form.setFieldsValue({
            url: 'https://taobao.com/',
        });
    };

    const [auth, setAuth] = useState(null);
    const [passphrase, setpassphrase] = useState(false);

    function handleAuth(choice) {
        form.setFieldsValue({auth_method : choice});
        if(choice != 1){
            form.setFieldsValue({ passphrase : null, private_key : null })
        }
        setAuth(choice);
    }

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
                <BreadcrumbItem>{capitalizeFirstLetter("device_type")}</BreadcrumbItem>
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
                        <Collapse activeKey={accordion}>
                            <Panel header="Details" key={0}>
                                { device_type && <DetailsPanel device_type={device_type}></DetailsPanel> }
                                <RightAlignedButtonWrapper>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(1)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel header="Settings" key={1}>
                                <UrlMonitorSettings/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(0)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(2)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel header="Retention Schedule" key={2}>
                                <RetentionSchedulePanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(1)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(3)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel header="Notification Template" key={3}>
                                <NotificationTemplatePanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(2)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(4)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel header="Notification Rules" key={4}>
                                <NotificationRulesPanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(3)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(5)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel header="Admin" key={5}>
                                <RightAlignedButtonWrapper>
                                    <Switch checkedChildren="Assigned" unCheckedChildren="All" onChange={(e)=> setAdmins_checked(e)} checked={admins_checked}></Switch>
                                </RightAlignedButtonWrapper>
                                <List
                                    dataSource={admins_checked ? [] : dummy_admins}
                                    renderItem={item => (
                                        <List.Item>
                                            {item.name}
                                        </List.Item>
                                    )}
                                >

                                </List>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(4)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(5)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                        </Collapse>
                    </Form>
                </TabPane>

            </Tabs>
            
        </Device_dashboard>
    )
}   


export default device_view