CREATE TABLE IF NOT EXISTS `vehicle_neon` (
  `plate` varchar(20) NOT NULL,
  `has_neon` int(11) DEFAULT 0,
  PRIMARY KEY (`plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;