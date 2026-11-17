/* Lukman Store: data dan keranjang. Satu-satunya yang perlu diisi: WA_NUMBER di bawah.
   Produk: ubah/tambah/hapus entri di PRODUCTS. Foto produk: tambahkan field `img`
   berisi nama file gambar (mis. "produk/akun-1.jpg") lalu letakkan file itu di folder
   yang sama dengan index.html. Tanpa `img`, kartu tampil tanpa foto. */
"use strict";

var CONFIG = {
  storeName: "Lukman Store",
  nmid: "ID1025424954085",
  /* Nomor WhatsApp toko (nomor kedua, khusus store), 085156084217 */
  waNumber: "6285156084217",
};

var PRODUCTS = [
  { id: "coc-th13",    name: "Akun Clash of Clans (TH 13)",      cat: "coc",     unit: "Hero Max, 5 Builder",            price: 450000,  stock: 1, tag: "Terlaris" },
  { id: "coc-th11",    name: "Akun Clash of Clans (TH 11)",      cat: "coc",     unit: "Hero 40+, 4 Builder",            price: 250000,  stock: 1, tag: "" },
  { id: "coc-th16",    name: "Akun Clash of Clans (TH 16)",      cat: "coc",     unit: "Max, Skin Hero",                 price: 1250000, stock: 1, tag: "Sultan" },
  { id: "ml-mythic",   name: "Akun Mobile Legends (Mythic)",     cat: "ml",      unit: "120 Skin, 30 Hero",              price: 850000,  stock: 1, tag: "Terlaris" },
  { id: "ml-legend",   name: "Akun Mobile Legends (Legend)",     cat: "ml",      unit: "45 Skin, 20 Hero",               price: 350000,  stock: 1, tag: "" },
  { id: "ml-epic",     name: "Akun Mobile Legends (Epic)",       cat: "ml",      unit: "20 Skin, 15 Hero",               price: 150000,  stock: 1, tag: "" },
  { id: "ml-glory",    name: "Akun Mobile Legends (Mythical Glory)", cat: "ml", unit: "200 Skin, Kolektor",             price: 1500000, stock: 1, tag: "Kolektor" },
  { id: "pubg-conq",   name: "Akun PUBG Mobile (Conqueror)",     cat: "pubg",    unit: "Mythic Set, 3 X-Suit",            price: 950000,  stock: 1, tag: "" },
  { id: "ff-heroic",   name: "Akun Free Fire (Heroic)",           cat: "ff",      unit: "Bundle Langka, 40+ Emote",        price: 400000,  stock: 1, tag: "" },
  { id: "genshin-ar55", name: "Akun Genshin Impact (AR 55)",     cat: "genshin", unit: "5 Karakter B5, 12 Senjata B5",     price: 750000,  stock: 1, tag: "" },
];

var CAT_LABEL = { coc: "Clash of Clans", ml: "Mobile Legends", pubg: "PUBG Mobile", ff: "Free Fire", genshin: "Genshin Impact" };

var cart = {};
try { cart = JSON.parse(localStorage.getItem("ls-cart") || "{}"); } catch (e) { cart = {}; }
var activeFilter = "semua";
var query = "";

