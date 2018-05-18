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
-- Table structure for table `choices`
--

DROP TABLE IF EXISTS `choices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `choices` (
  `idchoices` int(11) NOT NULL AUTO_INCREMENT,
  `choice` varchar(200) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idchoices`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `choices`
--

LOCK TABLES `choices` WRITE;
/*!40000 ALTER TABLE `choices` DISABLE KEYS */;
INSERT INTO `choices` VALUES (1,'Sri City',1),(2,'Tada',1),(3,'Interested in research',2),(25,'Professional Excellence',2),(26,'test c 2',31),(27,'test c 2 1',31),(28,'c1',32),(29,'chocie for quesion 1 final test',32),(30,'choice 2 for question 1 final test',35),(31,'choice 1 for final tst',36),(32,'choice',36),(33,'final choice for really final questink',37),(34,'second choice',37),(35,'choice dor  ',38),(36,'fchoice mor',38),(37,'asdasd asd ',39),(38,'1sad a',39),(39,'asd as',40),(40,'asd a',40),(41,'ewae ',40),(42,'asdasd asd ',41),(43,'1sad a',41),(44,'asd as',42),(45,'asd a',42),(46,'ewae ',42),(47,'Online , Multiple Choice Only Exam',43),(48,'Offline , written based exam',43),(49,'After the exams',44),(50,'Online , Multiple Choice Only Exam',45),(51,'Offline , written based exam',45),(52,'Combination of both online and offline examinations',45),(53,'After the exams',46),(54,'As per the original timetable',46),(55,'Before the exams',46),(56,'Online , Multiple Choice Only Exam',47),(57,'Offline , written based exam',47),(58,'After the exams',48),(59,'Online , Multiple Choice Only Exam',49),(60,'Offline , written based exam',49),(61,'Combination of both online and offline examinations',49),(62,'After the exams',50),(63,'As per the original timetable',50),(64,'Before the exams',50),(65,'asd',53),(66,'bsd',53),(67,'wasd',53),(68,'Online , Multiple Choice Only Exam',54),(69,'Offline , written based exam',54),(70,'Combination of both online and offline examinations',54),(71,'another option',54),(72,'After the exams',55),(73,'As per the original timetable',55),(74,'Before the exams',55);
/*!40000 ALTER TABLE `choices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-18 22:43:44
