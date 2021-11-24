import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;


const TemplatesIndex = () => {

  const router  = useRouter();
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    fetchNotifications();
    
  }, []);

  function fetchNotifications(){
    const loading = message.loading("Fetching Notification Templates..")
    secure_axios(
    "/notifs/enumerate",
    {},
    router,
    (response) => {
      if(response.accomplished){
        setTemplates(response.response);
      }else{
        setTemplates([]);
        message.error(handle_error(response))
      }
      loading()
    }
    )
  }

  function deleteNotification(id, name){
      const loading = message.loading("Deleting " + name + "...")
      secure_axios(
          '/notifs/delete',
          {notif_id : id},
          router,
          (response) => {
            if(response.accomplished){
                message.success("Notification Template deleted successfully!")
                fetchNotifications();
            }else{
                handle_error(response);
            }
            loading()
          }
      )
  }
  return (
    <Dashboard>
      <Tabs>
        
        <TabPane tab='Notification Templates'>
            <Link href="/dashboard/templates/add">
              <Button type="primary" icon={<PlusOutlined/>} >
                Add a new Notification Template
              </Button>
            </Link>
            <Divider/>
            <List
            itemLayout="horizontal"
            loading={templates == null ? true : false}
            dataSource={templates === null ? [] : templates}
            renderItem={template => (
            <Link href={`/dashboard/templates/${template._id}`}>
              <List.Item className="ui-list-item">
                <Row style={{width : "100%"}}>
                  <Col span={16}>
                    <List.Item.Meta
                      title={template.name}
                      description={`${template.header}`}
                    />
                  </Col>
                </Row>
                <Tag color="blue">{template.category && template.category.replace("<%", "").replace("%>", "")}</Tag>
                <Button type="danger" icon={<DeleteFilled/> } size="small" onClick={(e)=>{e.stopPropagation(); deleteNotification(template._id, template.name)}}>Delete</Button>
              </List.Item>
            </Link>
            )}
          />
        </TabPane>
      </Tabs>
    </Dashboard>
  )
}


export default TemplatesIndex