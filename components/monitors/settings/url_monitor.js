import {Form, Input, InputNumber, Slider} from "antd";
import{ useState } from 'react';

const {TextArea} = Input;
const UrlMonitorSettings = () => {
    

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
                    name='failure_content'
                    label="Failure Content"
                >
                    <TextArea name="content_failure" placeholder="Fail if content not found" ></TextArea>
                </Form.Item>
                <Form.Item
                    name='warning_content'
                    label="Warning Content"
                >
                    <TextArea name="content_warning" placeholder="Warn if content not found" ></TextArea>
                </Form.Item>
               
                
            </>
    )
}

export default UrlMonitorSettings;