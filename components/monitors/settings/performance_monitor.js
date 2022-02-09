import {Form, Input, InputNumber, message, Select, Button, Collapse} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";

const {Option} = Select;
const {TextArea} = Input;
const { Panel } = Collapse;


const PerformanceMonitorSettings = ({hostname, device_id, device_type, agent_id, form}) => {
    const [teamAgents, setTeamAgents] = useState(null);
    const [device, setDevice] = useState(null);
    const [enumerate, setEnumerate] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
                        if(agent_id){
                            console.log("Fetching processors")
                            fetchProcessors(response.response, agent_id)
                        }
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

        
    }, [device_id, agent_id, form]);

    function fetchProcessors(device, agent_id){
        if(device && agent_id){
            try {
                secure_axios(
                    '/monitors/remote',
                    {
                        ...{
                            api_path : '/api/performance_monitor/fetch/enumerate',
                            api_method : 'post',
                            agent_id : agent_id,
                        },
                        ...device.creds
                    },
                    router,
                    (response) => {
                        // return console.log(response)
                        if(response.accomplished){
                            setEnumerate(response.response.enumerate);
                            setCategories(response.response.enumerate.categories);

                        }else{
                            handle_error(response)
                        }
                    }
                )
            } catch (err) {
                console.log(err)
            }
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
                        onChange={(val) => {setAgent(val); fetchProcessors(val)}}
                    >
                        {teamAgents && teamAgents.map((el)=>{
                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.api_url}</span></div></Option>
                        })}
                    </Select>
                    
                    <Button onClick={()=>fetchProcessors(agent)}>Retry</Button>
                </Form.Item> */}

                <Form.Item
                    name='category_name'
                    labelCol={{span: 5}}
                    label='Category name'
                    rules={[{required : true, message : "Please select a Category."}]}
                >
                        <Select 
                            showSearch
                            placeholder={`Choose a Category.`}
                            onChange={(val) => {
                                const category = categories.filter(o => o.category_name === val)
                                console.log(category[0])
                                setSelectedCategory(category[0]);
                            }}
                            filterOption={(input, option) =>
                                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            
                            }
                            optionFilterProp="children"
                        >
                            {categories && categories.map((c)=>{
                                return <Option value={c.category_name} key={c.category_name}><div>{c.category_name}</div></Option>
                            })}
                        </Select>
                </Form.Item>
                    <Button disabled={!(categories == null)} style={{marginTop : "0.4em"}} onClick={()=>fetchProcessors(device, agent_id)}>Retry</Button>
                    
                <Form.Item
                    name='counter_name'
                    labelCol={{span: 5}}
                    label='Counter name'
                    rules={[{required : true, message : "Please select a Counter."}]}
                >
                        <Select 
                            disabled={selectedCategory != null ? false : true}
                            showSearch
                            placeholder={`Choose a Counter.`}
                            filterOption={(input, option) =>
                                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            
                            }
                            optionFilterProp="children"
                        >
                            {selectedCategory && selectedCategory.counters.map((c)=>{
                                return <Option value={c.couter_name} key={c.couter_name}><div>{c.couter_name}</div></Option>
                            })}
                        </Select>
                </Form.Item>
                    
                <Form.Item
                    name='instance'
                    labelCol={{span: 5}}
                    label='Instance'
                    rules={[{required : true, message : "Please select a Instance."}]}
                >
                        <Select 
                            disabled={selectedCategory != null ? false : true}
                            showSearch
                            placeholder={`Choose a Instance.`}
                            filterOption={(input, option) =>
                                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            optionFilterProp="children"
                        >
                            {selectedCategory && selectedCategory.Instances.map((c)=>{
                                return <Option value={c} key={c}><div>{c}</div></Option>
                            })}
                        </Select>
                </Form.Item>
                    
                <Form.Item
                    name='warn_min_threshold'
                    label='Warning Min threshold'
                    rules={[{required : true, message : "Please enter a min. warning threshold"}]}
                    
                >
                    <InputNumber 
                    // placeholder="Min. Warning" 
                    />
                </Form.Item>
                    
                <Form.Item
                    name='warn_max_threshold'
                    label='Warning Max threshold'
                    rules={[{required : true, message : "Please enter a max. warning threshold"}]}
                    
                >
                    <InputNumber 
                    // placeholder="Max. Warning" 
                    />
                </Form.Item>

                <Form.Item
                    name='fail_min_threshold'
                    label='Failure min. threshold'
                    rules={[{required : true, message : "Please enter a min. failure threshold"}]}
                >
                    <InputNumber 
                    // placeholder="Min. Failure"
                    />
                </Form.Item>

                <Form.Item
                    name='fail_max_threshold'
                    label='Failure max. threshold'
                    rules={[{required : true, message : "Please enter a max. failure threshold"}]}
                >
                    <InputNumber 
                    // placeholder="Max. Failure"
                    />
                </Form.Item>

                
                
            </>
    )
}

export default PerformanceMonitorSettings;