-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_idEmployee_fkey";

-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_idService_fkey";

-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_idUser_fkey";

-- DropForeignKey
ALTER TABLE "CartProducts" DROP CONSTRAINT "CartProducts_idCart_fkey";

-- DropForeignKey
ALTER TABLE "CartProducts" DROP CONSTRAINT "CartProducts_idProduct_fkey";

-- DropForeignKey
ALTER TABLE "Carts" DROP CONSTRAINT "Carts_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_idUser2_fkey";

-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_idChat_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_idUser_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseProducts" DROP CONSTRAINT "PurchaseProducts_idShopping_fkey";

-- DropForeignKey
ALTER TABLE "Shoppings" DROP CONSTRAINT "Shoppings_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Subscribers" DROP CONSTRAINT "Subscribers_idPlan_fkey";

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idService_fkey" FOREIGN KEY ("idService") REFERENCES "Services"("idService") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProducts" ADD CONSTRAINT "CartProducts_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProducts" ADD CONSTRAINT "CartProducts_idCart_fkey" FOREIGN KEY ("idCart") REFERENCES "Carts"("idCart") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shoppings" ADD CONSTRAINT "Shoppings_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProducts" ADD CONSTRAINT "PurchaseProducts_idShopping_fkey" FOREIGN KEY ("idShopping") REFERENCES "Shoppings"("idShopping") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_idUser2_fkey" FOREIGN KEY ("idUser2") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_idChat_fkey" FOREIGN KEY ("idChat") REFERENCES "Chats"("idChat") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribers" ADD CONSTRAINT "Subscribers_idPlan_fkey" FOREIGN KEY ("idPlan") REFERENCES "Plans"("idPlan") ON DELETE CASCADE ON UPDATE CASCADE;
