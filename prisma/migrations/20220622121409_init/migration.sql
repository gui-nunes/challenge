-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'VENDOR');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "uid" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "uid_owner" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "uid" TEXT NOT NULL,
    "uid_wallet_payer" TEXT NOT NULL,
    "uid_wallet_payee" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "helded" BOOLEAN NOT NULL,
    "held_on" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_uid_owner_key" ON "Wallet"("uid_owner");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_uid_owner_fkey" FOREIGN KEY ("uid_owner") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uid_wallet_payee_fkey" FOREIGN KEY ("uid_wallet_payee") REFERENCES "Wallet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uid_wallet_payer_fkey" FOREIGN KEY ("uid_wallet_payer") REFERENCES "Wallet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
