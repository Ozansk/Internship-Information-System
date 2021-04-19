-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 20 Mar 2021, 13:04:48
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
-- Tablo için tablo yapısı `internship_list`
--

CREATE TABLE `internship_list` (
  `internshipID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `company` varchar(127) NOT NULL,
  `work_day` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `confirmation` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `internship_list`
--

INSERT INTO `internship_list` (`internshipID`, `studentID`, `company`, `work_day`, `start_date`, `end_date`, `confirmation`) VALUES
(1, 4, '   HAVELSAN   ', 20, '2020-07-06', '2020-08-06', 1),
(16, 9290058, ' ASELSAN ', 20, '2021-06-01', '2021-06-28', 1),
(17, 9290060, 'HAVELSAN', 20, '2020-07-06', '2020-08-06', 0),
(18, 9290060, 'ASELSAN', 20, '2020-07-06', '2020-08-06', 0);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `internship_list`
--
ALTER TABLE `internship_list`
  ADD PRIMARY KEY (`internshipID`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `internship_list`
--
ALTER TABLE `internship_list`
  MODIFY `internshipID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
