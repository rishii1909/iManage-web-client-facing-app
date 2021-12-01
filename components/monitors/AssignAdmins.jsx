import {Form, Transfer} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../helpers/auth";

const AssignAdminsPanel = ({form}) => {
    const router = useRouter();
    
    const [users, setUsers] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    useEffect(() => {
        secure_axios("/teams/enumerate/users", {}, router, (data) => {
            console.log("admins users fetch",data)
            data.accomplished ? setUsers(data.response.map(user => { return {name : user.name, key : user._id} })) : handle_error(data);
        })
    }, []);

    const handleChange = (nextTargetKeys, direction, moveKeys) => {
      setTargetKeys(nextTargetKeys);

      console.log('targetKeys: ', nextTargetKeys);
      console.log('direction: ', direction);
      console.log('moveKeys: ', moveKeys);
    };

    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const selected = [...sourceSelectedKeys, ...targetSelectedKeys];
      setSelectedKeys(selected);
      form.setFieldsValue({assigned_users : selected})

      console.log('sourceSelectedKeys: ', sourceSelectedKeys);
      console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    const handleScroll = (direction, e) => {
      console.log('direction:', direction);
      console.log('target:', e.target);
    };


    const listStyleOptions = {minWidth : '300px'}
    const transferRowStyles = {display : 'flex', justifyContent : 'space-between'}
    const renderTransferRow = (item) => {
      return (
        <div style={transferRowStyles} key={item._id}>{item.name}</div>
      )
    }

    return (
            <>
                
                <Form.Item
                    name='assigned_users'
                    label="Assign monitor admins"
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <Transfer
                      dataSource={users}
                      titles={['Available users', 'Assigned users']}
                      targetKeys={targetKeys}
                      selectedKeys={selectedKeys}
                      onChange={handleChange}
                      onSelectChange={handleSelectChange}
                      onScroll={handleScroll}
                      render={item => renderTransferRow(item)}
                      oneWay
                      style={{ marginBottom: 16 }}
                      listStyle={listStyleOptions}
                    />
                </Form.Item>
                
            </>
    )
}

export default AssignAdminsPanel;