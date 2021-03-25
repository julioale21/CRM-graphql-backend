import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const url = "mongodb://crm-backend:admin@cluster0-shard-00-00.qxvzw.mongodb.net:27017,cluster0-shard-00-01.qxvzw.mongodb.net:27017,cluster0-shard-00-02.qxvzw.mongodb.net:27017/crm-backend?ssl=true&replicaSet=atlas-jn19zg-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false });

const customersSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  company: String,
  emails: Array,
  age: Number,
  type: String,
  orders: Array
});
const Customers = mongoose.model("customers", customersSchema);

const productsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});
const Products = mongoose.model("products", productsSchema);

const ordersSchema = new mongoose.Schema({
  order: Array,
  total: Number,
  date: Date,
  customer: String,
  status: String,
});
const Orders = mongoose.model("orders", ordersSchema);

export { Customers, Products, Orders };