import fs from 'fs'
import handlebars from 'handlebars'
import sendgrid from '@sendgrid/mail'

import config from '../config.js'
import debug from './debug.js'

const NAME = process.env.NAME
const SENDGRID_MAIL = process.env.SENDGRID_MAIL
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (SENDGRID_API_KEY) {
  sendgrid.setApiKey(SENDGRID_API_KEY)
}

type SendMail = {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendMail({ to, subject, text, html }: SendMail) {
  const mail = {
    from: `${NAME}<${SENDGRID_MAIL}>`,
    to,
    subject,
    text,
    html,
  }

  sendgrid
    .send(mail)
    .then(() => debug(`Mail sent to ${mail.to}`))
    .catch((err) => debug(err))
}

type SendTemplateMail = {
  to: string
  subject: string
  template: string
  values: object
}

export async function sendTemplateMail({
  to,
  subject,
  template,
  values,
}: SendTemplateMail) {
  const templatepath = `${config.basedir}/templates/email/${template}.html`

  fs.readFile(templatepath, 'utf8', function (err, data) {
    if (err) {
      return debug(err)
    }

    const templateObj = handlebars.compile(data)
    const html = templateObj(values)
    const mail = {
      from: `${NAME}<${SENDGRID_MAIL}>`,
      to,
      subject,
      html,
    }

    sendgrid
      .send(mail)
      .then(() => debug(`Mail sent to ${mail.to}`))
      .catch((err) => debug(err))
  })
}
