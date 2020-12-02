export {default as nextServer } from './nextServer'
export {default as nextApp } from './nextApp'

const env = process.env.NODE_ENV;
export const dev = env !== 'production';
export const prod = !dev;