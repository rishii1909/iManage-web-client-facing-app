import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { Button, message, Form, Select, Input, Space, Collapse, Tabs, Table, Tag, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <Tag>{text}</Tag>,
    },
    
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        // render: text => <p>{text}</p>,
    },
]

const vars = [
    {
        key : "<%Monitor%>",
        name : "<%Monitor%>",
        description : "Name of the monitor.",
    },
    {
        key : "<%Status%>",
        name : "<%Status%>",
        description : "Current status detected by the monitor.",
    },
    {
        key : "<%EventDT%>",
        name : "<%EventDT%>",
        description : "Date and time of the notification alert trigger event.",
    },
    {
        key : "<%EventMessage%>",
        name : "<%EventMessage%>",
        description : "Event verbose message",
    },
    {
        key : "<%Top10%>",
        name : "<%Top10%>",
        description : "Display a list of top 10 running processes. Only available on Disk and CPU monitors."
    }
    

]

const ViewTemplateIndex = () => {

  const router  = useRouter();
  const {template_id} = router.query;
  const [templates, setTemplates] = useState(null);
  const [variables, setVariables] = useState(null);


  const layout = {
    labelCol: { offset : 1, span: 4},
    wrapperCol: { offset: 4, span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 17, span : 4 },
  };
  const [form] = Form.useForm();

  useEffect(() => {
      fetchTemplate(template_id)
  }, [template_id]);

  const fetchTemplate = (notif_id) => {
    if(notif_id && form){
        const loading = message.loading("Fetching Notification Template...")
    secure_axios(
            '/notifs/enumerate',
            {notif_id},
            router,
            (response) => {
                if(response.accomplished){
                    const data = response.response;
                    console.log(data)
                    form.setFieldsValue(data[0]);
                }else{
                    handle_error(response);
                }
              loading();
            }
        )
    }
  }

  const on_finish = async (data) => {
      const loading = message.loading("Updating Notification Template...", 0);
      await secure_axios("/notifs/update", {...data, ...{notif_id : template_id}}, router, (response) => {
          console.log(response)
          if(response.accomplished){
              message.success("Notification Template updated successfully!").then(()=> fetchTemplate(template_id));
          }else{
              message.error(handle_error(response))
              // loading.then(() => {
              // })
          }
          loading();
      })
      
  }

  const on_finish_failed = () => {
      message.error('Submit failed!');
  };


  return (
    <Dashboard>
      <Tabs>
        
        <TabPane tab='Add a Notification Template'>

        <Collapse>
            <Panel header="Variables">
            <Table pagination={false} columns={columns} dataSource={vars} />
            </Panel>
        </Collapse>
        <Divider/>
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
            {/* <Form.Item 
                name='category'
                label='Template Type'
                rules={[{required : true, message : "Please select a template type."}]}
            >
                <Select 
                    placeholder="Select template type"
                >
                    <Option 
                        value="<%Monitor%>"
                    > 
                    {"<%Monitor%>"}
                    </Option>
                    <Option 
                        value="<%Status%>"
                    > 
                    {"<%Status%>"}
                    </Option>
                    <Option 
                        value="<%EventDT%>"
                    > 
                    {"<%EventDT%>"}
                    </Option>
                    <Option 
                        value="<%EventMessage%>"
                    > 
                    {"<%EventMessage%>"}
                    </Option>
                </Select>
            </Form.Item> */}
            <Form.Item
                name='name'
                label='Name'
                rules={[{required : true, message : "Please enter a name for this template."}]}
            >
                <Input placeholder="Enter name"></Input>
            </Form.Item>
            <Form.Item
                name='header'
                label='Header'
                rules={[{required : true, message : "Please enter a header for this template."}]}
            >
                <Input placeholder="Enter header"></Input>
            </Form.Item>

            <Form.Item
                name='body'
                label='Body'
                rules={[{required : true, message : "Please enter the body."}]}
            >
                <Input.TextArea allowClear placeholder="Enter body" ></Input.TextArea>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space size='large'>
                <Button type="primary" htmlType='submit'>
                    Update
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </TabPane>
      </Tabs>
    </Dashboard>
  )
}


export default ViewTemplateIndex