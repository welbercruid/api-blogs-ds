const config = require('./config');
const express = require('express');
const { dbConnect } = require('./config/mongo');

const app = express();
app.use(express.json());

// app.use(fileUpload({//*
//     useTempFiles : true,
//     tempFileDir : './uploads'
// }));
app.get('/', (req, res) => {
    res.send("Bienvenidos a mi blogs!");
});

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

dbConnect();

try {
    app.listen(config.PORT, () => {
        console.log(`Server funcionando en puerto: ${config.PORT}`);
    })
} catch (error) {
    console.error(`El puerto ${config.PORT} está ocupado. Error: ${error}`);
};