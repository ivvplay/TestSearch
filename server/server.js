const express = require('express');
const cors = require('cors');
const router = require('./router/index');

const PORT = 3001;
const corsOptions = {
    credentials: true,
    // origin: 'https://search-app2412.vercel.app',
    origin: 'http://localhost:5222',
    optionSuccessStatus:200,
    exposedHeaders: ['X-Total-Count'],
}
const app = express()

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', router);

const startServer = async () => {
    try {
        app.listen(PORT,'0.0.0.0', () =>  console.log(`Server started on PORT = ${PORT}`))

    } catch (error) {
        console.log(error);
    }
}

startServer();