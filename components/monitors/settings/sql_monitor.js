import {Button, Form, Input, Radio, Select} from "antd";
import{ useState } from 'react';
    import {PlusSquareOutlined} from "@ant-design/icons"
const { Option } = Select;

const SQLMonitorSettings = ({hostname}) => {
    // console.log(hostname)
    // const [hostVal, setHostVal] = useState(hostname);
    // console.log(hostVal)
    // const [portVal, setPortVal] = useState(161);

    const [type, setType] = useState(null);
    const [parameters, setParameters] = useState([]);
    const [paramCounter, setParamCounter] = useState(0);
    
    const addParameter = () => {
      setParameters(parameters.push({
        name : '',
        value : ''
    }));
    }

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
                    name='command_type'
                    label="Select command type"
                >
                    {/* <Input placeholder="Enter SQL database name" /> */}
                    <Radio  checked={type == 0} value={0} onClick={() => setType(0) } >Query</Radio>
                    <Radio  checked={type == 1} value={1} onClick={() => setType(1) } >Stored Procedure </Radio>
                </Form.Item>

                {type == 0 && 
                    <Form.Item
                        name='query'
                        label="SQL Query"
                    >
                        <Input placeholder="Enter SQL query"/>
                    </Form.Item>
                }

                {type == 1 && 
                    <Form.Item
                        name='stored_procedure'
                        label="SQL Stored Procedure"
                    >
                        <Input placeholder="Enter stored procedure"/>
                    </Form.Item>
                }

                {type !== null && 
                    <>
                    <Form.Item
                        name='parameters'
                        label="Add Parameters"
                        // rules={[{required : true, message : "Please enter OID."}]}
                    >
                        {parameters && parameters.map((p) => 
                            
                            <Input/>

                        )}
                        <Button icon={<PlusSquareOutlined/>} onClick={() => addParameter()}>Add Parameter</Button>
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
                }
                
            </>
    )
}

export default SQLMonitorSettings;