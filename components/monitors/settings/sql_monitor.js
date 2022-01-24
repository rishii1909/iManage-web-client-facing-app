import {Button, Col, Form, Input, Radio, Row, Select} from "antd";
import{ useState } from 'react';
    import {PlusSquareOutlined, DeleteOutlined} from "@ant-design/icons"
const { Option } = Select;

const SQLMonitorSettings = ({hostname, form}) => {
    // console.log(hostname)
    // const [hostVal, setHostVal] = useState(hostname);
    // console.log(hostVal)
    // const [portVal, setPortVal] = useState(161);

    const [type, setType] = useState(null);
    const [parameters, setParameters] = useState([]);
    const [paramCounter, setParamCounter] = useState(0);
    
    const addParameter = () => {
        setParameters([...parameters, {
            key : "",
            val : ""
        }]);
    }

    const changeKey = (key, i) => {
        parameters[i].key = key;
        // console.log(parameters)
        setParameters(parameters);
        form.setFieldsValue({parameters : parameters})
    }

    const changeVal = (val, i) => {
        // const params = parameters;
        parameters[i].val = val;
        setParameters(parameters);
        form.setFieldsValue({parameters : parameters})
    }

    // const deleteParam = (i) => {
    //     console.log(i, parameters)
    //     // let params = parameters.splice(i, 1);
    //     // console.log(i, params)
    //     parameters.splice(i, 1)
    //     setParameters(parameters)
    // }

    return (
            <>

                <Form.Item
                    name='host'
                    label="SQL Host"
                >
                    <Input placeholder="Enter SQL host" />
                </Form.Item>

                <Form.Item
                    name='username'
                    label="SQL Username"
                >
                    <Input placeholder="Enter SQL username" />
                </Form.Item>

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
                    <>
                    <Form.Item
                        name='stored_procedure'
                        label="SQL Stored Procedure"
                    >
                        <Input placeholder="Enter stored procedure"/>
                    </Form.Item>

                    <Form.Item
                        name='parameters'
                        label="Add Parameters"
                        // rules={[{required : true, message : "Please enter OID."}]}
                    >
                        {parameters.map((p, i) => 
                            
                            <Input.Group style={{margin : '0.4em 0'}}>
                                <Row gutter={8} justify="center" align="center">
                                    <Col span={12} >
                                        <Input 
                                        onChange={key => {
                                                changeKey(key.target.value, i);
                                                self.value = key.target.value
                                            }} 
                                        />
                                    </Col>
                                    <Col span={12} >
                                        <Input onChange={val => {
                                            changeVal(val.target.value, i);
                                            self.value = val.target.value
                                        }} />
                                    </Col>
                                    {/* <Col span={4} > 
                                        <Button size="medium" onClick={() => deleteParam(i)} className="delete-button" color="red" type="primary" icon={<DeleteOutlined/>}></Button> 
                                    </Col> */}
                                </Row>
                            </Input.Group>

                        )}
                        <Button type="primary" icon={<PlusSquareOutlined/>} onClick={() => addParameter()}>Add Parameter</Button>
                    </Form.Item>
                    </>
                }

                {type !== null && 
                    <>
                    <Form.Item
                        name='comparator'
                        label="Comparision operator"
                        initialValue={"="}
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