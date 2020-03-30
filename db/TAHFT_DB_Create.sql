-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema TAHFT_DB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema TAHFT_DB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `TAHFT_DB` DEFAULT CHARACTER SET utf8 ;
USE `TAHFT_DB` ;

-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(256) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `salt` VARCHAR(64) NOT NULL,
  `FirstName` VARCHAR(256) NULL,
  `LastName` VARCHAR(256) NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  PRIMARY KEY (`userId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Orders` (
  `invoiceNum` INT NOT NULL,
  `timeCreated` TIMESTAMP NOT NULL,
  `isShipped` TINYINT NOT NULL,
  `trackingNumber` VARCHAR(45) NULL,
  `Users_userId` INT NOT NULL,
  PRIMARY KEY (`invoiceNum`),
  UNIQUE INDEX `invoiceNum_UNIQUE` (`invoiceNum` ASC),
  INDEX `fk_Orders_Users_idx` (`Users_userId` ASC),
  CONSTRAINT `fk_Orders_Users`
    FOREIGN KEY (`Users_userId`)
    REFERENCES `TAHFT_DB`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Products` (
  `productID` INT NOT NULL AUTO_INCREMENT,
  `productName` VARCHAR(45) NOT NULL,
  `productDescription` TEXT NULL,
  PRIMARY KEY (`productID`),
  UNIQUE INDEX `productID_UNIQUE` (`productID` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Promotions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Promotions` (
  `promtionID` INT NOT NULL AUTO_INCREMENT,
  `startTime` TIMESTAMP NOT NULL,
  `endTime` TIMESTAMP NOT NULL,
  `promoType` TINYINT NOT NULL,
  `promoAmount` INT NOT NULL,
  `promoCode` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`promtionID`),
  UNIQUE INDEX `promtionID_UNIQUE` (`promtionID` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Sessions` (
  `sessionID` INT NOT NULL,
  `Users_userId` INT NOT NULL,
  `isLoggedIn` TINYINT NULL,
  `userAgent` VARCHAR(45) NULL,
  `userIP` VARCHAR(45) NULL,
  PRIMARY KEY (`sessionID`),
  UNIQUE INDEX `sessionID_UNIQUE` (`sessionID` ASC),
  INDEX `fk_Sessions_Users1_idx` (`Users_userId` ASC),
  CONSTRAINT `fk_Sessions_Users1`
    FOREIGN KEY (`Users_userId`)
    REFERENCES `TAHFT_DB`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Product Variants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Product Variants` (
  `productSKU` INT NOT NULL,
  `size` VARCHAR(45) NULL,
  `color` VARCHAR(45) NULL,
  `price` VARCHAR(45) NULL,
  `stock` INT NULL,
  `Products_productID` INT NOT NULL,
  `skuHasPromotion` TINYINT NOT NULL,
  PRIMARY KEY (`productSKU`),
  INDEX `fk_Product Variants_Products1_idx` (`Products_productID` ASC),
  CONSTRAINT `fk_Product Variants_Products1`
    FOREIGN KEY (`Products_productID`)
    REFERENCES `TAHFT_DB`.`Products` (`productID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Product Images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Product Images` (
  `imageID` INT NOT NULL AUTO_INCREMENT,
  `imageLocation` VARCHAR(255) NULL,
  `imageTitle` VARCHAR(45) NULL,
  `imageDescription` TINYTEXT NULL,
  `Product Variants_productSKU` INT NOT NULL,
  PRIMARY KEY (`imageID`),
  UNIQUE INDEX `pictureID_UNIQUE` (`imageID` ASC),
  INDEX `fk_Product Images_Product Variants1_idx` (`Product Variants_productSKU` ASC),
  CONSTRAINT `fk_Product Images_Product Variants1`
    FOREIGN KEY (`Product Variants_productSKU`)
    REFERENCES `TAHFT_DB`.`Product Variants` (`productSKU`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Admins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Admins` (
  `Users_userId` INT NOT NULL,
  `permissionLevel` TINYINT NOT NULL,
  PRIMARY KEY (`Users_userId`),
  CONSTRAINT `fk_Admins_Users1`
    FOREIGN KEY (`Users_userId`)
    REFERENCES `TAHFT_DB`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Orders_has_Product Variants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Orders_has_Product Variants` (
  `Orders_invoiceNum` INT NOT NULL,
  `Product Variants_productSKU` INT NOT NULL,
  PRIMARY KEY (`Orders_invoiceNum`, `Product Variants_productSKU`),
  INDEX `fk_Orders_has_Product Variants_Product Variants1_idx` (`Product Variants_productSKU` ASC),
  INDEX `fk_Orders_has_Product Variants_Orders1_idx` (`Orders_invoiceNum` ASC),
  CONSTRAINT `fk_Orders_has_Product Variants_Orders1`
    FOREIGN KEY (`Orders_invoiceNum`)
    REFERENCES `TAHFT_DB`.`Orders` (`invoiceNum`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Orders_has_Product Variants_Product Variants1`
    FOREIGN KEY (`Product Variants_productSKU`)
    REFERENCES `TAHFT_DB`.`Product Variants` (`productSKU`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TAHFT_DB`.`Product Variants_has_Promotions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TAHFT_DB`.`Product Variants_has_Promotions` (
  `Product Variants_productSKU` INT NOT NULL,
  `Promotions_promtionID` INT NOT NULL,
  PRIMARY KEY (`Product Variants_productSKU`, `Promotions_promtionID`),
  INDEX `fk_Product Variants_has_Promotions_Promotions1_idx` (`Promotions_promtionID` ASC),
  INDEX `fk_Product Variants_has_Promotions_Product Variants1_idx` (`Product Variants_productSKU` ASC),
  CONSTRAINT `fk_Product Variants_has_Promotions_Product Variants1`
    FOREIGN KEY (`Product Variants_productSKU`)
    REFERENCES `TAHFT_DB`.`Product Variants` (`productSKU`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Product Variants_has_Promotions_Promotions1`
    FOREIGN KEY (`Promotions_promtionID`)
    REFERENCES `TAHFT_DB`.`Promotions` (`promtionID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
`orders_has_product variants`