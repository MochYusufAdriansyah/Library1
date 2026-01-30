/*
  Warnings:

  - You are about to drop the column `password` on the `member` table. All the data in the column will be lost.
  - Made the column `name` on table `member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `member` DROP COLUMN `password`,
    MODIFY `name` VARCHAR(191) NOT NULL;
