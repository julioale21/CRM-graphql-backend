class Customer {
  constructor(id, { name, lastName, company, emails, age, type, orders }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.company = company;
    this.emails = emails;
    this.age = age;
    this.type = type;
    this.orders = orders;
  }
}

const customersDB = {};

// Resolver
const resolvers = {
  getCustomer : ({ id }) => {
    return new Customer(id, customersDB[id]);
  },

  createCustomer : ({ input }) => {
      const id = require("crypto").randomBytes(10).toString("hex");
      customersDB[id] = input;
      return new Customer(id, input);
  }
};

export default resolvers;