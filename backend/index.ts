import app from "./app";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
