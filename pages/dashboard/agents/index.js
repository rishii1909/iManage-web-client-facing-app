import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./agent.module.css";

import { getAccessToken, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";
import Agent_dashboard from "./Agent_dashboard";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message } from "antd";
import { snmp, types } from "./dict";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;


const Agent_Index = () => {

  const router  = useRouter();
  const { agent_tab } = router.query;
  const [tab, setTab] = useState(agent_tab);
  const [teamAgents, setTeamAgents] = useState(null);
  const [userAgents, setUserAgents] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState(null);

  useEffect(() => {

    secure_axios(
      "/agents/enumerate/team",
      {},
      router,
      (response) => {
        if(response.accomplished){
          setTeamAgents(response.response);
        }else{
          setTeamAgents([]);
        }
      }
      )
    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });

    secure_axios(
      "/agents/enumerate/user",
      {},
      router,
      (response) => {
        if(response.accomplished){
          console.log(response.response);
          setUserAgents(response.response);
        }else{
          setUserAgents([]);
        }
      }
      )
    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });
    
  }, []);
  return (
    <Agent_dashboard>
      <Tabs defaultActiveKey={tab}>
        <TabPane tab='My agents' key="user">
        <Link href="agents/user/add">
          <Button type="primary" icon={<PlusOutlined/>} >
            Add a new agent 
          </Button>
        </Link>
        <br></br>
        <br></br>
          <List
            itemLayout="horizontal"
            loading={userAgents == null ? true : false}
            dataSource={userAgents === null ? [] : userAgents}
            renderItem={agent => (
            <Link href={`/dashboard/agents/user/${agent._id}`}>
              <List.Item className={styles['agent-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={agent.name}
                      description={`API endpoint : ${agent.api_url}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[agent.snmp]}</Tag>
                <Tag>{types[agent.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
        <TabPane tab='Team agents' key="team">
          <Link href="agents/team/add">
            <Button type="primary" icon={<PlusOutlined/>} >
              Add a new agent to team
            </Button>
          </Link>
          <List
            itemLayout="horizontal"
            loading={teamAgents == null ? true : false}
            dataSource={teamAgents === null ? [] : teamAgents}
            renderItem={agent => (
            <Link href={`/dashboard/agents/team/${agent._id}`}>
              <List.Item className={styles['agent-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={agent.name}
                      description={`Agent address : ${agent.api_url}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[agent.snmp]}</Tag>
                <Tag>{types[agent.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
        <TabPane tab='Assigned agents' key={3}>
          <List
            itemLayout="horizontal"
            loading={assignedAgents == null ? true : false}
            dataSource={assignedAgents === null ? [] : assignedAgents}
            renderItem={agent => (
            <Link href={`${agent._id}`}>
              <List.Item className={styles['agent-list-item']}>
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={agent.name}
                      description={`Agent address : ${agent.api_url}`}
                    />
                  </Col>
                </Row>
                <Tag>{snmp[agent.snmp]}</Tag>
                <Tag>{types[agent.type]}</Tag>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
      </Tabs>
    </Agent_dashboard>
  )
}


export default Agent_Index