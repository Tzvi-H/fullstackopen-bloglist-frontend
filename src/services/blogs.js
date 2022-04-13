import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

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

const update = async blogObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject, config)
  return response.data
}

const remove = async blogId => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${blogId}`, config)
}

const blogService = { getAll, setToken, create, update, remove }

export default blogService