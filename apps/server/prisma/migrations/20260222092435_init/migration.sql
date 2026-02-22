-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `joinDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `skills` JSON NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `projects` INTEGER NOT NULL,
    `lastReview` DATETIME(3) NOT NULL,
    `performanceRating` DOUBLE NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
