import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Customer {
    id: ID
    name: String
    lastName: String
    company: String
    emails: [Email]
  }

  type Email {
    email: String
  }

  type Query {
    customer: Customer
  }
`);

export default schema;