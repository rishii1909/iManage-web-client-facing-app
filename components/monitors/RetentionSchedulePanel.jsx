import {Form, Slider} from "antd";
import{ useState } from 'react';

const RetentionSchedulePanel = () => {
    
    const [rawData, setRawData] = useState(0);
    const [dailyAggr, setDailyAggr] = useState(0);
    const [weeklyAggr, setWeeklyAggr] = useState(0);
    const [monthlyAggr, setMonthlyAggr] = useState(0);

    return (
            <>
                <Form.Item
                    name='raw_data'
                    colon={false}
                    label={`Raw data : ${rawData} months`}
                    labelAlign="left"
                    labelCol={{span: 5}}
                    initialValue={0}
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <div>
                    <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={rawData}
                        tipFormatter={(val) => {return `${val} months`}}
                        onChange={(val) => { return setRawData(val)}}
                    ></Slider>
                    </div>
                </Form.Item>
                <Form.Item
                    name='daily_aggregates'
                    label={`Daily Aggregates : ${dailyAggr} months`}
                    labelAlign="left"
                    colon={false}
                    labelCol={{span: 5}}
                    initialValue={0}
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <div>
                        <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={dailyAggr}
                        tipFormatter={(val) => {return `${val} months`}}
                        onChange={(val) => setDailyAggr(val)}
                    ></Slider>
                    </div>
                </Form.Item>
                <Form.Item
                    name='weekly_aggregates'
                    colon={false}
                    label={`Weekly Aggregates : ${weeklyAggr} months`}
                    labelAlign="left"
                    labelCol={{span: 5}}
                    initialValue={0}
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <div>
                        <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={weeklyAggr}
                        tipFormatter={(val) => {return `${val} months`}}
                        onChange={(val) => setWeeklyAggr(val)}
                    ></Slider>
                    </div>
                </Form.Item>
                <Form.Item
                    name='monthly_aggregates'
                    colon={false}
                    label={`Monthly Aggregates : ${monthlyAggr} months`}
                    labelAlign="left"
                    labelCol={{span: 5}}
                    initialValue={0}
                    // rules={[{required : true, message : "Please enter a name for this monitor."}]}
                    valuePropName="value"
                >
                    <div>
                        <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={monthlyAggr}
                        tipFormatter={(val) => {return `${val} months`}}
                        onChange={(val) => setMonthlyAggr(val)}
                    ></Slider>
                    </div>
                </Form.Item>
                
                
            </>
    )
}

export default RetentionSchedulePanel;