import express from "express";

const app = express();
const port = 3000;

let todos = [] as string[];

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example XSS</title>
</head>
<body>
    

    <h1>Hi welcome to my stupid to do apps UwU</h1>

    <h2>Here is your to do list</h2>

    <ul>
        ${todos
          .map((todo) => {
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
});

app.use(express.urlencoded({ extended: true }));


app.post("/add", (req, res) => {
    const { todo } = req.body
    todos.push(todo as string);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const { todo } = req.body
    todos = todos.filter((t) => t !== todo);
    res.redirect("/");
});


app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
