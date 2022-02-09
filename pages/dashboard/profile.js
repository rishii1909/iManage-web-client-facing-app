import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';

import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Dashboard from "./layout/layout";
import moment from "moment"
import { Form, Input, TimePicker, Switch, PageHeader, Button, message } from "antd";
import styles from "./dashboard.module.css"
import { secure_axios, handle_error } from "../../helpers/auth";
import { Header } from "antd/lib/layout/layout";
import { Skeleton } from "antd";
import Column from "antd/lib/table/Column";
import { UpCircleOutlined } from "@ant-design/icons";
import RightAlignedButtonWrapper from "../../components/ui/RetentionSchedulePanel";

const layout = {
  labelCol: { offset : 0, span: 4},
  wrapperCol: { offset : 4, span: 10 },
};

const ProfileIndex = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  function hydrate(admin_data){
    console.log("HYDRATE : ", admin_data)
    if(admin_data.notification_time){
      const nf = admin_data.notification_time.split(" ");
      const ot_start = admin_data.offline_time_start.split(" ")
      const ot_end = admin_data.offline_time_end.split(" ")
      
      if(nf.length) admin_data.notification_time = moment(`${nf[1]}:${nf[0]}`,'H:m');
      console.log(`${nf[1]}:${nf[0]}`)
      if(ot_start.length && ot_end.length){
        console.log(ot_start, ot_end)
        admin_data.offline_time = [moment(`${ot_start[1]}:${ot_start[0]}`,'H:m'), moment(`${ot_end[1]}:${ot_end[0]}`,'H:m')]
      }
    }
    form.setFieldsValue(admin_data)
  }

  useEffect(async () => {
    secure_axios(
      '/teams/monitoring_admins/enumerate/one',
      {},
      router,
      (r) => {
        if(r.accomplished){
          console.log(r)
          hydrate(r.response)
          
        }
        else{
          handle_error(r)
        }

      }
    )
  }, [])

  function on_finish(data){
    setLoading(true);
    if(Array.isArray(data.offline_time)){
      const off1 = data.offline_time[0].format("m:H").split(":");
      const off2 = data.offline_time[1].format("m:H").split(":");
      data.offline_time_start = `${off1[0]} ${off1[1]} * * *`
      data.offline_time_end = `${off2[0]} ${off2[1]} * * *`
    }

    if(data.notification_time){
      const nf = data.notification_time.format("m:H").split(":");
      data.notification_time = `${nf[0]} ${nf[1]} * * *`
    }
    
    secure_axios(
      '/teams/monitoring_admins/update/one',
      data,
      router,
      (r) => {
        if(r.accomplished){
          message.success("Profile updated successfully!")
          hydrate(r.response)
        }else{
          handle_error(r)
        }
        setLoading(false);
      }
    )


    
  }

  return ( 
    <Dashboard>
    <PageHeader title="Admin Profile" ></PageHeader>
    <Form
    form={form}
    preserve={false}
    colon={false}
    {...layout}
    layout='horizontal'
    onFinish={on_finish}
    //onFinishFailed={on_finish_failed}
    //autoComplete='off'
    labelAlign='left'
    requiredMark={false}
    >

    <Form.Item
      name="email"
      label="E-mail"
      rules={[{required : true, message : "Please enter email"}]}
    >
      <Input placeholder="Email"></Input>
    </Form.Item>
    
    <Form.Item
      name="name"
      label="Name"
      rules={[{required : true, message : "Please enter a name"}]}
    >
      <Input placeholder="Email"></Input>
    </Form.Item>

    <Form.Item
        name="offline_time"
        label="Offline time"
        // format="HH:mm"
    >
        <TimePicker.RangePicker order={false} use12Hours format="hh:mm a" />
    </Form.Item>

    <Form.Item
        name="heartbeat"
        label="Send Daily Heartbeat"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="send_queued"
        label="Send Queued alerts"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="incl_message_body"
        label="Include message body"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="incl_ok"
        label="Include status = OK"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="incl_warn"
        label="Include status = Warn"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="incl_fail"
        label="Include status = Fail"
        valuePropName="checked" 
        // wrapperCol={{offset : 9, span : 4}}
    >
        <Switch></Switch>
    </Form.Item>
    <Form.Item
        name="notification_time"
        label="Notification time"
        // initialValue={offline_1}
        // format="HH:mm"
    >
        <TimePicker use12Hours format="hh:mm a" />
    </Form.Item>

    <RightAlignedButtonWrapper>
        <Button type="primary" htmlType="submit" loading={loading} icon={<UpCircleOutlined />}> Update my profile</Button>
    </RightAlignedButtonWrapper>

    </Form>
    </Dashboard>
  )
}
 

export  default  ProfileIndex; 