const express = require('express');
const cors = require('cors');

const setupAPIs = require('./api');

const app = express();
const port = 3000;

// Enable JSON handling
app.use(express.json()); // for parsing application/json

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

/*-------------------------------------------------------------
    APIs
-------------------------------------------------------------*/
setupAPIs(app);

app.listen(port, () => {
    console.log(`API server listening on port ${port}...`);
});
