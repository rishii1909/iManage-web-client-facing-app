import { Row, Col, Layout, Menu } from 'antd';
import { LogoutOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import Link from 'next/link'
import Router from 'next/router';
import { logout } from '../../../helpers/auth';
import AuthWrapper from '../../../components/AuthWrapper';


const { Header, Content, Sider } = Layout;
const {SubMenu } = Menu;
export default function dashboard({ domain, subdomain, children }){
  const base_route = "/dashboard";
  const UserLogout = (e) => {
    logout(); Router.push('/auth/login')
  }
    return (
        <AuthWrapper>
          <Layout style={{minHeight : '100vh'}} >
          <Header className="header">
            <div className="logo" />
            
            <Row justify="space-between" wrap={false}>

            <Col>
              <Menu theme="dark" mode='horizontal' defaultSelectedKeys={[domain || false]}>

                  <Menu.Item key="monitors"> <Link href={`${base_route}/monitors`}>Monitors</Link> </Menu.Item>
                  <Menu.Item key="devices"> <Link href={`${base_route}/devices`}>Devices</Link> </Menu.Item>
                  <Menu.Item key="agents"> <Link href={`${base_route}/agents`}>Agents</Link> </Menu.Item>
            </Menu>
            </Col>
            <Col span={2}>
              <Menu theme='dark' mode='horizontal'>
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
          </Layout>
        </Layout>
        </AuthWrapper>
    )
}
