import {Form, Input, InputNumber, message, Select, Button, Tag} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const CPUMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [teamAgents, setTeamAgents] = useState(null);
    const [device, setDevice] = useState(null);
    const [disks, setDisks] = useState(null);
    const [disk_id, setDisk_id] = useState(null);
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
                        fetchDisks(response.response, agent_id)
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

    function fetchDisks(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/disk_monitor/fetch/enumerate',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)

                    if(response.accomplished){
                        setDisks(response.response.enumerate);
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
                        onChange={(val) => {setAgent(val); fetchDisks(val)}}
                    >
                        {teamAgents && teamAgents.map((el)=>{
                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                        })}
                    </Select>
                    
                    <Button onClick={()=>fetchDisks(agent)}>Retry</Button>
                </Form.Item> */}

                <Form.Item
                    name='disk_id'
                    labelCol={{span: 5}}
                    label='Select Disk'
                    rules={[{required : true, message : "Please select a disk."}]}
                    
                >
                    <Select 
                        placeholder={`Choose a disk.`}
                        onChange={(val) => {setDisk_id(val)}}
                    >
                        {disks && Object.keys(disks).map((key)=>{
                            return <Option value={disks[key].disk_id} key={disks[key].disk_id}><div style={{display : "flex", justifyContent : "space-between"}}>{key} <Tag>Used : {disks[key].used_perc} | Total space : {disks[key].total_space}</Tag> </div></Option>
                        })}
                    </Select>
                </Form.Item>
                <Button onClick={()=>fetchDisks(device, agent_id)} disabled={!(disks == null)}>Retry</Button>
                <Form.Item
                    name='warning_cap'
                    labelCol={{span: 5}}
                    initialValue={500}
                    
                    label='Warning when less than'
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                    
                >
                    <InputNumber 
                    onChange={val => form.setFieldsValue({ warning_cap : val })}
                    placeholder="Free space"
                    defaultValue={500}
                    /> KB free space
                </Form.Item>

                <Form.Item
                    name='failure_cap'
                    labelCol={{span: 5}}
                    initialValue={500}
                    label='Fail when less than'
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Free space"
                    defaultValue={50}
                    onChange={val => form.setFieldsValue({ failure_cap : val })}
                    /> KB free space
                </Form.Item>

                
                
            </>
    )
}

export default CPUMonitorSettings;