import axios from "axios";
import React, { useState } from 'react';
import { useRouter } from "next/router";

import { handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { Button, message, Form, Select, Input, Space, Collapse, Tabs, Table, Tag, Divider } from "antd";

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

    

]


const AddTemplateIndex = () => {

  const router  = useRouter();
  const [templates, setTemplates] = useState(null);


  const layout = {
    labelCol: { offset : 1, span: 4},
    wrapperCol: { offset: 4, span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 16, span : 4 },
  };
  const [form] = Form.useForm();

  const on_finish = async (data) => {
      console.log(data);
      const loading = message.loading("Creating Notification Template...", 0);
      await secure_axios("/notifs/create", data, router, (response) => {
          if(response.accomplished){
              message.success("Notification Template created successfully!").then(()=> router.push('/dashboard/templates'));
              setTimeout(() => {
                router.push('/dashboard/templates')
              }, 500);
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
                    Create
                </Button>
                <Button type="ghost" htmlType='reset'>
                    Reset
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </TabPane>
      </Tabs>
    </Dashboard>
  )
}


export default AddTemplateIndex