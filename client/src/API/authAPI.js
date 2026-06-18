import getJson from "./helpFunc.js"

const SERVER_URL = 'http://localhost:3001'

async function logIn(credentials) {
  const response = await fetch(`${SERVER_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials)
  })

  return getJson(response)
}

async function getCurrentUser() {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    credentials: 'include'
  })

  return getJson(response)
}

async function logOut() {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

const authenticationAPI = {
  logIn,
  logOut,
  getCurrentUser
}

export default authenticationAPI