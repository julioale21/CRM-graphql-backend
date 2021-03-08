import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Customer {
    id: ID
    name: String
    lastName: String
    company: String
    emails: [Email]
    age: Int
    type: CustomerType
    orders: [Order]
  }

  type Email {
    email: String
  }

  type Order {
    product: String
    price: Int
  }

  enum CustomerType {
    BASIC
    PREMIUM
  }

  input EmailInput {
    email: String
  }

  input OrderInput {
    product: String
    price: Int
  }

  input CustomerInput {
    id: ID
    name: String!
    lastName: String!
    company: String!
    emails: [EmailInput]
    age: Int!
    type: CustomerType!
    orders: [OrderInput]
  }

  type Query {
    getCustomer(id: ID!): Customer
  }

  type Mutation {
    createCustomer(input: CustomerInput): Customer 
  }
`);

export default schema;