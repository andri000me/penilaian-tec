-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 02 Agu 2018 pada 23.09
-- Versi server: 5.7.22-0ubuntu18.04.1
-- Versi PHP: 7.2.7-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `penilaian`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `score`
--

CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `uidFrom` int(11) NOT NULL,
  `uidTo` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `scoringCategory`
--

CREATE TABLE `scoringCategory` (
  `id` int(11) NOT NULL,
  `targetType` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `scoringCategory`
--

INSERT INTO `scoringCategory` (`id`, `targetType`, `name`, `description`) VALUES
(1, 1, 'Tugas Bukang', 'Buku angkatan digital yang keren'),
(2, 1, 'Review biscal 1', 'Review materi biscal tentang The Lean Startup');

-- --------------------------------------------------------

--
-- Struktur dari tabel `scoringItem`
--

CREATE TABLE `scoringItem` (
  `id` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `scoringItem`
--

INSERT INTO `scoringItem` (`id`, `category`, `name`) VALUES
(1, 1, 'Jumlah'),
(2, 1, 'Keniatan'),
(3, 2, 'Panjang'),
(4, 2, 'Menarik');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `score`
--
ALTER TABLE `score`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indeks untuk tabel `scoringCategory`
--
ALTER TABLE `scoringCategory`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `scoringItem`
--
ALTER TABLE `scoringItem`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `scoringCategory`
--
ALTER TABLE `scoringCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `scoringItem`
--
ALTER TABLE `scoringItem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
