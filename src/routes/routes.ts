import { FastifyInstance } from "fastify";

import type { FastifyTypedInstance } from "../types/fastify_types";

import { userRoutes } from "./UsersRoutes";
import { notificationsRoutes } from "./NotificationsRoutes";
import { shoppingsRoutes } from "./ShoppingsRoutes";
import { chatsRoutes } from "./chatsRoutes";
import { messagesRoutes } from "./messagesRoutes";
import { cartProductsRoutes } from "./cartProductsRoutes";
import { cartsRoutes } from "./cartsRoutes";
import { purchaseProductsRoutes } from "./purchaseProductsRoutes";
import { appointmentsRoutes } from "./appointmentsRoutes";
export async function routes(app:FastifyTypedInstance) {
  userRoutes(app)
  notificationsRoutes(app);
  shoppingsRoutes(app);
  chatsRoutes(app);
  messagesRoutes(app);
  cartProductsRoutes(app);
  cartsRoutes(app);
  purchaseProductsRoutes(app);
  appointmentsRoutes(app);
  




 
}