function rupiah(n) { return "Rp" + n.toLocaleString("id-ID"); }
function $(id) { return document.getElementById(id); }
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function renderProducts() {
  var grid = $("productGrid");
  var list = PRODUCTS.filter(function (p) {
    var okCat = activeFilter === "semua" || p.cat === activeFilter;
    var okQ = !query || (p.name + " " + CAT_LABEL[p.cat]).toLowerCase().indexOf(query) !== -1;
    return okCat && okQ;
  });
  $("resultsNote").textContent = list.length
    ? "Menampilkan " + list.length + " dari " + PRODUCTS.length + " akun."
    : "Tidak ada akun yang cocok. Coba kata kunci lain.";
  grid.innerHTML = list.map(function (p) {
    var inCart = cart[p.id] || 0;
    var stockCls = p.stock <= 5 ? "low" : "ok";
    var stockTxt = p.stock === 1 ? "Hanya 1 akun. Siapa cepat dia dapat." : (p.stock <= 5 ? "Stok menipis: tinggal " + p.stock : "Stok tersedia: " + p.stock);
    var photo = p.img
      ? '<img class="product-photo" src="' + esc(p.img) + '" alt="Foto ' + esc(p.name) + '" loading="lazy">'
      : "";
    return '<article class="product-card">' + photo +
      '<p class="product-game">' + CAT_LABEL[p.cat] + '</p>' +
      (p.tag ? '<span class="product-tag">' + esc(p.tag) + '</span>' : "") +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p class="product-unit">' + esc(p.unit) + '</p>' +
      '<p class="product-price">' + rupiah(p.price) + '</p>' +
      '<p class="product-stock ' + stockCls + '">' + stockTxt + '</p>' +
      '<button type="button" class="product-add' + (inCart ? " added" : "") + '" data-add="' + esc(p.id) + '"' + (inCart ? " disabled" : "") + '>' +
      (inCart ? "Di Keranjang ✓" : "Tambah ke Keranjang") + '</button>' +
      '</article>';
  }).join("");
}

/* Showcase hero: 3 akun termahal (otomatis mengikuti PRODUCTS). */
function renderShowcase() {
  var el = $("heroShowcase");
  if (!el) return;
  var top = PRODUCTS.slice().sort(function (a, b) { return b.price - a.price; }).slice(0, 3);
  el.innerHTML = top.map(function (p, i) {
    var inCart = cart[p.id] || 0;
    return '<article class="show-card sc-' + (i + 1) + '">' +
      '<p class="product-game">' + CAT_LABEL[p.cat] + '</p>' +
      (p.tag ? '<span class="product-tag">' + esc(p.tag) + '</span>' : "") +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p class="product-unit">' + esc(p.unit) + '</p>' +
      '<p class="product-price">' + rupiah(p.price) + '</p>' +
      '<button type="button" class="product-add' + (inCart ? " added" : "") + '" data-add="' + esc(p.id) + '"' + (inCart ? " disabled" : "") + '>' +
      (inCart ? "Di Keranjang ✓" : "Tambah ke Keranjang") + '</button>' +
      '</article>';
  }).join("");
}

function saveCart() { try { localStorage.setItem("ls-cart", JSON.stringify(cart)); } catch (e) {} }

function cartCount() {
  var n = 0;
  Object.keys(cart).forEach(function (id) { n += cart[id]; });
  return n;
}
function cartTotal() {
  var t = 0;
  Object.keys(cart).forEach(function (id) {
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (p) t += p.price * cart[id];
  });
  return t;
}

function renderCart() {
  $("cartCount").textContent = cartCount();
  var body = $("cartBody");
  var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
  if (!ids.length) {
    body.innerHTML = '<p class="cart-empty">Keranjang masih kosong.<br>Pilih akun di atas, lalu kembali ke sini.</p>';
  } else {
    body.innerHTML = ids.map(function (id) {
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      if (!p) return "";
      return '<div class="cart-item"><h3>' + esc(p.name) + '</h3>' +
        '<p class="ci-price">' + rupiah(p.price) + ' / ' + esc(p.unit) + '</p>' +
        '<button type="button" class="ci-remove" data-remove="' + esc(p.id) + '" aria-label="Hapus ' + esc(p.name) + ' dari keranjang">Hapus</button>' +
        '<span class="ci-subtotal">' + rupiah(p.price * cart[id]) + '</span></div>';
    }).join("");
  }
  $("cartTotal").textContent = rupiah(cartTotal());
  var note = $("cartNote");
  if (!CONFIG.waNumber) {
    note.textContent = "Checkout WhatsApp aktif setelah nomor toko diisi di app.js (WA_NUMBER). Sementara itu, pesanan bisa disalin dengan tombol di bawah.";
    note.classList.add("warn");
  } else {
    note.textContent = "Total sudah final, tidak ada ongkir (produk digital). Data akun dikirim setelah pembayaran terkonfirmasi.";
    note.classList.remove("warn");
  }
}

