import express from 'express';
import isLoggedIn from '../auth/auth.js';
import {
  getStations,
  getLines,
  getLineStations,
  getSegments,
  getInterchangeStations
} from '../dao/networkDAO.js';
import {
  createGame,
  getGameById,
  saveCompletedGame,
  saveFailedGame,
  saveGameStep,
  clearGameSteps,
  getRandomEvent,
  getRanking,
  saveQuittedGame,
  getUserBestScore
} from '../dao/gamesDAO.js';
import {
  buildGraph,
  chooseRandomStartDestination,
  validateRoute
} from '../utils/networkGraph.js';

const router = express.Router()

//Setups game
router.get('/network/map', isLoggedIn, async (req, res) => {
  try {
    const stations = await getStations()
    const lines = await getLines()
    const lineStations = await getLineStations()
    const segments = await getSegments()

    res.json({
      stations,
      lines,
      lineStations,
      segments
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load network map' })
  }
})

//Creates new game
router.post('/games', isLoggedIn, async (req, res) => {
  try {
    const stations = await getStations()
    const segments = await getSegments()
    const graph = buildGraph(segments)

    const pair = chooseRandomStartDestination(stations, graph, 3)
    const gameId = await createGame(
      req.user.id,
      pair.startStation.id,
      pair.destinationStation.id
    )

    res.status(201).json({
      gameId,
      startStation: pair.startStation,
      destinationStation: pair.destinationStation,
      initialCoins: 20,
      status: 'planning'
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' })
  }
})

//Starts the game
router.get('/games/:id/planning-data', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.id)
    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' })
    }

    const game = await getGameById(gameId)
    if (!game || game.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Game not found' })
    }

    const stations = await getStations()
    const segments = await getSegments()

    const startStation = stations.find(s => s.id === game.start_station_id)
    const destinationStation = stations.find(s => s.id === game.destination_station_id)

    res.json({
      gameId: game.id,
      startStation,
      destinationStation,
      stations: stations.map(s => ({ id: s.id, name: s.name })),
      segments: segments.map(seg => ({
        fromStationId: seg.from_station_id,
        fromStationName: seg.from_station_name,
        toStationId: seg.to_station_id,
        toStationName: seg.to_station_name
      })),
      timeLimitSeconds: 90
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load planning data' })
  }
})

//Ends the game
router.post('/games/:id/submit-route', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.id)
    const { routeStationIds } = req.body

    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' })
    }

    if (!Array.isArray(routeStationIds)) {
      return res.status(400).json({ error: 'routeStationIds must be an array' })
    }

    const game = await getGameById(gameId)
    if (!game || game.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Game not found' })
    }

    const segments = await getSegments()
    const interchangeStations = await getInterchangeStations()
    const interchangeStationIds = new Set(interchangeStations.map(s => s.id))

    const validation = validateRoute(
      routeStationIds,
      segments,
      interchangeStationIds,
      game.start_station_id,
      game.destination_station_id
    );

    if (!validation.valid) {
      await clearGameSteps(gameId)
      await saveFailedGame(gameId)

      return res.json({
        valid: false,
        reason: validation.reason,
        steps: [],
        finalScore: 0
      })
    }

    await clearGameSteps(gameId)

    let coins = 20
    const steps = []

    for (let i = 0; i < routeStationIds.length - 1; i++) {
      const fromStationId = routeStationIds[i]
      const toStationId = routeStationIds[i + 1]

      const event = await getRandomEvent()
      coins += event.effect

      await saveGameStep(
        gameId,
        i + 1,
        fromStationId,
        toStationId,
        event.id,
        coins
      )

      steps.push({
        stepIndex: i + 1,
        fromStationId,
        toStationId,
        event: {
          id: event.id,
          description: event.description,
          effect: event.effect
        },
        coinsAfterStep: coins
      })
    }

    const finalScore = Math.max(0, coins)
    const currentBest = await getUserBestScore(req.user.id)
    const isNewBestScore = finalScore > currentBest && finalScore > 0
    await saveCompletedGame(gameId, finalScore)

    res.json({
      valid: true,
      steps,
      finalScore,
      isNewBestScore
    })
  } catch (err) {
    console.error('submit-route error:', err)
    res.status(500).json({ error: 'Failed to submit route', details: err.message })
  }
})

//Returns best players ranking
router.get('/ranking', isLoggedIn, async (req, res) => {
  try {
    const ranking = await getRanking()
    res.json(ranking)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load ranking' })
  }
})

//Quits the game
router.post('/games/:id/quit', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.id)
    if (Number.isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' })
    }

    const game = await getGameById(gameId)
    if (!game || game.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Game not found' })
    }

    await saveQuittedGame(gameId)
    
    res.json({ message: 'Game quitted successfully' })
  } catch (err) {
    console.error('quit-game error:', err)
    res.status(500).json({ error: 'Failed to quit game', details: err.message })
  }
})

export default router;