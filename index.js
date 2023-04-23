const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// insertion
const insert_ = async (data)=>{
    const collection = await dbConnect('DictData','userData');
    const find = await collection.find({phone: data.phone}).toArray();
    console.log(find);
    if(find.length === 0){
        const result = await collection.insertMany(
            // {brand: 'vivo', model:'U20', price: 2000}
    
            //inserting more than one object
            [{name: data.name, phone:data.phone, password:data.password,email: data.email}]
        );
        if(result.acknowledged) console.log('Data inserted.....');
        else console.log('data not inserted....');
        return 1;
    }
    else{
        console.log('data already exists....')
        return 0;
    }
}


//......................................................................
const { MongoClient } = require('mongodb');
// or MongoClient = require('mongodb').MongoClient;

//path for the database for the node js to know
const url = 'mongodb+srv://ankushks145:xjwH6Tg1ZnNb6zw6@cluster0.vkimtsp.mongodb.net/?retryWrites=true&w=majority';

// now we have to pass the above url to MongoClient to know about the database which it to connect
const client = new MongoClient(url);

//database
const database = 'company';

async function dbConnect(database_name,collection_name) {
    console.log('hello2');
    let result = await client.connect(); // here client.connect returns a promise
    const db = result.db(database_name);
    return db.collection(collection_name);
    // collection.find({}).toArray().then((data) => {
    //     console.log(data);
    // })
    // let response = await collection.find({}).toArray();
    // console.log(response);
}

// const main = async ()=>{
//     let data = await dbConnect('DictData','userData');
//     data = await data.find().toArray();
//     console.log(data);
// }
// // export default database;
// main();


//************************************************************************/
app.set('view engine', 'ejs');
app.use(express.static('views'));

// app.get('/json', async (req,res)=>{
//     let data = await dbConnect('DictData','userData');
//     // data = await data.find().toArray();
//     res.setHeader('Content-Type', 'application/json');


//   // Send the file to the client
// //   data.pipe(res);
//     res.json(data);
// })

app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})

// app.get('/login',(req,res)=>{
//     res.render('./Main/index.ejs');
// })

app.get('/login',async (req,res)=>{
    res.render('login.ejs');
})

app.post('/dictionary', async (req,res)=>{
    try{
        phone = req.body.phone;
        password = req.body.password;
        console.log(phone);
        console.log(password)
        // phone = '7700856845';
        // password = 'Ankush@123';
        let info;
        const collection = await dbConnect('DictData','userData');
        let data = await collection.findOne({phone : phone});
        if(data.password === password){
            data.info = '';
            res.render('main.ejs',{data});
        }
        else{
            res.send('<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!');
        }

    }
    catch(e){
        console.log(e);
        res.send(`<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!`);
    }
})


app.post('/signup_', async (req,res)=>{
    try{
        const signupData = {
            name: req.body.name,
            phone : req.body.phone,
            password: req.body.password,
            email : req.body.email

        }
        // const userData = await dbConnect('DictData','userData');
        const what = await insert_(signupData);
        // res.send(action);
        // console.log("->"+what)
        // const collection = await dbConnect('DictData','userData');
        // const data = await collection.findOne({phone : phone});
        // res.render('./Login/index.ejs',{data});
        if(what == 0){
            res.send(`<h1 style="color:red;">Data you used for signup is already in use plz use different <br><br> go back and use another</h1>`);
        }
        else{
            res.send('<h1 style="color:green;">your are successfully signed up go back and click on login page<h1>');
        }
        
    }
    catch(e){
        console.log(e);
    }
})

app.listen(3000);
