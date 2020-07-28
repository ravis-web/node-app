/* --- CLUSTER --- */

const keys = {
  database: process.env.MONGO_DATA,
  password: process.env.MONGO_PASS
};

const cluster = `mongodb+srv://${process.env.MONGO_USER}:${keys.password}@${process.env.MONGO_INST}/${keys.database}?retryWrites=true&w=majority`;

const configs = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

exports.cluster = cluster;
exports.configs = configs;
