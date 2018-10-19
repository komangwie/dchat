-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2018 at 09:14 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dchat`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uname` varchar(255) NOT NULL,
  `pword` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `usergroup` varchar(2) DEFAULT NULL,
  `status` char(1) DEFAULT '0',
  `tanggal` int(11) DEFAULT NULL,
  `kodeaktivasi` varchar(32) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `pkey` varchar(255) DEFAULT NULL,
  `dom_id` varchar(50) DEFAULT NULL,
  `chat_allow` enum('y','n') NOT NULL DEFAULT 'n'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uname`, `pword`, `email`, `usergroup`, `status`, `tanggal`, `kodeaktivasi`, `name`, `photo`, `pkey`, `dom_id`, `chat_allow`) VALUES
('adit', '123456', NULL, '12', '0', NULL, NULL, 'Aditya Anggara', NULL, NULL, NULL, 'n'),
('bhaskara', '123456', 'bhaskara@gmail.com', '21', '0', NULL, NULL, 'I Wayan Bhaskara Budhiyoga', NULL, NULL, NULL, 'n'),
('mangwi', '123456', 'wiratmajaya62@gmail.com', '12', '0', NULL, NULL, 'I Nyoman Wiratma Jaya', NULL, NULL, NULL, 'n'),
('riky', '123456', 'riki@gmail.com', '21', '0', NULL, NULL, 'Riky Mahendra', NULL, NULL, NULL, 'n'),
('santa', '123456', 'santayana16@gmail.com', '12', '0', NULL, NULL, 'I Made Santa Yana', NULL, NULL, NULL, 'n'),
('tari', '123456', 'ari@gmail.com', '12', '0', NULL, NULL, 'Ni Md Widyantari', NULL, NULL, NULL, 'n'),
('yasa', '123456', 'yasautama16@gmail.com', '21', '0', NULL, NULL, 'I Putu Yasa Utama', NULL, NULL, NULL, 'n'),
('yogi', '123456', 'yogiprasetya17@gmail.com', '21', '0', NULL, NULL, 'I Ketut Yogi Prasetya', NULL, NULL, NULL, 'n');

-- --------------------------------------------------------

--
-- Table structure for table `user_group`
--

CREATE TABLE `user_group` (
  `id` char(2) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `table_relation` varchar(255) DEFAULT NULL,
  `pkey_relation` varchar(255) DEFAULT NULL,
  `alarm_pasien_baru` enum('y','n') DEFAULT 'n' COMMENT 'Untuk menghidupkan alarm pemberitahuan pasien baru dicek atau tidak'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_group`
--

INSERT INTO `user_group` (`id`, `name`, `table_relation`, `pkey_relation`, `alarm_pasien_baru`) VALUES
('12', 'Kasir', 'z_pegawai', 'peg_id', 'n'),
('21', 'Apotek', 'z_pegawai', 'peg_id', 'n');

-- --------------------------------------------------------

--
-- Table structure for table `z_chat_group`
--

