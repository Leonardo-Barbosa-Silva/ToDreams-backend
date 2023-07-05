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

    app.use(cors({
        origin: "https://todreams-frontend.onrender.com",
        optionsSuccessStatus: 200
    }))
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
            },
            frameguard: {
                action: 'deny'
            },
            hidePoweredBy: true,
            hsts: {
                maxAge: 60 * 60 * 24 * 365,
                includeSubDomains: true,
                preload: true
            },
            noSniff: true,
            dnsPrefetchControl: false, // Desabilitando isso como uma boa prática
            permissionsPolicy: {
                features: {
                    geolocation: ["'self'"],
                    microphone: ["'none'"],
                    camera: ["'none'"],
                    "payment-handler": ["'none'"]
                }
            }
        })
    )
    app.use(express.json({ limit: '30mb' }))
    app.use(express.urlencoded({ limit: '30mb', extended: true }))
    app.use(express.static(path.join(__dirname, '../../frontend/build', 'index.html')))
    app.use('/todreams', routes)
})()