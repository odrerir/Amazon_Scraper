import cors from "cors";
import express from "express";
import searchRouter from './src/routes/searchRouter.ts';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/', searchRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})