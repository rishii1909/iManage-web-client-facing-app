import {Checkbox, Form, InputNumber, Row, Select, Space} from "antd";
import FormItem from "antd/lib/form/FormItem";
import{ useState } from 'react';


const { Option } = Select;

const NotificationRulesPanel = () => {
    
    const [custom, setCustom] = useState(null);
    const [wtof, setWtof] = useState(false);
    const [otof, setOtof] = useState(false);
    
    return (
            <>
                <Form.Item
                    name='notif_rules'
                    label="Notification trigger events"
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <Select 
                        placeholder="Select notification rules"
                        value={custom}
                        onChange={(val) => { setCustom(val); }}
                    >
                        <Option
                            value="every"
                        >
                        Alert after every given number of events
                        </Option>
                        <Option
                            value="custom"
                        > 
                        Add custom configuration...
                        </Option>
                    </Select>
                </Form.Item>

                {custom === "every" && 
                    <Form.Item
                        name="every_count"
                        label="Number of events [OK/Warning/Failure]"
                        valuePropName="value"
                    >
                    <Select 
                        placeholder="Select number of trigger events"
                        // value={custom}
                        // onChange={(val) => { setCustom(val); }}
                    >
                        <Option value="1" > 1 </Option>
                        <Option value="2" > 2 </Option>
                        <Option value="3" > 3 </Option>
                    </Select>
                    </Form.Item>
                }

                {custom === "custom" && 
                    <Form.Item
                        name="custom"
                        label="Alert after every selected events"
                        valuePropName="value"
                    >
                    {/* <Select 
                        placeholder="Select trigger events"
                        mode="multiple"
                        // value={custom}
                        // onChange={(val) => { setCustom(val); }}
                    >
                        <Option value="0" > Every OK/Warning to Failure </Option>
                        <Option value="1" > Every Failure to OK </Option>
                        <Option value="2" > Every OK to Warning </Option>
                        <Option value="3" > Every Warning to OK </Option>
                    </Select> */}
                        <Row>
                            <Checkbox onChange={(e)=>setWtof(e.target.checked)}> Every OK/Warning to Failure (New Failure) </Checkbox>
                        </Row> 
                        {wtof && 
                            <Row style={{paddingLeft : "1.2em"}}>
                                <Checkbox>
                                And every  <InputNumber min={1} max={3} defaultValue={1} />  failures thereafter
                                </Checkbox>
                            </Row>
                        }
                        
                        <Row>
                            <Checkbox> Every Failure to OK </Checkbox>
                        </Row> 
                        <Row>
                            <Checkbox onChange={(e)=>setOtof(e.target.checked)} > Every OK to Warning (New Warning)</Checkbox>
                        </Row>
                        {otof && 
                            <Row style={{paddingLeft : "1.2em"}}>
                                <Checkbox>
                                And every  <InputNumber min={1} max={3} defaultValue={1} />  warning thereafter
                                </Checkbox>
                            </Row>
                        }
                        <Row>
                            <Checkbox> Every Warning to OK </Checkbox>
                        </Row>
                    
                    </Form.Item>
                }

            </>
    )
}

export default NotificationRulesPanel;