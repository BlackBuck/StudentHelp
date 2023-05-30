const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { match } = require('assert');

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(express.json())
app.use(express.static("./"))

app.post('/register', (req, res)=> {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let fname = req.body.fName;
    let programme = req.body.programme;
    let match = false;
    
    // defines the status of the code(for the asynchronous part)
    let stat = false;
    
    // the data to be sent through the response
    let resData = {status:true,Message:"Log Printed",success: false}
    fs.readFile('./database.json', 'utf-8', (err, jsonString)=> {
        const data = JSON.parse(jsonString);
        let len = data.length;
        // check if username already exists
        for(var i=0;i<len;i++) {
            if(data[i].username == username) {
               match = true;
               resData.success = true;
               console.log("Username already exists.");
               res.json(resData);
               return;
            }
        }
        let userpass = {"username" : username, "password" : password,"name" : name, "fname" : fname, "programme" : programme, "streams" : []};
        console.log(userpass)
        data.push(userpass);
        let writeData = JSON.stringify(data);
        // if username does not exist originally
        if(!match) {
            fs.writeFile("./database.json", writeData, (err)=> {
                if(err) console.log(err);
                else console.log("Write Successful")
            });
        }
        stat = true;
    });
    
    if(stat) {
        res.json(resData);
    }
});


app.post('/login', (req, res)=> {
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;
    let match = false;
    
    if(admin == 0) {
        // defines the status of the code(for the asynchronous part)
        let stat = false;
        // the data to be sent through the response.
        let resData = {status:true,Message:"Log Printed",success: false};
        fs.readFile('./database.json', 'utf-8', (err, jsonString)=> {
            const data = JSON.parse(jsonString);
            let len = data.length;
            // check if username already exists
            for(let i=0;i<len;i++) {
                if(data[i].username == username && data[i].password == password) {
                match = true;
                resData.success = true;
                resData.userData = data[i];
                console.log(resData);
                console.log("Username, password match.");
                stat = false;
                res.json(resData);
                return;
                }
            }
            stat = true;
        });
        
        if(stat) {
            res.send(resData);
        }
    }
    else {
        // defines the status of the code(for the asynchronous part)
        let stat = false;
        // the data to be sent through the response.
        let resData = {status:true,Message:"Log Printed",success: false};
        fs.readFile('./teachers.json', 'utf-8', (err, jsonString)=> {
            const data = JSON.parse(jsonString);
            let len = data.length;
            // check if username already exists
            for(let i=0;i<len;i++) {
                if(data[i].username == username && data[i].password == password) {
                match = true;
                resData.success = true;
                resData.userData = data[i];
                console.log(resData);
                console.log("Username, password match.");
                stat = false;
                res.json(resData);
                return;
                }
            }
            stat = true;
        });
        
        if(stat) {
            res.send(resData);
        }
    }
});

app.post("/data", (req, res)=> {
    let username = req.body.username;
    console.log(username);
    // for the asynchronous nature
    let stat = false
    fs.readFile("database.json", 'utf-8', (err, jsonString)=> {
        let data = JSON.parse(jsonString);
        for(var i=0;i<data.length;i++) {
            if(data[i].username == username) {
                res.send(data[i]);
                break;
            }
        }
    })
    // res.json({status:true, body:"Could do better."})
});

app.post('/updateStream', (req, res)=> {
    let {username, branches} = req.body;

    fs.readFile('database.json', 'utf-8', (err, jsonString)=> {
        let data = JSON.parse(jsonString);
        for(var i=0;i<data.length;i++) {
            if(data[i].username == username) {
                data[i].streams = branches;
                // write to file
                fs.writeFile('database.json', JSON.stringify(data), (err)=> {
                    if(err) console.log("Error occured while writing data.")
                })
                console.log(data[i]);
                res.send(data[i]);
                return;
            }
        }
        
    })
})

app.post('/channels', (req, res)=> {
    let stream = req.body.stream;
    // console.log(stream);
    fs.readFile('channels.json', 'utf-8', (err, jsonString)=> {
        let data = JSON.parse(jsonString);
        // for(var i=0;i<data.length;i++) {
        //     console.log(data[i].stream == stream);
        //     if(data[i].stream === stream) {
        //         res.send(data[i]);
        //         console.log(data[i]);
        //         return;
        //     }
        // }
        res.send(data[0]);
    })
})

app.post('/notes', (req, res)=> {
    let stream = req.body.stream;
    // console.log(stream);
    fs.readFile('notes.json', 'utf-8', (err, jsonString)=> {
        let data = JSON.parse(jsonString);
        // for(var i=0;i<data.length;i++) {
        //     console.log(data[i].stream == stream);
        //     if(data[i].stream === stream) {
        //         res.send(data[i]);
        //         console.log(data[i]);
        //         return;
        //     }
        // }
        res.send(data[0]);
    })
})

app.post('/books', (req, res)=> {
    let stream = req.body.stream;
    // console.log(stream);
    fs.readFile('books.json', 'utf-8', (err, jsonString)=> {
        let data = JSON.parse(jsonString);
        for(var i=0;i<data.length;i++) {
            console.log(data[i].stream == stream);
            if(data[i].stream === stream) {
                res.send(data[i]);
                console.log(data[i]);
                return;
            }
        }
    })
})




app.listen(3000, ()=> console.log("Listening at port 3000"))


