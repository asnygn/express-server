import { createRequire } from 'module'
import debug from 'debug'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export default debug(pkg.name)
