CREATE DATABASE  IF NOT EXISTS `pensurvey` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `pensurvey`;
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `choices`
--

LOCK TABLES `choices` WRITE;
/*!40000 ALTER TABLE `choices` DISABLE KEYS */;
INSERT INTO `choices` VALUES (1,'Sri City',1),(2,'Tada',1),(3,'Interested in research',2),(25,'Professional Excellence',2),(26,'test c 2',31),(27,'test c 2 1',31),(28,'c1',32),(29,'chocie for quesion 1 final test',32),(30,'choice 2 for question 1 final test',35),(31,'choice 1 for final tst',36),(32,'choice',36),(33,'final choice for really final questink',37),(34,'second choice',37),(35,'choice dor  ',38),(36,'fchoice mor',38),(37,'asdasd asd ',39),(38,'1sad a',39),(39,'asd as',40),(40,'asd a',40),(41,'ewae ',40),(42,'asdasd asd ',41),(43,'1sad a',41),(44,'asd as',42),(45,'asd a',42),(46,'ewae ',42),(47,'Online , Multiple Choice Only Exam',43),(48,'Offline , written based exam',43),(49,'After the exams',44),(50,'Online , Multiple Choice Only Exam',45),(51,'Offline , written based exam',45),(52,'Combination of both online and offline examinations',45),(53,'After the exams',46),(54,'As per the original timetable',46),(55,'Before the exams',46),(56,'Online , Multiple Choice Only Exam',47),(57,'Offline , written based exam',47),(58,'After the exams',48),(59,'Online , Multiple Choice Only Exam',49),(60,'Offline , written based exam',49),(61,'Combination of both online and offline examinations',49),(62,'After the exams',50),(63,'As per the original timetable',50),(64,'Before the exams',50),(65,'asd',53),(66,'bsd',53),(67,'wasd',53);
/*!40000 ALTER TABLE `choices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drafts`
--

DROP TABLE IF EXISTS `drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drafts` (
  `iddrafts` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iddrafts`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drafts`
--

LOCK TABLES `drafts` WRITE;
/*!40000 ALTER TABLE `drafts` DISABLE KEYS */;
INSERT INTO `drafts` VALUES (4,'Online Eaminatio',1,'2013-02-08 09:53:56','Exam conduction'),(5,'VIVA date',1,'2013-02-08 09:53:56','AI course'),(6,'Passport holders',1,'2013-02-08 09:53:56','passport requirements'),(7,'Scholarship eligibility',1,'2013-02-08 09:53:56','Management Officer'),(8,'Karate lessons',1,'2013-02-08 09:53:56','extra curricular'),(32,'Testing post titel ',1,'2018-04-03 22:49:04','note'),(33,'test title ',1,'2018-04-03 22:53:48','note'),(34,'test tt ',1,'2018-04-03 22:55:05','note'),(35,'test t ',1,'2018-04-03 22:58:11','note'),(36,'test',1,'2018-04-03 23:02:42','note'),(37,'test title final',1,'2018-04-03 23:03:35','note'),(38,'test title final this time',1,'2018-04-03 23:05:47','note'),(40,'title 40404',1,'2018-04-04 12:26:36','note'),(43,'test final',1,'2018-04-05 15:38:40','note'),(44,'Mode of Conduction of Examination ',1,'2018-04-05 15:38:47','note');
/*!40000 ALTER TABLE `drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `idgroups` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idgroups`),
  UNIQUE KEY `idgroups_UNIQUE` (`idgroups`),
  UNIQUE KEY `groupname_UNIQUE` (`groupname`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='groups information';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'UG2'),(2,'UG3');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8 COMMENT='table for questions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'CHOICE','Where are you from',1),(2,'CHOICE','Why did you choose Sricity',1),(31,'CHOICE','test q 1',32),(32,'CHOICE','test q 2',32),(34,'CHOICE','q1',36),(35,'CHOICE','question 1 final test',37),(36,'CHOICE','question 2 for final test',37),(37,'CHOICE','fina question really',38),(38,'CHOICE','secpd asd quest ',38),(39,'CHOICE','asd ',39),(40,'CHOICE','asd a',39),(41,'CHOICE','asd ',40),(42,'CHOICE','asd a',40),(43,'CHOICE','What mode of examination do you prefer?',41),(44,'CHOICE','When do you want it to be conducted?',41),(45,'CHOICE','What mode of examination do you prefer?',42),(46,'CHOICE','When do you want it to be conducted?',42),(47,'CHOICE','What mode of examination do you prefer?',43),(48,'CHOICE','When do you want it to be conducted?',43),(49,'CHOICE','What mode of examination do you prefer?',44),(50,'CHOICE','When do you want it to be conducted?',44),(51,'CHOICE','What mode of examination do you prefer?',33),(52,'CHOICE','When do you want it to be conducted?',33),(53,'CHOICE','option 1 for final',45);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire`
--

DROP TABLE IF EXISTS `questionnaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questionnaire` (
  `idquestionnaire` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `running` tinyint(4) DEFAULT NULL,
  `timestamppost` datetime DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idquestionnaire`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire`
--

LOCK TABLES `questionnaire` WRITE;
/*!40000 ALTER TABLE `questionnaire` DISABLE KEYS */;
INSERT INTO `questionnaire` VALUES (2,'DBMS',1,1,'2018-05-03 11:01:50','Extra classes'),(3,'Meal Cancellation',1,1,'2018-05-03 11:03:52','Mess'),(37,'test title final',1,1,'2018-04-13 05:25:59','note'),(40,'title 40404',1,1,'2018-05-03 10:45:37','note'),(44,'Mode of Conduction of Examination ',1,1,'2018-04-13 05:25:44','note'),(45,'Test FINAL FINAL FINAL',1,0,'2018-05-03 11:05:36','note');
/*!40000 ALTER TABLE `questionnaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_user`
--

DROP TABLE IF EXISTS `questionnaire_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questionnaire_user` (
  `questionnaire_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_user`
--

LOCK TABLES `questionnaire_user` WRITE;
/*!40000 ALTER TABLE `questionnaire_user` DISABLE KEYS */;
INSERT INTO `questionnaire_user` VALUES (44,1),(37,1),(2,1),(3,1),(45,1);
/*!40000 ALTER TABLE `questionnaire_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `response`
--

DROP TABLE IF EXISTS `response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `response` (
  `idresponse` int(11) NOT NULL AUTO_INCREMENT,
  `response` varchar(45) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idresponse`),
  UNIQUE KEY `idresponse_UNIQUE` (`idresponse`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `response`
--

LOCK TABLES `response` WRITE;
/*!40000 ALTER TABLE `response` DISABLE KEYS */;
INSERT INTO `response` VALUES (1,'64',50,1),(2,'60',49,1),(3,'30',35,1),(4,'64',50,2),(5,'65',53,2),(6,'66',53,1),(7,'67',53,3);
/*!40000 ALTER TABLE `response` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT 'unassigned',
  `phone_no` varchar(45) DEFAULT 'unassigned',
  `image_id` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `idUser_UNIQUE` (`idUser`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `phone_no_UNIQUE` (`phone_no`),
  UNIQUE KEY `image_id_UNIQUE` (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Stores Data regarding user';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'crespoter','7356240465','1','blantest');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_group` (
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User Group Relationship	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
INSERT INTO `user_group` VALUES (1,1);
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-03 11:21:20
