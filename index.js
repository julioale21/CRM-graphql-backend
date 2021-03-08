import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./data/schema";

const app = express();

app.get("/", (req, res) => {
  res.send("All ready");
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

const port = 8000;
app.listen(port, () => {
  console.log(`Server runnig on port ${port}`);
})
