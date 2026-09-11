-- Database Schema for Farmer Decision Support System
CREATE DATABASE IF NOT EXISTS `farmer-db`;
USE `farmer-db`;

-- Farmer (Users) Table
CREATE TABLE IF NOT EXISTS `farmer` (
    `Farmer-ID` INT AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL UNIQUE,
    `Contact No` VARCHAR(50),
    `Address` VARCHAR(255),
    `Password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farm Input Conditions Table
CREATE TABLE IF NOT EXISTS `farm_input` (
    `Input_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_ID` INT NOT NULL,
    `Temperature` VARCHAR(50),
    `Soil_Condition` VARCHAR(100),
    `Crop_Type` VARCHAR(100),
    `Weather` VARCHAR(100),
    `Date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_ID`) REFERENCES `farmer`(`Farmer-ID`) ON DELETE CASCADE
);

-- Recommendation Table
CREATE TABLE IF NOT EXISTS `recommendation` (
    `Recommendation_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_ID` INT NOT NULL,
    `Input_ID` INT NOT NULL,
    `Watering_Advice` TEXT,
    `Crop_Recommendation` TEXT,
    `Pest_Advice` TEXT,
    `Animal_Protection_Advice` TEXT,
    `Alert_Message` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_ID`) REFERENCES `farmer`(`Farmer-ID`) ON DELETE CASCADE,
    FOREIGN KEY (`Input_ID`) REFERENCES `farm_input`(`Input_ID`) ON DELETE CASCADE
);
