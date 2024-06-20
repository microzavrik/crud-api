import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import router from "./routes"; 

const prisma = new PrismaClient;
export const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});