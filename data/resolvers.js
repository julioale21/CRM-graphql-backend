import mongoose from "mongoose";
import { Customers } from "./db";

export const resolvers = {
  Query: {
    getCustomer : ({ id }) => {
      return new Customer(id, customersDB[id]);
    },
  },
  Mutation: {
    createCustomer : (root, { input }) => {
      const newCustomer = new Customers({
        name: input.name,
        lastName: input.lastName,
        company: input.company,
        emails: input.emails,
        age: input.age,
        type: input.type,
        orders: input.orders,
      })
      newCustomer.id = newCustomer._id;

      return new Promise((resolve, rejects) => {
        newCustomer.save((error) => {
          if (error) rejects(error)
          else resolve(newCustomer)
        })
      })
    }
  }
}
