import getJson from "./helpFunc.js"

const SERVER_URL = 'http://localhost:3001'

async function getRanking() {
  const response = await fetch(`${SERVER_URL}/api/ranking`, {
    credentials: 'include'
  })

  return getJson(response)
}

async function createGame() {
  const response = await fetch(`${SERVER_URL}/api/games`, {
    method: 'POST',
    credentials: 'include'
  })

  return getJson(response)
}

async function getPlanningData(gameId) {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/planning-data`, {
    credentials: 'include'
  })

  return getJson(response)
}

async function getNetworkMap() {
  const response = await fetch(`${SERVER_URL}/api/network/map`, {
    credentials: 'include'
  })

  return getJson(response)
}

async function submitRoute(gameId, routeStationIds) {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/submit-route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ routeStationIds })
  })

  return getJson(response);
}

async function quitGame(gameId) {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/quit`, {
    method: 'POST',
    credentials: 'include'
  })

  return getJson(response)
}

const gameAPI = {
    getRanking,
    createGame,
    getPlanningData,
    getNetworkMap,
    submitRoute,
    quitGame
}

export default gameAPI