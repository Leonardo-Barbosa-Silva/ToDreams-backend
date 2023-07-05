require('dotenv').config();
require('colors');
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3003;
const helmet = require('helmet');
const routes = require('./routes/indexRoutes');
const database = require('./config/mongoDB');
const path = require('path');


(async () => {
    await database( () => {
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`.yellow)
        })
    })

    app.use(cors())
    app.use(helmet())
    app.use(express.json({ limit: '30mb' }))
    app.use(express.urlencoded({ limit: '30mb', extended: true }))
    app.use(express.static(path.join(__dirname, '../../frontend/build', 'index.html')))
    app.use('/todreams', routes)
})()