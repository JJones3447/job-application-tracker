import apiClient from './client'

export const get = async (url) => {
  const res = await apiClient.get(url)
  return res.data
}

export const post = async (url, data) => {
  const res = await apiClient.post(url, data)
  return res.data
}

export const put = async (url, data) => {
  const res = await apiClient.put(url, data)
  return res.data
}

export const del = async (url) => {
  const res = await apiClient.delete(url)
  return res.data
}