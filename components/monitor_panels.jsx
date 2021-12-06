const { TimePicker, Form, Input, Switch, InputNumber, Select } = require("antd");
const { secure_axios } = require("../helpers/auth");
const {Option} = Select;
import{ useState, useEffect } from 'react';
import { useRouter } from "next/router";


const DetailsPanel = ({ host, device_type, device_name, monitor_type, agentCallback }) => {
    const router = useRouter();
    const [teamAgents, setTeamAgents] = useState(null);
    useEffect(() => {
        secure_axios(
            "/agents/enumerate/" + device_type,
            {},
            router,
            (response) => {
                console.log(response)
              if(response.accomplished){
                setTeamAgents(response.response);
                agentCallback(response.response[0]._id)
              }else{
                setTeamAgents([]);
              }
            }
            )
    }, []);


    return (
            <>
                
                {teamAgents && 
                    <Form.Item
                    name='agent_id'
                    labelCol={{span: 5}}
                    label='Agent'
                    initialValue={teamAgents[0] ? teamAgents[0]._id : null}
                    rules={[{required : true, message : "Please select an agent."}]}
                    >
                        <Select 
                            placeholder={`Select ${device_type} agent`}
                            onChange={val => agentCallback(val)}
                            defaultValue
                        >
                            {teamAgents && teamAgents.map((el)=>{
                                return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                            })}
                        </Select>
                    </Form.Item>
                }
                <Form.Item
                    name='label'
                    labelCol={{span: 5}}
                    label='Name'
                    initialValue={device_name + " - " + monitor_type}
                    rules={[{required : true, message : "Please enter a name for this monitor."}]}
                >
                    <Input placeholder="Name this monitor" ></Input>
                </Form.Item>
                { host && 
                    <Form.Item
                        name={host}
                        label='Name'
                        rules={[{required : true, message : "Please enter a hostname."}]}
                    >
                        <Input name={host} placeholder="Enter hostname"></Input>
                    </Form.Item>
                }
                <Form.Item
                    name="pingInterval"
                    label="Monitor logging interval"
                    initialValue={10}
                >
                    <InputNumber defaultValue={60} /> Seconds
                </Form.Item>
                <Form.Item
                    name="offline_time_1"
                    labelCol={{span: 5}}
                    label="Offline time 1"
                    format="HH:mm"
                >
                    <TimePicker.RangePicker/>
                </Form.Item>
                <Form.Item
                    name="offline_time_2"
                    labelCol={{span: 5}}
                    label="Offline time 2"
                    format="HH:mm"
                >
                    <TimePicker.RangePicker/>
                </Form.Item>
                <Form.Item
                    name="active"
                    labelCol={{span: 5}}
                    label="Enabled"
                    initialValue={true}
                    valuePropName="checked" 
                    // wrapperCol={{offset : 9, span : 4}}
                >
                    <Switch></Switch>
                </Form.Item>
            </>
    )
}


export default DetailsPanel;