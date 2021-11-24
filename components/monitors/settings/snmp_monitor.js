import {Form, Input, InputNumber, Slider} from "antd";
import{ useState } from 'react';

const {TextArea} = Input;

const SNMPMonitorSettings = ({hostname}) => {
    // console.log(hostname)
    // const [hostVal, setHostVal] = useState(hostname);
    // console.log(hostVal)
    // const [portVal, setPortVal] = useState(161);
    return (
            <>

                <Form.Item
                    name='port'
                    label="Port"
                >
                    <InputNumber defaultValue={161} />
                </Form.Item>


                <Form.Item
                    name='ttl'
                    label="TTL"
                >
                    <InputNumber defaultValue={100} />
                </Form.Item>

                <Form.Item
                    name='oid'
                    label="OID"
                    rules={[{required : true, message : "Please enter OID."}]}
                >
                    <Input placeholder="Enter OID"/>
                </Form.Item>

                <Form.Item
                    name='timeout'
                    label="Timeout (ms) "
                >
                    <InputNumber defaultValue={500} />
                </Form.Item>
               
                
            </>
    )
}

export default SNMPMonitorSettings;