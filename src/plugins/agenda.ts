import { Agenda } from 'agenda'

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URL as string },
})

export default agenda
