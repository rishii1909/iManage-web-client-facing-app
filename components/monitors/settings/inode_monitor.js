import {Form, Input, message, Select, Button, Tag, Checkbox, InputNumber, InfoCircleOutlined} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const CPUMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
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
                    name='inode_id'
                    labelCol={{span: 5}}
                    label='Select Inode'
                    rules={[{required : true, message : "Please select an Inode."}]}
                    
                >
                    <Select 
                        placeholder={`Choose an Inode`}
                        showSearch
                        filterOption={(input, option) =>
                            option.user.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                            (val) => {
                                setInode(val); 
                                form.setFieldsValue({
                                    warning_used_exceeds_cap : Math.floor(inodes[val].inodes * 0.9),
                                    failure_used_exceeds_cap : Math.floor(inodes[val].inodes * 0.75),
                                    warning_free_deceeds_cap : Math.floor(inodes[val].inodes * 0.1),
                                    failure_free_deceeds_cap : Math.floor(inodes[val].inodes * 0.05),
                                })
                            }
                        }
                    >
                        {inodes && Object.keys(inodes).map((key)=>{
                            return <Option value={key} key={key}><div style={{display : "flex", justifyContent : "space-between"}}> <span>{inodes[key].file_system}      <span style={{color: "gray"}}>{inodes[key].mounted_on}</span></span> <Tag color="geekblue">{inodes[key].iuse} | {inodes[key].inodes}</Tag> </div></Option>
                        })}
                    </Select>
                </Form.Item>
                <Button onClick={()=>fetchInodes(device, agent_id)} disabled={!(inodes == null)}>Retry</Button>

                <Form.Item
                    name='warning_used_exceeds_cap'
                    label='Warning usage exceed threshold'
                    tooltip={{ title: 'Trigger warning when bytes used exceed value' }}
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Bytes"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                

                <Form.Item
                    name='failure_used_exceeds_cap'
                    label='Failure usage exceed threshold'
                    tooltip={{ title: 'Trigger failure when bytes used exceed value' }}
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Bytes"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                

                <Form.Item
                    name='warning_free_deceeds_cap'
                    label='Warning free less than threshold'
                    tooltip={{ title: 'Trigger warning when free (available) bytes are less than given value' }}
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Bytes"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                

                <Form.Item
                    name='failure_free_deceeds_cap'
                    label='Failure free less than threshold'
                    tooltip={{ title: 'Trigger failure when free (available) bytes are less than given value' }}
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                    
                >
                    <InputNumber 
                    placeholder="Bytes"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                
            </>
    )
}

export default CPUMonitorSettings;