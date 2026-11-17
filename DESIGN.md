# DESIGN.md: Lukman Store

## Design Read
Toko akun game dan jasa untuk gamer Indonesia, gaya tegas dan langsung.
Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.

## Palet
- Ink `#191d21` (teks dan tombol sekunder)
- Putih `#ffffff` (dasar)
- Muted `#55606a` (teks sekunder)
- Garis `#e2e6e9` (pemisah)
- Aksen merah QRIS `#c8102e` (satu-satunya aksen)

Alasan tiap warna (R-31):
- Merah diambil dari stand QRIS, identitas pembayaran toko ini. Dipakai hanya di momen kunci: tombol utama, harga yang perlu menonjol, dan garis atas kartu QR.
- Tidak ada biru di mana pun. Lukman melarang penyebutan DANA, dan biru terbaca sebagai DANA.
- Palet dibatasi 2 warna inti + 1 aksen (R-29).

## Tipografi
System sans saja, tanpa webfont. Alasan: situs harus ringan dan cepat di HP.
Judul tebal 800 dengan leading rapat. Tanpa label huruf besar berjarak lebar,
tanpa em dash, tanpa pemisah titik tengah.

## Radius
Kartu 10px, tombol/input/chip 8px. Tidak ada bentuk pil di mana pun.
Alasan: pil di semua elemen adalah default AI (R-11).

## Komposisi (RHYTHM 2)
Tiap bagian beda bentuk, bukan judul tengah + grid kartu yang sama:
- Hero: dua kolom (teks kiri, kartu QR kanan)
- Akun: grid kartu
- Jasa: daftar beraturan garis, bukan kartu
- Cara Pesan: daftar bernomor polos
- Bayar: dua kolom (langkah kiri, kartu QR kanan)
- Tentang: dua kolom (teks dan kartu info)

## Motif identitas
Kartu QR: kartu putih, garis atas merah, kode QR, nama toko, NMID.
Muncul dua kali (hero dan bagian bayar) sebagai penanda toko ini.

## Motion
MOTION 1: hanya hover. Tanpa animasi scroll, tanpa fade-in.
