require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`GYC Sierra Leone app running on port ${port}`);
});
