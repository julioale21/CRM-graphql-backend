import mongoose from "mongoose";
import { Customers } from "./db";

export const resolvers = {
  Query: {
    getCustomers: () => {
      return Customers.find({});
    },

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

      return new Promise((resolve, object) => {
        newCustomer.save((error) => {
          if (error) rejects(error)
          else resolve(newCustomer)
        })
      });
    },

    updateCustomer: (root, { input }) => {
      return new Promise((resolve, object) => {
        Customers.findOneAndUpdate({ _id: input.id }, input , { new: true }, (error, customer) => {
          if (error) rejects(error);
          else resolve(customer);
        });
      })
    },

    deleteCustomer: (root, { id }) => {
      return new Promise((resolve, object) => {
        Customers.findOneAndRemove({ _id: id }, (error) => {
          if (error) rejects(error);
          else resolve("Customer successfully deleted");
        });
      });
    }
  }
}
