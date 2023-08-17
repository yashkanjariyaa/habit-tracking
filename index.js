const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userSchema = require('./server/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtkey = 'yash@88**1311+='

app.use(cors());
app.use(express.json());

const url = "mongodb+srv://yashkanjariya:CUBWIhrmxgkmylgW@cluster0.3xwfsbj.mongodb.net/UserData?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS : 5000 });
mongoose.connection.on("error", function(error) {
  console.log(error);
});
mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database.");
  });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, application/json");
    next();
  });

app.post('/api/register', async (req, res)=>{
    console.log(req.body);
    try{
        const cryptedPassword = await bcrypt.hash(req.body.password, 10);
        await userSchema.create({
            username : req.body.username,
            email : req.body.email,
            password : cryptedPassword,
        });
        res.json({status : 'ok'});
    }catch(err){
        console.log(err);
        res.json({status : 'error', error : 'Duplicate error'})
    }    
})

app.post('/api/login', async (req, res)=>{
    const user = await userSchema.findOne({
            username : req.body.username,
        });
    if(!user){
        return { status : 'error', error : 'Invalid Login'};
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(isPasswordValid){
        const token = jwt.sign({email : user.email,}, jwtkey);
        return res.json({status : 'ok', user : token});
    }else{
        return res.json({status: 'error', user : false});
    }

});
app.get('/api/habits', async (req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token, jwtkey);
        const email = decoded.email;
        const user = await userSchema.findOne(
                { email: email }
            );
        return res.json ({ status : 'ok', habit: user.habitName, type : user.habitType });
    }catch(err){
        console.log(err);
        return res.json({ status : 'error', error : 'Invalid Token' });
    }
});
app.post('/api/habits', async (req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token, jwtkey);
        const email = decoded.email;
        await userSchema.updateOne(
                    { email: email },
                    { $push : { habitName : req.body.habit, habitType : req.body.type }}
                );
        return { status : 'ok' }
    }catch(err){
        console.log(err);
        return res.json({ status : 'error', error : 'Invalid Token' });
    }
});
app.post('/api/deleteHabits', async(req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token, jwtkey);
        const email = decoded.email;
        let n = req.body.index;
        await userSchema.updateOne(
            {email: email},
            { $pull : {'habitName' : req.body.habit}}
        );
        }catch(error){
            console.log(error);
            return res.json({ status : 'error', error : 'Invalid Token'});
        }
});
app.listen(1337, ()=>{
    console.log('server started on 1337');
})