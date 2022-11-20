const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  JWT_SECRET
} = process.env;

module.exports = {
  mongoUri: !DB_USER
    ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    : `mongodb+srv://${ DB_USER }:${ DB_PASSWORD }@${ DB_HOST }/${ DB_NAME }?retryWrites=true&w=majority`,
  jwtSecret: JWT_SECRET
};
