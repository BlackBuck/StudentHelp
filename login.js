// let fs = require('browserify-fs');
// const fs = require('fs');

function loginUser(window) {
    let username = window.document.getElementById("username").value;
    let password = window.document.getElementById("password").value;
    var matched = false; // check if login was successful
            fetch('../database.json')
                .then((response)=> response.json())
                    .then((data)=> {
                        let len = data.length;
                        for(var i=0;i<len;i++) {
                            
                            if(data[i].username == username && data[i].password == password) {
                                matched = true;
                                window.localStorage.setItem("username", username);
                                window.localStorage.setItem("password", password);
                                window.localStorage.setItem("preferences", data[i].preferences);
                                window.localStorage.setItem("stream", data[i].stream);
                                window.open('/dashboard.html', '_self');
                            }
                        }

                        if(!matched) {
                            window.alert("Username and/or password incorrect.");
                        }

                    });
}

function registerUser(window, fs) {
    // let fs = require('fs');
    let username = window.document.getElementById("username").value;
    let password = window.document.getElementById("password").value;
    fetch('./database.json')
        .then((response)=> response.json())
            .then((data)=> {
                let len = data.length;
                for(var i=0;i<len;i++) {
                    if(data[i].username == username) {
                        alert("Username already exists.");
                        return;
                    }
                }
                let userpass = {"username" : username, "password" : password};
                console.log(userpass);
                data.push(userpass);
                fs.writeFile('./database.js', data, (err)=> {
                console.log(err);
            });
        });

}
