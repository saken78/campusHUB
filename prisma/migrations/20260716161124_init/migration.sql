/*
  Warnings:

  - You are about to drop the column `slug` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `tags` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- DropIndex
DROP INDEX `categories_slug_key` ON `categories`;

-- DropIndex
DROP INDEX `events_slug_key` ON `events`;

-- DropIndex
DROP INDEX `tags_slug_key` ON `tags`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `tags` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('superadmin', 'admin', 'dosen', 'mahasiswa') NOT NULL DEFAULT 'mahasiswa';
