import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import session from 'express-session'
import cors from 'cors'
import { UserResolver } from './modules/user/UserResolver'
import { NoteResolver } from './modules/note/NoteResolver'

async function start() {
  await createConnection()

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, NoteResolver],
      authChecker: ({ context }) => {
        return !!context.req.session.userId
      },
    }),
    context: ({ req, res }) => ({ req, res }),
  })

  const app = express()

  app.use(
    cors({
      credentials: true,
    })
  )

  app.use(
    session({
      secret: 'some secret value which should be in an env variable',
      saveUninitialized: false,
      resave: false,
      name: 'qid',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  )

  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

start()
