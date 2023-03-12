import express from "express";

const app = express();
const port = 3000;

const goods = [{
    name: "Apple",
    price: 100
}, {
    name: "Orange",
    price: 200
}, {
    name: "Banana",
    price: 300
    }
]

let balance = 100;

let cart = [] as string[];

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buy Our Stuff</title>
</head>
<body>

    <h1>Hi welcome to our store</h1>

    <h2>Here is your balance</h2>

    <p>${balance}</p>


    <h2>Here is our goods</h2>

    <ul>
        ${goods
            .map(({name, price}) => {
                return `
        <li style="flex:1; gap:2">[${price}] ${name}
            <button onclick="add('${name}')" type="button">Add to Cart!</button>
            </li>`;
            })
            .join("")}

    </ul>

    <h2>Here is your cart</h2>
    <ul>

        ${cart
            .map((item) => {
                return `
        <li style="flex:1; gap:2">${item}
            <button type="button">Remove from Cart!</button>
            </li>`;
            })
            .join("")}
            <li style="flex:1; gap:2">Total: ${
                cart.reduce((acc, item) => {
                    const price = goods.find(good => good.name === item)?.price
                    return acc + (price ?? 0)
                }
                , 0)
            }
           <a href="/buy">Buy</a>
            </li>
    </ul>

    <script>
        const goods = ${JSON.stringify(goods)}
        const carts = ${JSON.stringify(cart)}
        const balance = ${JSON.stringify(balance)}
        function add(item){
            // check if balance is enough
            const price = goods.find(good => good.name === item).price
            const total  = ${  cart.reduce((acc, item) => {
                const price = goods.find(good => good.name === item)?.price
                return acc + (price ?? 0)
            }
            , 0)}

            if (balance < total + price) {
                alert("Not enough balance")
                return
            }

            fetch("/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({item})
            }).then(() => {
                window.location.reload();
            })
        }
    </script>



   
    
</body>
</html>
`)
})
    



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add", (req, res) => {
    const { item } = req.body
    cart.push(item as string);
    res.redirect("/");
    balance -= goods.find(good => good.name === item)?.price ?? 0
});

app.get("/buy", (req, res) => {
    res.send("You bought the stuff!")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})  