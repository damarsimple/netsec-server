import express from "express";

const app = express();
const port = 3000;


const files = [
    {
        name: "file1",
        owner: "user1",
        id: "1"
    },
    {
        name: "file2",
        owner: "user2",
        id: "2"
    },
    {
        name: "file3",
        owner: "user3",
        id: "3"
    },
];

app.get("/", (req, res) => {

    const username = req.query.username as string;

    let view = "";

    if(!username){
        view = `
        <h1>Hi welcome to our file sharing service</h1>

        <form action="/" method="GET">
        <input type="text" name="username" id="username">
        <button type="submit">Login</button>
        </form>
        `;
    }else{

        const userFiles = files.filter(file => file.owner === username);

        view = `

        <h1>Hi ${username} welcome to our file sharing service</h1>

        <h2>Here is your files</h2>

        <ul>
            ${userFiles
            .map((file) => {
                return `
            <li style="flex:1; gap:2">
            <a href="/download/${file.id}">${file.name}</a>
                    </li>`;
            })
            .join("")}
        </ul>


        <form action="/upload" method="POST">
        <input type="hidden" name="username" value="${username}">
        <input type="file" name="file" id="file">
        <button type="submit">Upload</button>
        </form>
        `;

    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Easy Box!</title>
    </head>
    <body>

        ${view}
        
    </body>
    </html>
    `);

});

app.use(express.urlencoded({ extended: true }));

app.post("/upload", (req, res) => {
    const { username, file } = req.body;
    console.log(username, file);
    res.redirect("/");
});

app.get("/download/:id", (req, res) => {
    const { id } = req.params;
    const file = files.find(file => file.id === id);
    if(!file){
        res.send("File not found");
    }else{
        res.send(`Downloading ${file.owner} with filename of :  ${file.name}`);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});