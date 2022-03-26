import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";

import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Space, message } from "antd";
import styles from "./login.module.css";
import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Header } from "antd/lib/layout/layout";
import axios from "axios";
import { getAccessToken, handle_error, setToken } from "../../helpers/auth";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function register_form() {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp_email, setOtp_email] = useState("");
  const [otp_verify, setOtp_verify] = useState("");
  const [otp_sent, setOtp_sent] = useState(false);
  const [otp_verified, setOtp_verified] = useState(false);
  const [password, setPassword] = useState("");

  const [hasTeamSecret, setHasTeamSecret] = useState(false);

  const onFinish = (values) => {
    values.otp = values.verify_otp;
    axios
      .post(`${process.env.API_URL}/register`, values)
      .then((r) => {
        const response = r.data;
        if (response.accomplished) {
          message.success(response.response);
          Router.push("/auth/login");
        } else {
          handle_error(response);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const send_otp = () => {
    if (!validateEmail(email))
      return message.error("Please enter a valid email.");
    axios
      .post(`${process.env.API_URL}/register/send_verify_otp`, { email: email })
      .then((r) => {
        console.log(r);
        const response = r.data;
        if (response.accomplished) {
          setOtp_sent(true);
          message.success(response.response);
        } else {
          setOtp_sent(false);
          message.error(response.response);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const verify_otp = () => {
    axios
      .post(`${process.env.API_URL}/register/check_verify_otp`, {
        otp: otp_verify,
        email: email,
      })
      .then((r) => {
        const response = r.data;
        if (response.accomplished) {
          setOtp_verified(true);
          message.success(response.response);
        } else {
          setOtp_verified(false);
          message.error(response.response);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const reset_passwd = () => {
    axios
      .post(`${process.env.API_URL}/forgot_password/set_passwd`, {
        otp: otp_verify,
        password,
      })
      .then((r) => {
        const response = r.data;
        if (response.accomplished) {
          message.success(response.response);
          setForgotPassword(false);
        } else {
          message.error(response.response);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  return (
    <div className={styles.container}>
      <Col span={8} className={styles.login_box}>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <>
            <h1 style={{ textAlign: "center" }}>Create an account</h1>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                value={email}
                disabled={otp_sent}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </Form.Item>

            {!otp_sent && (
              <Form.Item>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    onClick={() => send_otp()}
                    className={styles.login_button}
                  >
                    Send verification code
                  </Button>
                </Space>
              </Form.Item>
            )}

            {otp_sent && (
              <>
                <Form.Item name="verify_otp">
                  <Input
                    value={otp_verify}
                    disabled={otp_verified}
                    onChange={(e) => setOtp_verify(e.target.value)}
                    placeholder="Enter verification token"
                  />
                </Form.Item>
              </>
            )}

            {!otp_verified && otp_sent && (
              <Form.Item>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    onClick={() => verify_otp()}
                    className={styles.login_button}
                  >
                    Verify code
                  </Button>
                </Space>
              </Form.Item>
            )}

            {otp_verified && otp_sent && (
              <>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name.",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Your Name"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password.",
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item name={"has_team_secret"} valuePropName={"checked"}>
                  <Checkbox
                    checked={hasTeamSecret}
                    onChange={(e) => setHasTeamSecret(e.target.checked)}
                  >
                    Join An Existing Team?
                  </Checkbox>
                </Form.Item>

                {hasTeamSecret && (
                  <Form.Item
                    name={"team_secret"}
                    label={"Team Secret"}
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter the team secret for the team you want to join.",
                      },
                    ]}
                  >
                    <Input type={"text"} placeholder={"Ex: SwVs_deTT"} />
                  </Form.Item>
                )}

                <Form.Item>
                  <Space
                    align="center"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.login_button}
                    >
                      Create Account
                    </Button>
                  </Space>
                </Form.Item>
              </>
            )}
          </>
        </Form>
      </Col>
    </div>
  );
}
