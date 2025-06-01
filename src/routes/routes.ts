import { FastifyInstance } from "fastify";

import type { FastifyTypedInstance } from "../types/fastify_types";

import { userRoutes } from "./UsersRoutes";

export async function routes(app:FastifyTypedInstance) {
  userRoutes(app)
 
}