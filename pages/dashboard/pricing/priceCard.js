import React, { useState, useEffect } from "react";
import styles from "./price.module.css";
import { useRouter } from "next/router";
import { Button, Radio, Modal } from "antd";

const PriceCard = (props) => {
  useEffect(() => {
    console.log(props, "props");
  }, []);

  return (
    <>
      <div className={styles["cards_wrapper"]}>
        <div className={styles["pricing_card two"]}>
          <div className={styles["details"]}>
            <h2 className={styles["title"]}>{props.values.name}</h2>
            <p className={styles["plan_description"]}>{props.values.devices}</p>

            <p className={styles["price"]}>{props.values.price}</p>
            <p className={styles["price_description"]}>{props.values.other}</p>

            {props.values.isSupport == true && (
              <p className={styles["price_description"]}>
                {props.values.hours}
              </p>
            )}
            {props.values.isSupport == false && (
              <p className={styles["price_description"]}>
                <br />{" "}
              </p>
            )}
          </div>
          <div className={styles["cta"]}>
            <Button type="primary"  onClick={(event)=>props.showModal(event)} shape="round" size={"large"}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCard;
