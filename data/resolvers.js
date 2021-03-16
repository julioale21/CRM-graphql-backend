import mongoose from "mongoose";
import { Customers, Products } from "./db";

export const resolvers = {
  Query: {
    getCustomers: (root, { limit, offset }) => {
      return Customers.find({}).limit(limit).skip(offset);
    },

    getCustomer : (root, { id }) => {
      return new Promise((resolve, rejects) => {
        Customers.findById(id, (error, customer) => {
          if (error) rejects(error);
          else resolve(customer);
        })
      });
    },

    totalCustomers: (root) => {
      return new Promise((resolve, rejects) => {
        Customers.countDocuments({}, (error, count) => {
          if (error) rejects(error);
          else resolve(count);
        })
      });
    }
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
      });
      newCustomer.id = newCustomer._id;

      return new Promise((resolve, rejects) => {
        newCustomer.save((error) => {
          if (error) rejects(error)
          else resolve(newCustomer)
        })
      });
    },

    updateCustomer: (root, { input }) => {
      return new Promise((resolve, rejects) => {
        Customers.findOneAndUpdate({ _id: input.id }, input , { new: true }, (error, customer) => {
          if (error) rejects(error);
          else resolve(customer);
        });
      })
    },

    deleteCustomer: (root, { id }) => {
      return new Promise((resolve, rejects) => {
        Customers.findOneAndRemove({ _id: id }, (error) => {
          if (error) rejects(error);
          else resolve("Customer successfully deleted");
        });
      });
    },

    createProduct: (root, { input }) => {
      const newProduct = new Products({
        name: input.name,
        price: input.price,
        stock: input.stock,
      });

      newProduct.id = newProduct._id;
      return new Promise((resolve, rejects) => {
        newProduct.save((error) => {
          if (error) rejects(error);
          else resolve(newProduct);
        })
      })
    }
  }
}
