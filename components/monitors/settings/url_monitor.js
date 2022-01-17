import {Form, Input, InputNumber, Radio, Slider} from "antd";
import{ useState } from 'react';

const {TextArea} = Input;
const UrlMonitorSettings = ({form}) => {
    
    const [warn_content, setWarn_content] = useState("");
    const [fail_content, setFail_content] = useState("");


    return (
            <>
                <Form.Item
                    name='url'
                    label="URL"
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                >
                    <Input name="url" defaultValue="https://"></Input>
                </Form.Item>

                <Form.Item
                    name='timeout_failure'
                    label="Failure timeout"
                >
                    <InputNumber name="timeout_failure" defaultValue={1000} />
                </Form.Item>

                <Form.Item
                    name='timeout_warning'
                    label="Failure warning"
                >
                    <InputNumber name="timeout_warning" defaultValue={60} />
                </Form.Item>

                <Form.Item
                    name='warning_content'
                    label="Warning Content"
                >
                    <TextArea name="content_warning" onChange={(e)=>setWarn_content(e.target.value)} placeholder="Warn if content not found" ></TextArea>
                </Form.Item>

                {warn_content && 
                    <Form.Item
                        name='warn_if_found'
                        label="Warning Trigger condition"
                    >
                        <Radio.Group defaultValue={true} buttonStyle="solid"  >
                            <Radio.Button value={true} >
                                Warn if found
                            </Radio.Button>
                            <Radio.Button value={false} >
                                Warn if not found
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                }

                <Form.Item
                    name='failure_content'
                    label="Failure Content"
                >
                    <TextArea name="content_failure" onChange={(e)=>setFail_content(e.target.value)} placeholder="Fail if content not found" ></TextArea>
                </Form.Item>
                {fail_content && 
                    <Form.Item
                        name='fail_if_found'
                        label="Failure Trigger condition"
                    >
                        <Radio.Group defaultValue={true} buttonStyle="solid"  >
                            <Radio.Button value={true} >
                                Fail if found
                            </Radio.Button>
                            <Radio.Button value={false} >
                                Fail if not found
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                }
               
                
            </>
    )
}

export default UrlMonitorSettings;