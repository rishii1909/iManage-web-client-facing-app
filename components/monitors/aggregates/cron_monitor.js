import { Line } from "@ant-design/charts";
import {Carousel, Checkbox, DatePicker, Select, Switch} from "antd";
import { useRouter } from "next/router";
import{ useState, useEffect } from 'react';
import { handle_error, secure_axios } from "../../../helpers/auth";
import RightAlignedButtonWrapper from "../../ui/RetentionSchedulePanel";

const { RangePicker } = DatePicker;


const {Option} = Select;
const dates_dict = {
    "24h" : 1,
    "3d" : 3,
    "7d" : 7,
}
const makeDate = (option) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - dates_dict[option]);
    return dt.toUTCString();
}

const contentStyle = {
    padding : '2em !important',
  };

const graphData = (stats) => {
    const segregated_logs = [];
    stats.forEach(el => {
        if(el.hasOwnProperty('running')) segregated_logs.push({ running : el.running, category : 'OK', logged_at : el.logged_at });
        if(el.hasOwnProperty('warn_running')) segregated_logs.push({ running : el.warn_running, category : 'Warning', logged_at : el.logged_at });
        if(el.hasOwnProperty('not_running')) segregated_logs.push({ running : el.not_running, category : 'Failure', logged_at : el.logged_at });
    });
    return segregated_logs;
}

