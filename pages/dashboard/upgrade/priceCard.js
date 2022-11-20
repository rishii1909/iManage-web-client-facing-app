import React, { useState, useEffect } from "react";
import styles from "./price.module.css";
import { useRouter } from "next/router";
import { Button, Radio, Modal, notification, Checkbox } from "antd";

const PriceCard = (props) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    console.log(props, "props");
  }, []);
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setChecked(e.target.checked);
  };

  return (
    <>
      <div className={styles["cards_wrapper"]}>
        <div className={styles["pricing_card two"]}>
          <div className={styles["details"]}>
            <h2 className={styles["title"]}>{props.values.name}</h2>
            <p className={styles["plan_description"]}>{props.values.devices}</p>
            {checked == false && (
              <p className={styles["price"]}>{props.values.price}</p>
            )}
            {checked == true && (
              <p className={styles["price"]}>{props.values.price}</p>
            )}

            <p className={styles["price_description"]}>{props.values.other}</p>

            {props.values.isSupport == true && checked && (
              <p className={styles["price_description"]}>
                {props.values.hours}
              </p>
            )}
            
            <p className={styles["price_description"]}>
              {" "}
              <Checkbox  checked={checked} onChange={onChange}>With Support</Checkbox>
            </p>
          </div>
          <div className={styles["cta"]}>
            <Button
              type="primary"
              onClick={(event) => props.showModal(event)}
              shape="round"
              size={"large"}
            >
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCard;