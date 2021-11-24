import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message, Form, Select, Input, Checkbox, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

const ViewTemplateIndex = () => {

  const router  = useRouter();
  const {device_group_id} = router.query;
  const [devices, setDevices] = useState(null);
  const [analyticGroups, setAnalyticGroups] = useState(null);

  const layout = {
    labelCol: { offset : 1, span: 4},
    wrapperCol: { offset: 4, span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 17, span : 4 },
  };
  const [form] = Form.useForm();

  useEffect(() => {
      fetchGroup(device_group_id)
  }, [device_group_id]);

  const fetchGroup = (device_group_id) => {
    if(device_group_id && form){
        const loading = message.loading("Fetching Device Group...")
    secure_axios(
            '/device_groups/enumerate',
            {device_group_id},
            router,
            (response) => {
                if(response.accomplished){
                    const data = response.response;
                    console.log(data)
                    form.setFieldsValue({
                      name : data.name,
                    });
                    setAnalyticGroups(data.analytic_groups);
                    setDevices(data.devices);
                }else{
                    handle_error(response);
                }
              loading();
            }
        )
    }
  }

  const on_finish = async (data) => {
      const loading = message.loading("Updating Device Group...", 0);
      await secure_axios("/notifs/update", {...data, ...{notif_id : device_group_id}}, router, (response) => {
          if(response.accomplished){
              message.success("Device Group updated successfully!").then(()=> fetchGroup(device_group_id));
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
        
        <TabPane tab='Device Groups'>
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
                rules={[{required : true, message : "Please enter a name for this device group."}]}
            >
                <Input placeholder="Enter name"></Input>
            </Form.Item>

            <Form.Item 
                name='devices'
                label='Devices'
                rules={[{required : true, message : "Please select atleast one device"}]}
            >
                <Select 
                    placeholder="Select devices"
                    mode="multiple"
                    allowClear

                >
                    {devices && 
                    devices.map((el) => {
                      return (
                        <Option value={el._id} key={el._id}>{el.name}</Option>
                      )
                    })
                    }
                </Select>
            </Form.Item>

            <Form.Item 
                name='analytic_groups'
                label='Analytic Groups'
                rules={[{required : true, message : "Please select atleast one analytic group"}]}
            >
                <Select 
                    placeholder="Select analytic groups"
                    mode="multiple"
                    allowClear

                >
                    {analyticGroups && 
                    analyticGroups.map((el) => {
                      return (
                        <Option value={el._id} key={el._id}>{el.name}</Option>
                      )
                    })
                    }
                </Select>
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


export default ViewTemplateIndex