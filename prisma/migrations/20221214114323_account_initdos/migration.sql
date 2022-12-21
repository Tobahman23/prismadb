/*
  Warnings:

  - You are about to alter the column `user` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `user` VARCHAR(191) NULL;
