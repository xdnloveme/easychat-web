import fetch from './config.js';

export const authToken = () => (
  fetch({
    method: 'POST',
    url: '/api/user/authToken',
  })
)

export const searchByOpenId = (openId) => (
  fetch('/api/user/searchByOpenId', {
    openId,
  })
)

export const getRecommendUser = () => (
  fetch('/api/user/getRecommendUser')
)

export const getContactsList = (openId) => (
  fetch('/api/user/getContactsList', {
    openId,
  })
)

export const getAvatarList = ()=> (
  fetch('/api/avatar/getList')
)
