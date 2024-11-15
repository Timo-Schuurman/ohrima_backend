require('dotenv').config();
const express = require('express');
const app = express();
const emailRouter = require('./emailContact');
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const addressRoutes = require('./routes/address');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register the address route
app.use('/api/user', addressRoutes);

app.use('/email', emailRouter); 

const corsOptions = {
    origin: 'http://localhost:3000',//(https://your-client-app.com)
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

require("./routes.js")(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
