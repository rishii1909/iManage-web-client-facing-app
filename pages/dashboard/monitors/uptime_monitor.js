import { Divider, PageHeader, Form, Input, Button, MessageArgsProps, Space, message, Select, Checkbox } from "antd"
const { Option } = Select;
import Device_dashboard from "./uptime_monitor"
import { useState } from 'react';

const device_add = () => {

    const [form] = Form.useForm();

    const on_finish = () => {
        message.success("Device created successfully!");
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
                >
                    <Option 
                        value="1"
                    > 
                    Linux Server
                    </Option>
                    <Option 
                        value="2"
                    > 
                    Windows Server
                    </Option>
                    <Option 
                        value="3"
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
                <Input placeholder="Name this device"></Input>
            </Form.Item>

            <Form.Item 
                name='protocol'
                label='Protocol'
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

            <Form.Item
                name='hostname'
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