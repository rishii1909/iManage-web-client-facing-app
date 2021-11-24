import api_url from "./api_url";
import axios from "axios";

let axiosConfig = {
  headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxNjZjMDI1ZGU2ZGUzMTUzY2JmMDY0NiIsImVtYWlsIjoiIGhydXNoaWtlc2hjaGFwa2VAZ21haWwuY29tIn0sImlhdCI6MTYzNDEyNDc4N30.BnKCVc5xpL_jJhZ319MNd6DJ-QG9feLRgAqbKVDF7_0`
  }
};


export default async function fetch_team_data(callback){
    try {
      await axios.post(api_url("teams/enumerate/team"), { team_id : '616a99b5dd28594910c97f00' }, axiosConfig).then( async team_resp => {
        const team = team_resp.data.response;

        const user_keys = JSON.stringify(Object.keys(team.response.users));
        const device_keys = JSON.stringify(Object.keys(team.response.devices));
        await axios.post(api_url("secure/users/enumerate/user"), {user_ids : user_keys}, axiosConfig).then( user_resp => {
          user_resp.data.response.forEach(el => {
            const meta = team.response.users[el._id];
            team.response.users[el._id] = {...{permissions : meta} , ...{metadata : el}};
          });
        })
        await axios.post(api_url("devices/enumerate"), {device_ids : device_keys}, axiosConfig).then( device_resp => {
          device_resp.data.response.forEach(el => {
            const meta = team.response.devices[el._id];
            team.response.devices[el._id] = {...{enabled : meta} , ...{metadata : el}};
          });
        })
        console.log(team);
        callback(team);
        return team;
      })
    } catch (error) {
      return error;
    }
}