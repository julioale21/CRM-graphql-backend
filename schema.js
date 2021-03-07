import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Customer {
    id: ID
    name: String
    lastName: String
    company: String
    email: String
  }

  type Query {
    customer: Customer
  }


  input CustomerInput {
    id: ID
    name: String!
    lastName: String!
    company: String!
    email: String!
  }

  type Mutation {
    createCustomer(input: CustomerInput): Customer 
  }
`);

export default schema;