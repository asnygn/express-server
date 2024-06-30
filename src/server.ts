import { createRequire } from 'module'
import os from 'os'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import expressFormData from 'express-form-data'
import expressRateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import apicache from 'apicache'

import '@/plugins/dotenv.js'
import { errorHandler } from '@/middlewares/index.js'
import logger from '@/plugins/winston.js'

import config from './config.js'
import { router } from './routes.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())

const formDataOptions = {
  uploadDir: os.tmpdir(),
  autoClean: true,
}

app.use(expressFormData.parse(formDataOptions))
app.use(expressFormData.format())
app.use(expressFormData.union())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(config.basedir, 'public')))

app.use('/', router)

app.all('*', (req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Page not found.',
  })
})

app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  const rateLimit = expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/v1/', rateLimit)
  app.use(apicache.middleware('5 minutes'))
}

if (process.env.NODE_ENV === 'development') {
  const require = createRequire(import.meta.url)
  const swaggerDocument = require('../openapi.json')
  router.use('/api', swaggerUi.serve)
  router.get('/api', swaggerUi.setup(swaggerDocument))
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
