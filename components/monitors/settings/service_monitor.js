import {Form, Input, InputNumber, message, Select, Button, Radio} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const ServiceMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [teamAgents, setTeamAgents] = useState(null);
    const [device, setDevice] = useState(null);
    const [services, setServices] = useState(null);
    const [service_id, setService_id] = useState(null);
    const [agent, setAgent] = useState(null);
    const router = useRouter();
    useEffect(async () => {
        if(device_id){
            secure_axios(
                "/devices/enumerate/device",
                {device_id : device_id, show_creds : true},
                router,
                (response) => {
                    if(response.accomplished){
                        setDevice(response.response);
                        fetchServices(response.response, agent_id)
                    }
                }
            )
            secure_axios(
                "/agents/enumerate/" + device_type,
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
        }
    }, [device_id, agent_id]);

    function fetchServices(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/service_monitor/fetch/enumerate',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)

                    if(response.accomplished){
                        setServices(response.response.enumerate);
                    }else{
                        message.error(response.response.message ? response.response.message : response.response)
                    }
                }
            )
        }
    }

    return (
            <>

                {/* <Form.Item
                    name='agent_id'
                    labelCol={{span: 5}}
                    label='Agent'
                    rules={[{required : true, message : "Please select an agent."}]}
                >
                    <Select 
                        placeholder={`Select ${device_type} agent`}
                        onChange={(val) => {setAgent(val); fetchServices(val)}}
                    >
                        {teamAgents && teamAgents.map((el)=>{
                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                        })}
                    </Select>
                    
                    <Button onClick={()=>fetchServices(agent)}>Retry</Button>
                </Form.Item> */}

                <Form.Item
                    name='service_id'
                    labelCol={{span: 5}}
                    label='Service'
                    rules={[{required : true, message : "Please select a service."}]}
                >
                        <Select 
                            showSearch
                            placeholder={`Choose a service.`}
                            // onChange={(val) => {setService_id(val)}}
                            filterOption={(input, option) =>
                                option.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                            
                            }
                            optionFilterProp="children"
                        >
                            {services && Object.keys(services).map((key)=>{
                                return <Option value={key} key={key}><div>{services[key].unit} | <span style={{fontSize : "0.8em", color : "gray"}}>{services[key].description}</span></div></Option>
                            })}
                        </Select>
                </Form.Item>
                <Button onClick={()=>fetchServices(device, agent_id)} disabled={services != null}>Retry</Button>

                <Form.Item
                    name="normal_state"
                    label="Normal state"
                    initialValue=""
                >
                    <Radio.Group>
                        <Radio value="running">Running</Radio>
                        <Radio value="not running">Not running</Radio>
                    </Radio.Group>
                </Form.Item>

                
                
            </>
    )
}

export default ServiceMonitorSettings;