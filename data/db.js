import mongoose from "mongoose";

mongoose.Promise = global.Promise;

/* mongoose.connect("mongodb://localhost/customers", { useNewUrlParser:true });
 */

mongoose.connect("mongodb+srv://crm-backend:admin@cluster0.qxvzw.mongodb.net/crm-backend?retryWrites=true&w=majority", { useNewUrlParser:true, useUnifiedTopology: true });

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

export { Customers };