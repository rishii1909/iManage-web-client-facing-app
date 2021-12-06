import { PageHeader, Form, Input, Button, Space, message, Select, Checkbox, Breadcrumb, Row, Col, Tabs, List, Tag, Modal } from "antd"
import styles from "../../device.module.css";

const { Option } = Select;
import Device_dashboard from "../../Device_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios, handle_error } from '../../../../../helpers/auth'
import { useRouter } from "next/router";
import Link from "next/link";
import { snmp, types } from "../../../../../helpers/devices/dict";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import { capitalizeFirstLetter, monitor_types } from "../../../../../helpers/format";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const device_view = () => {
    const router = useRouter();
    const { device_type, device_id } = router.query;
    const [device, setDevice] = useState(device_id);
    const [monitors, setMonitors] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(async () => {
        if(device_id){
            const loading = message.loading("Fetching device information...");
            await secure_axios(`/devices/enumerate/device`, {device_id : device_id, show_creds : true, show_monitors : true}, router, (response) => {
                if(response.accomplished){
                    const data = response.response
                    console.log(data);
                    setMonitors(data.monitors);
                    setDevice(data);
                    let auth_data = null;
                    if(data.creds.password) auth_data = 0;
                    if(data.creds.privateKey) auth_data = 1;
                    handleAuth(auth_data);
                    data.snmp = snmp[data.snmp];
                    data.type = types[data.type];
                    form.setFieldsValue({...response.response, ...response.response.creds});
                }else{
                    message.error(response.response.message ? response.response.message : response.response )
                    // loading.then(() => {
                    // })
                }
                loading();
            })
        }
    }, [device_id]);


    const delete_device = async () => {
        const loading = message.loading("Deleting device...", 0);
        await secure_axios(`/devices/delete/${device_type}`, {device_id : device_id}, router, (response) => {
            if(response.accomplished){
                message.success("Device deleted successfully!").then(()=> router.push(`/dashboard/devices?device_tab=${device_type}`));
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

    function delete_monitor(monitor_id, monitor_name){
        const loading = message.loading(`Deleting ${monitor_name}...`, 0);
        secure_axios(
            `/monitors/delete/${device_type}`,
            {monitor_id},
            router,
            (r) => {
                if(r.accomplished){
                    message.success(`${monitor_name} deleted successfully!`);
                    secure_axios(`/devices/enumerate/device`, {device_id : device_id, show_creds : true, show_monitors : true}, router, (response) => {
                        if(response.accomplished){
                            const data = response.response
                            console.log(data);
                            setMonitors(data.monitors);
                            setDevice(data);
                            let auth_data = null;
                            if(data.creds.password) auth_data = 0;
                            if(data.creds.privateKey) auth_data = 1;
                            handleAuth(auth_data);
                            data.snmp = snmp[data.snmp];
                            data.type = types[data.type];
                            form.setFieldsValue({...response.response, ...response.response.creds});
                        }else{
                            message.error(response.response.message ? response.response.message : response.response )
                            // loading.then(() => {
                            // })
                        }
                        loading();
                    })
                }else{
                    handle_error(r);
                }
                loading();
            }
        )
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
                    <Link href={`/dashboard/devices?device_tab=${device_type}`}>Devices</Link>
                </Breadcrumb.Item>
                <BreadcrumbItem>{capitalizeFirstLetter(device_type)}</BreadcrumbItem>
                <Breadcrumb.Item>{device && device.name ? device.name : ""}</Breadcrumb.Item>
            </Breadcrumb>
            
            <Tabs>
                <TabPane tab="Monitors" key="monitors">
                    {/* <Link href={`/dashboard/devices/${device_type}/${device_id}/monitors/add`}> */}
                      <Button type="primary" icon={<PlusOutlined/>} onClick={()=>setModalVisible(true)} >
                        Add a monitor
                      </Button>
                    {/* </Link> */}
                    <br></br>
                    <br></br>
                    <List
                      itemLayout="horizontal"
                      loading={monitors === null ? true : false}
                      dataSource={monitors === null ? [] : monitors}
                      renderItem={monitor => (
                        // <Link href={`/dashboard/devices/${device_type}/${device_id}/${monitor._id}`} key={monitor.monitor_ref}>
                          <List.Item className={styles['device-list-item']} >
                            <Row style={{width : "100%"}} >
                              <Col span={16}>
                                <List.Item.Meta
                                  title={monitor.label}
                                  description={<Tag>{monitor_types[monitor.type]}</Tag>}
                                />
                              </Col>
                            </Row>
                            {/* <Tag>{monitor_types[monitor.type]}</Tag> */}
                            <Tag color="blue">{monitor.monitor_ref}</Tag>
                            <Button type='danger' icon={<DeleteFilled/>} onClick={() => delete_monitor(monitor._id, monitor.label)}>Delete</Button>
                            {/* <Tag color={monitor.active ? "success" : "error"}>{monitor.active ? "Active" : "Inactive"}</Tag> */}
                          </List.Item>
                        //</Link>
                        )}
                    />
                    <Modal
                    title={"Add monitor" + ((device && device.name) ? " to " + device.name : "")}
                    visible={modalVisible}
                    onok={() => setModalVisible(false)}
                    onCancel={() => setModalVisible(false)}
                    >
                    <List
                      itemLayout="horizontal"
                      className={styles['scrollable-list']}
                      dataSource={create_monitor_types}
                      renderItem={monitor => (
                        <Link href={`/dashboard/devices/${device_type}/${device_id}/add/${monitor.key}`} key={monitor.key}>
                          <List.Item className={styles['device-list-item']} >
                            <Row style={{width : "100%"}} >
                              <Col span={16}>
                                <List.Item.Meta
                                  title={monitor.name}
                                />
                              </Col>
                            </Row>
                            {monitor.pro && 
                                <Tag color="red">PRO</Tag>
                            }
                          </List.Item>
                        </Link>
                        )}
                    >
                        <List.Item onClick={() => setPerformanceModalVisible(true)} className={styles['device-list-item']} >
                            <Row style={{width : "100%"}} >
                              <Col span={16}>
                                <List.Item.Meta
                                  title="Performance monitor"
                                />
                              </Col>
                            </Row>
                            <Tag color="red">PRO</Tag>
                        </List.Item>
                        <Modal
                            title="Add a Performance monitor"
                            visible={performanceModalVisible}
                            onok={() => setPerformanceModalVisible(false)}
                            onCancel={() => setPerformanceModalVisible(false)}
                        >
                        <List
                          itemLayout="horizontal"
                          className={styles['scrollable-list']}
                          dataSource={performance_monitor_types}
                          renderItem={monitor => (
                            <Link href={`/dashboard/devices/${device_type}/${device_id}/add/${monitor.key}`} key={monitor.key}>
                              <List.Item className={styles['device-list-item']} >
                                <Row style={{width : "100%"}} >
                                  <Col span={16}>
                                    <List.Item.Meta
                                      title={monitor.name}
                                    />
                                  </Col>
                                </Row>
                                    <Tag color="red">PRO</Tag>
                              </List.Item>
                            </Link>
                            )}
                        ></List>

                        </Modal>
                    </List>
                    </Modal>
                </TabPane>


                <TabPane tab='Device Information' key="device_information">
                    <PageHeader
                    backIcon={false}
                    // onBack={
                    //     () => {
                    //         window.history.back();
                    //     }
                    // }
                    title="Device information"
                    subTitle="View or update your device information."
                    />

                    <Form
                    form={form}
                    preserve={false}
                    colon={false}
                    {...layout}
                    layout='horizontal'
                    onFinish={on_finish}
                    onFinishFailed={on_finish_failed}
                    autoComplete='off'
                    labelAlign='left'
                    requiredMark={false}
                    onFieldsChange={(fields)=>console.log(fields)}
                    style={{
                        display: 'flex',
                        justifyContent : 'center',
                        flexFlow : 'column'
                    }}
                >

                <Form.Item 
                    name='type'
                    label='Type'
                    rules={[{required : true, message : "Please select a remote device type"}]}
                >
                    <Select 
                        placeholder="Select remote device type"
                    >
                        <Option 
                            value="0"
                        > 
                        Linux Server
                        </Option>
                        <Option 
                            value="1"
                        > 
                        Windows Server
                        </Option>
                        <Option 
                            value="2"
                        > 
                        Cisco Router
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='name'
                    label='Name'
                    rules={[{required : true, message : "Please enter a name for this device."}]}
                >
                    <Input name='name' placeholder="Name this device"></Input>
                </Form.Item>

                <Form.Item 
                    name='snmp'
                    label='SNMP Protocol'
                    rules={[{required : true, message : 'Please select an SNMP protocol. If none, choose "No SNMP support".'}]}
                >
                    <Select 
                        placeholder="SNMP protocol"
                    >
                        <Option 
                            value="1"
                        > 
                        SNMP v1
                        </Option>
                        <Option 
                            value="2"
                        > 
                        SNMP v2
                        </Option>
                        <Option 
                            value="3"
                        > 
                        SNMP v3
                        </Option>
                        <Option
                            value="0"
                        > 
                        No SNMP support
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item name='private' valuePropName="checked" wrapperCol={{offset : 9, span : 4}}>
                    <Checkbox defaultChecked={device && device.private ? device.private : false } > Private</Checkbox>
                </Form.Item>

                <Form.Item
                    name='username'
                    label='Username'
                    required={true}
                    tooltip='Login username of your remote device, for SSH access.'
                    rules={[{required : true, message : "Please enter your device's SSH username."}]}
                >
                    <Input placeholder="Enter username"></Input>
                </Form.Item>
                <Form.Item
                    name='host'
                    label='Hostname'
                    required={true}
                    tooltip='Hostname of your remote device, for SSH access.'
                    rules={[{required : true, message : "Please enter your device's hostname."}]}
                >
                    <Input placeholder="Enter hostname"></Input>
                </Form.Item>

                <Form.Item 
                    name='auth_method'
                    label='Authentication method'
                    rules={[{required : true, message : "Please provide an authentication method."}]}
                >
                    <Select 
                        placeholder="Choose auth method"
                        onSelect={handleAuth}
                    >
                        <Option 
                            value={0}
                        > 
                        Password
                        </Option>
                        <Option 
                            value={1}
                        > 
                        Private Key
                        </Option>
                    </Select>
                </Form.Item>

                { auth == 0 && 
                    <Form.Item
                    name='password'
                    label='Password'
                    rules={[{required : true, message : "Please enter the password."}]}
                >
                    <Input.Password placeholder="Enter password"></Input.Password>
                </Form.Item>           
                }

                { auth == 1 && 
                    <div>
                    <Form.Item
                        name='private_key'
                        label='Private key'
                        rules={[{required : true, message : "Please enter the private key."}]}
                    >
                        <Input.TextArea showCount allowClear autoSize={{minRows : 8}} placeholder="Enter private key" s></Input.TextArea>
                    </Form.Item>
                    <Form.Item valuePropName="checked" wrapperCol={{offset : 9, span : 4}}>
                        <Checkbox onChange={() => setpassphrase(!passphrase)}> Requires passpharase?</Checkbox>
                    </Form.Item>
                    {passphrase && 
                    <Form.Item name='passphrase' label='Passphrase' rules={[{required : true, message : "Please enter the passphrase."}]}>
                        <Input.Password placeholder="Enter passphrase"></Input.Password>
                    </Form.Item>
                    }
                    </div>
                }

                <Form.Item {...tailLayout}>
                    <Space size='large'>
                    <Button type="primary" htmlType='submit'>
                        Update device
                    </Button>
                    <Button >
                        Reset
                    </Button>
                    </Space>
                </Form.Item>
                    </Form>


                    <Row align="middle" justify="space-between">
                    <Col span={18}>
                        <PageHeader
                            backIcon={false}
                            // onBack={
                            //     () => {
                            //         window.history.back();
                            //     }
                            // }
                            title="Delete device"
                            subTitle={`Pressing this button would permanently delete ${device && device.name ? device.name : ''}, please be aware of the consequences.`}
                        />
                    </Col>
                    <Col span={3} offset={2}>
                        <Button type='danger' large block onClick={delete_device}>Delete</Button>
                    </Col>
                    </Row>
                </TabPane>
            </Tabs>
            
        </Device_dashboard>
    )
}

const create_monitor_types = [
    {
        key : "uptime_monitor",
        name : "Uptime monitor"
    },
    {
        key : "url_monitor",
        name : "URL monitor"
    },
    {
        key : "tcp_monitor",
        name : "TCP monitor"
    },
    {
        key : "cpu_monitor",
        name : "CPU monitor",
        pro : true
    },
    {
        key : "disk_monitor",
        name : "Disk monitor",
        pro : true
    },
    {
        key : "file_monitor",
        name : "File monitor",
        pro : true
    },
    {
        key : "service_monitor",
        name : "Service monitor",
        pro : true
    },
    {
        key : "snmp_monitor",
        name : "SNMP monitor"
    },
]
const performance_monitor_types = [
    {
        key : "cron_monitor",
        name : "Cron Job monitor"
    },
    {
        key : "inode_monitor",
        name : "Inode monitor"
    },
    {
        key : "load_monitor",
        name : "Load monitor"
    },
    {
        key : "swap_monitor",
        name : "Swap monitor",
        pro : true
    },
]


export default device_view