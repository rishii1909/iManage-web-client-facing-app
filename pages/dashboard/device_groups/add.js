import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message, Form, Select, Input, Checkbox, Space, Transfer } from "antd";
import { ConsoleSqlOutlined, PlusOutlined } from "@ant-design/icons";
import TreeSelect from "rc-tree-select";

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

const listStyleOptions = {width: '30vw', minWidth : '300px'}
const transferRowStyles = {display : 'flex', justifyContent : 'space-between'}
const renderTransferRow = (item) => {
  return (
    <div style={transferRowStyles}>{item.name} <Tag>{item.type}</Tag></div>
  )
}

const AddGroupIndex = () => {

  const router  = useRouter();

  const [loadingStatus, setloadingStatus] = useState(false);
  const [userDevices, setUserDevices] = useState([]);
  const [teamDevices, setTeamDevices] = useState([]);

  const [analyticGroups, setAnalyticGroups] = useState([]);

  const [analyticGroupsSelectedKeys, setAnalyticGroupsSelectedKeys] = useState([]);
  const [analyticGroupsTargetKeys, setAnalyticGroupsTargetKeys] = useState();
  const [devicesSelectedKeys, setDevicesSelectedKeys] = useState([]);
  const [devicesTargetKeys, setDevicesTargetKeys] = useState();

  const onAnalyticGroupChange = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setAnalyticGroupsTargetKeys(nextTargetKeys);
  };

  const onAnalyticGroupSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setAnalyticGroupsSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onAnalyticGroupScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  const onDevicesChange = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setDevicesTargetKeys(nextTargetKeys);
  };

  const onDevicesSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setDevicesSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onDevicesScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

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
              setUserDevices(response.response.map(obj =>  { return {name : obj.name, key : obj._id, type : "User"} }));
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
            setTeamDevices(response.response.map(obj =>  { return {name : obj.name, key : obj._id, type : "Team"} }));
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
          const options = data.analytic_groups.map((obj) => {return {name : obj.name, description : obj.name, key : obj._id}});
          console.log(options)
          setAnalyticGroups(options);
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
                // rules={[{required : true, message : "Please select atleast one device"}]}
            > 
                <Transfer
                  dataSource={userDevices.concat(teamDevices)}
                  showSearch
                  titles={['Devices', 'Selected Devices']}
                  oneWay
                  pagination
                  targetKeys={devicesTargetKeys}
                  selectedKeys={devicesSelectedKeys}
                  onChange={onDevicesChange}
                  onSelectChange={onDevicesSelectChange}
                  onScroll={onDevicesScroll}
                  render={item => renderTransferRow(item)}
                  listStyle={listStyleOptions}
                />
            </Form.Item>

            <Form.Item 
                name='analytic_groups'
                label='Analytic Groups'
                // rules={[{required : true, message : "Please select atleast one analytic group"}]}
            >
                <Transfer
                  dataSource={analyticGroups}
                  showSearch
                  titles={['Analytic Groups', 'Selected']}
                  oneWay
                  pagination
                  targetKeys={analyticGroupsTargetKeys}
                  selectedKeys={analyticGroupsSelectedKeys}
                  onChange={onAnalyticGroupChange}
                  onSelectChange={onAnalyticGroupSelectChange}
                  onScroll={onAnalyticGroupScroll}
                  render={item => item.name}
                  listStyle={listStyleOptions}
                />
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