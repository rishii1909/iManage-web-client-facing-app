import {Form, Input, InputNumber, message, Select, Button, Space, Row} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { secure_axios } from "../../../helpers/auth";
const {Option} = Select;
const {TextArea} = Input;

const FileMonitorSettings = ({hostname, device_id, device_type, form}) => {
    const [teamAgents, setTeamAgents] = useState(null);
    const [device, setDevice] = useState(null);
    const [services, setServices] = useState(null);
    const [service_id, setService_id] = useState(null);
    const [agent, setAgent] = useState(null);
    const [dir_path, setDir_path] = useState("/");
    const [file_pattern, setFile_pattern] = useState("");
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
    }, [device_id]);

    function fetchServices(agent_id){
        console.log(agent_id)
        if(device){
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


                <Form.Item
                    name='dir_path'
                    label="Directory path"
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                >
                    <Input value={dir_path} onChange={(e) => {setDir_path(e.target.value); form.setFieldsValue({file_path : e.target.value + file_pattern})}} ></Input>
                </Form.Item>
                <Form.Item
                    name='file_pattern'
                    label="File pattern"
                >
                    <Input placeholder="Eg, *.txt" value={file_pattern} onChange={(e) => {setFile_pattern(e.target.value); form.setFieldsValue({file_path : dir_path + e.target.value})}} ></Input>
                </Form.Item>

                <Form.Item
                    name='file_path'
                    label="File path"
                >
                    <Input value={dir_path + file_pattern} />
                    <span style={{display : 'none'}}>{dir_path + file_pattern}</span>
                </Form.Item>
               
                <Form.Item
                    name='warning_cap_file_count'
                    label="Warning file count"
                    initialValue={100}
                >
                    <InputNumber></InputNumber>
                </Form.Item>
                <Form.Item
                    name='failure_cap_file_count'
                    label="Failure file count"
                    initialValue={500}
                >
                    <InputNumber></InputNumber>
                </Form.Item>
                <Form.Item
                    name='warning_cap_file_size'
                    label="Warning file size"
                >
                    <InputNumber defaultValue={10} onChange={val => form.setFieldsValue({ warning_cap_file_size : val})} /> MB
                </Form.Item>
                <Form.Item
                    name='failure_cap_file_size'
                    label="Failure file size"
                >
                    <InputNumber defaultValue={50} onChange={val => form.setFieldsValue({ failure_cap_file_size : val})} /> MB
                </Form.Item>
                <Form.Item
                    name='failure_max_file_age'
                    label="Failure max file age"
                >
                    {/* <Space> */}
                    <Row>
                    <Space>
                    <InputNumber></InputNumber>
                    <Select style={{width : "120px"}} placeholder="Units" defaultActiveFirstOption>
                        <Option value="seconds">Seconds</Option>
                        <Option value="minutes">Minutes</Option>
                        <Option value="hours">Hours</Option>
                    </Select>
                    </Space>
                    </Row>
                    <Row>
                    <div style={{display : "flex", alignItems:"center"}}>
                    Based on Time 
                    <Select style={{width : "120px", margin : '4px'}} placeholder="Type" defaultActiveFirstOption>
                        <Option value="modified">modified</Option>
                        <Option value="created">created</Option>
                        <Option value="accessed">accessed</Option>
                    </Select>
                    of
                    <Select style={{width : "120px", margin : '4px'}} placeholder="Type" defaultActiveFirstOption>
                        <Option value="oldest">oldest</Option>
                        <Option value="newest">newest</Option>
                    </Select>
                    file.
                    </div>
                    </Row>
                    {/* </Space> */}
                </Form.Item>
               
               
                
            </>
    )
}

export default FileMonitorSettings;