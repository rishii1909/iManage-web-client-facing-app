import UnauthorizedLayer from "../../../components/UnauthorizedLayer";
import Layout from "./../layout/layout";
import { handle_error } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import Router from "next/router";

import {
  Button,
  Col,
  Divider,
  PageHeader,
  Row,
  Spin,
  Card,
  Switch,
  Space,
  Badge,
  InputNumber,
  Modal,
  Select,
  Option,
  notification,
  Input,
} from "antd";
import PriceCard from "./priceCard";
const UpgradePage = (props) => {
  const [loadScreen, setLoadScreen] = useState(true);
  const [priceList, setPriceList] = useState([]);
  const [issupportSected, setSupportSelecetd] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceValue, setDevicevalue] = useState(1);
  const [api, contextHolder] = notification.useNotification();

  const handleOk = () => {
    setIsModalOpen(false);
    openNotificationWithIcon("success");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Notification Title",
      description: "User  will be redirect to stripe payment page . ",
    });
    setTimeout(() => {
      Router.push("payment");
    }, 2000);
  };

  useEffect(() => {
    fetch(`${process.env.API_URL}/plans/getPriceConfig`)
      .then((res) => res.json())
      .then((data) => {
        if (data.accomplished) {
          setPriceList([
            data.response.filter((element) => element.name == "Pro")[0],
          ]);
          setLoadScreen(false);
        }
      })
      .catch((error) => {
        console.error(error);
        handle_error(error);
        setPriceList(false);
      });
  }, []);

  return (
    <>
      {priceList.map((data) => {
        return (
          <PriceCard
            values={data}
            showModal={(event) => props.handleCancel(true)}
          />
        );
      })}
    </>
  );
};

export default UpgradePage;
