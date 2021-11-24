import {Form, Input, InputNumber, Slider} from "antd";
import{ useState } from 'react';

const {TextArea} = Input;

const UptimeMonitorSettings = ({hostname}) => {
    

    return (
            <>
                <Form.Item
                    name='target'
                    label="Hostname"
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                >
                    <Input name="target" defaultValue={hostname ? hostname : ""}></Input>
                </Form.Item>

                <Form.Item
                    name='triesCount'
                    label="# Tries"
                    initialValue={2}
                >
                    <InputNumber name="triesCount" />
                </Form.Item>

                <Form.Item
                    name='maxFailures'
                    label="Max # Failures"
                    initialValue={2}
                >
                    <InputNumber name="maxFailures" />
                </Form.Item>

                <Form.Item
                    name='timeout'
                    label="Timeout (ms)"
                    initialValue={500}
                >
                    <InputNumber name="timeout" />
                </Form.Item>

                <Form.Item
                    name='packetSize'
                    label="Data Packet Size "
                    initialValue={500}
                >
                    <InputNumber name="packetSize" />
                </Form.Item>
               
               
                
            </>
    )
}

export default UptimeMonitorSettings;