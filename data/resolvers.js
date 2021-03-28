import mongoose from "mongoose";
import { Customers, Products, Orders } from "./db";

export const resolvers = {
  Query: {
    getCustomers: (root, { limit, offset }) => {
      return Customers.find({}).limit(limit).skip(offset);
    },

    getCustomer : (root, { id }) => {
      return new Promise((resolve, reject) => {
        Customers.findById(id, (error, customer) => {
          if (error) reject(error);
          else resolve(customer);
        })
      });
    },

    totalCustomers: (root) => {
      return new Promise((resolve, reject) => {
        Customers.countDocuments({}, (error, count) => {
          if (error) reject(error);
          else resolve(count);
        })
      });
    },

    getProducts: (root, { limit, offset, stock}) => {
      let filter;
      if (stock) {
        filter = { stock: { $gt: 0 } }
      }
      return Products.find(filter).limit(limit).skip(offset);
    },

    getProduct: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Products.findById(id, (error, product) => {
          if (error) reject(error);
          else resolve(product);
        });
      });
    },

    totalProducts: (root) => {
      return new Promise((resolve, reject) => {
        Products.countDocuments({}, (error, count) => {
          if (error) reject(error);
          else resolve(count);
        })
      });
    },

    getOrders: (root, { customer }) => {
      return new Promise((resolve, reject) => {
        Orders.find({ customer }, (error, order) => {
          if (error) reject(error);
          else resolve(order);
        })
      });
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
      });
      newCustomer.id = newCustomer._id;

      return new Promise((resolve, reject) => {
        newCustomer.save((error) => {
          if (error) reject(error)
          else resolve(newCustomer)
        })
      });
    },

    updateCustomer: (root, { input }) => {
      return new Promise((resolve, reject) => {
        Customers.findOneAndUpdate({ _id: input.id }, input , { new: true }, (error, customer) => {
          if (error) reject(error);
          else resolve(customer);
        });
      })
    },

    deleteCustomer: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Customers.findOneAndRemove({ _id: id }, (error) => {
          if (error) reject(error);
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
      return new Promise((resolve, reject) => {
        newProduct.save((error) => {
          if (error) reject(error);
          else resolve(newProduct);
        })
      })
    },

    updateProduct: (root, { input }) => {
      return new Promise((resolve, reject) => {
        Products.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, product) => {
          if (error) reject(error);
          else resolve(product);
        });
      });
    },

    deleteProduct: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Products.findOneAndRemove({ _id: id }, (error) => {
          if (error) reject(error);
          else resolve("Product successfully deleted");
        });
      });
    },

    createOrder: (root, { input }) => {
      const newOrder = new Orders({
        order: input.order,
        total: input.total,
        date: new Date(),
        customer: input.customer,
        status: "PENDING",
      });

      newOrder.id = newOrder._id;
      return new Promise((resolve, reject) => {
        newOrder.save((error) => {
          if (error) reject(error);
          else resolve(newOrder);
        });
      });
    },

    updateOrderStatus: (root, { input }) => {
      return new Promise((resolve, reject) => {
        const { status } = input;

        let instruction;
        if (status === "COMPLETED") {
          instruction = "-";
        } else if (status === "CANCELLED") {
          instruction = "+";
        };

        input.order.forEach(element => {
          Products.updateOne({ _id: element.id },
            { "$inc": { "stock": `${instruction}${element.quantity}` }
            }, function(error) {
              if (error) return new Error(error);
            });
        });
        Orders.findOneAndUpdate({_id: input.id}, input, { new: true }, (error) => {
          if (error) reject(error);
          else resolve("Updated successfully");
        })
      })
    }
  }
}
