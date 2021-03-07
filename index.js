import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";

const app = express();

app.get("/", (req, res) => {
  res.send("All ready");
});

// Resolver
const root = {
  customer: () => {
    return {
      "id": Date.now(),
      "name": "Julio",
      "lastName": "Romero",
      "company": "Polica del Chubut",
      "emails": [
        { email: "julioale04031981@gmail.com" },
        { email: "julio_ale21@hotmail.com" },
      ]
    };
  },
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
