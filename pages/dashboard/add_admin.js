import { UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  PageHeader,
  Switch,
  TimePicker,
} from "antd";
import router from "next/router";
import { useState } from "react";
import RightAlignedButtonWrapper from "../../components/ui/RetentionSchedulePanel";
import { handle_error, secure_axios } from "../../helpers/auth";
import Dashboard from "./layout/layout";

const AddAdmin = () => {
  const [form] = Form.useForm();

  const [addingAdmin, setAddingAdmin] = useState(false);

  const handleAddAdmin = (data) => {
    setAddingAdmin(true);

    if (Array.isArray(data.offline_time)) {
      const start_date = data.offline_time[0].format("m:H").split(":");
      const end_date = data.offline_time[1].format("m:H").split(":");
      data.offline_time_start = `${start_date[0]} ${start_date[1]} * * *`;
      data.offline_time_end = `${end_date[0]} ${end_date[1]} * * *`;
    }

    if (data.notification_time) {
      const notification_time = data.notification_time.format("m:H").split(":");
      data.notification_time = `${notification_time[0]} ${notification_time[1]} * * *`;
    }

    secure_axios(
      "/teams/monitoring_admins/add/one",
      data,
      router,
      (response) => {
        if (response.accomplished) {
          message.success("Admin added successfully").then(() => {
            router.push("/dashboard/view_admins");
          });
          setAddingAdmin(false);
        } else {
          handle_error(response);
          setAddingAdmin(false);
        }
      }
    );
  };

  return (
    <Dashboard>
      <PageHeader title={"Add Admin"}>
        <Form
          form={form}
          preserve={false}
          layout={"vertical"}
          labelAlign={"left"}
          onFinish={handleAddAdmin}
          labelCol={{ offset: 0, span: 4 }}
          wrapperCol={{ offset: 0, span: 10 }}
        >
          <Form.Item
            name={"email"}
            label={"E-mail"}
            rules={[
              {
                required: true,
                message: "Admin cannot be added without entering the e-mail",
              },
            ]}
          >
            <Input placeholder={"Ex: johndoe@example.com"} />
          </Form.Item>

          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[
              {
                required: true,
                message: "Admin cannot be added without entering the name",
              },
            ]}
          >
            <Input placeholder={"Ex: John Doe"} />
          </Form.Item>

          <Form.Item name={"offline_time"} label={"Offline Time"}>
            <TimePicker.RangePicker
              use12Hours
              format={"hh:mm a"}
              order={false}
            />
          </Form.Item>

          <Form.Item
            name={"heartbeat"}
            label={"Send Daily Heartbeat"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={"send_queued"}
            label={"Send Queued Alerts"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={"incl_message_body"}
            label={"Include Message Body"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={"incl_ok"}
            label={"Include Status = OK"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={"incl_warn"}
            label={"Include Status = Warn"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={"incl_fail"}
            label={"Include Status = Fail"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>

          <Form.Item name={"notification_time"} label={"Notification Time"}>
            <TimePicker use12Hours format={"hh:mm a"} />
          </Form.Item>

          <RightAlignedButtonWrapper>
            <Button
              type={"primary"}
              htmlType={"submit"}
              loading={addingAdmin}
              icon={<UserAddOutlined />}
            >
              Add Admin
            </Button>
          </RightAlignedButtonWrapper>
        </Form>
      </PageHeader>
    </Dashboard>
  );
};

export default AddAdmin;
