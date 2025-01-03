-- MySQL dump 10.13  Distrib 8.0.34, for Linux (x86_64)
--
-- Host: localhost    Database: canticum
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dequeue_history`
--

CREATE DATABASE canticum;
USE canticum;

DROP TABLE IF EXISTS `dequeue_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dequeue_history` (
  `playTimestamp` datetime NOT NULL,
  `enqueueHistoryId` int NOT NULL,
  PRIMARY KEY (`enqueueHistoryId`),
  CONSTRAINT `dequeue_history_ibfk_1` FOREIGN KEY (`enqueueHistoryId`) REFERENCES `enqueue_history` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dequeue_history`
--

LOCK TABLES `dequeue_history` WRITE;
/*!40000 ALTER TABLE `dequeue_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `dequeue_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enqueue_history`
--

DROP TABLE IF EXISTS `enqueue_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enqueue_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `uploader` varchar(255) DEFAULT NULL,
  `originalURL` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `enqueueTimestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enqueue_history`
--

LOCK TABLES `enqueue_history` WRITE;
/*!40000 ALTER TABLE `enqueue_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `enqueue_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist`
--

DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `playlistName` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  PRIMARY KEY (`playlistName`,`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist`
--

LOCK TABLES `playlist` WRITE;
/*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_content_map`
--

DROP TABLE IF EXISTS `playlist_content_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist_content_map` (
  `playlistItemId` int NOT NULL,
  `userId` varchar(255) NOT NULL,
  `playlistName` varchar(255) NOT NULL,
  `playlistPosition` int NOT NULL,
  PRIMARY KEY (`playlistItemId`,`userId`,`playlistName`,`playlistPosition`),
  KEY `fk1_playlist_content_map` (`userId`,`playlistName`),
  CONSTRAINT `fk1_playlist_content_map` FOREIGN KEY (`userId`, `playlistName`) REFERENCES `playlist` (`userId`, `playlistName`),
  CONSTRAINT `fk2_playlist_content_map` FOREIGN KEY (`playlistItemId`) REFERENCES `playlist_items` (`playlistItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_content_map`
--

LOCK TABLES `playlist_content_map` WRITE;
/*!40000 ALTER TABLE `playlist_content_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist_content_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_items`
--

DROP TABLE IF EXISTS `playlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist_items` (
  `playlistItemId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `uploader` varchar(255) DEFAULT NULL,
  `musicId` varchar(255) DEFAULT NULL,
  `originalURL` varchar(255) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  PRIMARY KEY (`playlistItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=682 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_items`
--

LOCK TABLES `playlist_items` WRITE;
/*!40000 ALTER TABLE `playlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
