-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 19 Haz 2021, 15:38:43
-- Sunucu sürümü: 10.4.8-MariaDB
-- PHP Sürümü: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `internship_system`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `holiday_list`
--

CREATE TABLE `holiday_list` (
  `holiday_date` date NOT NULL,
  `holiday_reason` varchar(63) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `holiday_list`
--

INSERT INTO `holiday_list` (`holiday_date`, `holiday_reason`) VALUES
('2021-01-01', NULL),
('2021-04-23', NULL),
('2021-05-01', NULL),
('2021-05-19', NULL),
('2021-07-15', NULL),
('2021-08-30', NULL),
('2021-10-29', NULL);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `holiday_list`
--
ALTER TABLE `holiday_list`
  ADD PRIMARY KEY (`holiday_date`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
