import express from "express";

const app = express();

const port = 3000;

const users = [
    {
        username: "user1",
        password: "pas"
    },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// login 

app.post("/login" , (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    console.log({
        username,
        password,
        user
    })
    if(user){
        res.send("You are logged in");
    }else{
        res.status(401).send("Invalid username or password");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});