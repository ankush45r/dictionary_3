const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }))

// insertion
const insert_ = async (data)=>{
    const collection = await dbConnect('DictData','userData');
    const find = await collection.find({phone: data.phone}).toArray();
    if(find.length === 0){
        const result = await collection.insertMany(
            //inserting more than one object
            [{name: data.name, phone:data.phone, password:data.password,email: data.email}]
        );
        return 1;
    }
    else{
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
    let result = await client.connect(); // here client.connect returns a promise
    const db = result.db(database_name);
    return db.collection(collection_name);
}


//************************************************************************/
app.set('view engine', 'ejs');
app.use(express.static('views'));

app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})

app.get('/login', (req,res)=>{
    res.render('login.ejs');
})

app.post('/dictionary', async (req,res)=>{
//         password = req.body.password;
//         const collection = await dbConnect('DictData','userData');
//         let data = await collection.findOne({phone : phone});
//     res.render('main.ejs',{data});
//         if(data.password === password){
    
//             res.render('main.ejs',{data});
            res.send(password);
//         }
//         else{
//             res.send('<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!');
//         }
//     data={
//         name: "Ankush kumar"
//     }
//     res.render('main.ejs',{data});
//     try{
//         phone = req.body.phone;
//         password = req.body.password;
//         let info;
//         const collection = await dbConnect('DictData','userData');
//         let data = await collection.findOne({phone : phone});
//         if(data.password === password){
// //             res.render('main.ejs',{data});
//             res.send('<h1>This is what</h1>');
//         }
//         else{
//             res.send('<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!');
//         }

//     }
//     catch(e){
//         res.send(`<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!`);
//     }
})

// app.get('/dictionary',(req,res)=>{
//     res.render('<h1 style="color:red;"> Id or password you entered are incorrect, Go back and try again!!!!')
// }


app.post('/signup_', async (req,res)=>{
    try{
        const signupData = {
            name: req.body.name,
            phone : req.body.phone,
            password: req.body.password,
            email : req.body.email

        }
        const what = await insert_(signupData);
        if(what == 0){
            res.send(`<h1 style="color:red;">Data you used for signup is already in use plz use different <br><br> go back and use another</h1>`);
        }
        else{
            res.send('<h1 style="color:green;">your are successfully signed up go back and click on login page<h1>');
        }
        
    }
    catch(e){
    }
})

app.listen(4000);
