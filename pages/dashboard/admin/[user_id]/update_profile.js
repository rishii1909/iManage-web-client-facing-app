import { LoadingOutlined, UpCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  PageHeader,
  Switch,
  TimePicker,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import RightAlignedButtonWrapper from "../../../../components/ui/RetentionSchedulePanel";
import { handle_error, secure_axios } from "../../../../helpers/auth";
import Dashboard from "../../layout/layout";

const ProfileIndex = () => {
  const router = useRouter();

  const [fetchingProfile, setFetchingProfile] = useState(true);

  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);

  function hydrate(admin_data) {
    if (admin_data.notification_time) {
      const nf = admin_data.notification_time.split(" ");
      const ot_start = admin_data.offline_time_start.split(" ");
      const ot_end = admin_data.offline_time_end.split(" ");

      if (nf.length)
        admin_data.notification_time = moment(`${nf[1]}:${nf[0]}`, "H:m");

      if (ot_start.length && ot_end.length) {
        admin_data.offline_time = [
          moment(`${ot_start[1]}:${ot_start[0]}`, "H:m"),
          moment(`${ot_end[1]}:${ot_end[0]}`, "H:m"),
        ];
      }
    }

    form.setFieldsValue(admin_data);
  }

  useEffect(async () => {
    if (router.query.user_id) {
      secure_axios(
        "/teams/monitoring_admins/enumerate/one",
        {
          user_id: router.query.user_id,
        },
        router,
        (r) => {
          if (r.accomplished) {
            hydrate(r.response);
            setFetchingProfile(false);
          } else {
            handle_error(r);
          }
        }
      );
    }
  }, [router]);

  const handleUpdateProfile = (data) => {
    setUpdating(true);
    if (Array.isArray(data.offline_time)) {
      const off1 = data.offline_time[0].format("m:H").split(":");
      const off2 = data.offline_time[1].format("m:H").split(":");
      data.offline_time_start = `${off1[0]} ${off1[1]} * * *`;
      data.offline_time_end = `${off2[0]} ${off2[1]} * * *`;
    }

    if (data.notification_time) {
      const nf = data.notification_time.format("m:H").split(":");
      data.notification_time = `${nf[0]} ${nf[1]} * * *`;
    }

    secure_axios("/teams/monitoring_admins/update/one", data, router, (r) => {
      if (r.accomplished) {
        message.success("Profile updated successfully!");
        hydrate(r.response);
        router.push("/dashboard/admin/view_admins");
      } else {
        handle_error(r);
      }

      setUpdating(false);
    });
  };

  return (
    <Dashboard>
      <PageHeader title={"Edit Admin Profile"}>
        {fetchingProfile ? (
          <LoadingOutlined />
        ) : (
          <Form
            form={form}
            preserve={false}
            layout={"vertical"}
            labelCol={{
              offset: 0,
              span: 8,
            }}
            wrapperCol={{
              offset: 0,
              span: 12,
            }}
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              name={"email"}
              label={"E-mail"}
              rules={[{ required: true, message: "Please enter email" }]}
            >
              <Input placeholder={"johndoe@example.com"} readOnly disabled />
            </Form.Item>

            <Form.Item
              name={"name"}
              label={"Name"}
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input placeholder={"John Doe"} />
            </Form.Item>

            <Form.Item
              name={"offline_time"}
              label={"Offline time"}
              // format="HH:mm"
            >
              <TimePicker.RangePicker
                order={false}
                use12Hours
                format={"hh:mm a"}
              />
            </Form.Item>

            <Form.Item
              name={"heartbeat"}
              label={"Daily Heartbeat"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"send_queued"}
              label={"Send Queued Alerts"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"incl_message_body"}
              label={"Include Message Body"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"incl_ok"}
              label={"Include Status = Ok"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"incl_warn"}
              label={"Include Status = Warn"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"incl_fail"}
              label={"Include Status = Fail"}
              valuePropName={"checked"}
              // wrapperCol={{offset : 9, span : 4}}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={"notification_time"}
              label={"Notification Time"}
              // initialValue={offline_1}
              // format="HH:mm"
            >
              <TimePicker use12Hours format="hh:mm a" />
            </Form.Item>

            <RightAlignedButtonWrapper>
              <Button
                type={"primary"}
                htmlType={"submit"}
                loading={updating}
                icon={<UpCircleOutlined />}
              >
                Update my profile
              </Button>
            </RightAlignedButtonWrapper>
          </Form>
        )}
      </PageHeader>
    </Dashboard>
  );
};

export default ProfileIndex;
