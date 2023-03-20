import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import emailjs from "emailjs-com";
import { useState } from "react";
import UnauthorizedLayer from "../components/UnauthorizedLayer";

const EMAILJS_SERVICE_ID = "service_9pohbfr";
const EMAILJS_TEMPLATE_ID = "template_0ine8rh";
const EMAILJS_USER_ID = "e8DFkaCp7NxUsZC3D";

const ContactPage = () => {
  const [form] = Form.useForm();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = (values) => {
    setSendingEmail(true);

    const name = values.name;
    const email = values.email;
    const msg = values.message;

    console.log(process.env.EMAILJS_SERVICE_ID);

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name,
          email,
          message: msg,
        },
        EMAILJS_USER_ID
      )
      .then(
        () => {
          setSendingEmail(false);
          setEmailSent(true);
          message.success(
            "The message was successfully delivered, we'll get back to you shortly"
          );
        },
        () => {
          setSendingEmail(false);
          setEmailSent(false);
          message.error(
            "The email couldn't be delivered, as something went wrong."
          );
        }
      );
  };

  return (
    <UnauthorizedLayer>
      <div
        style={{
          padding: "32px",
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "414px",
          }}
        >
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <h3
              style={{
                margin: "0px",
              }}
            >
              Contact Us
            </h3>

            <p
              style={{
                margin: "0px",
                opacity: "0.6",
              }}
            >
              Send us a message and we'll get back to you shortly!
            </p>
          </div>

          <Form form={form} onFinish={sendEmail}>
            <Form.Item
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Please enter your name.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className={"site-form-item-icon"} />}
                placeholder={"Your Name"}
              />
            </Form.Item>

            <Form.Item
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Please enter your email.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className={"site-form-item-icon"} />}
                placeholder={"Your Email"}
              />
            </Form.Item>

            <Form.Item
              name={"message"}
              rules={[
                {
                  required: true,
                  message: "Please enter the message.",
                },
              ]}
            >
              <Input.TextArea rows={5} placeholder={"Your Message"} />
            </Form.Item>

            <Button
              color={"primary"}
              icon={<SendOutlined />}
              type={"primary"}
              htmlType={"submit"}
              disabled={emailSent}
              loading={sendingEmail}
            >
              {emailSent ? "Email Has Been Sent" : "Send Message"}
            </Button>
          </Form>
        </div>
      </div>
    </UnauthorizedLayer>
  );
};

export default ContactPage;
