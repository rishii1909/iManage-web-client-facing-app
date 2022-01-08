import {Form, Input, Select} from "antd";
import{ useState } from 'react';

const { Option } = Select;

const SQLMonitorSettings = ({hostname}) => {
    // console.log(hostname)
    // const [hostVal, setHostVal] = useState(hostname);
    // console.log(hostVal)
    // const [portVal, setPortVal] = useState(161);
    return (
            <>

                <Form.Item
                    name='password'
                    label="SQL Password"
                >
                    <Input placeholder="Enter SQL password" type="password" />
                </Form.Item>

                <Form.Item
                    name='database'
                    label="SQL Database name"
                >
                    <Input placeholder="Enter SQL database name" />
                </Form.Item>

                <Form.Item
                    name='query'
                    label="SQL Query"
                >
                    <Input placeholder="Enter SQL query"/>
                </Form.Item>

                <Form.Item
                    name='comparator'
                    label="Comparision operator"
                    // rules={[{required : true, message : "Please enter OID."}]}
                >
                    <Select >
                        <Option value="=" >{"="}</Option>
                        <Option value=">=" >{">="}</Option>
                        <Option value="<=" >{"<="}</Option>
                        <Option value=">" >{">"}</Option>
                        <Option value="<" >{"<"}</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name='warning_cap'
                    label="Warning check value"
                >
                    <Input placeholder="Enter value"/>
                </Form.Item>

                <Form.Item
                    name='failure_cap'
                    label="Failure check value"
                >
                    <Input placeholder="Enter value"/>
                </Form.Item>
                
            </>
    )
}

export default SQLMonitorSettings;