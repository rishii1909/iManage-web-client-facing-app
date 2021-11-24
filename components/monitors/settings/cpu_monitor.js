import {Form, Input, InputNumber, message, Select, Button} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const CPUMonitorSettings = ({hostname, device_id, device_type, agent_id}) => {
    const [teamAgents, setTeamAgents] = useState(null);
    const [device, setDevice] = useState(null);
    const [processors, setProcessors] = useState(null);
    const [proc_id, setProc_id] = useState(null);
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
                        if(agent_id){
                            console.log("Fetching processors")
                            fetchProcessors(response.response, agent_id)
                        }
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

    function fetchProcessors(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cpu_monitor/fetch/enumerate',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)

                    if(response.accomplished){
                        setProcessors(response.response.enumerate);
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
                        onChange={(val) => {setAgent(val); fetchProcessors(val)}}
                    >
                        {teamAgents && teamAgents.map((el)=>{
                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                        })}
                    </Select>
                    
                    <Button onClick={()=>fetchProcessors(agent)}>Retry</Button>
                </Form.Item> */}

                <Form.Item
                    name='proc_id'
                    labelCol={{span: 5}}
                    label='Select processor'
                    rules={[{required : true, message : "Please select a processor."}]}
                >
                    <Select 
                        placeholder={`Choose a processor.`}
                        onChange={val => setProc_id(val)}
                    >
                        {processors && Object.keys(processors).map((key)=>{
                            return <Option value={key} key={key}>{processors[key]}</Option>
                        })}
                    </Select>
                </Form.Item>
                    <Button disabled={!(processors == null)} style={{marginTop : "0.4em"}} onClick={()=>fetchProcessors(device, agent_id)}>Retry</Button>

                <Form.Item
                    name='warning_cap'
                    labelCol={{span: 5}}
                    label='Warning Processor usage threshold'
                    initialValue={50}
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Usage %" 
                    formatter={val => `${val} %`}
                    parser={val => val.replace(' %', '')}
                    />
                </Form.Item>

                <Form.Item
                    name='failure_cap'
                    labelCol={{span: 5}}
                    initialValue={80}
                    label='Failure Processor usage threshold'
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Usage %" 
                    formatter={val => `${val} %`}
                    parser={val => val.replace(' %', '')}
                    />
                </Form.Item>

                
                
            </>
    )
}

export default CPUMonitorSettings;