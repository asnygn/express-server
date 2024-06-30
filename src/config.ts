import { URL } from 'url'

let basedir = new URL('.', import.meta.url).pathname

basedir = basedir.replace('/build', '')
basedir = basedir.replace('/src', '')

export default {
  basedir,
}
