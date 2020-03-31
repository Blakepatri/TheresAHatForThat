-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

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
  `admin` TINYINT DEFAULT 0,
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
  `trackingNumber` INT NULL,
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
  `productPrice` INT NOT NULL,
  `productImage` VARCHAR(255) NOT NULL,
  `isFrontPage` TINYINT DEFAULT 0,
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




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO Users (email, password, salt, FirstName, LastName, admin) VALUES ('k.pineo@dal.ca', 'b283e8cd7073748037a753870b4c4f7cdefa73f05ca0482408d0d9aa9ca5715f', 'TAHFT_Sombrero', '', '',1);

INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Sombrero', 'A somewhat authentic sombrero that was probably made in Mexico', 3999, 'Sombrero.jpg',1);
INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Canada Toque', 'This Canada toque was handmade for your comfort by the highest quality sweatshop.', 2599, 'CanadaToque.jpg',1);
INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Tophat', 'This costs about as much as Tophat.com extorts from one student for a semester!', 3999, 'Tophat.jpg',1);
INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Montreal Expos Ball Hat', 'It\' alright, at least they aren\'the Leafs.', 3999, 'ExposBallHat.png',0);
INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Hockey Helmet', 'For when you want to survive a slapshot to the head.', 9999, 'HockeyHelmet.png',0);
INSERT INTO Products (productName, productDescription, productPrice, productImage, isFrontPage) VALUES ('Cat', 'Literally a cat that sits on your head. Please check allergies before buying. Dog not included.', 12999, 'CatOnHead.png',0);