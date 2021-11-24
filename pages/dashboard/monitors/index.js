import Dashboard from "../layout/layout";

const Device_dashboard = ({subdomain, children}) => {
  return (
        <Dashboard 
          domain='monitor' 
          submenu={submenu}
          urlPath='monitors'
          subdomain={subdomain}
        >
        {children}
        </Dashboard>
    )
}

const submenu = [
  {
    path : 'uptime_monitor',
    label : 'Uptime Monitor'
  },
]
export default Device_dashboard