import { Checkbox, Form, InputNumber, Row, Select, Space } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useEffect, useState } from "react";

const { Option } = Select;

const NotificationRulesPanel = ({ form, monitor }) => {
  const [custom, setCustom] = useState(null);
  const [wtof, setWtof] = useState(false);
  const [otow, setotow] = useState(false);
  const [owtof_count_check, setOwtof_count_check] = useState(false);
  const [otow_count_check, setOtow_count_check] = useState(false);

  useEffect(() => {
    if (monitor)
      setCustom(
        monitor?.notification_rules?.alert_all == true
          ? "every"
          : monitor?.notification_rules?.alert_rules.every == 1
          ? "disabled"
          : "custom"
      );
  }, [monitor]);

  return (
    <>
      {custom ? (
        <Form.Item
          name="custom"
          label="Notification trigger events"
          rules={[
            {
              required: true,
              message: "Please enter a name for this monitor.",
            },
          ]}
          valuePropName="value"
        >
          <Select
            placeholder="Select notification rules"
            defaultValue={custom}
            onChange={(val) => {
              setCustom(val);
            }}
          >
            <option value="every">
              Alert after every given number of events
            </option>
            <option value="custom">Add custom configuration...</option>
            <option value="disabled">Disable notifications</option>
          </Select>
        </Form.Item>
      ) : (
        <></>
      )}

      {custom === "every" && (
        <Form.Item
          name="every_count"
          label="Number of events [OK/Warning/Failure]"
          valuePropName="value"
        >
          <Select
            placeholder="Select number of trigger events"
            // value={custom}
            // onChange={(val) => { setCustom(val); }}
          >
            <Option value="1"> 1 </Option>
            <Option value="2"> 2 </Option>
            <Option value="3"> 3 </Option>
          </Select>
        </Form.Item>
      )}

      {custom === "custom" && (
        <Form.Item
          name="custom_config"
          label="Alert after every selected events"
          valuePropName="value"
        >
          <Row>
            <Form.Item name="owtof" valuePropName="checked">
              <Checkbox onChange={(e) => setWtof(e.target.checked)}>
                {" "}
                Every OK/Warning to Failure (New Failure){" "}
              </Checkbox>
            </Form.Item>
          </Row>
          {wtof && (
            <Row style={{ paddingLeft: "1.2em" }}>
              <Form.Item
                name="owtof_count_wrapper"
                valuePropName="checked"
                value
              >
                <Checkbox
                  onChange={(e) => {
                    setOwtof_count_check(e.target.checked);
                  }}
                >
                  And every{" "}
                  <InputNumber
                    disabled={!owtof_count_check}
                    min={1}
                    max={3}
                    defaultValue={1}
                    onChange={(val) => {
                      form.setFieldsValue({ owtof_count: val });
                    }}
                  />{" "}
                  failures thereafter
                </Checkbox>
              </Form.Item>
              <Form.Item name="owtof_count" hidden />
            </Row>
          )}

          <Row>
            <Form.Item name="fto" valuePropName="checked">
              <Checkbox> Every Failure to OK </Checkbox>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="otow" valuePropName="checked">
              <Checkbox onChange={(e) => setotow(e.target.checked)}>
                {" "}
                Every OK to Warning (New Warning)
              </Checkbox>
            </Form.Item>
          </Row>
          {otow && (
            <Row style={{ paddingLeft: "1.2em" }}>
              <Form.Item name="otow_count_wrapper" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setOtow_count_check(e.target.checked)}
                >
                  And every{" "}
                  <InputNumber
                    min={1}
                    max={3}
                    defaultValue={1}
                    onChange={(val) => {
                      form.setFieldsValue({ otow_count: val });
                    }}
                  />{" "}
                  warning thereafter
                </Checkbox>
              </Form.Item>
              <Form.Item name="otow_count" hidden />
            </Row>
          )}
          <Row>
            <Form.Item name="wto" valuePropName="checked">
              <Checkbox> Every Warning to OK </Checkbox>
            </Form.Item>
          </Row>
        </Form.Item>
      )}
    </>
  );
};

export default NotificationRulesPanel;
