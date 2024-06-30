import { createRequire } from 'module'
// @ts-ignore
import logflake from 'logflake'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export default logflake({
  prefix: pkg.name,
  callCount: true,
  linebreak: true,
  disabled: process.env.NODE_ENV === 'production' ? true : false,
})
