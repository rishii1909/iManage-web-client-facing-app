const { message } = require("antd");
const { default: axios } = require("axios");
const { useRouter, Router } = require("next/router");

exports.setToken = (accessToken) => {
  if (typeof window !== "undefined")
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
};

exports.getAccessToken = () => {
  if (typeof window !== "undefined")
    return JSON.parse(localStorage.getItem("accessToken"));
};

exports.logout = () => {
  if (typeof window !== "undefined") localStorage.removeItem("accessToken");
};

exports.handle_error = (response) => {
  try {
    if (response.response) {
      const resp = response.response;
      if (resp.message) {
        message.error(resp.message);
      } else if (resp.error && typeof resp.error == "string") {
        message.error(resp.error);
      } else {
        message.error(resp);
      }
    } else {
      if (response.error && typeof response.error == "string")
        message.error(response.error);
      else message.error("Resource not accessible.");
    }
  } catch (err) {
    console.log(response, err);
    message.error("Resource not accessible.");
  }
};

exports.secure_axios = (path, postData, router, successCallback) => {
  const data = this.getAccessToken();
  return axios
    .post(
      `${process.env.API_URL}${path}`,
      { user_id: data.user_id, team_id: data.team_id, ...postData },
      {
        headers: {
          Authorization: "Bearer " + (data ? data.auth_token : ""),
        },
      }
    )
    .then((r) => {
      const response = r.data;
      successCallback(response);
      return response.status;
    })
    .catch((error) => {
      const err = error.response ? error.response : error;
      console.log(error);
      message.error(err.data ? err.data : err.message ? err.message : err);
      if (err.status == 401) {
        router.push("/auth/login");
        this.logout();
      }
      return err.status;
    });
};
