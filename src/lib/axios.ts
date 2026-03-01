import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    // We will add logic here to inject tokens or other headers if needed

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