function orderText() {
  var lines = ["Halo " + CONFIG.storeName + ", saya mau pesan:"];
  Object.keys(cart).filter(function (id) { return cart[id] > 0; }).forEach(function (id) {
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (p) lines.push("- " + p.name + " (" + p.unit + ") x" + cart[id] + " = " + rupiah(p.price * cart[id]));
  });
  lines.push("Total: " + rupiah(cartTotal()));
  lines.push("Pembayaran: QRIS (" + CONFIG.nmid + ")");
  return lines.join("\n");
}

function openCart() {
  renderCart();
  $("cartDrawer").hidden = false;
  $("cartOverlay").hidden = false;
  document.body.style.overflow = "hidden";
  $("cartClose").focus();
}
function closeCart() {
  $("cartDrawer").hidden = true;
  $("cartOverlay").hidden = true;
  document.body.style.overflow = "";
}

function closeMenu() {
  var nav = $("mainNav"), btn = $("menuBtn");
  nav.classList.remove("is-open");
  btn.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", function (e) {
  var add = e.target.closest("[data-add]");
  if (add) {
    var id = add.getAttribute("data-add");
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (p && !cart[id]) cart[id] = 1; /* tiap akun unik, stok 1: tidak ada qty */
    saveCart(); renderProducts(); renderShowcase(); renderCart();
    return;
  }
  var rem = e.target.closest("[data-remove]");
  if (rem) {
    delete cart[rem.getAttribute("data-remove")];
    saveCart(); renderProducts(); renderShowcase(); renderCart();
    return;
  }
  var chip = e.target.closest("[data-filter]");
  if (chip) {
    activeFilter = chip.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach(function (c) {
      c.classList.toggle("is-active", c === chip);
    });
    renderProducts();
  }
});

$("searchInput").addEventListener("input", function (e) {
  query = e.target.value.trim().toLowerCase();
  renderProducts();
});
$("cartBtn").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
$("cartOverlay").addEventListener("click", closeCart);
$("menuBtn").addEventListener("click", function () {
  var nav = $("mainNav");
  var open = nav.classList.toggle("is-open");
  $("menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
});
$("mainNav").addEventListener("click", function (e) {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (!$("cartDrawer").hidden) closeCart();
    if ($("mainNav").classList.contains("is-open")) closeMenu();
  }
});

$("checkoutBtn").addEventListener("click", function () {
  if (!cartCount()) { $("cartNote").textContent = "Keranjang masih kosong. Tambah akun dulu."; return; }
  if (!CONFIG.waNumber) {
    $("cartNote").textContent = "Nomor WhatsApp toko belum diisi (app.js, WA_NUMBER). Salin pesanan dengan tombol di bawah, lalu kirim manual ke toko.";
    $("cartNote").classList.add("warn");
    return;
  }
  window.open("https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(orderText()), "_blank", "noopener");
});

$("copyBtn").addEventListener("click", function () {
  if (!cartCount()) { $("cartNote").textContent = "Keranjang masih kosong. Tambah akun dulu."; return; }
  var done = function () { $("cartNote").textContent = "Pesanan disalin. Tempel ke chat WhatsApp toko."; };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(orderText()).then(done, function () { $("cartNote").textContent = orderText(); });
  } else {
    $("cartNote").textContent = orderText();
  }
});

(function initWa() {
  var btn = $("waBtn");
  if (CONFIG.waNumber) {
    btn.href = "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent("Halo " + CONFIG.storeName + ", saya mau tanya stok akun.");
  } else {
    btn.href = "#tentang";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Nomor WhatsApp toko belum diisi (app.js, WA_NUMBER).");
    });
  }
})();

renderProducts();
renderShowcase();
renderCart();
