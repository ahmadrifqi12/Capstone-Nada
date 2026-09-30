import type { Collection } from "./types";

export const collections: Collection[] = [
  {
    slug: "senja-di-pesisir",
    name: "Senja di Pesisir",
    tagline: "Warna-warna sore hari di tepi laut, dalam bahan yang jatuh ringan.",
    launch: "2026-09-05",
    tone: "#c9b08f",
    storyTitle: "Sore hari yang tidak terburu-buru",
    story: [
      {
        body: "Koleksi ini lahir dari satu perjalanan singkat ke pesisir utara Jawa. Bukan liburan panjang — hanya beberapa hari, dengan angin yang membawa bau garam dan langit yang berubah warna sedikit demi sedikit menjelang magrib.",
      },
      {
        heading: "Warna yang dipinjam dari langit",
        body: "Kami mencatat warna yang muncul di sela-sela waktu ashar hingga magrib: krem pasir, terakota tipis, hijau zaitun, dan abu batu. Tidak ada yang mencolok. Semuanya dipilih agar nyaman dipadukan satu sama lain, dan tetap tenang di foto maupun di kehidupan nyata.",
      },
      {
        heading: "Potongan yang memberi ruang bergerak",
        body: "Setiap siluet dirancang longgar di tempat yang perlu longgar. Lengan cukup panjang untuk menutup pergelangan tanpa menyulitkan wudu, dan bagian belakang sedikit lebih panjang agar tetap terjaga saat duduk maupun bersujud.",
      },
      {
        heading: "Bahan yang jatuh, bukan menempel",
        body: "Kami memakai ceruty babydoll dan linen rayon yang dicuci sebelum dijahit. Hasilnya lembut sejak pemakaian pertama, dan tidak mudah menerawang meski dipakai di bawah terik.",
      },
    ],
    details: [
      { label: "Bahan", value: "Ceruty babydoll, linen rayon" },
      { label: "Palet", value: "Krem pasir, terakota, zaitun, abu batu" },
      { label: "Produksi", value: "Penjahit rumahan di Bandung, batch kecil" },
    ],
  },
  {
    slug: "kebun-pagi",
    name: "Kebun Pagi",
    tagline: "Lapisan ringan untuk hari-hari yang dimulai lebih awal.",
    launch: "2026-06-12",
    tone: "#a8ad8c",
    storyTitle: "Dimulai sebelum matahari tinggi",
    story: [
      {
        body: "Kebun Pagi dibuat untuk perempuan yang harinya dimulai sebelum subuh berakhir — menyiram tanaman, menyiapkan sarapan, atau berangkat kerja dengan angkutan pertama.",
      },
      {
        heading: "Berlapis, tapi tidak berat",
        body: "Outer tipis, set dua potong, dan khimar dua lapis yang bisa dipakai bergantian. Tujuannya sederhana: satu lemari kecil yang bisa dipadukan tanpa berpikir panjang.",
      },
      {
        heading: "Sedikit, tapi dipakai lama",
        body: "Kami memproduksi dalam jumlah kecil dan tidak memaksakan pergantian musim yang cepat. Jika satu model habis, ia akan kembali hanya bila memang layak dibuat ulang.",
      },
    ],
    details: [
      { label: "Bahan", value: "Katun poplin, crinkle airflow" },
      { label: "Palet", value: "Hijau sage, putih tulang, cokelat susu" },
      { label: "Produksi", value: "Konveksi kecil di Bandung" },
    ],
  },
];

export const latestCollection = () =>
  [...collections].sort((a, b) => b.launch.localeCompare(a.launch))[0];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
