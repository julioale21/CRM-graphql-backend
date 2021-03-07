import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";

const app = express();

app.get("/", (req, res) => {
  res.send("All ready");
});

class Customer {
  constructor(id, { name, lastName, company, email }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.company = company;
    this.email = email;
  }
}

const customersDB = {};

// Resolver
const root = {
  customer: () => {
    return {
      "id": Date.now(),
      "name": "Julio",
      "lastName": "Romero",
      "company": "Polica del Chubut",
      "email": "julioale04031981@gmail.com"
    };
  },

  createCustomer : ({ input }) => {
      const id = require("crypto").randomBytes(10).toString("hex");
      customersDB[id] = input;
      return new Customer(id, input);
  }
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = 8000;
app.listen(port, () => {
  console.log(`Server runnig on port ${port}`);
})