CREATE TABLE `z_chat_group` (
  `cg_id` int(5) NOT NULL,
  `cg_uname` varchar(255) NOT NULL,
  `cg_pesan` text NOT NULL,
  `cg_gambar` varchar(255) DEFAULT NULL,
  `cg_tanggal` datetime(6) NOT NULL,
  `cg_gc_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `z_chat_group`
--

INSERT INTO `z_chat_group` (`cg_id`, `cg_uname`, `cg_pesan`, `cg_gambar`, `cg_tanggal`, `cg_gc_id`) VALUES
(1, 'yogi', 'Tess', NULL, '2018-10-05 08:58:20.000000', 6),
(2, 'yogi', 'Tess', NULL, '2018-10-05 08:58:20.000000', 6),
(3, 'yogi', 'Ggh', 'images/group_chat/6/chat/213375170_1538722737.png', '2018-10-05 08:58:57.000000', 6),
(4, 'yogi', '', 'images/group_chat/6/chat/1445284384_1538722761.png', '2018-10-05 08:59:21.000000', 6),
(5, 'yogi', 'Weee', 'images/group_chat/7/chat/1311683671_1538722812.png', '2018-10-05 09:00:12.000000', 7),
(6, 'bhaskara', 'Ape ne ?', NULL, '2018-10-05 09:12:04.000000', 6),
(7, 'bhaskara', 'Ne nake tolih', 'images/group_chat/6/chat/1163503999_1538723541.png', '2018-10-05 09:12:21.000000', 6),
(8, 'bhaskara', 'P', NULL, '2018-10-05 11:18:13.000000', 9),
(9, 'bhaskara', 'P', NULL, '2018-10-05 11:24:42.000000', 6),
(10, 'bhaskara', '', 'images/group_chat/6/chat/1422428968_1538731499.png', '2018-10-05 11:24:59.000000', 6),
(11, 'bhaskara', 'We ?', NULL, '2018-10-05 11:28:06.000000', 9),
(12, 'mangwi', 'mngwi', NULL, '2018-10-05 11:32:15.000000', 6),
(13, 'bhaskara', 'Apo ?', NULL, '2018-10-05 11:32:29.000000', 6),
(14, 'mangwi', '', 'images/group_chat/6/chat/1616061679_1538731983.png', '2018-10-05 11:33:03.000000', 6),
(15, 'bhaskara', 'Wwere ertree fggeerty ggdfg yhgg bbbgg vvgfc vgyyt tuuiyygv gghhhuu', NULL, '2018-10-05 11:54:42.000000', 6),
(16, 'santa', 'Yuk, kerahkan tenaga teman-teman, dan salurkan bantuan melalui transfer:\nNo.Rek : 0719366562 (BNI) a.n Cikal Farah Irian Jati Saweng\nKonfirmasi ke narahubung Ciki (LINE messenger) cikalfarah\n\nSemoga dengan adanya bantuan dari kita semua, dapat bermanfaat bagi saudara kita di Palu, Donggala, sekitarnya, dan mempercepat pulihnya kondisi di daerah tersebut.', 'images/group_chat/8/chat/522054274_1538733641.png', '2018-10-05 12:00:41.000000', 8),
(17, 'riky', '', 'images/group_chat/6/chat/1244507890_1538733785.png', '2018-10-05 12:03:05.000000', 6),
(18, 'riky', 'Haloo ? Selamat bergabung di grup ini ya', NULL, '2018-10-05 12:24:10.000000', 15),
(19, 'riky', 'Tes', NULL, '2018-10-06 09:39:49.000000', 6),
(20, 'riky', 'G', NULL, '2018-10-06 09:39:57.000000', 6),
(21, 'riky', 'Ne kodingan baru', 'images/group_chat/6/chat/2101216938_1538972007.png', '2018-10-08 06:13:27.000000', 6),
(22, 'riky', 'Tess', NULL, '0000-00-00 00:00:00.000000', 11),
(23, 'riky', 'Tess lagee', NULL, '0000-00-00 00:00:00.000000', 11),
(24, 'riky', 'Tesss', NULL, '0000-00-00 00:00:00.000000', 7);

-- --------------------------------------------------------

--
-- Table structure for table `z_chat_private`
--

CREATE TABLE `z_chat_private` (
  `cp_id` int(5) NOT NULL,
  `cp_uname` varchar(255) DEFAULT NULL,
  `cp_tujuan` varchar(255) DEFAULT NULL,
  `cp_pesan` text,
  `cp_gambar` varchar(255) DEFAULT NULL,
  `cp_tanggal` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `z_chat_private`
--

INSERT INTO `z_chat_private` (`cp_id`, `cp_uname`, `cp_tujuan`, `cp_pesan`, `cp_gambar`, `cp_tanggal`) VALUES
(17, 'mangwi', 'santa', 'P', NULL, '0000-00-00 00:00:00.000000'),
(18, 'mangwi', 'santa', '', 'images/private_msg/406416010_1538636578.png', '0000-00-00 00:00:00.000000'),
(19, 'mangwi', 'santa', '[REPOST KSATRIA MUDA UDAYANA]\n[CALLING FOR HUMANITY]\n\nSehubungan dengan terjadinya bencana alam gempa bumi dan tsunami di Palu, Donggala, dan sekitarnya yang hingga kini telah banyak menelan korban jiwa. Bahkan, akibat bencana ini warga yang selamat berbondong-bondong mengungsi, dan pasien-pasien RS terpaksa harus dirawat di luar.', NULL, '0000-00-00 00:00:00.000000'),
(20, 'yogi', 'mangwi', 'Weee ?', NULL, '0000-00-00 00:00:00.000000'),
(21, 'yogi', 'riky', 'Kyy ?', NULL, '0000-00-00 00:00:00.000000'),
(23, 'yogi', 'riky', 'Hgg', NULL, '0000-00-00 00:00:00.000000'),
(24, 'yogi', 'riky', 'Tess', 'images/private_msg/2039668812_1538665921.png', '0000-00-00 00:00:00.000000'),
(25, 'yogi', 'riky', 'P', 'images/private_msg/420885103_1538665948.png', '0000-00-00 00:00:00.000000'),
(26, 'yogi', 'riky', '', 'images/private_msg/1706131893_1538665948.png', '0000-00-00 00:00:00.000000'),
(27, 'yogi', 'riky', 'Tesss', NULL, '0000-00-00 00:00:00.000000'),
(28, 'yogi', 'riky', 'P', NULL, '0000-00-00 00:00:00.000000'),
(29, 'yogi', 'riky', '', 'images/private_msg/406935787_1538666053.png', '0000-00-00 00:00:00.000000'),
(30, 'yogi', 'riky', 'Gd', 'images/private_msg/521538002_1538666058.png', '0000-00-00 00:00:00.000000'),
(31, 'yogi', 'mangwi', 'Gg', 'images/private_msg/968983415_1538666159.png', '0000-00-00 00:00:00.000000'),
(32, 'yogi', 'mangwi', 'Csgshs ', NULL, '0000-00-00 00:00:00.000000'),
(33, 'yogi', 'mangwi', 'P', NULL, '0000-00-00 00:00:00.000000'),
(34, 'riky', 'mangwi', 'P', NULL, '0000-00-00 00:00:00.000000'),
(35, 'riky', 'adit', 'Dit ?', NULL, '0000-00-00 00:00:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `z_group_chat`
--

CREATE TABLE `z_group_chat` (
  `gc_id` int(5) NOT NULL,
  `gc_uname` varchar(30) NOT NULL,
  `gc_name` varchar(255) NOT NULL,
  `gc_gambar` varchar(255) DEFAULT NULL,
  `gc_tanggal` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `z_group_chat`
--

INSERT INTO `z_group_chat` (`gc_id`, `gc_uname`, `gc_name`, `gc_gambar`, `gc_tanggal`) VALUES
(6, 'yogi', 'Access', 'images/group_chat/6/profiles/2032830569_1538913953.png', '2018-10-04 13:47:17.000000'),
(7, 'yogi', 'Solid Team', 'images/group_chat/7/profiles/1157231416_1538653692.png', '2018-10-04 13:48:12.000000'),
(8, 'yogi', 'Tea grup', NULL, '2018-10-04 16:27:25.000000'),
(9, 'yogi', 'Hacker', 'images/group_chat/9/profiles/1831746722_1538663281.png', '2018-10-04 16:28:01.000000'),
(10, 'yogi', 'random group', NULL, '2018-10-04 16:30:34.000000'),
(11, 'yogi', 'Pkl', 'images/group_chat/11/profiles/1214180396_1538742568.png', '2018-10-04 16:31:08.000000'),
(12, 'yogi', 'Grup kece', 'images/group_chat/12/profiles/1069634441_1538663928.png', '2018-10-04 16:38:47.000000'),
(13, 'yogi', 'Ini tess', NULL, '2018-10-04 16:39:43.000000'),
(14, 'yogi', 'Tes terakhir', NULL, '2018-10-04 16:41:20.000000'),
(15, 'bhaskara', 'RS Bongaya', 'images/group_chat/15/profiles/836516629_1538731836.png', '2018-10-05 11:30:36.000000'),
(16, 'riky', 'Pkl Djingga Media', 'images/group_chat/16/profiles/1525858000_1538971583.png', '2018-10-08 06:06:23.000000');

-- --------------------------------------------------------

--
-- Table structure for table `z_user_group`
--

CREATE TABLE `z_user_group` (
  `ug_id` int(10) NOT NULL,
  `ug_uname` varchar(30) NOT NULL,
  `ug_gc_id` int(5) NOT NULL,
  `ug_status` enum('anggota','admin') NOT NULL DEFAULT 'anggota'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `z_user_group`
--

INSERT INTO `z_user_group` (`ug_id`, `ug_uname`, `ug_gc_id`, `ug_status`) VALUES
(7, 'riky', 6, 'anggota'),
(11, 'yogi', 6, 'admin'),
(12, 'yasa', 7, 'anggota'),
(13, 'riky', 7, 'anggota'),
(14, 'adit', 7, 'anggota'),
(15, 'mangwi', 7, 'anggota'),
(16, 'tari', 7, 'anggota'),
(17, 'yogi', 7, 'admin'),
(18, 'adit', 8, 'anggota'),
(19, 'yasa', 8, 'anggota'),
(20, 'mangwi', 8, 'anggota'),
(21, 'santa', 8, 'anggota'),
(22, 'yogi', 8, 'admin'),
(23, 'bhaskara', 9, 'anggota'),
(24, 'adit', 9, 'anggota'),
(25, 'mangwi', 9, 'anggota'),
(26, 'yogi', 9, 'admin'),
(27, 'riky', 10, 'anggota'),
(28, 'adit', 10, 'anggota'),
(29, 'mangwi', 10, 'anggota'),
(30, 'tari', 10, 'anggota'),
(31, 'santa', 10, 'anggota'),
(32, 'yasa', 10, 'anggota'),
(33, 'yogi', 10, 'admin'),
(34, 'yasa', 11, 'anggota'),
(35, 'riky', 11, 'anggota'),
(36, 'bhaskara', 11, 'anggota'),
(37, 'adit', 11, 'anggota'),
(38, 'mangwi', 11, 'anggota'),
(39, 'yogi', 11, 'admin'),
(40, 'bhaskara', 12, 'anggota'),
(41, 'riky', 12, 'anggota'),
(42, 'yogi', 12, 'admin'),
(43, 'bhaskara', 13, 'anggota'),
(44, 'riky', 13, 'anggota'),
(45, 'yogi', 13, 'admin'),
(46, 'yasa', 14, 'anggota'),
(47, 'riky', 14, 'anggota'),
(48, 'yogi', 14, 'admin'),
(49, 'riky', 15, 'anggota'),
(50, 'yasa', 15, 'anggota'),
(51, 'yogi', 15, 'anggota'),
(52, 'mangwi', 15, 'anggota'),
(53, 'tari', 15, 'anggota'),
(54, 'bhaskara', 15, 'admin'),
(60, 'bhaskara', 16, 'anggota'),
(61, 'yogi', 16, 'anggota'),
(62, 'mangwi', 16, 'anggota'),
(63, 'riky', 16, 'admin'),
(64, 'yasa', 6, 'anggota'),
(65, 'adit', 6, 'anggota'),
(66, 'santa', 6, 'anggota'),
(67, 'mangwi', 6, 'anggota');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uname`),
  ADD KEY `FK_user` (`usergroup`);

