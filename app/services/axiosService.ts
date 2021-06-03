import axios from 'axios';
const axiosService = axios.create({
  // baseURL: 'http://115.113.181.35/VoltasAPI_UAT/api/',
  // baseURL:  'https://epm.datamatics.com/VoltasAPI/api/',
  // baseURL:  'https://epmsuite.com/voltasAPI/api/',
  //test
  //baseURL: 'https://epmuat.com/VoltasIOBGAPI/api/',
  //prod
  //baseURL: 'https://www.epmsuite.com/VoltasIOBGAPI/api/',
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosService.interceptors.request.use(
  async config => {
  console.log(config);
    // const tokennew = await this.getToken(); // slightly longer running function than example above
    // const tokennew = "";
    // slightly longer running function than example above
    // console.log("tokennew ",tokennew);
    // if (tokennew) {
    //   config.headers.Authorization = 'Bearer ' + tokennew;
    // }
    config.auth = {
        username: 'globaladmin',
        password: 'P@ssw0rd'
    }
    // config.params = {Seasons: "all", childAge: "all", childGender: "all", parentGender: "all"};
    console.log("edited config-",config);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosService.interceptors.response.use(
  function(response) {
    // Do something with response data
    console.log("axios response  ",response);
    return response;
  },
  error => {
   console.log('axios error  ', JSON.stringify(error));
  //  return error;
    // console.log(error);
    //Depending on  the api error we will need to modify code
    // const originalRequest = error.config;
    // console.log(JSON.stringify(error));
    // console.log('error==================================', error.response.data.error);
    // if (error.response.status === 401 && error.response.data.error === 'invalid_token') { //custom error checking based on the data i get

    //     console.log('hit error');
  
    //     originalRequest._retry = true
    //     const retryOrigReq = new Promise((resolve, reject) => {
    //       axios.post(REFRESH_TOKEN_URL, null) //give ur refrsh token url 
    //         .then((resp) => {
    //           // console.log(resp)
    //           self.setState({
    //             token: resp.data.access_token
    //           });
    //           try {
    //             AsyncStorage.setItem('AUTH_TOKEN', 'bearer ' + resp.data.access_token);
    //           } catch (error) {
    //             // Error saving data
    //           }
    //           try {
    //             AsyncStorage.setItem('REFRESH_TOKEN', resp.data.refresh_token);
    //           } catch (error) {
    //             // Error saving data
    //           }
    //           originalRequest.headers['Authorization'] = 'Bearer ' + resp.data.access_token
    //           resolve(axios(originalRequest));
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         })
    //     });
    //     return retryOrigReq;
    //   } else {
    //     return Promise.reject(error);
    //   }
   // *** For reference use above *** //
    return Promise.reject(error);
  },
);
// singleton instance
export default axiosService;
