const axios = require('axios')

const baseUrl = 'https://gtaquizbackend.herokuapp.com/api/highscores'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (scoreObj) => {
  const request = await axios.post(baseUrl,scoreObj)
  return request.data
}

const update = async (name,scoreObj) => {
  const request = await axios.put(`${baseUrl}/${name}`,scoreObj)
  return request.data
}

module.exports = {
  getAll,create,update
}