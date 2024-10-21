require('dotenv').config();

const express = require('express');
const app = express();
const emailRouter = require('./emailContact');
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/email', emailRouter); 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

require("./routes.js")(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
