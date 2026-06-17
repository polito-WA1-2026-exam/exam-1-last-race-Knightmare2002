import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/passport.js';
import sessionsRouter from './routes/sessions.js';
import gamesRouter from './routes/gamesRoutes.js';

// init express
const app = express()
const port = 3001

app.use(morgan('dev'))
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(session({
  secret: 'None-of-your-business',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/sessions', sessionsRouter)

app.use('/api', gamesRouter)

//Check if the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

//Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})