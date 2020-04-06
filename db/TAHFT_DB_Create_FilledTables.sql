-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tahft_db
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orderhasitem`
--

CREATE SCHEMA IF NOT EXISTS `TAHFT_DB` DEFAULT CHARACTER SET utf8 ;
USE `TAHFT_DB` ;

DROP TABLE IF EXISTS `orderhasitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderhasitem` (
  `order` int NOT NULL,
  `item` int NOT NULL,
  `qty` int NOT NULL,
  KEY `fk_OrderHasItem_Order` (`order`),
  KEY `fk_OrderHasItem_Item` (`item`),
  CONSTRAINT `fk_OrderHasItem_Item` FOREIGN KEY (`item`) REFERENCES `products` (`productID`),
  CONSTRAINT `fk_OrderHasItem_Order` FOREIGN KEY (`order`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderhasitem`
--

LOCK TABLES `orderhasitem` WRITE;
/*!40000 ALTER TABLE `orderhasitem` DISABLE KEYS */;
INSERT INTO `orderhasitem` VALUES (6,2,2),(6,4,1),(6,3,1),(6,5,3),(7,2,2),(7,3,2),(7,4,1),(8,2,1),(8,6,3),(9,1,1);
/*!40000 ALTER TABLE `orderhasitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timeCreated` timestamp NOT NULL,
  `isShipped` tinyint NOT NULL,
  `trackingNumber` int DEFAULT NULL,
  `userId` int NOT NULL,
  `total` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_Orders_Users_idx` (`userId`),
  CONSTRAINT `fk_Orders_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,'2020-04-06 00:14:34',1,30261949,1,43193),(7,'2020-04-06 00:27:24',1,6267846,1,17195),(8,'2020-04-06 01:27:58',1,79689192,2,41596),(9,'2020-04-06 22:08:17',1,42690475,1,3999);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productID` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(45) NOT NULL,
  `productDescription` text,
  `productPrice` int NOT NULL,
  `productImage` varchar(255) NOT NULL,
  `isActive` tinyint DEFAULT '1',
  `isFrontPage` tinyint DEFAULT '0',
  PRIMARY KEY (`productID`),
  UNIQUE KEY `productID_UNIQUE` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Sombrero','A somewhat authentic sombrero that was probably made in Mexico',3999,'Sombrero.jpg',1,1),(2,'Canada Toque','This Canada toque was handmade for your comfort by the highest quality sweatshop.',2599,'CanadaToque.jpg',1,1),(3,'Tophat','This costs about as much as Tophat.com extorts from one student for a semester!',3999,'Tophat.jpg',1,1),(4,'Montreal Expos Ball Hat','It\' alright, at least they aren\'the Leafs.',3999,'ExposBallHat.png',1,0),(5,'Hockey Helmet','For when you want to survive a slapshot to the head.',9999,'HockeyHelmet.png',1,0),(6,'Cat','Literally a cat that sits on your head. Please check allergies before buying. Dog not included.',12999,'CatOnHead.png',1,0),(7,'Skyrim Helmet','A skyrim helmet. Offers no protection against dragons. +5 to heavy armor.',14999,'SkyrimHelmet.png',1,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `password` varchar(64) NOT NULL,
  `salt` varchar(64) NOT NULL,
  `FirstName` varchar(256) DEFAULT NULL,
  `LastName` varchar(256) DEFAULT NULL,
  `admin` tinyint DEFAULT '0',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'k.pineo@dal.ca','ab0e1db9bd5de3383c6d70efaf638cb65f44d33a06dd3374460db4a7a8eba634','TAHFT_Sombrero','','',1),(2,'test@gmail.com','ab0e1db9bd5de3383c6d70efaf638cb65f44d33a06dd3374460db4a7a8eba634','TAHFT_Sombrero',' ',' ',0),(3,'testing124@yahoo.com','c0d841e2d3a61fc7645e4f59a521f0220922eebae26c5b5e45fc0c8ee6681b89','TAHFT_Sombrero',' ',' ',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'tahft_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-06 17:11:56
