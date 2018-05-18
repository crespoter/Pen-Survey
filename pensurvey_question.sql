-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pensurvey
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `idquestion` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `question_text` varchar(45) DEFAULT NULL,
  `questionnaire_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idquestion`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COMMENT='table for questions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'CHOICE','Where are you from',1),(2,'CHOICE','Why did you choose Sricity',1),(31,'CHOICE','test q 1',32),(32,'CHOICE','test q 2',32),(34,'CHOICE','q1',36),(35,'CHOICE','question 1 final test',37),(36,'CHOICE','question 2 for final test',37),(37,'CHOICE','fina question really',38),(38,'CHOICE','secpd asd quest ',38),(39,'CHOICE','asd ',39),(40,'CHOICE','asd a',39),(41,'CHOICE','asd ',40),(42,'CHOICE','asd a',40),(43,'CHOICE','What mode of examination do you prefer?',41),(44,'CHOICE','When do you want it to be conducted?',41),(45,'CHOICE','What mode of examination do you prefer?',42),(46,'CHOICE','When do you want it to be conducted?',42),(47,'CHOICE','What mode of examination do you prefer?',43),(48,'CHOICE','When do you want it to be conducted?',43),(49,'CHOICE','What mode of examination do you prefer?',44),(50,'CHOICE','When do you want it to be conducted?',44),(51,'CHOICE','What mode of examination do you prefer?',33),(52,'CHOICE','When do you want it to be conducted?',33),(53,'CHOICE','option 1 for final',45),(54,'CHOICE','What mode of examination do you prefer?',46),(55,'CHOICE','When do you want it to be conducted?',46);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-18 22:43:43
