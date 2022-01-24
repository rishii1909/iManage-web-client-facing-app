import { Divider, PageHeader, Form, Input, Button, MessageArgsProps, Space, message, Select, Checkbox } from "antd"
const { Option } = Select;
import Device_dashboard from "./Device_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios } from '../../../helpers/auth'
import { Router, useRouter } from "next/router";

const device_types = [
    'user',
    'team'
]

const device_add = () => {
    const router = useRouter();
    const [deviceType, setDeviceType] = useState(null);
    const [snmp, setSnmp] = useState(false);
    const [server_type, setServer_type] = useState(null);
    useEffect(() => {
        const type = device_types.includes(router.query.type) ? router.query.type : false;
        if(!type) router.replace('/dashboard/devices');
        else setDeviceType(type);
    }, []);

    const [form] = Form.useForm();

    const on_finish = async (data) => {
        console.log(data);
        const loading = message.loading("Creating device...", 0);
        await secure_axios(`/devices/create/${deviceType}`, data, router, (response) => {
            if(response.accomplished){
                message.success("Device created successfully!").then(()=> router.push('/dashboard/devices'));
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

            <PageHeader
                backIcon={false}
                // onBack={
                //     () => {
                //         window.history.back();
                //     }
                // }
                title="Add a new device"
                subTitle="Add a new device for breezy monitor setups!"
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
                    onChange={(type) => setServer_type(type)}
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
                    Network Device
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
                    onChange={(val) => setSnmp(val)}
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
            {snmp > 0 && 
                <Form.Item 
                    name='community_string'
                    label='Community String'
                    initialValue={"public"}
                    rules={[{required : true}]}
                >
                    <Input placeholder="Enter community string" ></Input>
                </Form.Item>
            }
            <Form.Item name='private' valuePropName="checked" wrapperCol={{offset : 9, span : 4}}>
                <Checkbox> Private</Checkbox>
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
            {server_type != "1" &&
                <>
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
                </>
            }

            <Form.Item {...tailLayout}>
                <Space size='large'>
                <Button type="primary" htmlType='submit'>
                    Submit
                </Button>
                <Button type="ghost" htmlType='reset'>
                    Reset
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Device_dashboard>
    )
}   


export default device_add