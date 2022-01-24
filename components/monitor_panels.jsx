const { TimePicker, Form, Input, Switch, InputNumber, Select } = require("antd");
const { secure_axios } = require("../helpers/auth");
const {Option} = Select;
import{ useState, useEffect } from 'react';
import { useRouter } from "next/router";
import * as moment from 'moment';


const DetailsPanel = ({ host, device_type, device_name, monitor_type, agentCallback, agent, remote_data, metadata }) => {
    const router = useRouter();
    const [teamAgents, setTeamAgents] = useState([]);
    const [offline_1, setOffline_1] = useState([]);
    useEffect(() => {
        if(remote_data) console.log("REMOTE DATA IN DETAILS PANEL : ", remote_data);
        if(metadata) {
            console.log("META DATA IN DETAILS PANEL : ", metadata)
            const offline_times = metadata.offline_times;
            if(offline_times){
                console.log(offline_times)
                if(offline_times.offline_time_1_start){
                    const off_time_1 = offline_times.offline_time_1_start.split(' ');
                    const date_1_start = moment({hour : parseInt(off_time_1[0]), minute : parseInt(off_time_1[1])})
                    const date_1_end = moment({hour : parseInt(off_time_1[0])+1, minute : parseInt(off_time_1[1])+1})
                    const off_arr_1 = [date_1_start, date_1_end];
                    console.log(off_arr_1)
                    setOffline_1(off_arr_1);
                }
            }
        }
        if(!agent){
            secure_axios(
            "/agents/enumerate/" + device_type,
            {},
            router,
            (response) => {
                console.log(response)
                if(response.accomplished){
                  console.log("FETCHED AGENTS", response.response)
                setTeamAgents(response.response);
                if(response.response[0]) agentCallback(response.response[0]._id)
              }else{
                setTeamAgents([]);
              }
            }
            )
        }
    }, [agent]);


    return (
            <>
                
                {(teamAgents.length && !agent) && 
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
                            defaultActiveFirstOption
                            // defaultValue={ teamAgents.length ?  teamAgents[0]._id : false}
                        >
                            {teamAgents && teamAgents.map((el)=>{
                                return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                            })}
                        </Select>
                    </Form.Item>
                }
                {/* {agent && 
                    <Form.Item
                    name='null_agent'
                    labelCol={{span: 5}}
                    label='Agent'
                    initialValue={teamAgents[0] ? teamAgents[0]._id : null}
                    >
                        <Select 
                            placeholder={`Select ${device_type} agent`}
                            onChange={val => agentCallback(val)}
                            defaultValue
                            disabled
                        >
                            {agent && 
                                <Option value={agent._id} key={agent._id}><div>{agent.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{agent.api_url}</span></div></Option>
                            }
                        </Select>
                    </Form.Item>
                } */}
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
                    initialValue={60}
                >
                    <InputNumber defaultValue={60} /> Seconds
                </Form.Item>
                <Form.Item
                    name="offline_time_1"
                    labelCol={{span: 5}}
                    label="Offline time 1"
                    // initialValue={offline_1}
                    // format="HH:mm"
                >
                    <TimePicker.RangePicker use12Hours defaultValue={offline_1} format="hh:mm a" />
                </Form.Item>
                <Form.Item
                    name="offline_time_2"
                    labelCol={{span: 5}}
                    label="Offline time 2"
                    // initialValue={remote_data && [`${remote_data.offline_times.offline_time_1_start.split(' ')[1]}:${remote_data.offline_times.offline_time_1_start.split(' ')[0]}`, `${remote_data.offline_times.offline_time_1_start.split(' ')[1]}:${remote_data.offline_times.offline_time_1_start.split(' ')[0]}`]}
                    // format="HH:mm"
                >
                    <TimePicker.RangePicker use12Hours format="hh:mm a" />
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