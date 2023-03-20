import { Form, Slider } from "antd";
import { useState, useEffect } from "react";

const RetentionSchedulePanel = ({ form, retention_schedule }) => {
  const [rawData, setRawData] = useState(1);
  const [dailyAggr, setDailyAggr] = useState(1);
  const [weeklyAggr, setWeeklyAggr] = useState(1);
  const [monthlyAggr, setMonthlyAggr] = useState(1);

  useEffect(() => {
    if (retention_schedule) {
      console.log(retention_schedule);
      setRawData(retention_schedule.raw_data);
      setDailyAggr(retention_schedule.daily_aggr);
      setWeeklyAggr(retention_schedule.weekly_aggr);
      setMonthlyAggr(retention_schedule.monthly_aggr);
      form.setFieldsValue({
        raw_data: rawData,
        daily_aggr: dailyAggr,
        weekly_aggr: weeklyAggr,
        monthly_aggr: monthlyAggr,
      });
    }
  }, [retention_schedule]);

  return (
    <>
      <Form.Item
        name="raw_data"
        colon={false}
        label={`Raw data : ${rawData} months`}
        labelAlign="left"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        initialValue={rawData}
        // rules={[{required : true, message : "Please enter a name for this monitor."}]}
        valuePropName="value"
        // shouldUpdate={true}
      >
        <div>
          <Slider
            min={0}
            max={12}
            step={1}
            marks
            value={rawData}
            tipFormatter={(val) => {
              return `${val} months`;
            }}
            onChange={(val) => {
              setRawData(val);
              form.setFieldsValue({ raw_data: val });
            }}
          ></Slider>
        </div>
      </Form.Item>
      <Form.Item
        name="daily_aggr"
        label={`Daily Aggregates : ${dailyAggr} months`}
        labelAlign="left"
        colon={false}
        labelCol={{ span: 12 }}
        wrapperCol={{
          span: 12,
        }}
        initialValue={retention_schedule ? dailyAggr : 1}
        // rules={[{required : true, message : "Please enter a name for this monitor."}]}
        valuePropName="value"
        shouldUpdate={true}
      >
        <div>
          <Slider
            min={0}
            max={12}
            marks
            step={1}
            value={dailyAggr}
            shouldUpdate={true}
            tipFormatter={(val) => {
              return `${val} months`;
            }}
            onChange={(val) => {
              setDailyAggr(val);
              form.setFieldsValue({ daily_aggr: val });
            }}
          ></Slider>
        </div>
      </Form.Item>
      <Form.Item
        name="weekly_aggr"
        colon={false}
        label={`Weekly Aggregates : ${weeklyAggr} months`}
        labelAlign="left"
        labelCol={{ span: 12 }}
        wrapperCol={{
          span: 12,
        }}
        initialValue={retention_schedule ? retention_schedule.weekly_aggr : 0}
        // rules={[{required : true, message : "Please enter a name for this monitor."}]}
        valuePropName="value"
      >
        <div>
          <Slider
            min={0}
            max={12}
            step={1}
            marks
            value={weeklyAggr}
            tipFormatter={(val) => {
              return `${val} months`;
            }}
            onChange={(val) => {
              setWeeklyAggr(val);
              form.setFieldsValue({ weekly_aggr: val });
            }}
          ></Slider>
        </div>
      </Form.Item>
      <Form.Item
        name="monthly_aggr"
        colon={false}
        label={`Monthly Aggregates : ${monthlyAggr} months`}
        labelAlign="left"
        labelCol={{ span: 12 }}
        wrapperCol={{
          span: 12,
        }}
        initialValue={retention_schedule ? retention_schedule.monthly_aggr : 0}
        // rules={[{required : true, message : "Please enter a name for this monitor."}]}
        valuePropName="value"
      >
        <div>
          <Slider
            min={0}
            max={12}
            step={1}
            marks
            value={monthlyAggr}
            tipFormatter={(val) => {
              return `${val} months`;
            }}
            onChange={(val) => {
              setMonthlyAggr(val);
              form.setFieldsValue({ monthly_aggr: val });
            }}
          ></Slider>
        </div>
      </Form.Item>
    </>
  );
};

export default RetentionSchedulePanel;
