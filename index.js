import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("All ready");
})

const port = 8000;
app.listen(port, () => {
  console.log(`Server runnig on port ${port}`);
})
