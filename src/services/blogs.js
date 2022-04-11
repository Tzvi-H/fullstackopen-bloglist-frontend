import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = newToken => {
  if (newToken === null) {
    token = null
  }

  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const blogService = { getAll, setToken, create }

export default blogService