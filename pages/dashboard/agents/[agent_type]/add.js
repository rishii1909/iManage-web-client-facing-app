import { Divider, PageHeader, Form, Input, Button, MessageArgsProps, Space, message, Select, Checkbox, Breadcrumb } from "antd"
const { Option } = Select;
import Agent_dashboard from "../Agent_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios } from '../../../../helpers/auth'
import { Router, useRouter } from "next/router";
import Link from "next/link"


const agent_types = [
    'user',
    'team'
]

const agent_add = () => {
    const router = useRouter();
    const {agent_type} = router.query;
    const [agentType, setAgentType] = useState(null);

    useEffect(() => {
        const type = agent_type ? agent_type : false;
        if(!type) router.replace('/dashboard/agents');
        else setAgentType(type);
    }, []);

    const [form] = Form.useForm();

    const on_finish = async (data) => {
        console.log(data);
        const loading = message.loading("Creating agent...", 0);
        await secure_axios(`/agents/create/${agentType}`, data, router, (response) => {
            if(response.accomplished){
                message.success("Agent created successfully!").then(()=> router.push('/dashboard/agents'));
                // loading.then(() => {
                // })
                // Router.push('/dashboard/agents')
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
        <Agent_dashboard subdomain='Add Agent'>

            <Breadcrumb>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href={`/dashboard/agents?agent_tab=${agentType}`}>Agents</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {agentType}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Create
                </Breadcrumb.Item>

            </Breadcrumb>

            <PageHeader
                backIcon={false}
                // onBack={
                //     () => {
                //         window.history.back();
                //     }
                // }
                title="Add a new agent"
                subTitle="Add a new agent for breezy monitor setups!"
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
                rules={[{required : true, message : "Please select a remote agent type"}]}
            >
                <Select 
                    placeholder="Select remote agent type"
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
                rules={[{required : true, message : "Please enter a name for this agent."}]}
            >
                <Input name='name' placeholder="Name this agent"></Input>
            </Form.Item>

            <Form.Item name='private' valuePropName="checked" wrapperCol={{offset : 9, span : 4}}>
                <Checkbox> Private</Checkbox>
            </Form.Item>

            <Form.Item
                name='api_url'
                label='API endpoint URL'
                required={true}
                tooltip='API endpoint that will be accessed to track and manage your logs'
                rules={[{required : true, message : "Please enter your agent's API endpoint."}]}
            >
                <Input placeholder="Enter API endpoint URL"></Input>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space size='large'>
                <Button type="primary" htmlType='submit'>
                    Create
                </Button>
                <Button type="ghost" htmlType='reset'>
                    Reset
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Agent_dashboard>
    )
}   


export default agent_add