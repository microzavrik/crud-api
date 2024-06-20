import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;
export const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});