--
-- Indexes for table `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `z_chat_group`
--
ALTER TABLE `z_chat_group`
  ADD PRIMARY KEY (`cg_id`);

--
-- Indexes for table `z_chat_private`
--
ALTER TABLE `z_chat_private`
  ADD PRIMARY KEY (`cp_id`),
  ADD KEY `p_msg_uname` (`cp_uname`),
  ADD KEY `p_msg_tujuan` (`cp_tujuan`);

--
-- Indexes for table `z_group_chat`
--
ALTER TABLE `z_group_chat`
  ADD PRIMARY KEY (`gc_id`);

--
-- Indexes for table `z_user_group`
--
ALTER TABLE `z_user_group`
  ADD PRIMARY KEY (`ug_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `z_chat_group`
--
ALTER TABLE `z_chat_group`
  MODIFY `cg_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `z_chat_private`
--
ALTER TABLE `z_chat_private`
  MODIFY `cp_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `z_group_chat`
--
ALTER TABLE `z_group_chat`
  MODIFY `gc_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `z_user_group`
--
ALTER TABLE `z_user_group`
  MODIFY `ug_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_user` FOREIGN KEY (`usergroup`) REFERENCES `user_group` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `z_chat_private`
--
ALTER TABLE `z_chat_private`
  ADD CONSTRAINT `z_chat_private_ibfk_1` FOREIGN KEY (`cp_uname`) REFERENCES `user` (`uname`) ON UPDATE CASCADE,
  ADD CONSTRAINT `z_chat_private_ibfk_2` FOREIGN KEY (`cp_tujuan`) REFERENCES `user` (`uname`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
