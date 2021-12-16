const app = require('./server');
const { initConnection } = require('./dbConfig');

const port = process.env.PORT || 3000;

initConnection(); // init connection to mongo

app.listen(port, () => console.log(`Express departed from http://localhost:${port}`));