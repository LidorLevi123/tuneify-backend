import dotenv from 'dotenv'
dotenv.config()

export default  {
  // dbURL: 'mongodb://127.0.0.1:27017',
  dbURL: process.env.DB_URL,
  dbName : 'Tuneify'
}
