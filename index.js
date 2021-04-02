import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./data/schema";
import { resolvers } from "./data/resolvers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "variables.env",
});

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];

    if (token !== "null" && token !== undefined) {
      try {
        const currentUser = await jwt.verify(token, process.env.SECRET);
        req.currentUser = currentUser;
        return {
          currentUser,
        };
      } catch (error) {
        console.error(error);
      }
    }
  },
});

server.applyMiddleware({ app });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
