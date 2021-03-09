import mongoose from "mongoose";

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/customers", { useNewUrlParser:true });

const customersSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  company: String,
  email: String,
  age: Number,
  type: String,
  orders: Array
});

const Customers = mongoose.model("customers", customersSchema);

export { Customers };