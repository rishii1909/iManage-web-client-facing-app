import { handle_error, secure_axios } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { notification } from "antd";
import PriceCard from "./priceCard";
import { useRouter } from "next/router";

const DowngradePage = (props) => {
  const [priceList, setPriceList] = useState([]);
  const [supportId, setSupportId] = useState("");
  const [supportPrice, setSupportPrice] = useState("");
  const [supportHours, setSupportHrs] = useState("");


  const router = useRouter();

  const handleClick = ( checked, id) => {
    // event.preventDefault();
    var dataToPass = {
      id: checked == true ? supportId : id,
      frompage: "downgrade",
    };
    props.handleCancel(dataToPass);

    //redirect to stripe Page
  };

  useEffect(() => {
    secure_axios(`/plans/getDowngradePlans`, {}, router, (response) => {
      if (response.accomplished) {
        if (response.accomplished) {
          var supportItems = response.response.filter((data) => {
            return data.isSupport == true;
          });
          if (supportItems.length != 0) {
            setSupportId(supportItems[0]._id);
            setSupportPrice(supportItems[0].price);
            setSupportHrs(supportItems[0].hours)

          }
          setPriceList(
            response.response.filter((data) => {
              return data.isSupport == false;
            })
          );
        }
      } else {
        handle_error(response);
        setPriceList(false);
      }
    });
  }, []);

  return (
    <>
      {priceList.map((data) => {
        return (
          <PriceCard
            key={data._id}
            values={data}
            supportPrice={supportPrice}
            supportHours={supportHours}
            showModal={(checked, id) => handleClick(checked, id)}
          />
        );
      })}
    </>
  );
};

export default DowngradePage;
