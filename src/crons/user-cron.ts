import dayjs from 'dayjs'

import agenda from '../modules/agenda.js'

export async function userCron() {
  agenda.define('User Cron', async () => {
    console.log('Running User Cron...')
  })

  await agenda.start()

  // @ts-ignore
  await agenda.schedule(dayjs().add(1, 'm'), 'User Cron')
}
