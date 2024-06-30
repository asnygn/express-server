import axios from 'axios'

axios.defaults.baseURL = process.env.CLIENT_URL

export default axios
