import React, { useState, useEffect } from "react";
import styles from "./price.module.css";
import { useRouter } from "next/router";
import { Button, Radio, Modal, notification, Checkbox } from "antd";

const PriceCard = (props) => {
  const [checked, setChecked] = useState(false);

 
  const onChange = (e) => {
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
              <p className={styles["price"]}>{props.supportPrice}</p>
            )}

            <p className={styles["price_description"]}>{props.values.other}</p>

            { checked && (
              <p className={styles["price_description"]}>
                {props.supportHours}
              </p>
            )}

            <p className={styles["price_description"]}>
              {" "}
              <Checkbox checked={checked} onChange={onChange}>
                With Support
              </Checkbox>
            </p>
          </div>
          <div className={styles["cta"]}>
            <Button
              type="primary"
              onClick={(event) => props.showModal(checked,props.values._id)}
              shape="round"
              size={"large"}
            >
              Downgrade
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCard;
