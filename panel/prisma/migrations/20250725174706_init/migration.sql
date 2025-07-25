-- CreateTable
CREATE TABLE `bots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `status` VARCHAR(30) NULL DEFAULT 'active',
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `tenantId`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `tenantSlug` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `botId` INTEGER NULL,
    `menuOption` VARCHAR(100) NULL,
    `message` TEXT NULL,
    `response` TEXT NULL,
    `intent` VARCHAR(100) NULL,
    `isFallback` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantSlug` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` ENUM('PENDING', 'IN_REVIEW', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `requiresFollowup` BOOLEAN NULL DEFAULT false,
    `resolvedByHuman` BOOLEAN NULL DEFAULT false,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `opcion_num` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `response` VARCHAR(1024) NOT NULL,

    UNIQUE INDEX `uniq_tenant_option`(`tenantId`, `opcion_num`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metricsdaily` (
    `day` DATE NOT NULL,
    `tenantSlug` VARCHAR(100) NOT NULL,
    `botId` INTEGER NOT NULL,
    `conversations` INTEGER NOT NULL,
    `users` INTEGER NOT NULL,
    `messages` INTEGER NOT NULL,
    `fallbacks` INTEGER NOT NULL,
    `avgPerConv` FLOAT NOT NULL,

    INDEX `tenantSlug`(`tenantSlug`, `day`),
    PRIMARY KEY (`day`, `tenantSlug`, `botId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'TENANT_ADMIN', 'ANALYST', 'AGENT', 'VIEWER') NOT NULL,
    `tenantId` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `tenantId`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bots` ADD CONSTRAINT `bots_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
