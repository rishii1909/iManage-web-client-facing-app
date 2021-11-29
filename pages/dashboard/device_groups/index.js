import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;


const DeviceGroupsIndex = () => {

  const router  = useRouter();
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    fetchGroups();
    
  }, []);

  function fetchGroups(){
    const loading = message.loading("Fetching Device Groups..")
    secure_axios(
    "/teams/enumerate",
    {},
    router,
    (response) => {
      if(response.accomplished){
        const data = response.response
        setGroups(data.response.device_groups);
      }else{
        setGroups([]);
        message.error(handle_error(response))
      }
      loading()
    }
    )
  }

  function deleteNotification(id, name){
      const loading = message.loading("Deleting " + name + "...")
      secure_axios(
          '/device_groups/delete',
          {device_group_id : id},
          router,
          (response) => {
            loading()
            if(response.accomplished){
                message.success("Device Group deleted successfully!")
                fetchGroups();
            }else{
                handle_error(response);
            }
          }
      )
  }
  return (
    <Dashboard>
      <Tabs>
        
        <TabPane tab='Device Groups'>
            <Link href="/dashboard/device_groups/add">
              <Button type="primary" icon={<PlusOutlined/>} >
                Add a new Device Group
              </Button>
            </Link>
            <Divider/>
            <List
            itemLayout="horizontal"
            loading={groups == null ? true : false}
            dataSource={groups === null ? [] : groups}
            renderItem={group => (
            <Link href={`/dashboard/device_groups/${group._id}`}>
              <List.Item className="ui-list-item">
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={group.name}
                    />
                  </Col>
                </Row>
                {/* <Tag color="blue">{group.category && group.category.replace("<%", "").replace("%>", "")}</Tag> */}
                <Button type="danger" icon={<DeleteFilled/> } size="small" onClick={(e)=>{e.stopPropagation(); deleteNotification(group._id, group.name)}}>Delete</Button>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
      </Tabs>
    </Dashboard>
  )
}


export default DeviceGroupsIndex