import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { getAccessToken, handle_error, secure_axios } from "../../../helpers/auth";
import Dashboard from "../layout/layout"; 

import { Menu, Tabs, List, Row, Col, Tag, Button, Divider, message } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;


const SubscriptionIndex = () => {

  const router = useRouter();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);


  useEffect(() => {
    loadScripts();
    setEmail("ramya.nayak@gmail.com");
    setTimeout(() => {
      getSubscriptionToken();
    }, 3000);

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }, []);

  async function getSubscriptionToken() {
    var URL = "/subscription/subscription_token";

    const loading = message.loading("Fetching subscription information...");
    const data = getAccessToken();
    console.log("getAccessToken : ",data)
    await secure_axios(
     URL,
      { user_id: data.user_id },
      router,
      (response) => {
        if (response.accomplished) {
          const userToken = response.response.replace(/\"/g, "");
          console.log(userToken);
          setToken(userToken);
          manageBilling(userToken);

        } else {
          message.error(
            response.response.message
              ? response.response.message
              : response.response
          );

          if (response == "User not registered.") {
            initSubscription();
          }
        }
        loading();
      }
    );

  }


  function manageBilling(token) {

    var apiUrl = 'http://imanage.host:4000';

    window.Servicebot.init({
      url: apiUrl,
      selector: document.getElementById('servicebot-management-form'),
      type: "manage",
      token: token,
      handleResponse: (response) => {
        console.log(response);
        if (response.event == 'cancellation' || response.event == "resubscribe") {
          console.log("ceancellation || resubscribe");
          // window.location.href = "/?isCancelled=true";
        }
      }
    });

  }

  function initSubscription() {
    this.existCondition = setInterval(() => {
      if ($('#servicebot-request-form').html() != '') {
        if ($('#servicebot-request-form .App span').html() != '') {

          setTimeout(() => {


            $('button[type=submit]').attr('disabled', 'disabled');
            $('button[type=submit]').css('cursor', 'default');
            $('button[type=submit]').css('background', '#b0b0b1');

            $('input[type=text]').css('background-color', '#e9ecef');
            $('input[type=text]').val((email)).trigger('focus');


            clearInterval(this.existCondition);

          }, 200);
        }
      }
    });
  }

  function loadScripts() {

    // This array contains all the files/CDNs 
    const dynamicScripts = [
      'https://js.stripe.com/v3/',
      'https://servicebot.io/js/servicebot-embed.js'

      //Load all your script files here'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }



  }



  return (
    <Dashboard>
      <Tabs>

        <TabPane tab='Subscription'>

          <div id="servicebot-management-form"></div>
          <input type="hidden" id="token" value={token} />
          <div id="servicebot-request-form"></div>
          {/* <iframe src="http://imanage.host:4000/" style={{width:'100%', height:'500px'}}></iframe> */}


        </TabPane>
      </Tabs>
    </Dashboard>
  )
}


export default SubscriptionIndex