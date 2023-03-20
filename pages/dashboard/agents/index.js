import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Col, List, Row, Space, Tabs, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { types } from "../../../helpers/agents/dict";
import { secure_axios } from "../../../helpers/auth";
import styles from "./agent.module.css";
import Agent_dashboard from "./Agent_dashboard";

const { TabPane } = Tabs;

const Agent_Index = () => {
  const router = useRouter();
  const { agent_tab } = router.query;
  const [tab, setTab] = useState(agent_tab);
  const [teamAgents, setTeamAgents] = useState(null);
  const [userAgents, setUserAgents] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState(null);

  useEffect(() => {
    fetchTeamAgents();
    fetchUserAgents();
    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });

    // ).then((status) => {
    //   console.log(status);
    //   if(status === 401) useRouter().push("/auth/login");
    // });
  }, []);

  function fetchTeamAgents() {
    setTeamAgents(null);
    secure_axios("/agents/enumerate/team", {}, router, (response) => {
      if (response.accomplished) {
        setTeamAgents(response.response);
      } else {
        setTeamAgents([]);
      }
    });
  }

  function fetchUserAgents() {
    setUserAgents(null);
    secure_axios("/agents/enumerate/user", {}, router, (response) => {
      if (response.accomplished) {
        console.log(response.response);
        setUserAgents(response.response);
      } else {
        setUserAgents([]);
      }
    });
  }
  return (
    <Agent_dashboard>
      <Tabs defaultActiveKey={tab}>
        <TabPane tab="My agents" key="user">
          <Space>
            <Link href="agents/user/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Add a new agent
              </Button>
            </Link>
            <Button icon={<ReloadOutlined />} onClick={fetchUserAgents}>
              Refresh
            </Button>
          </Space>
          <br></br>
          <br></br>
          <List
            itemLayout="horizontal"
            loading={userAgents == null ? true : false}
            dataSource={userAgents === null ? [] : userAgents}
            renderItem={(agent) => (
              <Link href={`/dashboard/agents/user/${agent._id}`}>
                <List.Item className={styles["agent-list-item"]}>
                  <Row style={{ width: "100%" }}>
                    <Col span={16}>
                      <List.Item.Meta
                        title={agent.name}
                        description={agent._id}
                      />
                    </Col>
                  </Row>
                  <Tag>{types[agent.type]}</Tag>
                  {agent.connected ? (
                    <Tag color="blue">Connected</Tag>
                  ) : (
                    <Tag color="red">Disconnected</Tag>
                  )}
                </List.Item>
              </Link>
            )}
          />
        </TabPane>
        <TabPane tab="Team agents" key="team">
          <Space>
            <Link href="agents/team/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Add a new agent to team
              </Button>
            </Link>
            <Button icon={<ReloadOutlined />} onClick={fetchTeamAgents}>
              Refresh
            </Button>
          </Space>
          <List
            itemLayout="horizontal"
            loading={teamAgents == null ? true : false}
            dataSource={teamAgents === null ? [] : teamAgents}
            renderItem={(agent) => (
              <Link href={`/dashboard/agents/team/${agent._id}`}>
                <List.Item className={styles["agent-list-item"]}>
                  <Row style={{ width: "100%" }}>
                    <Col span={16}>
                      <List.Item.Meta
                        title={agent.name}
                        description={`Agent address : ${agent.api_url}`}
                      />
                    </Col>
                  </Row>
                  <Tag>{types[agent.type]}</Tag>
                  {agent.connected ? (
                    <Tag color="blue">Connected</Tag>
                  ) : (
                    <Tag color="red">Disconnected</Tag>
                  )}
                </List.Item>
              </Link>
            )}
          />
        </TabPane>

        {/* <TabPane tab='Assigned agents' key={3}>
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
        </TabPane> */}
      </Tabs>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gridGap: "16px",
          marginTop: "16px",
        }}
      >
        <Button
          onClick={() => {
            window.open(
              "https://drive.google.com/file/d/1G7PCf6OdFSPmNbcbqDAioO3SHrArs2DI/view?usp=sharing"
            );
          }}
        >
          Download&nbsp;<u>Windows Agent</u>
        </Button>
        <Button
          onClick={() => {
            window.open(
              "https://drive.google.com/file/d/1G7PCf6OdFSPmNbcbqDAioO3SHrArs2DI/view?usp=sharing"
            );
          }}
        >
          Download&nbsp;<u>Linux Agent</u>
        </Button>
      </div>
    </Agent_dashboard>
  );
};

export default Agent_Index;
