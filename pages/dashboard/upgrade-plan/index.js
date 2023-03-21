import { handle_error, secure_axios } from "../../../helpers/auth";
import { useEffect, useRef, useState } from "react";
import PriceCard from "./priceCard";
import { useRouter } from "next/router";

const UpgradePage = (props) => {
  const [priceList, setPriceList] = useState([]);
  const [supportId, setSupportId] = useState("");
  const router = useRouter();

  const handleClick = (checked, id) => {
    var dataToPass = {
      id: checked == true ? supportId : id,
      frompage: "upgrade",
    };
    props.handleCancel(dataToPass);
  };

  useEffect(() => {
    secure_axios(`/plans/getUpgradedPlans`, {}, router, (response) => {
      if (response.accomplished) {
        if (response.accomplished) {
          var supportItems = response.response.filter((data) => {
            return data.isSupport == true;
          });
          if (supportItems.length != 0) {
            setSupportId(supportItems[0]._id);
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
            showModal={(checked, id) => handleClick(checked, id)}
          />
        );
      })}
    </>
  );
};

export default UpgradePage;
