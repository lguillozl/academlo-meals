const { app } = require('./app');

const { initModels } = require('./models/initModels');

const { db } = require('./utils/database');

db.authenticate()
  .then(() => console.log('Database successfully conected and authenticated'))
  .catch(err =>
    console.log('Error occurred during database authentication:', err)
  );

initModels();

db.sync()
  .then(() => console.log('Database successfully synced'))
  .catch(err => console.log('Error occurred during database sync:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
