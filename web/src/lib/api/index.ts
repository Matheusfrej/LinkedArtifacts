import axios from 'axios'
import { BASE_URL } from './config'
import { AppError } from '../../utils/AppError'

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.error))
    } else {
      return Promise.reject(error)
    }
  },
)

export default api
