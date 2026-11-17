# Lukman Store: toko akun game dan jasa, pembayaran QRIS

Situs statis (HTML + CSS + JS vanilla, tanpa framework, tanpa font eksternal).
Live di Vercel, project `lukman-store`. Arah desain: `DESIGN.md`.

## File
- `index.html`: struktur + konten toko
- `styles.css`: semua gaya
- `app.js`: **data produk + nomor WhatsApp + keranjang** (satu-satunya file yang perlu diedit)
- `qris-qr.jpg`: kode QRIS resmi Lukman Store (NMID ID1025424954085), crop dari cetakan A5
- `vercel.json`: security headers

## Yang harus diisi (2 menit)
1. **Nomor WhatsApp toko**, sudah diisi: 085156084217 (nomor kedua, khusus store).
   Ada di `app.js`, `waNumber: "6285156084217"`.
2. **Akun game**, ubah/tambah/hapus entri di array `PRODUCTS` di `app.js`
   (nama, game, spesifikasi, harga; stok selalu 1 karena tiap akun unik).
   Foto/screenshot akun: tambahkan field `img: "nama-file.jpg"` lalu letakkan
   file gambarnya di folder ini.
3. **Jasa**, 7 jasa ada di `index.html`, bagian `#jasa` (joki rank MLBB
   + 6 jasa website). Ubah daftar/isi jasanya di sana; harga ditanyakan via
   WhatsApp (tanpa harga tetap).

## Deploy ulang setelah edit
Edit file di folder ini, lalu deploy ulang ke Vercel (project `lukman-store`,
target production), file yang sama, deployment baru.

## Verifikasi bisnis
Screenshot halaman ini (beranda + bagian Bayar QRIS + daftar produk) bisa
dipakai sebagai bukti usaha: nama toko, NMID, kode QRIS, daftar produk +
stok, dan cara pemesanan, semua terlihat di satu situs.

## Catatan penulisan
Situs ini tidak menyebut penyedia pembayaran apa pun, hanya "QRIS".
Jangan tambahkan nama penyedia ke copy situs.
