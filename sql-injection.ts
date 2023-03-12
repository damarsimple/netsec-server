import express from "express";
import sqlite3 from "sqlite3";


const app = express();
const port = 3000;
const db = new sqlite3.Database('db.sqlite');

app.get("/", (req, res) => {
    // no cache at all
    res.set("Cache-Control", "no-store");
     db.all("SELECT * FROM todos", (err, todos:{
        todo: string;
     }[]) => {
        if (err) {
            console.log(err);
            res.send('error occured : ' + err);
        }else{
            res.send(`
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Example SQL Injection</title>
        </head>
        <body>
            
        
            <h1>Hi welcome to my stupid to do apps UwU</h1>
        
            <h2>Here is your to do list</h2>
        
            <ul>
                ${todos
                  .map(({todo}) => {
                    return `
                <li style="flex:1; gap:2">${todo} 
                    <form action="/delete" method="POST">
                        <input type="hidden" name="todo" value="${todo}">
                        <button type="submit">Delete</button>
                    </form>
                    </li>`;
                  })
                  .join("")}
        
            </ul>
        
            <form action="/add" method="POST">
                <input type="text" name="todo" id="todo">
                <button type="submit">Add</button>
            </form>
        
        
        
        </body>
        </html>
            `);
        }
    
    });

   
});

app.use(express.urlencoded({ extended: true }));


app.post("/add", (req, res) => {
    const { todo } = req.body;
    // insert with raw SQL
    const query = `INSERT INTO todos (todo) VALUES ('${todo}')`;
    db.exec(query, (err) => {
        if (err) {
            console.log(err);
        }else{
        res.redirect("/");
        }
    });
    // example malicious input:  '); DROP TABLE todos; --
});

app.post("/delete", (req, res) => {
    const { todo } = req.body;
    // delete with raw SQL
    db.exec(`DELETE FROM todos WHERE todo = '${todo}'`);
    res.redirect("/");
});

app.get("/userTodo", (req, res) => {
    // no cache at all
    res.set("Cache-Control", "no-store");
    const username  = req.query.username  as string;
    // example malicious input : ' OR 1=1; --

     db.all(`SELECT * FROM userTodo WHERE username = '${username}'`, (err: string, todos:{
        todo: string;
        username: string;
     }[]) => {
        if (err) {
            console.log(err);
            res.send('error occured : ' + err);
        }else{
            res.send(`
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Example SQL Injection</title>
        </head>
        <body>
            
        
            <h1>Hi ${username} welcome to my stupid to do apps UwU</h1>
        
            <h2>Here is your to do list</h2>
        
            <ul>
                ${todos
                  .map(({todo, username}) => {
                    return `
                <li style="flex:1; gap:2">[${username}]${todo} 
                    <form action="/delete" method="POST">
                        <input type="hidden" name="todo" value="${todo}">
                        <button type="submit">Delete</button>
                    </form>
                    </li>`;
                  })
                  .join("")}
        
            </ul>
        
            <form action="/addUserTodo" method="POST">
                <input type="text" name="todo" id="todo">
                <input type="hidden" name="username" value="${username}">
                <button type="submit">Add</button>
            </form>
        
        
        
        </body>
        </html>
            `);
        }
    
    });

   
});
app.post("/addUserTodo", (req, res) => {
    const { todo, username } = req.body;
    // insert with raw SQL
    const query = `INSERT INTO userTodo (todo, username) VALUES ('${todo}', '${username}')`;
    db.exec(query, (err) => {
        if (err) {
            console.log(err);
        }else{
    res.redirect(`/userTodo?username=${username}`);
        }
    });
});


app.listen(port, () => {
    db.run("CREATE TABLE IF NOT EXISTS todos (todo TEXT)");
    // userTodo table with username and todo
    db.run("CREATE TABLE IF NOT EXISTS userTodo (todo TEXT, username TEXT)");
    console.log(`Example app listening at http://localhost:${port}`);
});