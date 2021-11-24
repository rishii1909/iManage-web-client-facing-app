import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message, Form, Select, Input, Checkbox, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TreeSelect from "rc-tree-select";

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

const AddGroupIndex = () => {

  const router  = useRouter();
  const [groups, setGroups] = useState(null);
  const [userDevices, setUserDevices] = useState(null);
  const [teamDevices, setTeamDevices] = useState(null);
  const [analyticGroups, setAnalyticGroups] = useState(null);
  useEffect(() => {
    fetchOptions();
    
  }, []);

  function fetchOptions(){

      secure_axios(
          '/devices/enumerate/user',
          {},
          router,
          (response) => {
            console.log("User response : ", response);
            if(response.accomplished){
                setUserDevices(response.response);
            }else{
                handle_error(response)
            }
          }
      )
      secure_axios(
        '/devices/enumerate/team',
        {},
        router,
        (response) => {
          console.log("Team response : ", response);
          if(response.accomplished){
            setTeamDevices(response.response);
          }else{
              handle_error(response)
          }
        }
    )
    secure_axios(
      '/teams/enumerate',
      {},
      router,
      (response) => {
        if(response.accomplished){
          const data = response.response.response;
          setAnalyticGroups(data.analytic_groups);
        }
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
  const [form] = Form.useForm();

  const on_finish = async (data) => {
      console.log(data);
      const loading = message.loading("Creating Device Group...", 0);
      await secure_axios("/device_groups/create", data, router, (response) => {
          if(response.accomplished){
              message.success("Device Group created successfully!").then(()=> router.push('/dashboard/device_groups'));
              setTimeout(() => {
                router.push('/dashboard/device_groups')
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
        
        <TabPane tab='Device Groups agents'>
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
                    <OptGroup label="User devices">
                    {userDevices && 
                    userDevices.map((el) => {
                      return (
                        <Option value={el._id} key={el._id}>{el.name}</Option>
                      )
                    })
                    }
                    </OptGroup>
                    <OptGroup label="Team devices">
                    {teamDevices && 
                    teamDevices.map((el) => {
                      return (
                        <Option value={el._id} key={el._id}>{el.name}</Option>
                      )
                    })
                    }
                    </OptGroup>
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


export default AddGroupIndex