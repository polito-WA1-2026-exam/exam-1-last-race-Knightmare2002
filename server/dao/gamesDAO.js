import db from './db.js';

//===== Handy functions to make things more readable ===== 
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}
//=====================================================

async function createGame(userId, startStationId, destinationStationId) {
  const sql = `
    INSERT INTO games(user_id, start_station_id, destination_station_id, initial_coins, final_score, status, created_at)
    VALUES (?, ?, ?, 20, NULL, 'planning', datetime('now'))
  `
  const result = await run(sql, [userId, startStationId, destinationStationId])
  return result.lastID
}

async function getGameById(gameId) {
  const sql = `
    SELECT *
    FROM games
    WHERE id = ?
  `
  return await get(sql, [gameId])
}

async function saveCompletedGame(gameId, finalScore) {
  const sql = `
    UPDATE games
    SET final_score = ?, status = 'completed'
    WHERE id = ?
  `
  await run(sql, [finalScore, gameId])
}

async function saveFailedGame(gameId) {
  const sql = `
    UPDATE games
    SET final_score = 0, status = 'completed'
    WHERE id = ?
  `
  await run(sql, [gameId])
}

async function saveGameStep(gameId, stepIndex, fromStationId, toStationId, eventId, coinsAfterStep) {
  const sql = `
    INSERT INTO game_steps(game_id, step_index, from_station_id, to_station_id, event_id, coins_after_step)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  await run(sql, [gameId, stepIndex, fromStationId, toStationId, eventId, coinsAfterStep])
}

async function clearGameSteps(gameId) {
  const sql = `DELETE FROM game_steps WHERE game_id = ?`
  await run(sql, [gameId])
}

async function getRandomEvent() {
  const sql = `
    SELECT id, description, effect
    FROM events
    ORDER BY RANDOM()
    LIMIT 1
  `
  return await get(sql)
}

async function getRanking() {
  const sql = `
    SELECT 
        u.username, 
        u.name, 
        MAX(g.final_score) AS best_score

    FROM users u
    JOIN games g ON u.id = g.user_id
    WHERE g.status = 'completed'
    
    GROUP BY u.id, u.username, u.name
    ORDER BY best_score DESC, u.username ASC
  `
  return await all(sql)
}

async function saveQuittedGame(gameId) {
  const sql = `
    UPDATE games
    SET status = 'quitted'
    WHERE id = ?
  `
  await run(sql, [gameId])
}

export {
  createGame,
  getGameById,
  saveCompletedGame,
  saveFailedGame,
  saveGameStep,
  clearGameSteps,
  getRandomEvent,
  getRanking,
  saveQuittedGame
}