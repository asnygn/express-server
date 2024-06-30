import mongoose from 'mongoose'
import { accessibleRecordsPlugin } from '@casl/mongoose'

import './dotenv.js'

mongoose.connect(process.env.MONGODB_URL)
mongoose.pluralize(null)
mongoose.plugin(accessibleRecordsPlugin)

export default mongoose
