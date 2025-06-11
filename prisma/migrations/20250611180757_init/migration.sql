-- CreateTable
CREATE TABLE "Users" (
    "idUser" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "photo" TEXT,
    "phoneNumber" VARCHAR(45),
    "role" INTEGER NOT NULL,
    "path" TEXT,
    "status" BOOLEAN NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "idNotification" SERIAL NOT NULL,
    "icon" TEXT,
    "description" VARCHAR(255),
    "notificationTime" VARCHAR(100),
    "read" BOOLEAN,
    "idUser" INTEGER,
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("idNotification")
);

-- CreateTable
CREATE TABLE "Services" (
    "idService" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "priceInCents" INTEGER,
    "duration" INTEGER,
    "benefits" TEXT,
    "reviews" INTEGER,
    "status" BOOLEAN,
    "category" VARCHAR(255),
    "updatedIn" TIMESTAMP(3),
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(255),
    "photo" TEXT,
    "schedulingLimit" INTEGER NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("idService")
);

-- CreateTable
CREATE TABLE "Products" (
    "idProduct" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "priceInCents" INTEGER,
    "status" BOOLEAN,
    "category" VARCHAR(255),
    "updatedIn" TIMESTAMP(3),
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER,
    "photo" TEXT,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("idProduct")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "idAppointment" SERIAL NOT NULL,
    "appointmentTime" VARCHAR(45),
    "appointmentDate" TIMESTAMP(3),
    "status" BOOLEAN,
    "employeeName" VARCHAR(255),
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "phoneNumber" VARCHAR(255),
    "employeePhoneNumber" VARCHAR(255),
    "employeeEmail" VARCHAR(255),
    "idService" INTEGER,
    "idUser" INTEGER,
    "idEmployee" INTEGER,
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("idAppointment")
);

-- CreateTable
CREATE TABLE "Carts" (
    "idCart" SERIAL NOT NULL,
    "idUser" INTEGER,
    "status" BOOLEAN,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("idCart")
);

-- CreateTable
CREATE TABLE "CartProducts" (
    "idCartProduct" SERIAL NOT NULL,
    "idProduct" INTEGER,
    "idCart" INTEGER,
    "productName" VARCHAR(255),
    "priceInCents" INTEGER,
    "status" BOOLEAN,
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartProducts_pkey" PRIMARY KEY ("idCartProduct")
);

-- CreateTable
CREATE TABLE "Shoppings" (
    "idShopping" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Shoppings_pkey" PRIMARY KEY ("idShopping")
);

-- CreateTable
CREATE TABLE "PurchaseProducts" (
    "idPurchaseProduct" SERIAL NOT NULL,
    "idShopping" INTEGER,
    "idProduct" VARCHAR(255),
    "priceInCents" INTEGER,
    "productName" VARCHAR(255),
    "paymentMethod" VARCHAR(45),
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "PurchaseProducts_pkey" PRIMARY KEY ("idPurchaseProduct")
);

-- CreateTable
CREATE TABLE "Chats" (
    "idChat" SERIAL NOT NULL,
    "idUser" INTEGER,
    "idUser2" INTEGER,
    "username1" VARCHAR(255),
    "username2" VARCHAR(255),
    "userPhoto1" TEXT,
    "userPhoto2" TEXT,
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("idChat")
);

-- CreateTable
CREATE TABLE "Messages" (
    "idMessage" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedIn" TIMESTAMP(3),
    "idUser" INTEGER,
    "idChat" INTEGER NOT NULL,
    "username" VARCHAR(255),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("idMessage")
);

-- CreateTable
CREATE TABLE "VerificationCodes" (
    "id_verification_code" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("id_verification_code")
);

-- CreateTable
CREATE TABLE "Plans" (
    "idPlan" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "services" TEXT,
    "priceInCents" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("idPlan")
);

-- CreateTable
CREATE TABLE "Subscribers" (
    "idSubscriber" SERIAL NOT NULL,
    "subscriberName" VARCHAR(255) NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idPlan" INTEGER NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL,
    "updatedIn" TIMESTAMP(3),

    CONSTRAINT "Subscribers_pkey" PRIMARY KEY ("idSubscriber")
);

-- CreateTable
CREATE TABLE "_ProductsToPurchaseProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductsToPurchaseProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "_ProductsToPurchaseProducts_B_index" ON "_ProductsToPurchaseProducts"("B");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idService_fkey" FOREIGN KEY ("idService") REFERENCES "Services"("idService") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProducts" ADD CONSTRAINT "CartProducts_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Products"("idProduct") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProducts" ADD CONSTRAINT "CartProducts_idCart_fkey" FOREIGN KEY ("idCart") REFERENCES "Carts"("idCart") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shoppings" ADD CONSTRAINT "Shoppings_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProducts" ADD CONSTRAINT "PurchaseProducts_idShopping_fkey" FOREIGN KEY ("idShopping") REFERENCES "Shoppings"("idShopping") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_idUser2_fkey" FOREIGN KEY ("idUser2") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_idChat_fkey" FOREIGN KEY ("idChat") REFERENCES "Chats"("idChat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribers" ADD CONSTRAINT "Subscribers_idPlan_fkey" FOREIGN KEY ("idPlan") REFERENCES "Plans"("idPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPurchaseProducts" ADD CONSTRAINT "_ProductsToPurchaseProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPurchaseProducts" ADD CONSTRAINT "_ProductsToPurchaseProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "PurchaseProducts"("idPurchaseProduct") ON DELETE CASCADE ON UPDATE CASCADE;