const CronMonitorAggregates = ({monitor, device_id, agent_id}) => {

    const router = useRouter();
    const [device, setDevice] = useState(null);
    const [autoPlay, setAutoPlay] = useState(true);

    const [hourly, setHourly] = useState([]);
    const [customHourly, setCustomHourly] = useState(true);
    const [hourlyLoading, setHourlyLoading] = useState(false);

    const [daily, setDaily] = useState([]);
    const [customDaily, setCustomDaily] = useState(false);
    const [dailyLoading, setDailyLoading] = useState(false);

    const [weekly, setWeekly] = useState([]);
    const [customWeekly, setCustomWeekly] = useState(false);
    const [weeklyLoading, setWeeklyLoading] = useState(false);

    const [monthly, setMonthly] = useState([]);
    const [customMonthly, setCustomMonthly] = useState(false);
    const [monthlyLoading, setMonthlyLoading] = useState(false);

    useEffect(() => {
        
        if(device_id && monitor){
            secure_axios(
                "/devices/enumerate/device",
                {device_id : device_id, show_creds : true},
                router,
                (response) => {
                    console.log(response);
                    if(response.accomplished){
                        setDevice(response.response);
                        const dt = new Date();
                        dt.setDate(dt.getDate() - 1);
                        fetchHourlyMonitors(response.response, agent_id, false, dt.toUTCString() )
                        fetchDailyMonitors(response.response, agent_id, false, dt.toUTCString() )
                        fetchWeeklyMonitors(response.response, agent_id, false, dt.toUTCString() )
                        fetchMonthlyMonitors(response.response, agent_id, false, dt.toUTCString() )
                    }
                }
            )
        }
    }, [device_id, agent_id, monitor]);

    
    function fetchHourlyMonitors(device, agent_id, before, after){
        setHourlyLoading(true);
        if(device && agent_id && monitor){
            if(before){
                if(dates_dict.hasOwnProperty(before)) before = makeDate(before)
                else before = (new Date(before)).toUTCString()
            };
            if(after){
                if(dates_dict.hasOwnProperty(after)) after = makeDate(after)
                else after = (new Date(after)).toUTCString()
            }
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/trends/hourly',
                        api_method : 'post',
                        monitor_ref : monitor.agent_id,
                        agent_id : agent_id,
                        ...(before) && {before : before},
                        ...(after) && {after : after},
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log("HOURLY MONITORS ", response)

                    if(response.accomplished){
                        const stats = response.response;
                        setHourly(graphData(stats));
                    }else{
                        handle_error(response);
                    }
                    setHourlyLoading(false);
                }
            )
        }
    }

    function fetchDailyMonitors(device, agent_id, before, after){
        setDailyLoading(true);
        if(device && agent_id && monitor){
            if(before){
                if(dates_dict.hasOwnProperty(before)) before = makeDate(before)
                else before = (new Date(before)).toUTCString()
            };
            if(after){
                if(dates_dict.hasOwnProperty(after)) after = makeDate(after)
                else after = (new Date(after)).toUTCString()
            }
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/trends/daily',
                        api_method : 'post',
                        monitor_ref : monitor.agent_id,
                        agent_id : agent_id,
                        ...(before) && {before : before},
                        ...(after) && {after : after},
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log("DAILY MONITORS ", response)

                    if(response.accomplished){
                        const stats = response.response;
                        setDaily(graphData(stats));
                    }else{
                        handle_error(response);
                    }
                    setDailyLoading(false);
                }
            )
        }
    }

    function fetchWeeklyMonitors(device, agent_id, before, after){
        setWeeklyLoading(true);
        if(device && agent_id && monitor){
            if(before){
                if(dates_dict.hasOwnProperty(before)) before = makeDate(before)
                else before = (new Date(before)).toUTCString()
            };
            if(after){
                if(dates_dict.hasOwnProperty(after)) after = makeDate(after)
                else after = (new Date(after)).toUTCString()
            }
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/trends/hourly',
                        api_method : 'post',
                        monitor_ref : monitor.agent_id,
                        agent_id : agent_id,
                        ...(before) && {before : before},
                        ...(after) && {after : after},
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log("WEEKLY MONITORS ", response)

                    if(response.accomplished){
                        const stats = response.response;
                        setWeekly(graphData(stats));
                    }else{
                        handle_error(response);
                    }
                    setWeeklyLoading(false);
                }
            )
        }
    }
    function fetchMonthlyMonitors(device, agent_id, before, after){
        setMonthlyLoading(true);
        if(device && agent_id && monitor){
            if(before){
                if(dates_dict.hasOwnProperty(before)) before = makeDate(before)
                else before = (new Date(before)).toUTCString()
            };
            if(after){
                if(dates_dict.hasOwnProperty(after)) after = makeDate(after)
                else after = (new Date(after)).toUTCString()
            }
            secure_axios(
                '/monitors/remote',
                {
                    ...{
                        api_path : '/api/cron_monitor/fetch/trends/hourly',
                        api_method : 'post',
                        monitor_ref : monitor.agent_id,
                        agent_id : agent_id,
                        ...(before) && {before : before},
                        ...(after) && {after : after},
                    },
                    ...device.creds
                },
                router,
                (response) => {
                    console.log("WEEKLY MONITORS ", response)

                    if(response.accomplished){
                        const stats = response.response;
                        setMonthly(graphData(stats));
                    }else{
                        handle_error(response);
                    }
                    setMonthlyLoading(false);
                }
            )
        }
    }

    let chartConfig = {
        padding : 'auto',
        xField : 'logged_at',
        yField : 'running',
        seriesField : 'category',
        xAxis : {
            type : 'time',
        },
        yAxis : {
            // smooth: true,
            animation: {
              appear: {
                animation: 'path-in',
                duration: 1500,
              },
            },
        },
        annotations : [
            {
                type : "regionFilter",
                start : ['min', monitor ? monitor.warning_cap : 'median'],
                end : ['max', monitor ? monitor.failure_cap : 'median'],
                color : "#ffcc00",
            },
            {
                type: 'text',
                position: ['min', `${monitor ? monitor.warning_cap : 0}`],
                content: 'Warning threshold',
                offsetY: -4,
                style: {
                  textBaseline: 'bottom',
                },
            },
            {
                type: 'text',
                position: ['min', `${monitor ? monitor.failure_cap : 0}`],
                content: 'Failure threshold',
                offsetY: -4,
                style: {
                  textBaseline: 'bottom',
                },
            },
            {
                type: 'line',
                start : ['min', monitor ? monitor.warning_cap : 'median'],
                end : ['max', monitor ? monitor.warning_cap : 'median'],
                style: {
                  stroke: '#cca300',
                  lineDash: [5, 5],
                },
            },  
            {
                type: 'line',
                start : ['min', monitor ? monitor.failure_cap : 'median'],
                end : ['max', monitor ? monitor.failure_cap : 'median'],
                style: {
                  stroke: '#cc3300',
                  lineDash: [5, 5],
                },
            },
            {
                type : "regionFilter",
                start : ['min', 0],
                end : ['max', monitor ? monitor.warning_cap : 'median'],
                color : "#339900",
            },
            {
                type : "regionFilter",
                start : ['min', monitor ? monitor.failure_cap : 'median'],
                end : ['max', 'max'],
                color : "#339900",
            }
        ],
        color : ['#339900', '#ffcc00', '#cc3300'],
        interactions: [{ type: 'element-active' }],

        // options : {
        //     onClick : (evt, element) => {
        //         console.log(evt, element)
        //     }
        // }

        // onEvent : (chart, event) => {
        //   console.log(chart);
        //   console.log(event);
        // }
    }

    return (
            <>  
                <RightAlignedButtonWrapper>
                    Autoplay <Switch checked={autoPlay} onChange={val => setAutoPlay(val)} />
                </RightAlignedButtonWrapper>
                <Carousel  autoplay={autoPlay}>
                    <div style={contentStyle}>
                        <h2>Hourly Aggregates</h2>
                        <RightAlignedButtonWrapper style={{marginBottom : '20px'}}>
                        <Checkbox checked={customHourly} onChange={e => setCustomHourly(e.target.checked)} >Custom range</Checkbox>
                        </RightAlignedButtonWrapper>
                        {customHourly ? 
                            <RightAlignedButtonWrapper>
                                <RangePicker onChange={(date_objects, dates) => fetchHourlyMonitors(device, agent_id, dates[1], dates[0])} />
                            </RightAlignedButtonWrapper>
                            :
                            <RightAlignedButtonWrapper>
                                Viewing now : 
                                <Select
                                    defaultValue="24h"
                                    onChange={val => fetchHourlyMonitors(device, agent_id, false, val)}
                                >
                                    <Option value='24h'>Last 24 hours</Option>
                                    <Option value='3d'>Last 3 days</Option>
                                    <Option value='7d'>Last 7 days</Option>
                                </Select>
                            </RightAlignedButtonWrapper>
                        }
                        
                        {!hourlyLoading && 
                            <Line
                            {...chartConfig}
                            data={hourly}
                            />
                        }
                    </div>
                    <div style={contentStyle}>
                        <h2>Daily Aggregates</h2>
                        <RightAlignedButtonWrapper style={{marginBottom : '20px'}}>
                        <Checkbox checked={customDaily} onChange={e => setCustomDaily(e.target.checked)} >Custom range</Checkbox>
                        </RightAlignedButtonWrapper>
                        {customDaily ? 
                            <RightAlignedButtonWrapper>
                                <RangePicker onChange={(date_objects, dates) => fetchDailyMonitors(device, agent_id, dates[1], dates[0])} />
                            </RightAlignedButtonWrapper>
                            :
                            <RightAlignedButtonWrapper>
                                Viewing now : 
                                <Select
                                    defaultValue="24h"
                                    onChange={val => fetchDailyMonitors(device, agent_id, false, val)}
                                >
                                    <Option value='24h'>Last 24 hours</Option>
                                    <Option value='3d'>Last 3 days</Option>
                                    <Option value='7d'>Last 7 days</Option>
                                </Select>
                            </RightAlignedButtonWrapper>
                        }

                        {!dailyLoading && 
                            <Line
                            {...chartConfig}
                            data={daily}
                            />
                        }
                    </div>
                    <div style={contentStyle}>
                        <h2>Weekly Aggregates</h2>
                        <RightAlignedButtonWrapper style={{marginBottom : '20px'}}>
                        <Checkbox checked={customWeekly} onChange={e => setCustomWeekly(e.target.checked)} >Custom range</Checkbox>
                        </RightAlignedButtonWrapper>
                        {customWeekly ? 
                            <RightAlignedButtonWrapper>
                                <RangePicker onChange={(date_objects, dates) => fetchWeeklyMonitors(device, agent_id, dates[1], dates[0])} />
                            </RightAlignedButtonWrapper>
                            :
                            <RightAlignedButtonWrapper>
                                Viewing now : 
                                <Select
                                    defaultValue="24h"
                                    onChange={val => fetchWeeklyMonitors(device, agent_id, false, val)}
                                >
                                    <Option value='24h'>Last 24 hours</Option>
                                    <Option value='3d'>Last 3 days</Option>
                                    <Option value='7d'>Last 7 days</Option>
                                </Select>
                            </RightAlignedButtonWrapper>
                        }

                        {!weeklyLoading && 
                            <Line
                            {...chartConfig}
                            data={weekly}
                            />
                        }
                    </div>
                    <div style={contentStyle}>
                        <h2>Monthly Aggregates</h2>
                        <RightAlignedButtonWrapper style={{marginBottom : '20px'}}>
                        <Checkbox checked={customMonthly} onChange={e => setCustomMonthly(e.target.checked)} >Custom range</Checkbox>
                        </RightAlignedButtonWrapper>
                        {customMonthly ? 
                            <RightAlignedButtonWrapper>
                                <RangePicker onChange={(date_objects, dates) => fetchMonthlyMonitors(device, agent_id, dates[1], dates[0])} />
                            </RightAlignedButtonWrapper>
                            :
                            <RightAlignedButtonWrapper>
                                Viewing now : 
                                <Select
                                    defaultValue="24h"
                                    onChange={val => fetchMonthlyMonitors(device, agent_id, false, val)}
                                >
                                    <Option value='24h'>Last 24 hours</Option>
                                    <Option value='3d'>Last 3 days</Option>
                                    <Option value='7d'>Last 7 days</Option>
                                </Select>
                            </RightAlignedButtonWrapper>
                        }

                        {!monthlyLoading && 
                            <Line
                            {...chartConfig}
                            data={monthly}
                            />
                        }
                    </div>
                    
                </Carousel>
                
            </>
    )
}


export default CronMonitorAggregates;