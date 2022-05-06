import { Form, Input, InputNumber, Slider } from "antd";
import { useState } from "react";

const { TextArea } = Input;
const TCPMonitorSettings = ({ hostname }) => {
  return (
    <>
      <Form.Item
        name="hostname"
        label="Hostname"
        style={{
          display: "none",
        }}
        initialValue={hostname}
        rules={[{ required: true, message: "Please enter the hostname." }]}
      >
        <Input placeholder="Enter hostname"></Input>
      </Form.Item>

      <Form.Item
        name="port"
        label="TCP Port"
        initialValue="80"
        rules={[{ required: true, message: "Please enter a port." }]}
      >
        <Input placeholder="Enter Port"></Input>
      </Form.Item>

      <Form.Item
        name="socketTimeout"
        label="Timeout (ms)"
        initialValue="1000"
        rules={[{ required: true, message: "Please enter a socket timeout." }]}
      >
        <Input placeholder="Enter socket timeout"></Input>
      </Form.Item>
    </>
  );
};

export default TCPMonitorSettings;
