import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../database/lastRace.sqlite');
const schemaPath = path.join(__dirname, '../database/schema.sql');

const db = new sqlite3.Database(dbPath);

// Run a query (no rows)
function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Run a query (row returned)
function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Initialize Database
async function init() {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    //At least 3 users
    const users = [
      { username: 'samuele', name: 'Samuele', password: 'SamuCar02' },
      { username: 'diana', name: 'Diana', password: 'didi03' },
      { username: 'franco', name: 'Francesco', password: 'FrancoCar04' }
    ]

    for (const u of users) {
      const salt = crypto.randomBytes(16).toString('hex')
      
      const hashBuffer = await new Promise((resolve, reject) => {
        crypto.scrypt(u.password, salt, 32, (err, derivedKey) => {
          if (err) reject(err)
          resolve(derivedKey)
        })
      })
      const hash = hashBuffer.toString('hex')
      
      await run(
        db,
        'INSERT INTO users(username, name, hash, salt) VALUES (?, ?, ?, ?)',
        [u.username, u.name, hash, salt]
      )
    }

    //At least 12 stations
    const stations = [
        'Cadorna', 
        'Duomo', 
        'Cairoli', 
        'San Babila', 
        'Centrale FS', 
        'Garibaldi FS', 
        'Sant\'Ambrogio', 
        'Sforza Policlinico',
        'Montenapoleone', 
        'De Amicis', 
        'Loreto', 
        'Zara'
    ];

    for (const name of stations) {
      await run(db, 'INSERT INTO stations(name) VALUES (?)', [name]);
    }

    const lines = [
      { name: 'M1', color: '#d62828' },
      { name: 'M2', color: '#2dd81d' },
      { name: 'M3', color: '#e3ea1a' },
      { name: 'M4', color: '#1042e8' }
    ];

    for (const line of lines) {
      await run(db, 'INSERT INTO lines(name, color) VALUES (?, ?)', [line.name, line.color]);
    }

    const stationMap = {};
    for (const name of stations) {
      const row = await get(db, 'SELECT id FROM stations WHERE name = ?', [name]);
      stationMap[name] = row.id;
    }

    const lineMap = {};
    for (const line of lines) {
      const row = await get(db, 'SELECT id FROM lines WHERE name = ?', [line.name]);
      lineMap[line.name] = row.id;
    }

    const network = {
      'M1': ['Cadorna', 'Duomo', 'Cairoli', 'San Babila'],
      'M2': ['Cadorna', 'Centrale FS', 'Garibaldi FS', 'Sant\'Ambrogio'],
      'M3': ['Duomo', 'Centrale FS', 'Sforza Policlinico', 'Montenapoleone'],
      'M4': ['San Babila', 'Sforza Policlinico', 'Sant\'Ambrogio', 'De Amicis']
    };

    //Built to understand which stations belong to which line, adjacency and order.
    for (const [lineName, stationList] of Object.entries(network)) {
      for (let i = 0; i < stationList.length; i++) {
        await run(
          db,
          'INSERT INTO line_stations(line_id, station_id, position) VALUES (?, ?, ?)',
          [lineMap[lineName], stationMap[stationList[i]], i]
        );
      }
    }

    // At least 8 events
    const events = [
        ['Attention, pickpockets', -4],
        ['Catched without ticket', -3],
        ['Doors closed in your face', -2],
        ['Train is crowded', -1],
        ['Quiet ride', 0],
        ['Meeting a friend', 1],
        ['Found an empty seat', 2],
        ['Found money on the ground', 3],
        ['A/C is actually working in mid-summer', 4]
    ];

    for (const [description, effect] of events) {
      await run(
        db,
        'INSERT INTO events(description, effect) VALUES (?, ?)',
        [description, effect]
      );
    }

    //Initialization of two games played by two users
    const samuele = await get(db, 'SELECT id FROM users WHERE username = ?', ['samuele']);
    const diana = await get(db, 'SELECT id FROM users WHERE username = ?', ['diana']);

    const cadorna = stationMap['Cadorna'];
    const sanBabila = stationMap['San Babila'];
    const santAmbrogio = stationMap['Sant\'Ambrogio'];
    const zara = stationMap['Zara'];

    await run(
      db,
      `INSERT INTO games(user_id, start_station_id, destination_station_id, initial_coins, final_score, status, created_at)
       VALUES (?, ?, ?, 20, 18, 'completed', datetime('now'))`,
      [samuele.id, cadorna, sanBabila]
    );

    await run(
      db,
      `INSERT INTO games(user_id, start_station_id, destination_station_id, initial_coins, final_score, status, created_at)
       VALUES (?, ?, ?, 20, 15, 'completed', datetime('now'))`,
      [diana.id, santAmbrogio, zara]
    );

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Database initialization failed:', err);
  } finally {
    db.close();
  }
}

init();