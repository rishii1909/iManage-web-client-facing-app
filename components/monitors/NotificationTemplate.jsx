import { Checkbox, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handle_error, secure_axios } from "../../helpers/auth";

const { Option } = Select;
const { TextArea } = Input;

const NotificationTemplatePanel = ({ template_id }) => {
  const router = useRouter();
  const [templates, setTemplates] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const [editingTemplate, setEditingTemplate] = useState(false);

  useEffect(() => {
    secure_axios("/notifs/enumerate", {}, router, (response) => {
      if (response.accomplished) {
        setTemplates(response.response);
        setSelectedTemplate(response.response[0]);
        if (template_id) {
          setEditingTemplate(template_id !== response.response[0]._id);
        } else {
          setEditingTemplate(false);
        }
      } else {
        console.log(response);
        handle_error(response);
      }
    });
  }, [template_id]);

  return (
    <>
      {templates !== null && templates.length > 0 && (
        <Form.Item
          name="notification_template"
          label="Choose a template"
          initialValue={
            template_id ? template_id : templates[0] ? templates[0]._id : null
          }
          required={true}
        >
          <Select
            placeholder={`Select Notification Template`}
            onChange={(selectedTemplateID) => {
              setSelectedTemplate(
                templates.find((el) => el._id === selectedTemplateID)
              );
            }}
          >
            {templates.map((el) => {
              return (
                <Option value={el._id} key={el._id}>
                  <div>
                    {el.name} |{" "}
                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                      {el.header}
                    </span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
      <Form.Item
        label={"Edit Template"}
        name={"editing_template"}
        valuePropName={"checked"}
        style={{
          display: "flex",
          alignItems: "center",
          //   justifyContent: "center",
          gridGap: "8px",
          marginBottom: "16px",
        }}
      >
        <Checkbox
          checked={editingTemplate}
          onChange={(e) => {
            setEditingTemplate(e.target.checked);
          }}
        />
      </Form.Item>
      {selectedTemplate.name && (
        <>
          <Form.Item
            name={"template_name"}
            label={"Template Name"}
            required={true}
            // labelAlign={"right"}
            layout={"vertical"}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValue={selectedTemplate.name}
          >
            <Input disabled={!editingTemplate} />
          </Form.Item>

          <Form.Item
            name={"template_header"}
            label={"Template Header"}
            required={true}
            // labelAlign={"right"}
            layout={"vertical"}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValue={selectedTemplate.header}
          >
            <Input disabled={!editingTemplate} />
          </Form.Item>

          <Form.Item
            name={"template_body"}
            label={"Template Body"}
            required={true}
            // labelAlign={"right"}
            layout={"vertical"}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValue={selectedTemplate.body}
          >
            <Input.TextArea rows={6} disabled={!editingTemplate} />
          </Form.Item>
        </>
      )}{" "}
    </>
  );
};

export default NotificationTemplatePanel;
