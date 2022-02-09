import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Space, message } from 'antd';
import styles from "./login.module.css";
import { InfoCircleOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Header } from 'antd/lib/layout/layout';
import axios from 'axios';
import { getAccessToken, setToken } from '../../helpers/auth';


export default function login_form() {

  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp_email, setOtp_email] = useState("");
  const [otp_verify, setOtp_verify] = useState("");
  const [otp_sent, setOtp_sent] = useState(false);
  const [otp_verified, setOtp_verified] = useState(false);
  const [password, setPassword] = useState("");

  const onFinish = (values) => {
    axios.post(
      `${process.env.API_URL}/login`,
      values
    ).then((r) => {
      const response  = r.data;
      if(response.accomplished){
        setToken(response.response)
        console.log(getAccessToken());
        Router.push('/dashboard');
      }
    }).catch((err) => {
      alert(err);
    })
  };

  const send_otp = () => {
    console.log(otp_email)
    axios.post(
      `${process.env.API_URL}/forgot_password/send_otp`,
      {email : otp_email}
    ).then((r) => {
      const response = r.data;
      if(response.accomplished){
        setOtp_sent(true)
        message.success(response.response);
      }else{
        setOtp_sent(false)
        message.error(response.response);
      }
      setOtp_sent(true)

    }).catch((err) => {
      console.log(err)
      alert(err);
    })
  }

  const verify_otp = () => {
    axios.post(
      `${process.env.API_URL}/forgot_password/verify_otp`,
      {otp : otp_verify}
    ).then((r) => {
      const response = r.data;
      if(response.accomplished){
        setOtp_verified(true)
        message.success(response.response);
      }else{
        setOtp_verified(false)
        message.error(response.response);
      }
      setOtp_verified(true)
    }).catch((err) => {
      console.log(err)
      alert(err);
    })
  }

  const reset_passwd = () => {
    axios.post(
      `${process.env.API_URL}/forgot_password/set_passwd`,
      {
        otp : otp_verify,
        password,
      }
    ).then((r) => {
      const response = r.data;
      if(response.accomplished){
        message.success(response.response);
        setForgotPassword(false);
      }else{
        message.error(response.response);
      }
    }).catch((err) => {
      console.log(err)
      alert(err);
    })
  }
  
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
      {!forgotPassword ?
        <>
        <h1 style={{textAlign : 'center'}}>Welcome back!</h1>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your email.',
            },
          ]}
        >
          <Input 
          prefix={<UserOutlined 
          className="site-form-item-icon" />} 
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Email" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password.',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            value='Reset123!'
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>  
          <a className="login-form-forgot" style={{textDecoration : "underline"}} onClick={() => setForgotPassword(true)}>
            Forgot password
          </a>
        </Form.Item>
  
        <Form.Item>
          <Space align='center' style={{width: '100%', justifyContent: 'center'}}>
          <Button type="primary" htmlType="submit" className={styles.login_button}>
            Log in
          </Button>
          </Space>
        </Form.Item>
        </>
      :
      <>
      <h2 style={{textAlign : 'center'}}>Forgot Password</h2>
      <p>Please enter your email address, an OTP will be sent to help reset your password.</p>
        <Form.Item
          name="otp_email"
         
        >
          <Input 
          prefix={<MailOutlined 
          className="site-form-item-icon" />}
          value={otp_email}
          required
          onChange={e => setOtp_email(e.target.value)}
          placeholder="OTP" 
          disabled={otp_sent}
          />
        </Form.Item>
        {!otp_sent && 
        <Form.Item>
          <Space align='center' style={{width: '100%', justifyContent: 'center'}}>
          <Button type="primary" htmlType="submit" onClick={() => send_otp()} className={styles.login_button}>
            Send OTP
          </Button>
          </Space>
        </Form.Item>
        }

        {otp_sent && 
          <>
            <Form.Item
            name="otp_verfy"
            >
            <Input 
            value={otp_verify}
            required
            onChange={e => setOtp_verify(e.target.value)}
            placeholder="Enter OTP" 
            />
            </Form.Item>

            {!otp_verified && 
              <Form.Item>
                <Space align='center' style={{width: '100%', justifyContent: 'center'}}>
                <Button type="primary" htmlType="submit" onClick={() => verify_otp()} className={styles.login_button}>
                  Verify OTP
                </Button>
                </Space>
              </Form.Item>
            }

            {otp_verified && 
              <>
              <Form.Item
              name="password"
              >
              <Input 
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password" 
              />
              </Form.Item>

              <Form.Item>
                <Space align='center' style={{width: '100%', justifyContent: 'center'}}>
                <Button type="primary" htmlType="submit" onClick={() => reset_passwd()} className={styles.login_button}>
                  Reset password
                </Button>
                </Space>
              </Form.Item>

              </>
            }


          </>

        
        }
      </>
      }
      </Form>
      </Col>
    </div>
  );
};

