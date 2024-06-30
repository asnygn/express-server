import twilio from 'twilio'

import debug from './debug.js'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE = process.env.TWILIO_PHONE
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP

let twilioClient: any = null

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
}

type SendSms = {
  to: string
  body: string
}

export function sendSms({ to, body }: SendSms) {
  if (twilioClient) {
    twilioClient.messages
      .create({ from: TWILIO_PHONE, to, body })
      .then((message: any) => debug(message.sid))
  }
}

type sendMessage = {
  to: string
  body: string
}

export function sendMessage({ to, body }: sendMessage) {
  if (twilioClient) {
    twilioClient.messages
      .create({
        from: TWILIO_WHATSAPP,
        to: `whatsapp:${to}`,
        body,
      })
      .then((message: any) => debug(message.sid))
  }
}
