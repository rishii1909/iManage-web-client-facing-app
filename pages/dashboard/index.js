import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';

import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Dashboard from "./layout/layout";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message, PageHeader, Spin, Card, Statistic, Avatar, Empty } from "antd";
import styles from "./dashboard.module.css"
import { secure_axios } from "../../helpers/auth";
import { Header } from "antd/lib/layout/layout";
import { Skeleton } from "antd";
import Column from "antd/lib/table/Column";
import { CheckSquareFilled, CloseSquareFilled, MinusCircleFilled, WarningFilled } from "@ant-design/icons";
const dict_two_states = {
  0 : "Up",
  1 : "Down",
  [-1] : "Inactive"
}

const dict_three_states = {
  0 : "OK",
  1 : "Warning",
  2 : "Failure",
  [-1] : "Inactive"
}

const Pie = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Pie),
  { ssr: false }
)

const DashboardIndex = () => {

  const router = useRouter();

  const [dashboard, setDashboard] = useState({});
  const [twoStates_lvl_1, setTwoStates_lvl_1] = useState([]);
  const [threeStates_lvl_1, setThreeStates_lvl_1] = useState([]);
  const [loaded_two_states, setLoaded_two_states] = useState(false);
  const [loaded_three_states, setLoaded_three_states] = useState(false);
  const [level_2, setLevel_2] = useState([]);
  const [level_3, setLevel_3] = useState([]);
  const [level_2_state, setLevel_2_state] = useState(null);
  const [level_3_state, setLevel_3_state] = useState(null);
  const [activeState, setActiveState] = useState(null);

  const ref_level_2 = useRef(null);
  const ref_level_3 = useRef(null);

  

  useEffect(() => {
    secure_axios(
      '/monitors/dashboard/showcase',
      {},
      router,
      (response) => {
        try {
          console.log(response)
          if(response.accomplished){
            if(response.response == []){  
              setTwoStates_lvl_1([]);
              setLoaded_two_states(true);
              setThreeStates_lvl_1([]);
              setLoaded_three_states(true);
              return message.info("No monitors found.");
            }
            setDashboard(response.response);
            const two_keys = Object.keys(response.response.level_1.two_states)
            const three_keys = Object.keys(response.response.level_1.three_states)
            const two_states = []
            const three_states = []
            console.log(three_keys)
            let three_sum = 0;
            let two_sum = 0;
            three_keys.forEach((key) => {
              const monitors = response.response.level_1.three_states[key];
              three_sum += monitors;
              dict_three_states[key] && three_states.push({
                type : dict_three_states[key],
                monitors : monitors,
                // code : key,
                key : key
              })
              
            })
            two_keys.forEach((key) => {
              const monitors = response.response.level_1.two_states[key];
              two_sum += monitors;
              dict_two_states[key] && two_states.push({
                type : dict_two_states[key],
                monitors : monitors,
                // code : key,
                key : key
              })
            })
            setTwoStates_lvl_1(two_sum > 0 ? two_states : []);
            setLoaded_two_states(true);
            setThreeStates_lvl_1(three_sum > 0 ? three_states : []);
            setLoaded_three_states(true);
          }
        } catch (error) {
          console.log(error);
          setTwoStates_lvl_1([]);
          setLoaded_two_states(true);
          setThreeStates_lvl_1([]);
          setLoaded_three_states(true);
        }
      }

    )
  }, []);

  function level_two(state){
    setActiveState(state);
    console.log(state)
    const dash = dashboard.level_2[`${state == 2 ? "two" : "three"}_states`];
    const two_keys = Object.keys(dash);
    const two_keys_arr = [];
    two_keys.forEach(key => {
      const current = dash[key];
      const states_arr = []
      let monitors_count = 0;
      for (const code in current) {
        if (Object.hasOwnProperty.call(current, code)) {
          const monitors = current[code];
          monitors_count += monitors;
          states_arr.push({
            type : state == 2 ? dict_two_states[code] : dict_three_states[code],
            monitors : monitors
          })
        }
      }
      two_keys_arr.push({
        key : key,
        states : states_arr,
        count : monitors_count
      })
    });
    console.log(two_keys_arr)
    setLevel_2(two_keys_arr);
    setLevel_2_state(state)
    ref_level_2.current.scrollIntoView()
    
  }

  function level_three(key){
    setLevel_3_state(key);
    const dash = dashboard.level_3[key];
    const monitors = [];
    for (const monitor_key in dash) {
      if (Object.hasOwnProperty.call(dash, monitor_key)) {
        const monitor = dash[monitor_key];
        monitor.ref = monitor_key;
        // if(level_2_state == 2 && monitor.monitor_status == 1) monitor.monitor_status = 2;
        if(activeState == 2){
          switch (monitor.monitor_status) {
            case 0:
              monitor.color = "#3f8600";
              monitor.color_faded = "#ecf3e6";
              monitor.symbol = <CheckSquareFilled />
              monitor.verbose = "Up"
              break;
          
            case 1:
              monitor.color = "#cf1322";
              monitor.color_faded = "#fae7e9";
              monitor.symbol = <CloseSquareFilled />
              monitor.verbose = "Down"
              break;
          
            default:
              monitor.color = "#a020f0";
              monitor.color_faded = "#f6e9fe";
              monitor.symbol = <MinusCircleFilled />
              monitor.verbose = "Inactive"
              break;
          }
        }else{
          switch (monitor.monitor_status) {
            case 0:
              monitor.color = "#3f8600";
              monitor.color_faded = "#ecf3e6";
              monitor.symbol = <CheckSquareFilled />
              monitor.verbose = "OK"
              break;
          
            case 1:
              monitor.color = "#eed202";
              monitor.color_faded = "#fdfbe6";
              monitor.symbol = <WarningFilled />
              monitor.verbose = "Warning"
              break;
          
            case 2:
              monitor.color = "#cf1322";
              monitor.color_faded = "#fae7e9";
              monitor.symbol = <CloseSquareFilled />
              monitor.verbose = "Failure"
              break;
          
            default:
              monitor.color = "#a020f0";
              monitor.color_faded = "#f6e9fe";
              monitor.symbol = <MinusCircleFilled />
              monitor.verbose = "Inactive"
              break;
          }
        }
        monitors.push(monitor)
      }
    }
    setLevel_3(monitors);
    ref_level_3.current.scrollIntoView()

  }

  let config_two_states = {
    appendPadding: 0,
    data: twoStates_lvl_1,
    angleField: 'monitors',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    onReady : (plot) => {
      plot.on('plot:click', ({data}) => {
        level_two(2);
      });
    }
  };

  let config_three_states = {
    appendPadding: 0,
    data: threeStates_lvl_1,
    angleField: 'monitors',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    onReady : (plot) => {
      plot.on('plot:click', ({data}) => {
        level_two(3);
      });
    }
  };

  function level_2_config(host){
    return {
      data : host.states,
      appendPadding: 0,
      angleField: 'monitors',
      colorField: 'type',
      radius: 1,
      innerRadius : 0.5,
      label: {
        type: 'inner',
        offset: '-50%',
        labelHeight: 28,
        content: '',
      },
      interactions: [{ type: 'element-active' }],
      statistic: {
        title: true,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize : '16px',
            fontWeight : '600'
          },
          content: `${host.count} monitor${host.count > 1 ? "s" : ""}`,
        },
      },
    };
  }


  return ( 
    <Dashboard>
      <div style={{display : "flex", flexFlow : "column"}}>
      <div>
      <Row style={{paddingTop : "1.6em"}} >
        <Col xl={12} md={24} >
          <PageHeader
            style={{padding : '0px'}}
            title="2 state monitors"
          />
          <p>Monitors that have either Up/Down monitor log states for detection.</p>


          <div className={styles['pie-wrapper']}>
          { twoStates_lvl_1 && twoStates_lvl_1.length > 0 ? 
          <Pie
           {...config_two_states} style={{opacity : twoStates_lvl_1 ? '1' : '0.4', width : '100%'}} ></Pie>
            :
            loaded_two_states ?
            <Empty description={"No monitors to show"}></Empty> 
            :
            <Spin size='large' style={{position : 'absolute' }}></Spin> 
            }
          </div>
        </Col>
        <Col xl={12} md={24} >
          <PageHeader
            style={{padding : '0px'}}
            title="3 state monitors"
          />
          <p>Monitors that have one of OK/Warning/Failure monitor log states for detection.</p>


          <div className={styles['pie-wrapper']}>
            { threeStates_lvl_1 && threeStates_lvl_1.length > 0 ? 
            <Pie
            
             {...config_three_states} style={{opacity : threeStates_lvl_1 ? '1' : '0.4', width : '100%'}} ></Pie>
             :
            loaded_three_states ?
            <Empty description={"No monitors to show"}></Empty> 
            :
            <Spin size='large' style={{position : 'absolute' }}></Spin> 
            }
          </div>
        </Col>
      </Row>
      </div>
      
      </div>
      <div>
      {level_2.length > 0 && 
          <>
          <Divider/>
          <PageHeader
            style={{padding : '0px'}}
            title={level_2_state + " state monitors"}
          />
          </>
        }
      <Row 
        justify="space-between"
        align="top"
        style={{paddingTop : '1em'}}
        ref={ref_level_2}
      >
        {level_2.map((host) => 
          <>
          <Col className={styles['monitor_box']} onClick={() => level_three(host.key)}>
            <h3 style={{textAlign : 'center', paddingRight : '12%'}}>{host.key}</h3>
            <Pie 
              {...(level_2_config(host))}
              width={250}
              height={220}
              
              data={host.states}
              style={{margin : '0px'}}
            />
          </Col>
          </>
        )}
      </Row>
      </div>
      <div>
      {level_3.length > 0 && 
          <>
          <Divider/>
          <PageHeader
            style={{padding : '0px'}}
            title={level_3_state}
          />
          </>
        }
      <Row 
        justify="space-between"
        align="top"
        style={{paddingTop : '2em'}}
        ref={ref_level_3}
      >
        {level_3.map((monitor) => 
          <>
          <Col style={{border : `2px solid lightGray`}}>
          <div className={styles['monitor_box']} style={{backgroundColor : monitor.color_faded, borderRadius : '5px', padding : "1.6em 1.6em"}}>
            <div style={{color : "rgba(black, 0.6)", fontWeight : "600", fontSize : '18px'}}>{monitor.label ? monitor.label : "iManage monitor"}</div>
            
            <Statistic
              // title={monitor.label}
              prefix={monitor.symbol}
              valueStyle={{color : monitor.color}}
              value={monitor.verbose}
            />
            <br></br>
            <div style={{display : "flex", justifyContent : "flex-end"}}>
            <Tag>{monitor.ref}</Tag>
            </div>
          </div>
          </Col>
          </>
        )}
      </Row>
      </div>
      {/* {threeStates.length > 0 && <Pie {...config_three_states} ></Pie>} */}
    </Dashboard>
  )
}
 

export  default  DashboardIndex ; 