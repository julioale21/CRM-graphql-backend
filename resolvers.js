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
const resolvers = {
  getCustomer : ({ id }) => {
    return new Cliente(id, customersDB[id]);
  },

  createCustomer : ({ input }) => {
      const id = require("crypto").randomBytes(10).toString("hex");
      customersDB[id] = input;
      return new Customer(id, input);
  }
};

export default resolvers;