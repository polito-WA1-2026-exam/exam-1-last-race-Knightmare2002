import db from './db.js';

//Handy function to make things more readable
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

async function getStations() {
  const sql = `SELECT id, name FROM stations ORDER BY name`
  return await all(sql)
}

async function getLines() {
  const sql = `SELECT id, name, color FROM lines ORDER BY name`
  return await all(sql)
}

async function getLineStations() {
  const sql = `
    SELECT 
        ls.line_id, 
        l.name AS line_name, 
        l.color, 
        ls.station_id, 
        s.name AS station_name, 
        ls.position

    FROM line_stations ls
    JOIN lines l ON ls.line_id = l.id
    JOIN stations s ON ls.station_id = s.id

    ORDER BY ls.line_id, ls.position
  `
  return await all(sql)
}

async function getSegments() {
  const sql = `
    SELECT
      l.id AS line_id,
      l.name AS line_name,
      l.color,
      s1.id AS from_station_id,
      s1.name AS from_station_name,
      s2.id AS to_station_id,
      s2.name AS to_station_name

    FROM line_stations ls1
    JOIN line_stations ls2
      ON ls1.line_id = ls2.line_id
     AND ls2.position = ls1.position + 1
    JOIN lines l ON l.id = ls1.line_id
    JOIN stations s1 ON s1.id = ls1.station_id
    JOIN stations s2 ON s2.id = ls2.station_id
    ORDER BY l.name, ls1.position
  `
  return await all(sql)
}

async function getInterchangeStations() {
  const sql = `
    SELECT 
        s.id, 
        s.name, 
        COUNT(DISTINCT ls.line_id) AS line_count

    FROM stations s
    JOIN line_stations ls ON s.id = ls.station_id

    GROUP BY s.id, s.name
    HAVING COUNT(DISTINCT ls.line_id) > 1
    ORDER BY s.name
  `
  return await all(sql)
}

export {
  getStations,
  getLines,
  getLineStations,
  getSegments,
  getInterchangeStations
};