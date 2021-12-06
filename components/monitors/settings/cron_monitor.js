import {Form, Input, message, Select, Button, Tag} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const CPUMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [device, setDevice] = useState(null);
    const [agent, setAgent] = useState(null);
    const [cronUser, setCronUser] = useState(null);
    const [cronUsers, setCronUsers] = useState(null);
    const [cronJobs, setCronJobs] = useState(null);
    const [cronJob, setCronJob] = useState(null);
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
                        fetchCronUsers(response.response, agent_id)
                    }
                }
            )
        }
    }, [device_id, agent_id]);

    function fetchCronUsers(device, agent_id){
        if(device && agent_id){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/enumerate/users',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log(response)
                    if(response.accomplished){
                        // console.log(response.response.enumerate.users)
                        setCronUsers(response.response.enumerate.users);
                    }else{
                        handle_error(response);
                    }
                }
            )
        }
    }
    function fetchCronJobs(device, agent_id, cron_user){
        console.log(device, agent_id, cron_user);
        if(device && agent_id && cron_user){
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/enumerate/cron_jobs',
                        api_method : 'post',
                        agent_id : agent_id,
                    },
                    ...device.creds,
                    ...{cron_user}
                },
                router,
                (response) => {
                    console.log(response)
                    if(response.accomplished){
                        console.log(response.response.enumerate.cron_jobs)
                        setCronJobs(response.response.enumerate.cron_jobs);
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
                    name='cron_user_id'
                    labelCol={{span: 5}}
                    label='Select Cron User'
                    rules={[{required : true, message : "Please select a cron user."}]}
                    
                >
                    <Select 
                        placeholder={`Choose a cron user`}
                        showSearch
                        filterOption={(input, option) =>
                            option.user.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(val) => {setCronUser(val); fetchCronJobs(device, agent_id, val);}}
                    >
                        {cronUsers && Object.keys(cronUsers).map((key)=>{
                            return <Option value={key} key={key} user={cronUsers[key]}><div style={{display : "flex", justifyContent : "space-between"}}>{cronUsers[key]}</div></Option>
                        })}
                    </Select>
                </Form.Item>
                <Button onClick={()=>fetchCronUsers(device, agent_id)} disabled={!(cronUsers == null)}>Retry</Button>
                <Form.Item
                    name='cron_id'
                    labelCol={{span: 5}}
                    label='Select Cron Job'
                    rules={[{required : true, message : "Please select a cron job."}]}
                    
                >
                    <Select 
                        placeholder={`Choose a cron job`}
                        showSearch
                        filterOption={(input, option) =>
                            option.user && option.user.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(val) => {setCronJob(val)}}
                    >
                        {cronJobs && Object.keys(cronJobs).map((key)=>{
                            return <Option value={key} key={key} user={cronJobs[key]}><div> <Tag color="blue" >{cronJobs[key].recurrence}</Tag> {cronJobs[key].command} </div></Option>
                        })}
                    </Select>
                </Form.Item>
                <Button onClick={()=>fetchCronJobs(device, agent_id, cronUser)} disabled={!(cronJobs == null)}>Retry</Button>
                <Form.Item
                    name='cron_logs_location'
                    labelCol={{span: 5}}
                    initialValue="/var/log/cron"
                    
                    label='Cron logs location path'
                    rules={[{required : true, message : "Please enter a a location to access cron logs from."}]}
                    
                >
                    <Input
                    />
                </Form.Item>

                
            </>
    )
}

export default CPUMonitorSettings;