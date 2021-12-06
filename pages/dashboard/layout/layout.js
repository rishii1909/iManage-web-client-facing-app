import { useState, useEffect } from 'react';
import { Row, Col, Layout, Menu, Drawer, List, Empty, Space, Button, Tag, message, Divider } from 'antd';
import { BellOutlined, DeleteFilled, DeleteOutlined, LogoutOutlined, ReloadOutlined, SwapRightOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import Link from 'next/link'
import Router, { useRouter } from 'next/router';
import { handle_error, logout, secure_axios } from '../../../helpers/auth';
import AuthWrapper from '../../../components/AuthWrapper';


const { Header, Content, Sider } = Layout;
const {SubMenu } = Menu;
export default function dashboard({ domain, subdomain, children }){
  const router = useRouter();
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  function stats(num, is_binary){
    switch (num) {
      case 1:
        return is_binary ? "Failure" : "Warning"
        break;
      case 2: 
      return "Failure"
      break;

      case 0:
      return "OK"
      break;

      default:
        break;
    }
  }

  function tagColor(p,c,b){
    // if(p == c){
    // }
    if(c == 0) return "green"
    if(c == 1){
      return b ? "red" : "yellow" 
    }
    if(c == 2) return "red"
  }

  function Notifooter({n}){
    
    if(n.isBinary && n.current_monitor_status) n.current_monitor_status++;
    if(n.previous_monitor_status == n.current_monitor_status){
      return (
        <Tag color={tagColor(n.current_monitor_status, n.previous_monitor_status, n.isBinary)}>{stats(n.current_monitor_status)}</Tag>
      )
    }else{
      return (
        <Tag>
        {stats(n.previous_monitor_status)} <SwapRightOutlined style={{display : "inline-block"}}/> {stats(n.current_monitor_status)}
        </Tag>
      )
    }
    
  }
  useEffect(() => {
    fetchNotifs();
    
  }, []);

  function fetchNotifs(){
    setNotifsLoading(true);
    secure_axios('/notifications/enumerate', {}, router, (r) => {
      setNotifsLoading(false)
      if(r.accomplished){
        console.log(r.response.notifications)
        setNotifs(r.response.notifications)
      }else{
        handle_error(r);
      }
    })
  }

  

  function clearNotifications(){
    secure_axios('/notifications/clear', {}, router, (r) => {
      if(r.accomplished){
        message.success(r.response)
        fetchNotifs();
      }else{
        handle_error(r);
      }
    })
  }

  
  const base_route = "/dashboard";
  const UserLogout = (e) => {
    logout(); Router.push('/auth/login')
  }
    return (
        <AuthWrapper>
          <Layout style={{minHeight : '100vh'}} >
          <Header className="header" style={{padding : '0px'}}>
            <div className="logo" />
            
            <Row justify="space-between" wrap={false}>

            <Col>
              <Menu theme="dark" mode='horizontal' defaultSelectedKeys={[domain || false]}>

                  <Menu.Item key="monitors"> <Link href={`${base_route}/monitors`}>Monitors</Link> </Menu.Item>
                  <Menu.Item key="devices"> <Link href={`${base_route}/devices`}>Devices</Link> </Menu.Item>
                  <Menu.Item key="agents"> <Link href={`${base_route}/agents`}>Agents</Link> </Menu.Item>
            </Menu>
            </Col>
            <Col span={3}>
              
              <Menu theme='dark' mode='horizontal' selectable={false}>
              <Menu.Item onClick={() => setNotificationDrawer(true)} >
              <BellOutlined/> {notifs.length > 0 && <span className="notification-dot"></span>}
              </Menu.Item>
              <SubMenu icon={<UserOutlined/>} title="Profile">
                <Menu.Item icon={<TeamOutlined/>}>
                  <Link href={`${base_route}/team`}>My Team</Link>
                </Menu.Item>
                <Menu.Item onClick={UserLogout} icon={<LogoutOutlined/>}>
                Log out
                </Menu.Item>
              </SubMenu>
              
              </Menu>
            </Col>
            </Row>
          </Header>
          <Layout>
            <Sider  width={200} className="site-layout-background" collapsible={true}>
              <Menu
                theme='dark'
                mode='inline'
                defaultSelectedKeys={[subdomain]}
                defaultOpenKeys={[subdomain]}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="monitors"> <Link href={`${base_route}`}>Dashboard</Link> </Menu.Item>
                <Menu.Item key="devices"> <Link href={`${base_route}/devices`}>Devices</Link> </Menu.Item>
                <Menu.Item key="templates"> <Link href={`${base_route}/templates`}>Templates</Link> </Menu.Item>
                <Menu.Item key="agents"> <Link href={`${base_route}/agents`}>Agents</Link> </Menu.Item>
                <SubMenu key="grouping" title="Groups">
                  <Menu.Item key="device_groups"> <Link href={`${base_route}/device_groups`}>Device Groups</Link> </Menu.Item>
                </SubMenu>
                
              </Menu>
            </Sider>
            <Layout style={{ padding: '0.5em 2em', margin : '0px auto' }}>
              <Content
                className="site-layout-background"
                style={{
                  margin: '0px ',
                  minHeight: 280,
                }}
              >
                {children}
              </Content>
            </Layout>
            <Drawer 
              title="My Notifications" 
              width={595} 
              placement="right" 
              onClose={() => setNotificationDrawer(false)} 
              visible={notificationDrawer}
              >
                <Button style={{position : "absolute", right : '2em', bottom : '2em'}} onClick={clearNotifications} type="primary" icon={<DeleteOutlined/>}>Clear notifications</Button>
              <List>
              {notifs.map(n => {
                return (
                  <List.Item>
                    {/* <List.Item.Meta title={n.header} description={n.body} /> */}
                    
                    <div style={{display : 'flex', flexFlow : 'row', justifyContent : 'space-between'}}>
                      <div style={{display : 'flex', alignItems : 'center', justifyContent : 'center'}}><Notifooter n={n}></Notifooter></div>
                      <div style={{paddingLeft : '0.6em'}}>
                      <div style={{fontSize : '1.2em', marginBottom : "0.8em !important" }}>{n.header}</div>
                      <div style={{color : "gray"}}>{n.body.split('\n').map(i => {
                        return <p style={{marginBottom : '0.2em'}}>{i}</p>
                      })}</div>
                      </div>
                    </div>
                    
                  </List.Item>
                )
              })}
              {notifs.length == 0 && 
                <div style={{display : "flex", alignItems : 'center', flexFlow : 'column'}}>
                <Empty description="There are no notifications" />
                <Divider style={{margin : "1em auto"}}/>
                <Button style={{transform : 'scale(0.9)'}} loading={notifsLoading} onClick={() => fetchNotifs()} primary icon={<ReloadOutlined/>}>Refresh</Button>
                </div>
              }
              </List>
            </Drawer>
          </Layout>
        </Layout>
        </AuthWrapper>
    )
}
