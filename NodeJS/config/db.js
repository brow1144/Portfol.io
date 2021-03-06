import mongoose from 'mongoose';

// URL of our cluster
const dbURL = 'mongodb://Portfolio:CS408Portfolio@' +
  'cluster0-shard-00-00-hddp7.mongodb.net:27017,' +
  'cluster0-shard-00-01-hddp7.mongodb.net:27017,' +
  'cluster0-shard-00-02-hddp7.mongodb.net:27017/main?' +
  'ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

const options = {
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  poolSize: 10
};

// prevent deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// connection
mongoose.connect(dbURL, options).then(() => {
  console.log("Database connection established!");
}).catch((err) => {
  console.log("Error connecting Database instance: ", err);
});
