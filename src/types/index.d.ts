declare module 'mongoose-slug-plugin'

interface File extends Blob {
  readonly name: string
  readonly type: string
  readonly size: number
  readonly path: string
  readonly originalFilename: string
  readonly lastModified: number
}

interface RequestQuery {
  skip?: number
  limit?: number
  page?: number
  sort?: object
}

interface HttpError extends Error {
  status: number
  details?: {}
}

declare var process: {
  env: {
    NODE_ENV: string

    // Server
    NAME: string
    HOST: string
    PORT: number
    TZ: string

    // Client
    CLIENT_URL: string

    // MongoDB
    MONGODB_URL: string

    // Redis
    REDIS_HOST: string
    REDIS_PORT: number

    // Nodemailer
    NODEMAILER_MAIL: string
    NODEMAILER_HOST: string
    NODEMAILER_PORT: number
    NODEMAILER_USER: string
    NODEMAILER_PASS: string

    // Twilio
    TWILIO_ACCOUNT_SID: string
    TWILIO_AUTH_TOKEN: string
    TWILIO_PHONE: string
    TWILIO_WHATSAPP: string

    // SendGrid
    SENDGRID_MAIL: string
    SENDGRID_API_KEY: string

    // SMSPoh
    SMSPOH_KEY: string

    // Stripe
    STRIPE_KEY: string

    // JWT
    JWT_ACCESS_KEY: string
    JWT_ACCESS_EXPIRY: string
    JWT_REFRESH_KEY: string
    JWT_REFRESH_EXPIRY: string
  }
}
