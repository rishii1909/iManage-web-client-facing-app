import {
  CopyOutlined,
  EyeInvisibleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, PageHeader } from "antd";
import router from "next/router";
import { useEffect, useState } from "react";
import { handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout";

const TeamSecret = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [teamSecretKey, setTeamSecretKey] = useState(null);

  const [generatingKey, setGeneratingKey] = useState(false);

  useEffect(() => {
    secure_axios(`/team_secrets/enumerate`, {}, router, (response) => {
      if (response.accomplished) {
        //   response
        if (!response.response) {
          setTeamSecretKey(null);
          setLoading(false);
          return;
        }

        setTeamSecretKey(response.response.secret);
        setLoading(false);
      } else {
        handle_error(response);
        setLoading(false);
      }
    });
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(teamSecretKey);
    message.success("Key copied to clipboard successfully");
  };

  const generateKey = () => {
    setGeneratingKey(true);
    secure_axios(`/team_secrets/create`, {}, router, (response) => {
      if (response.accomplished) {
        setTeamSecretKey(response.response.secret);
        message.success("The team secret key was generated successfully");
      } else {
        handle_error(response);
      }

      setLoading(false);
    });
  };

  return (
    <Dashboard>
      <PageHeader title={"View Team Secret"}>
        {loading ? (
          <LoadingOutlined />
        ) : (
          <>
            <Form
              form={form}
              preserve={false}
              layout={"vertical"}
              labelAlign={"left"}
              //   onFinish={handleAddAdmin}
              labelCol={{ offset: 0, span: 8 }}
              wrapperCol={{ offset: 0, span: 10 }}
            >
              {teamSecretKey ? (
                <>
                  <Form.Item label={"Team Secret Key"}>
                    <Input value={teamSecretKey} disabled readOnly />
                  </Form.Item>

                  <Button
                    type={"primary"}
                    htmlType={"button"}
                    icon={<CopyOutlined />}
                    onClick={handleCopyKey}
                  >
                    Copy Key
                  </Button>
                </>
              ) : (
                <Button
                  type={"primary"}
                  htmlType={"button"}
                  loading={generatingKey}
                  icon={<EyeInvisibleFilled />}
                  onClick={generateKey}
                >
                  Generate Team Secret
                </Button>
              )}
            </Form>
          </>
        )}
      </PageHeader>
    </Dashboard>
  );
};

export default TeamSecret;
