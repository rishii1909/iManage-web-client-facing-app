import {Form, Input, message, Select, Button, Tag, Checkbox, InputNumber, InfoCircleOutlined} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const LoadMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [device, setDevice] = useState(null);
    const [agent, setAgent] = useState(null);
    const [inode, setInode] = useState(null);
    const [inodes, setInodes] = useState(null);
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
                        fetchInodes(response.response, agent_id)
                    }
                }
            )
        }
    }, [device_id, agent_id]);

    function fetchInodes(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/inode_monitor/fetch/enumerate',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)
                    if(response.accomplished){
                        setInodes(response.response.enumerate);
                    }else{
                        handle_error(response);
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
                        onChange={(val) => {setAgent(val); fetchCronUsers(val)}}
                    >
                        {teamAgents && teamAgents.map((el)=>{
                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                        })}
                    </Select>
                    
                    <Button onClick={()=>fetchCronUsers(agent)}>Retry</Button>
                </Form.Item> */}

                <Form.Item
                    name='warning_cap'
                    label='Trigger warning when load exceeds'
                    // tooltip={{ title: 'Trigger warning when bytes used exceed value' }}
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                    initialValue={75}
                    
                >
                    <InputNumber 
                    placeholder="Load percentage"
                    min={0}
                    max={100}
                    style={{width : "160px"}}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    />
                </Form.Item>
                

                <Form.Item
                    name='failure_cap'
                    label='Trigger failure when load exceeds'
                    // tooltip={{ title: 'Trigger failure when bytes used exceed value' }}
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                    initialValue={90}
                    
                >
                    <InputNumber 
                    placeholder="Load percentage"
                    min={0}
                    max={100}
                    style={{width : "160px"}}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    />
                </Form.Item>
                
            </>
    )
}

export default LoadMonitorSettings;