const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_HOST_00,
  DB_HOST_01,
  DB_HOST_02,
  DB_PORT,
  DB_NAME,
  JWT_SECRET
} = process.env;

module.exports = {
  mongoUri: !DB_USER
    ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    : `mongodb://${DB_USER}:${DB_PASSWORD
    }@${DB_HOST_00}:${DB_PORT},${DB_HOST_01}:${DB_PORT},${DB_HOST_02}:${DB_PORT}/${DB_NAME
    }?ssl=true&replicaSet=atlas-sfvrpv-shard-0&authSource=admin&retryWrites=true&w=majority`,
  jwtSecret: JWT_SECRET
};
