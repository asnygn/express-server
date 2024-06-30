import fs from 'fs'
import nodemailer from 'nodemailer'
import handlebars from 'handlebars'

import config from '../config.js'
import debug from './debug.js'

const NAME = process.env.NAME
const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL

const mailConfig = {
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
} as nodemailer.TransportOptions

type SendMail = {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: SendMail) {
  const transporter = nodemailer.createTransport(mailConfig)
  const mail = { from: `${NAME}<${NODEMAILER_MAIL}>`, to, subject, html }

  try {
    const info: nodemailer.SentMessageInfo = await transporter.sendMail(mail)
    debug('nodemailer message %s', info.messageId)
    debug('nodemailer preview %s', nodemailer.getTestMessageUrl(info))
  } catch (err) {
    debug(err)
  }
}

type SendTemplateMail = {
  to: string
  subject: string
  template: string
  payload: { [key: string]: unknown }
}

export async function sendTemplateMail({
  to,
  subject,
  template,
  payload,
}: SendTemplateMail) {
  const templatepath = `${config.basedir}/templates/email/${template}.html`

  fs.readFile(templatepath, 'utf8', async function (err, data) {
    if (err) {
      return debug(err)
    }

    const templateObj = handlebars.compile(data)
    const html = templateObj(payload)
    const transporter = nodemailer.createTransport(mailConfig)
    const mail = { from: `${NAME}<${NODEMAILER_MAIL}>`, to, subject, html }

    try {
      const info: nodemailer.SentMessageInfo = await transporter.sendMail(mail)
      debug('nodemailer message %s', info.messageId)
      debug('nodemailer preview %s', nodemailer.getTestMessageUrl(info))
    } catch (err) {
      debug(err)
    }
  })
}
