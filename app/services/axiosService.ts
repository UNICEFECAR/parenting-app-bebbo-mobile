import axios from 'axios';
const axiosService = axios.create({
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

axiosService.interceptors.request.use(
  async config => {
   return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosService.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  error => {
    //Depending on  the api error we will need to modify code
    return Promise.reject(error);
  },
);
// singleton instance
export default axiosService;
