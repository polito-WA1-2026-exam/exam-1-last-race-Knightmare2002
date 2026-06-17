import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserByUsername, getUserById } from '../dao/usersDAO.js';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' })
    }

    const match = await bcrypt.compare(password, user.hash)

    if (!match) {
      return done(null, false, { message: 'Incorrect username or password.' })
    }

    return done(null, {
      id: user.id,
      username: user.username,
      name: user.name
    })
  } catch (err) {
    return done(err)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport;