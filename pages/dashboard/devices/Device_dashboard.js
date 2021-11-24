import { useRouter } from "next/router";
import AuthWrapper from "../../../components/AuthWrapper";
import Dashboard from "../layout/layout";

const Device_dashboard = ({subdomain, children}) => {
  return (
          <Dashboard 
          domain='device' 
          submenu={submenu}
          urlPath='devices'
          subdomain={subdomain}
        >
          {children}
        </Dashboard>
    )
}


const submenu = [
  {
    path : 'add',
    label : 'Add Device'
  },
  {
    path : 'delete',
    label : 'Delete device'
  }
]
export default Device_dashboard