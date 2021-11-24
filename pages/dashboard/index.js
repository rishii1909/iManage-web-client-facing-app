import axios from "axios";
import React, { useState, useEffect } from 'react';

import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Dashboard from "./layout/layout";

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message, PageHeader, Spin } from "antd";
import styles from "./dashboard.module.css"
import { secure_axios } from "../../helpers/auth";
import { Header } from "antd/lib/layout/layout";
import { Skeleton } from "antd";
const dict_two_states = {
  0 : "Up",
  1 : "Down",
}

const dict_three_states = {
  0 : "OK",
  1 : "Warning",
  2 : "Failure"
}

const Pie = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Pie),
  { ssr: false }
)

const DashboardIndex = () => {

  const router = useRouter();

  const [dashboard, setDashboard] = useState({});
  const [twoStates, setTwoStates] = useState(null);
  const [threeStates, setThreeStates] = useState(null);
  const [loaded_two_states, setLoaded_two_states] = useState(false);
  const [loaded_three_states, setLoaded_three_states] = useState(false);

  useEffect(() => {
    secure_axios(
      '/monitors/dashboard/showcase',
      {},
      router,
      (response) => {
        console.log(response)
        if(response.accomplished){
          const two_keys = Object.keys(response.response.level_1.two_states)
          const three_keys = Object.keys(response.response.level_1.three_states)
          const two_states = []
          const three_states = []
          three_keys.forEach((key) => {
            dict_three_states[key] && three_states.push({
              type : dict_three_states[key],
              monitors : response.response.level_1.three_states[key]
            })
          })
          two_keys.forEach((key) => {
            dict_two_states[key] && two_states.push({
              type : dict_two_states[key],
              monitors : response.response.level_1.two_states[key]
            })
          })
          setTwoStates(two_states);
          setLoaded_two_states(true);
          setThreeStates(three_states);
          setLoaded_three_states(true);
        }
      }

    )
  }, []);

  var config_two_states = {
    appendPadding: 0,
    data: twoStates,
    angleField: 'monitors',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  var config_three_states = {
    appendPadding: 0,
    data: threeStates,
    angleField: 'monitors',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  return ( 
    <Dashboard>
      <Row style={{paddingTop : "1.6em"}} >
        <Col xl={12} md={24} >
          <PageHeader
            style={{padding : '0px'}}
            title="2 state monitors"
          />
          <p>Monitors that have either Up/Down monitor log states for detection.</p>
          <div className={styles['pie-wrapper']}>
          { twoStates ? 
          <Pie {...config_two_states} style={{opacity : twoStates ? '1' : '0.4', width : '100%'}} ></Pie>
            :
            <Spin size='large' style={{position : 'absolute'}}></Spin> }
          </div>
        </Col>
        <Col xl={12} md={24} >
          <PageHeader
            style={{padding : '0px'}}
            title="3 state monitors"
          />
          <p>Monitors that have one of OK/Warning/Failure monitor log states for detection.</p>
          <div className={styles['pie-wrapper']}>
            { threeStates ? 
            <Pie {...config_three_states} style={{opacity : threeStates ? '1' : '0.4', width : '100%'}} ></Pie>
             :
            <Spin size='large' style={{position : 'absolute' }}></Spin> }
          </div>
        </Col>
      </Row>
      {/* {threeStates.length > 0 && <Pie {...config_three_states} ></Pie>} */}
    </Dashboard>
  )
}
 

export  default  DashboardIndex ; 