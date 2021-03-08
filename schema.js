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

  """ Types of valid customers """
  enum CustomerType {
    BASIC
    PREMIUM
  }

  """ Fields input an email """
  input EmailInput {
    email: String
  }

  """ Fields to create a new order """
  input OrderInput {
    product: String
    price: Int
  }

  """ Fields to create a new customer """
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

  """ Get a specific customer """
  type Query {
    getCustomer(id: ID!): Customer
  }

  """ Create new customer """
  type Mutation {
    createCustomer(input: CustomerInput): Customer 
  }
`);

export default schema;