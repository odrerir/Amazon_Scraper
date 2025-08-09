import axios from "axios";
import cors from "cors";
import express from "express";
import { JSDOM } from "jsdom";
import searchRouter from './src/routes/search.ts';


const app = express();

app.use(cors());
app.use(express.json());

// Import or define your router here

app.use('/', searchRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})