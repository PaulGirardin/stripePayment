const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const port = process.env.PORT || 8080;
console.log(keyPublishable);

const app = require("express")();
const stripe = require("stripe")(keySecret);

const pagePath = 'pages/';
let page = 'index';
let template = 'templates/default.pug';
let articles = [
  {
    show: 'ARTICLE1',
    title: 'Article1',
    price: 1000
  },
  {
    show: 'ARTICLE2',
    title: 'Article2',
    price: 2000
  },
  {
    show: 'ARTICLE3',
    title: 'Article3',
    price: 3000
  }
];

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.render(pagePath + page, {
    keyPublishable: keyPublishable,
    articles: articles
  });
});

app.post("/charge", (req, res) => {
  let amount = req.body.payment;
  page = require(pagePath + 'charge');

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render(template, (err, html) => {
    res.render(pagePath + page, {});
  }));
});

app.listen(port, function () {
  console.log('Port: ' + port)
});