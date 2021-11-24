import Dashboard from "../layout/layout";
import React, { useState, useEffect } from 'react';
import fetch_team_data from "../../api/fetch_team_data";
import { PageHeader, Skeleton, Tag, List, Row, Col, Badge } from "antd";

require('dotenv').config()


const Team_dashboard = ({children}) => {
  return (
        <Dashboard 
          domain='team' 
          submenu={submenu}
          urlPath="team"
        >
        {children ? 
        children : 
        //Default content goes here.
        <Team_homepage></Team_homepage>
        }
        </Dashboard>
    )
}

const submenu = [ 
  {
    path : 'manage',
    label : 'Manage Team'
  },
  {
    path : 'invite',
    label : 'Invite user'
  }
]


const Team_homepage = () => {

  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(async () => {
    const teamObj = await fetch_team_data(setTeam);
    setUsers(teamObj);
    return () => {
    };
  }, []);
  return (
    <div>
      {team !== null ?
        <div>
        <PageHeader size='large' backIcon={false} title={team.response.name} subTitle={`Tier - ${team.response.level + 1}`} tags={[<Tag>{`${team.response._id}`}</Tag>]}></PageHeader>
        <Row gutter={24}>
          <Col span={12} >
            <h3>Users</h3>
            <List bordered>
              {Object.keys(team.response.users).map((key,i) => {
                const curr = team.response.users[key];
                return (
                  <Badge.Ribbon text={curr.permissions.active ? "Active" : "Disabled"} color={curr.permissions.active ? 'blue' : 'red'}>
                    <List.Item key={key} >
                      <List.Item.Meta
                      title={curr.metadata.name}
                      description={curr.metadata.email}
                      key={i}
                      >
                      </List.Item.Meta>
                    </List.Item>
                  </Badge.Ribbon>
                )
              })}
            </List>
          </Col>
          <Col span={12} >
          <h3>Devices</h3>
          <List bordered>
              {Object.keys(team.response.devices).map(key => {
                const curr = team.response.devices[key];
                return (
                  <Badge.Ribbon text={curr.enabled ? "Enabled" : "Disabled"} color={curr.enabled ? 'green' : 'red'} >
                    <List.Item key={key} style={{borderBottom : '1px lightgray solid'}} >
                      <List.Item.Meta
                      title={curr.metadata.name}
                      description={`${curr.metadata.username}@${curr.metadata.host}`}
                      >
                      </List.Item.Meta>
                    </List.Item>
                  </Badge.Ribbon>
                )
                
              })}
            </List>
          </Col>
        </Row>
        
        </div>
        
        
        :
        
        
        <Skeleton active></Skeleton>
      }
    </div>
  )
}
export default Team_dashboard