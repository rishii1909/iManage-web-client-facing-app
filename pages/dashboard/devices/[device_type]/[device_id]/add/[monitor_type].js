import { Form, Button, message, Select, Breadcrumb, Tabs, List, Switch, Divider } from "antd"

const { Option } = Select;
import Device_dashboard from "../../../Device_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios } from '../../../../../../helpers/auth'
import { useRouter } from "next/router";
import Link from "next/link";
import { snmp, types } from "../../../dict";
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

var valid_monitors = [
  "uptime_monitor",
  "url_monitor",
  "tcp_monitor",
  "cpu_monitor",
  "disk_monitor",
  "file_monitor",
  "service_monitor",
  "snmp_monitor",
]



const { Panel } = Collapse;
const { TabPane } = Tabs;

const dummy_admins = [
    {name : "Admin 1"},
    {name : "Admin 2"},
    {name : "Admin 3"},
]

const create_monitor_view = () => {
    const router = useRouter();
    const { device_type, device_id, monitor_type } = router.query;
    const [metaData, setMetaData] = useState({});
    const [accordion, setAccordion] = useState(1);
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
        console.log(device_id)
        if(device_id){
            console.log('here')
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
        console.log(data);
        const merged = {...data, ...(device.creds)};
        if(data.host) merged.host = data.host;
        merged.type = monitor_type;
        merged.device_id = device_id
        const loading = message.loading("Creating monitor...", 0);
        await secure_axios(`/monitors/create/${device_type}`, merged, router, (response) => {
            console.log(response)
            if(response.accomplished){
                message.success("Monitor created successfully!")
                // message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
                // loading.then(() => {
                // })
                // Router.push('/dashboard/devices')
            }else{
                if(response.response){
                    const resp = response.response
                    if(resp.message){
                        message.error(resp.message);
                    }
                    else if(resp.error){
                        message.error(resp.error)
                    }else{
                        message.error(resp)
                    }
                }else{
                    if(response.error) message.error(response.error);
                }

                // loading.then(() => {
                // })
            }
            loading();
        })
        
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
                        <Collapse activeKey={accordion}>
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
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(1)}>Next</Button>
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
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(0)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(2)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Retention Schedule" key={2}>
                                <RetentionSchedulePanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(1)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(3)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Notification Template" key={3}>
                                <NotificationTemplatePanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(2)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(4)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Notification Rules" key={4}>
                                <NotificationRulesPanel/>
                                <RightAlignedButtonWrapper>
                                    <Button icon={<UpOutlined/>} onClick={()=>setAccordion(3)}>Previous</Button>
                                    <Button type="primary" icon={<DownOutlined/>} onClick={()=>setAccordion(5)}>Next</Button>
                                </RightAlignedButtonWrapper>
                            </Panel>
                            <Panel forceRender header="Admin" key={5}>
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