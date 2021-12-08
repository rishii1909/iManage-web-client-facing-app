import { Divider, PageHeader, Form, Input, Button, MessageArgsProps, Space, message, Select, Checkbox, Breadcrumb, Grid, Row, Col } from "antd"
const { Option } = Select;
import Agent_dashboard from "../Agent_dashboard"
import { useState, useEffect } from 'react';
import { secure_axios } from '../../../../helpers/auth'
import { Router, useRouter } from "next/router";
import Link from "next/link";
import { snmp, types } from "../../../../helpers/agents/dict";

const agent_view = () => {
    const router = useRouter();
    const { agent_type, agent_id } = router.query;
    const [agent, setAgent] = useState(agent_id);
    const [form] = Form.useForm();

    useEffect(async () => {
        if(agent_id){
            const loading = message.loading("Fetching agent information...");
            await secure_axios(`/agents/enumerate/agent`, {agent_id : agent_id, show_creds : true}, router, (response) => {
                if(response.accomplished){
                    const data = response.response
                    console.log(data);
                    setAgent(data);
                    let auth_data = null;
                    data.type = types[data.type];
                    form.setFieldsValue(data);
                }else{
                    message.error(response.response.message ? response.response.message : response.response )
                }
                loading();
            })
        }
    }, [agent_id]);


    const delete_agent = async () => {
        const loading = message.loading("Deleting agent...", 0);
        await secure_axios(`/agents/delete/${agent_type}`, {agent_id : agent_id}, router, (response) => {
            if(response.accomplished){
                message.success("Agent deleted successfully!").then(()=> router.push(`/dashboard/agents?agent_tab=${agent_type}`));
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
        if(agent.password) auth_data = 0;
        if(agent.privateKey) auth_data = 1;
        handleAuth(auth_data);
        agent.snmp = snmp[agent.snmp];
        agent.type = types[agent.type];
        form.setFieldsValue(agent);
    }
    const on_finish = async (data) => {
        console.log(data);
        const loading = message.loading("Creating agent...", 0);
        await secure_axios(`/agents/create/${agentType}`, data, router, (response) => {
            if(response.accomplished){
                // message.success("Agent created successfully!").then(()=> router.push('/dashboard/agents'));
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
                    <Link href={`/dashboard/agents?agent_tab=${agent_type}`}>Agents</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{agent && agent.name ? agent.name : ""}</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader
                backIcon={false}
                // onBack={
                //     () => {
                //         window.history.back();
                //     }
                // }
                title="Agent information"
                subTitle="View or update your agent information."
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
                    disabled
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

            
            <Row align="middle" justify="space-between">
                <Col span={18}>
                    <PageHeader
                        backIcon={false}
                        // onBack={
                        //     () => {
                        //         window.history.back();
                        //     }
                        // }
                        title="Delete agent"
                        subTitle={`Pressing this button would permanently delete ${agent && agent.name ? agent.name : ''}, please be aware of the consequences.`}
                    />
                </Col>
                <Col span={3} offset={2}>
                    <Button type='danger' large block onClick={delete_agent}>Delete</Button>
                </Col>
            </Row>
            
        </Agent_dashboard>
    )
}   


export default agent_view