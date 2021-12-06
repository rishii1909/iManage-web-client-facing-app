import {Form, Input, message, Select, Button, Tag, Checkbox, InputNumber, InfoCircleOutlined} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const CPUMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [device, setDevice] = useState(null);
    const [agent, setAgent] = useState(null);
    const [swap, setSwap] = useState(null);
    const [swaps, setSwaps] = useState(null);
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
                        fetchSwaps(response.response, agent_id)
                    }
                }
            )
        }
    }, [device_id, agent_id]);

    function fetchSwaps(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/swap_monitor/fetch/enumerate',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)
                    if(response.accomplished){
                        setSwaps(response.response.enumerate);
                    }else{
                        handle_error(response);
                    }
                }
            )
        }
    }

    return (
            <>


                <Form.Item
                    name='swap_id'
                    labelCol={{span: 5}}
                    label='Select Swap'
                    rules={[{required : true, message : "Please select an Swap."}]}
                    
                >
                    <Select 
                        placeholder={`Choose a swap file`}
                        showSearch
                        filterOption={(input, option) =>
                            option.user.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                            (val) => {
                                setSwap(val); 
                                form.setFieldsValue({
                                    warning_used_exceeds_cap : Math.floor(swap[val].size * 0.75),
                                    failure_used_exceeds_cap : Math.floor(swap[val].size * 0.9),
                                })
                            }
                        }
                    >
                        {swaps && Object.keys(swaps).map((key)=>{
                            return <Option value={key} key={key}><div style={{display : "flex", justifyContent : "space-between"}}> <span>{swaps[key].swap}      <span style={{color: "gray"}}>{swaps[key].type}</span></span> <Tag color="geekblue">{swaps[key].used} | {swaps[key].size}</Tag> </div></Option>
                        })}
                    </Select>
                </Form.Item>
                <Button onClick={()=>fetchSwaps(device, agent_id)} disabled={!(swaps == null)}>Retry</Button>

                <Form.Item
                    name='warning_used_exceeds_cap'
                    label='Warning usage exceed threshold'
                    tooltip={{ title: 'Trigger warning when space used exceed value' }}
                    rules={[{required : true, message : "Please enter a warning threshold"}]}
                >
                    <InputNumber 
                    placeholder="Value"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                

                <Form.Item
                    name='failure_used_exceeds_cap'
                    label='Failure usage exceed threshold'
                    tooltip={{ title: 'Trigger failure when space used exceed value' }}
                    rules={[{required : true, message : "Please enter a failure threshold"}]}
                >
                    <InputNumber 
                    placeholder="Value"
                    style={{width : "160px"}}
                    />
                </Form.Item>
                
            </>
    )
}

export default CPUMonitorSettings;