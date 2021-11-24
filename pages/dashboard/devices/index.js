import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./device.module.css";

import { getAccessToken, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import Device_dashboard from "./Device_dashboard";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message } from "antd";
import { snmp, types } from "./dict";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;


const Device_Index = () => {

  const router  = useRouter();
  const { device_tab } = router.query;
  const [tab, setTab] = useState(device_tab);
  const [teamDevices, setTeamDevices] = useState(null);
  const [userDevices, setUserDevices] = useState(null);
  const [assignedDevices, setAssignedDevices] = useState(null);

  useEffect(() => {

    secure_axios(
      "/devices/enumerate/team",
      {},
      router,
      (response) => {
        if(response.accomplished){
          setTeamDevices(response.response);
        }else{
          setTeamDevices([]);
        }
      }
      )
    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });

    secure_axios(
      "/devices/enumerate/user",
      {},
      router,
      (response) => {
        if(response.accomplished){
          setUserDevices(response.response);
        }else{
          setUserDevices([]);
        }
      }
      )
    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });
    
  }, []);
  return (
    <Device_dashboard>
      <Tabs defaultActiveKey={tab}>
        <TabPane tab='My devices' key="user">
        <Link href={{pathname : "devices/add", query : {type : "user"}}}>
          <Button type="primary" icon={<PlusOutlined/>} >
            Add a new device 
          </Button>
        </Link>
        <br></br>
        <br></br>
          <List
            itemLayout="horizontal"
            loading={userDevices == null ? true : false}
            dataSource={userDevices === null ? [] : userDevices}
            renderItem={device => (
            <Link href={`/dashboard/devices/user/${device._id}`} key={device._id}>
              <List.Item className={styles['device-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={device.name}
                      description={`Device address : ${device.host}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[device.snmp]}</Tag>
                <Tag>{types[device.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
        <TabPane tab='Team devices' key="team">
          <Link href={{pathname : "devices/add", query : {type : "team"}}}>
            <Button type="primary" icon={<PlusOutlined/>} >
              Add a new device to team
            </Button>
          </Link>
          <List
            itemLayout="horizontal"
            loading={teamDevices == null ? true : false}
            dataSource={teamDevices === null ? [] : teamDevices}
            renderItem={device => (
            <Link href={`/dashboard/devices/team/${device._id}`}>
              <List.Item className={styles['device-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={device.name}
                      description={`Device address : ${device.host}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[device.snmp]}</Tag>
                <Tag>{types[device.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
        <TabPane tab='Assigned devices' key={3}>
          <List
            itemLayout="horizontal"
            loading={assignedDevices == null ? true : false}
            dataSource={assignedDevices === null ? [] : assignedDevices}
            renderItem={device => (
            <Link href={`${device._id}`}>
              <List.Item className={styles['device-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={device.name}
                      description={`Device address : ${device.host}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[device.snmp]}</Tag>
                <Tag>{types[device.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
      </Tabs>
    </Device_dashboard>
  )
}


export default Device_Index