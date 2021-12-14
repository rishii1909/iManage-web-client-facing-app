import {Form, Input, Select} from "antd";
import FormItem from "antd/lib/form/FormItem";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../helpers/auth";
import { useRouter } from "next/router";


const { Option } = Select;
const { TextArea } = Input;
const NotificationTemplatePanel = ({template_id}) => {
    const router = useRouter();
    const [templates, setTemplates] = useState(null);
    useEffect(() => {
        secure_axios(
            "/notifs/enumerate",
            {},
            router,
            (response) => {
              if(response.accomplished){
                setTemplates(response.response);
              }else{
                  console.log(response)
                handle_error(response)
              }
            }
            )
    }, []);

    return (
            <>
                    {
                        templates !== null && (
                            templates.length > 0 ? 
                                <Form.Item
                                    name='notification_template'
                                    label='Choose a template'
                                    initialValue={template_id ? template_id : templates[0] ? templates[0]._id : null}
                                    required={true}
                                >
                                    <Select 
                                        placeholder={`Select Notification Template`}
                                        
                                    >
                                        {templates.map((el)=>{
                                            return <Option value={el._id} key={el._id}><div>{el.name} | <span style={{fontSize : "0.8em", color : "gray"}}>{el.header}</span></div></Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                
                                :
                                <>
                                    <p>No saved notification templates found. Adding data here will create a new Notification Template.</p>
                                    <Form.Item
                                        name='template_name'
                                        label='Name'
                                        rules={[{required : true, message : "Please enter a name for this template."}]}
                                    >
                                        <Input name='name' placeholder="Name"></Input>
                                    </Form.Item>
                                    <Form.Item
                                        name='template_header'
                                        label='Subject'
                                        rules={[{required : true, message : "Please enter a subject for this template."}]}
                                    >
                                        <Input name='header' placeholder="Subject"></Input>
                                    </Form.Item>
                                    <Form.Item
                                        name='template_body'
                                        label='Body'
                                        rules={[{required : true, message : "Please enter a body for this template."}]}
                                    >
                                        <TextArea name='body' placeholder="Body"></TextArea>
                                    </Form.Item>
                                </>
                                
                                
                        )
                    }
            </>
    )
}

export default NotificationTemplatePanel;