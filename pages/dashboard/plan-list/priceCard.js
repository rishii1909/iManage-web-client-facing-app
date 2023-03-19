import React, { useState, useEffect } from "react";
import styles from "./price.module.css";
import { Button, Radio, Modal } from "antd";
import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(process.env.STRIPE_PK_KEY);
const PriceCard = (props) => {
  const handleClick = (event) => {
    props.setSelectedCard(props.values._id);
    props.setCardDetails(props.values);
    props.showModal(props);
  };
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

            <Button
             role="link"
              type="primary"
              onClick={(event) => handleClick(event)}
              shape="round"
              size={"large"}
            >
              Buy Now
            </Button>

          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCard;
