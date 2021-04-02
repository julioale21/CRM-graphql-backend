import mongoose from "mongoose";
import { Customers, Products, Orders, Users } from "./db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const ObjectId = mongoose.Types.ObjectId;

dotenv.config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  const { username } = user;
  return jwt.sign({ username }, secret, { expiresIn });
};

export const resolvers = {
  Query: {
    getCustomers: (root, { limit, offset, seller }) => {
      let filter;
      if (seller) {
        filter = { seller: ObjectId(seller) };
      }
      return Customers.find(filter).limit(limit).skip(offset);
    },

    getCustomer: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Customers.findById(id, (error, customer) => {
          if (error) reject(error);
          else resolve(customer);
        });
      });
    },

    totalCustomers: (root, { seller }) => {
      let filter;
      if (seller) {
        filter = { seller: ObjectId(seller) };
      }
      return new Promise((resolve, reject) => {
        Customers.countDocuments(filter, (error, count) => {
          if (error) reject(error);
          else resolve(count);
        });
      });
    },

    getProducts: (root, { limit, offset, stock }) => {
      let filter;
      if (stock) {
        filter = { stock: { $gt: 0 } };
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

    totalProducts: root => {
      return new Promise((resolve, reject) => {
        Products.countDocuments({}, (error, count) => {
          if (error) reject(error);
          else resolve(count);
        });
      });
    },

    getOrders: (root, { customer }) => {
      return new Promise((resolve, reject) => {
        Orders.find({ customer }, (error, order) => {
          if (error) reject(error);
          else resolve(order);
        });
      });
    },

    topCustomers: root => {
      return new Promise((resolve, reject) => {
        Orders.aggregate(
          [
            {
              $match: {
                status: "COMPLETED",
              },
            },
            {
              $group: {
                _id: "$customer",
                total: {
                  $sum: "$total",
                },
              },
            },
            {
              $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "_id",
                as: "customer",
              },
            },
            {
              $sort: {
                total: -1.0,
              },
            },
            {
              $limit: 10.0,
            },
          ],
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
      });
    },

    topSellers: root => {
      return new Promise((resolve, reject) => {
        Orders.aggregate(
          [
            {
              $match: {
                status: "COMPLETED",
              },
            },
            {
              $group: {
                _id: "$seller",
                total: {
                  $sum: "$total",
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "seller",
              },
            },
            {
              $sort: {
                total: -1.0,
              },
            },
            {
              $limit: 10.0,
            },
          ],
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
      });
    },

    getUser: (root, args, { currentUser }) => {
      if (!currentUser) return null;
      const user = Users.findOne({ username: currentUser.username });
      return user;
    },
  },

  Mutation: {
    createCustomer: (root, { input }) => {
      const newCustomer = new Customers({
        name: input.name,
        lastName: input.lastName,
        company: input.company,
        emails: input.emails,
        age: input.age,
        type: input.type,
        orders: input.orders,
        seller: input.seller,
      });
      newCustomer.id = newCustomer._id;

      return new Promise((resolve, reject) => {
        newCustomer.save(error => {
          if (error) reject(error);
          else resolve(newCustomer);
        });
      });
    },

    updateCustomer: (root, { input }) => {
      return new Promise((resolve, reject) => {
        Customers.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, customer) => {
          if (error) reject(error);
          else resolve(customer);
        });
      });
    },

    deleteCustomer: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Customers.findOneAndRemove({ _id: id }, error => {
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
        newProduct.save(error => {
          if (error) reject(error);
          else resolve(newProduct);
        });
      });
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
        Products.findOneAndRemove({ _id: id }, error => {
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
        seller: input.seller,
      });

      newOrder.id = newOrder._id;
      return new Promise((resolve, reject) => {
        newOrder.save(error => {
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
        }

        input.order.forEach(element => {
          Products.updateOne(
            { _id: element.id },
            { $inc: { stock: `${instruction}${element.quantity}` } },
            function (error) {
              if (error) return new Error(error);
            },
          );
        });
        Orders.findOneAndUpdate({ _id: input.id }, input, { new: true }, error => {
          if (error) reject(error);
          else resolve("Updated successfully");
        });
      });
    },

    createUser: async (root, { username, name, role, password }) => {
      const user = await Users.findOne({ username });
      if (user) throw new Error("User already exists");

      const newUser = await new Users({
        username,
        name,
        role,
        password,
      }).save();

      return "User successfully created";
    },

    authenticateUser: async (root, { username, password }) => {
      const user = await Users.findOne({ username });
      if (!user) throw new Error("User not found");

      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) throw new Error("Wrong password");

      return {
        token: createToken(user, process.env.SECRET, "1h"),
      };
    },
  },
};
