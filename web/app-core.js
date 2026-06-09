// =========================================================================
// 1. SYSTEM ENGINE STORAGE & CONFIGURATION (LocalStorage Engine)
// =========================================================================

if (!localStorage.getItem('kategoriBuku')) {
    localStorage.setItem('kategoriBuku', JSON.stringify(["Sains", "Sejarah", "Psikologi", "Fiksi", "Bisnis"]));
}

if (!localStorage.getItem('koleksiBuku')) {
    const defaultBuku = [];
    localStorage.setItem('koleksiBuku', JSON.stringify(defaultBuku));
}

if (!localStorage.getItem('kredensialPengunjung')) {
    localStorage.setItem('kredensialPengunjung', JSON.stringify([
        { email: "budi@pustaka.id", password: "123", nama: "Budi Santoso" },
        { email: "siti@pustaka.id", password: "123", nama: "Siti Aminah" }
    ]));
}

// BARU: Kode otorisasi petugas yang valid
if (!localStorage.getItem('kodeOtorisasiPetugas')) {
    localStorage.setItem('kodeOtorisasiPetugas', 'PUSTAKA2026');
}

if (!localStorage.getItem('kredensialPetugas')) {
    localStorage.setItem('kredensialPetugas', JSON.stringify([
        { email: "admin@pustaka.id", password: "admin123", nama: "Admin Perpus" }
    ]));
}

if (!localStorage.getItem('daftarAnggota')) {
    localStorage.setItem('daftarAnggota', JSON.stringify([
        { id: "M-001", nama: "Budi Santoso", email: "budi@pustaka.id" },
        { id: "M-002", nama: "Siti Aminah", email: "siti@pustaka.id" }
    ]));
}

if (!localStorage.getItem('logSirkulasi')) {
    localStorage.setItem('logSirkulasi', JSON.stringify([
        { member: "Budi Santoso", buku: "Atomic Habits", tglPinjam: "2026-06-01", tglKembali: "2026-06-08", tglRealisasi: null }
    ]));
}

// Avatar admin: default putih polos, diset saat upload

// Sinkronisasi Variabel Global Runtime
let kategoriBuku = JSON.parse(localStorage.getItem('kategoriBuku'));
let koleksiBuku = JSON.parse(localStorage.getItem('koleksiBuku'));
let daftarAnggota = JSON.parse(localStorage.getItem('daftarAnggota'));
let logSirkulasi = JSON.parse(localStorage.getItem('logSirkulasi'));
let kategoriTerpilih = "Semua";

let currentLoginRole = 'pengunjung';
let currentRegisterRole = 'pengunjung';

// UI Toast Notification Premium
function toastNotify(message, type = "success") {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-20 right-5 z-[100] transform translate-y-10 opacity-0 transition-all duration-300 p-4 rounded-xl shadow-xl flex items-center gap-3 text-white font-semibold text-sm ${type === 'success' ? 'bg-teal-600' : 'bg-red-600'}`;
    toast.innerHTML = `<span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 50);
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================================================
// 2. AUTHENTICATION (LOGIN & REGISTER)
// =========================================================================
function togglePasswordVisibility() {
    const p = document.getElementById('password');
    if(p) p.type = p.type === 'password' ? 'text' : 'password';
}

function switchLoginRole(role) {
    currentLoginRole = role;
    const tp = document.getElementById('tab-pengunjung'), tt = document.getElementById('tab-petugas');
    const title = document.getElementById('login-title');
    const subtitle = document.getElementById('login-subtitle');

    if(tp && tt) {
        tp.className = role === 'pengunjung' ?
            "flex-1 py-4 text-sm font-bold text-[#002045] border-b-2 border-[#002045] bg-white focus:outline-none" :
            "flex-1 py-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 text-center focus:outline-none";
        tt.className = role === 'petugas' ?
            "flex-1 py-4 text-sm font-bold text-[#002045] border-b-2 border-[#002045] bg-white focus:outline-none" :
            "flex-1 py-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 text-center focus:outline-none";
    }

    if (title && subtitle) {
        title.style.opacity = '0';
        subtitle.style.opacity = '0';
        setTimeout(() => {
            if (role === 'petugas') {
                title.innerText = "Masuk sebagai Petugas";
                subtitle.innerText = "Akses dashboard administrasi perpustakaan";
            } else {
                title.innerText = "Masuk sebagai Pengunjung";
                subtitle.innerText = "Akses koleksi buku digital Anda sekarang";
            }
            title.style.opacity = '1';
            subtitle.style.opacity = '1';
        }, 200);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    let dbUsers = JSON.parse(localStorage.getItem('kredensialPengunjung'));
    let dbStaff = JSON.parse(localStorage.getItem('kredensialPetugas')) || [];

    const db = (currentLoginRole === 'pengunjung') ? dbUsers : dbStaff;
    const user = db.find(u => u.email === email);

    if (!user) { toastNotify("Email belum terdaftar!", "error"); return; }
    if (user.password !== pass) { toastNotify("Password salah!", "error"); return; }

    toastNotify(`Selamat Datang, ${user.nama}!`);
    setTimeout(() => {
        if (currentLoginRole === 'petugas') window.location.href = "dashboard-admin.html";
        else { localStorage.setItem('sessionPengunjung', JSON.stringify(user)); window.location.href = "dashboard-pengunjung.html"; }
    }, 1000);
}

function switchRegisterRole(role) {
    currentRegisterRole = role;
    const rp = document.getElementById('reg-tab-pengunjung'), rt = document.getElementById('reg-tab-petugas'), wc = document.getElementById('wrapper-auth-code');
    if(rp && rt && wc) {
        rp.className = role === 'pengunjung' ? "flex-1 py-4 text-sm font-bold text-[#006a63] border-b-2 border-[#006a63] bg-white focus:outline-none" : "flex-1 py-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 text-center focus:outline-none";
        rt.className = role === 'petugas' ? "flex-1 py-4 text-sm font-bold text-[#006a63] border-b-2 border-[#006a63] bg-white focus:outline-none" : "flex-1 py-4 text-sm font-semibold text-slate-500 hover:bg-slate-100 text-center focus:outline-none";
        wc.className = role === 'petugas' ? "block" : "hidden";
    }
}

function handleRegister(e) {
    e.preventDefault();
    const nama = document.getElementById('reg-nama').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    let dbUsers = JSON.parse(localStorage.getItem('kredensialPengunjung'));
    let dbStaff = JSON.parse(localStorage.getItem('kredensialPetugas')) || [];

    if (currentRegisterRole === 'pengunjung') {
        if (dbUsers.some(u => u.email === email)) { toastNotify("Email sudah digunakan!", "error"); return; }
        const user = { email, password, nama };
        dbUsers.push(user);
        daftarAnggota.push({ id: `M-00${daftarAnggota.length + 1}`, nama, email });
        localStorage.setItem('kredensialPengunjung', JSON.stringify(dbUsers));
        localStorage.setItem('daftarAnggota', JSON.stringify(daftarAnggota));
        localStorage.setItem('sessionPengunjung', JSON.stringify(user));
        toastNotify("Registrasi Pengunjung Berhasil!");
        setTimeout(() => window.location.href = "dashboard-pengunjung.html", 1000);
    } else {
        // BARU: Validasi kode otorisasi petugas
        const kodeInput = document.getElementById('reg-auth-code').value.trim();
        const kodeValid = localStorage.getItem('kodeOtorisasiPetugas') || 'PUSTAKA2026';
        if (kodeInput !== kodeValid) {
            toastNotify("Kode otorisasi tidak valid!", "error");
            document.getElementById('reg-auth-code').classList.add('border-red-500', 'bg-red-50');
            setTimeout(() => document.getElementById('reg-auth-code').classList.remove('border-red-500', 'bg-red-50'), 2000);
            return;
        }
        if (dbStaff.some(u => u.email === email)) { toastNotify("Email sudah digunakan!", "error"); return; }
        dbStaff.push({ email, password, nama });
        localStorage.setItem('kredensialPetugas', JSON.stringify(dbStaff));
        toastNotify("Registrasi Petugas Berhasil!");
        setTimeout(() => window.location.href = "login.html", 1000);
    }
}

// =========================================================================
// BARU: FITUR LUPA PASSWORD
// =========================================================================
function bukaModalLupaPassword() {
    openModal('modal-lupa-password');
    document.getElementById('lupa-step-1').classList.remove('hidden');
    document.getElementById('lupa-step-2').classList.add('hidden');
    document.getElementById('lupa-step-3').classList.add('hidden');
    document.getElementById('lupa-email').value = '';
    if (document.getElementById('lupa-password-baru')) document.getElementById('lupa-password-baru').value = '';
    if (document.getElementById('lupa-konfirmasi-password')) document.getElementById('lupa-konfirmasi-password').value = '';
}

function prosesCariEmail() {
    const email = document.getElementById('lupa-email').value.trim();
    const role = document.querySelector('input[name="lupa-role"]:checked')?.value || 'pengunjung';
    let db = JSON.parse(localStorage.getItem(role === 'pengunjung' ? 'kredensialPengunjung' : 'kredensialPetugas')) || [];
    const user = db.find(u => u.email === email);
    if (!user) { toastNotify("Email tidak ditemukan!", "error"); return; }
    localStorage.setItem('lupaPasswordSession', JSON.stringify({ email, role }));
    document.getElementById('lupa-step-1').classList.add('hidden');
    document.getElementById('lupa-step-2').classList.remove('hidden');
    document.getElementById('info-email-konfirmasi').innerText = email;
}

function prosesResetPassword() {
    const passwordBaru = document.getElementById('lupa-password-baru').value;
    const konfirmasi = document.getElementById('lupa-konfirmasi-password').value;
    if (passwordBaru.length < 3) { toastNotify("Password minimal 3 karakter!", "error"); return; }
    if (passwordBaru !== konfirmasi) { toastNotify("Konfirmasi password tidak cocok!", "error"); return; }
    const sesi = JSON.parse(localStorage.getItem('lupaPasswordSession'));
    if (!sesi) return;
    const key = sesi.role === 'pengunjung' ? 'kredensialPengunjung' : 'kredensialPetugas';
    let db = JSON.parse(localStorage.getItem(key)) || [];
    db = db.map(u => u.email === sesi.email ? { ...u, password: passwordBaru } : u);
    localStorage.setItem(key, JSON.stringify(db));
    localStorage.removeItem('lupaPasswordSession');
    document.getElementById('lupa-step-2').classList.add('hidden');
    document.getElementById('lupa-step-3').classList.remove('hidden');
}

// =========================================================================
// 3. LOGIKA INTERAKSI DASHBOARD PENGUNJUNG
// =========================================================================
function initDashboardPengunjung() {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    if (!session) { window.location.href = "login.html"; return; }
    document.getElementById('nama-pengunjung-aktif').innerText = session.nama;
    const savedAvatar = localStorage.getItem(`avatar_user_${session.email}`);
    const imgEl = document.getElementById('user-avatar-pic');
    const placeholder = document.getElementById('avatar-placeholder');
    if (savedAvatar && imgEl) {
        imgEl.src = savedAvatar;
        imgEl.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    }
    renderKategoriPengunjung();
    renderKatalogPengunjungGrid();
    renderPinjamanSayaBento();
    // BARU: Cek notifikasi denda saat masuk
    cekNotifikasiDenda();
}

function gantiFotoProfilPengunjung(inputElement) {
    const file = inputElement.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { toastNotify("Ukuran foto maksimal adalah 2MB!", "error"); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
            localStorage.setItem(`avatar_user_${session.email}`, e.target.result);
            const imgEl = document.getElementById('user-avatar-pic');
            const placeholder = document.getElementById('avatar-placeholder');
            if (imgEl) { imgEl.src = e.target.result; imgEl.style.display = 'block'; }
            if (placeholder) placeholder.style.display = 'none';
            if (document.getElementById('modal-profil-avatar')) document.getElementById('modal-profil-avatar').src = e.target.result;
            toastNotify("Foto profil Anda sukses diperbarui!");
        };
        reader.readAsDataURL(file);
    }
}

function renderKategoriPengunjung() {
    const el = document.getElementById('filter-kategori-pengunjung') || document.getElementById('filter-katalog-page');
    if (!el) return;
    let html = `<button onclick="filterKategoriBuku('Semua')" class="flex-shrink-0 flex items-center gap-2 ${kategoriTerpilih === 'Semua' ? 'bg-[#99efe5] text-[#006f67] font-bold' : 'bg-white text-slate-600'} border border-slate-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all">Semua</button>`;
    html += kategoriBuku.map(kat => `<button onclick="filterKategoriBuku('${kat}')" class="flex-shrink-0 flex items-center gap-2 ${kategoriTerpilih === kat ? 'bg-[#99efe5] text-[#006f67] font-bold' : 'bg-white text-slate-600'} border border-slate-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all">${kat}</button>`).join('');
    el.innerHTML = html;
}

function filterKategoriBuku(kategori) {
    kategoriTerpilih = kategori;
    renderKategoriPengunjung();
    renderKatalogPengunjungGrid();
}

function renderKatalogPengunjungGrid() {
    const el = document.getElementById('grid-katalog-buku');
    const keyword = document.getElementById('input-pencarian-katalog')?.value.toLowerCase() || "";
    if (!el) return;

    const list = koleksiBuku.filter(b => {
        const cocokKat = (kategoriTerpilih === "Semua" || b.kategori === kategoriTerpilih);
        const cocokKata = b.judul.toLowerCase().includes(keyword) || b.penulis.toLowerCase().includes(keyword);
        return cocokKat && cocokKata;
    });

    if (list.length === 0) {
        el.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400 text-sm italic">Koleksi buku tidak ditemukan.</div>`;
        return;
    }

    el.innerHTML = list.map(b => {
        const sisa = b.stok - b.terpinjam;
        return `
            <div onclick="bukaDetailBuku('${b.id}')" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all cursor-pointer group">
                <div class="aspect-[3/4] bg-slate-100 overflow-hidden">
                    <img src="${b.sampul || 'https://via.placeholder.com/150x200?text=Buku'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div class="p-3">
                    <h4 class="font-bold text-slate-900 text-xs truncate">${b.judul}</h4>
                    <p class="text-[10px] text-slate-500 mb-2 truncate">${b.penulis}</p>
                    <div class="mt-2 flex justify-between items-center pt-2 border-t border-slate-100">
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sisa > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${sisa > 0 ? 'Tersedia' : 'Dipinjam'}
                        </span>
                        <span class="text-[9px] text-slate-400 font-medium">${b.kategori || 'Umum'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function bukaDetailBuku(id) {
    localStorage.setItem('bukuTerpilih', id);
    window.location.href = 'detail-buku.html';
}

function cariBuku() { renderKatalogPengunjungGrid(); }

function pinjamBukuOtomatis(id) {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    const b = koleksiBuku.find(x => x.id === id);
    if (!b || (b.stok - b.terpinjam) <= 0) { toastNotify("Stok buku habis!", "error"); return; }
    b.terpinjam += 1;
    logSirkulasi.push({ member: session.nama, buku: b.judul, tglPinjam: new Date().toISOString().split('T')[0], tglKembali: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], tglRealisasi: null });
    localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
    localStorage.setItem('logSirkulasi', JSON.stringify(logSirkulasi));
    toastNotify(`Berhasil meminjam "${b.judul}"!`);
    renderKatalogPengunjungGrid();
    renderPinjamanSayaBento();
}

function renderPinjamanSayaBento() {
    const el = document.getElementById('log-pinjaman-pengunjung');
    if (!el) return;
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    const list = logSirkulasi.filter(s => s.member === session.nama && !s.tglRealisasi);
    if (list.length === 0) {
        el.innerHTML = `<p class="text-slate-400 text-xs italic text-center py-4">Tidak ada pinjaman aktif.</p>`;
        return;
    }
    const today = new Date();
    el.innerHTML = list.map(s => {
        const batas = new Date(s.tglKembali);
        const terlambat = today > batas;
        const selisih = Math.ceil(Math.abs(today - batas) / (1000*60*60*24));
        return `
        <div class="flex justify-between items-center ${terlambat ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'} border p-2.5 rounded-lg text-xs">
            <div>
                <span class="font-bold text-slate-800 block truncate max-w-[140px]">${s.buku}</span>
                <span class="text-[10px] ${terlambat ? 'text-red-600 font-bold' : 'text-amber-700 font-medium'}">
                    ${terlambat ? `⚠ Terlambat ${selisih} hari` : `Batas: ${s.tglKembali}`}
                </span>
            </div>
            <button onclick="kembalikanBukuOtomatis('${s.buku}', '${s.tglPinjam}')" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-sm transition-colors">
                Kembalikan
            </button>
        </div>
    `}).join('');
}

function kembalikanBukuOtomatis(judulBuku, tglPinjam) {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    const transaksi = logSirkulasi.find(s => s.member === session.nama && s.buku === judulBuku && s.tglPinjam === tglPinjam && !s.tglRealisasi);
    if (!transaksi) return;
    const hariIniStr = new Date().toISOString().split('T')[0];
    transaksi.tglRealisasi = hariIniStr;
    const buku = koleksiBuku.find(b => b.judul === judulBuku);
    if (buku && buku.terpinjam > 0) buku.terpinjam -= 1;
    const batas = new Date(transaksi.tglKembali), realisasi = new Date(hariIniStr);
    let infoDenda = "";
    if (realisasi > batas) {
        const selisihHari = Math.ceil(Math.abs(realisasi - batas) / (1000 * 60 * 60 * 24));
        infoDenda = ` | Denda: Rp ${(selisihHari * 2000).toLocaleString('id-ID')}`;
    }
    localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
    localStorage.setItem('logSirkulasi', JSON.stringify(logSirkulasi));
    toastNotify(`Buku "${judulBuku}" berhasil dikembalikan!${infoDenda}`);
    renderKatalogPengunjungGrid();
    renderPinjamanSayaBento();
}

function logoutPengunjung() { localStorage.removeItem('sessionPengunjung'); window.location.href = "login.html"; }

// =========================================================================
// BARU: MODAL PROFIL PENGUNJUNG
// =========================================================================
function bukaModalProfil() {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    if (!session) { window.location.href = "login.html"; return; }

    const savedAvatar = localStorage.getItem(`avatar_user_${session.email}`);
    const avatarSrc = savedAvatar || '';

    const pinjamanAktif = logSirkulasi.filter(s => s.member === session.nama && !s.tglRealisasi);
    const riwayat = logSirkulasi.filter(s => s.member === session.nama && s.tglRealisasi);
    const today = new Date();

    // Cek apakah modal sudah ada
    let modal = document.getElementById('modal-profil-pengunjung');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-profil-pengunjung';
        modal.className = 'fixed inset-0 bg-black/60 z-[200] flex items-end justify-center';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-fade-in">
            <div class="flex justify-between items-center mb-5">
                <h2 class="text-lg font-bold text-[#002045]">Profil Saya</h2>
                <button onclick="document.getElementById('modal-profil-pengunjung').remove()" class="material-symbols-outlined text-slate-400 hover:text-slate-700">close</button>
            </div>
            <!-- Avatar & Info -->
            <div class="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                <label for="upload-avatar-profil-modal" class="relative cursor-pointer group">
                    <img id="modal-profil-avatar" src="${avatarSrc}" class="w-16 h-16 rounded-full object-cover border-2 border-teal-400 shadow"/>
                    <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined text-white text-sm">photo_camera</span>
                    </div>
                </label>
                <input type="file" id="upload-avatar-profil-modal" accept="image/*" class="hidden" onchange="gantiFotoProfilPengunjung(this)"/>
                <div>
                    <p class="font-bold text-slate-900 text-base">${session.nama}</p>
                    <p class="text-sm text-slate-500">${session.email}</p>
                    <span class="text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">Pengunjung Aktif</span>
                </div>
            </div>
            <!-- Ganti Password -->
            <div class="mb-5">
                <button onclick="toggleGantiPassword()" class="w-full flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all">
                    <span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">lock_reset</span> Ganti Password</span>
                    <span class="material-symbols-outlined text-sm" id="icon-toggle-pass">expand_more</span>
                </button>
                <div id="wrapper-ganti-password" class="hidden mt-3 space-y-2 px-1">
                    <input type="password" id="pass-lama" placeholder="Password Lama" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400"/>
                    <input type="password" id="pass-baru" placeholder="Password Baru" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400"/>
                    <input type="password" id="pass-konfirmasi" placeholder="Konfirmasi Password Baru" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400"/>
                    <button onclick="prosesGantiPassword()" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-sm transition-all">Simpan Password Baru</button>
                </div>
            </div>
            <!-- Pinjaman Aktif -->
            <div class="mb-4">
                <h3 class="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-amber-500 text-sm">bookmark</span>
                    Pinjaman Aktif (${pinjamanAktif.length})
                </h3>
                ${pinjamanAktif.length === 0
                    ? `<p class="text-xs text-slate-400 italic text-center py-3">Tidak ada pinjaman aktif.</p>`
                    : pinjamanAktif.map(s => {
                        const batas = new Date(s.tglKembali);
                        const terlambat = today > batas;
                        const selisih = Math.ceil(Math.abs(today - batas) / (1000*60*60*24));
                        return `
                        <div class="flex justify-between items-center ${terlambat ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'} border p-3 rounded-lg text-xs mb-2">
                            <div>
                                <span class="font-bold text-slate-800">${s.buku}</span>
                                <span class="block text-[10px] ${terlambat ? 'text-red-600 font-bold' : 'text-slate-500'}">
                                    ${terlambat ? `⚠ Terlambat ${selisih} hari · Denda: Rp ${(selisih*2000).toLocaleString('id-ID')}` : `Batas: ${s.tglKembali}`}
                                </span>
                            </div>
                        </div>`;
                    }).join('')
                }
            </div>
            <!-- Riwayat Pinjaman -->
            <div>
                <h3 class="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-teal-500 text-sm">history</span>
                    Riwayat Pinjaman (${riwayat.length})
                </h3>
                ${riwayat.length === 0
                    ? `<p class="text-xs text-slate-400 italic text-center py-3">Belum ada riwayat.</p>`
                    : riwayat.slice().reverse().slice(0, 5).map(s => `
                        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-xs mb-2 border border-slate-100">
                            <span class="font-bold text-slate-700">${s.buku}</span>
                            <span class="text-slate-400">Kembali: ${s.tglRealisasi}</span>
                        </div>`).join('')
                }
            </div>
            <!-- Logout -->
            <button onclick="logoutPengunjung()" class="w-full mt-5 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl text-sm transition-all">
                <span class="material-symbols-outlined text-sm">logout</span> Keluar Akun
            </button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function toggleGantiPassword() {
    const w = document.getElementById('wrapper-ganti-password');
    const icon = document.getElementById('icon-toggle-pass');
    if (w.classList.contains('hidden')) {
        w.classList.remove('hidden');
        icon.innerText = 'expand_less';
    } else {
        w.classList.add('hidden');
        icon.innerText = 'expand_more';
    }
}

function prosesGantiPassword() {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    const passLama = document.getElementById('pass-lama').value;
    const passBaru = document.getElementById('pass-baru').value;
    const konfirmasi = document.getElementById('pass-konfirmasi').value;
    let db = JSON.parse(localStorage.getItem('kredensialPengunjung')) || [];
    const user = db.find(u => u.email === session.email);
    if (!user) return;
    if (user.password !== passLama) { toastNotify("Password lama salah!", "error"); return; }
    if (passBaru.length < 3) { toastNotify("Password baru minimal 3 karakter!", "error"); return; }
    if (passBaru !== konfirmasi) { toastNotify("Konfirmasi password tidak cocok!", "error"); return; }
    user.password = passBaru;
    localStorage.setItem('kredensialPengunjung', JSON.stringify(db));
    toastNotify("Password berhasil diperbarui!");
    document.getElementById('wrapper-ganti-password').classList.add('hidden');
}

// =========================================================================
// BARU: NOTIFIKASI DENDA
// =========================================================================
function cekNotifikasiDenda() {
    const session = JSON.parse(localStorage.getItem('sessionPengunjung'));
    if (!session) return;
    const today = new Date();
    const terlambat = logSirkulasi.filter(s => {
        if (s.member !== session.nama || s.tglRealisasi) return false;
        return today > new Date(s.tglKembali);
    });
    if (terlambat.length > 0) {
        const totalDenda = terlambat.reduce((acc, s) => {
            const selisih = Math.ceil(Math.abs(today - new Date(s.tglKembali)) / (1000*60*60*24));
            return acc + selisih * 2000;
        }, 0);
        setTimeout(() => {
            toastNotify(`⚠ ${terlambat.length} buku terlambat! Total denda: Rp ${totalDenda.toLocaleString('id-ID')}`, "error");
        }, 1500);
    }
}

function cekNotifikasiDendaAdmin() {
    const today = new Date();
    const terlambat = logSirkulasi.filter(s => !s.tglRealisasi && today > new Date(s.tglKembali));
    if (terlambat.length > 0) {
        setTimeout(() => {
            toastNotify(`⚠ ${terlambat.length} transaksi melewati batas kembali!`, "error");
        }, 1500);
    }
}

// =========================================================================
// 4. MANAGEMENT CONSOLE LOGIC (Dashboard Petugas Admin Master)
// =========================================================================
function renderDashboardStats() {
    let bk = JSON.parse(localStorage.getItem('koleksiBuku')) || [], ag = JSON.parse(localStorage.getItem('daftarAnggota')) || [], sk = JSON.parse(localStorage.getItem('logSirkulasi')) || [];
    if(document.getElementById('stat-total-buku')) document.getElementById('stat-total-buku').innerText = bk.length;
    if(document.getElementById('stat-total-anggota')) document.getElementById('stat-total-anggota').innerText = ag.length;
    if(document.getElementById('stat-total-dipinjam')) document.getElementById('stat-total-dipinjam').innerText = bk.reduce((acc, c) => acc + c.terpinjam, 0);
    let denda = 0;
    sk.forEach(s => {
        const b = new Date(s.tglKembali), r = s.tglRealisasi ? new Date(s.tglRealisasi) : new Date();
        if(r > b) denda += (Math.ceil(Math.abs(r - b) / (1000*60*60*24)) * 2000);
    });
    if(document.getElementById('stat-total-denda')) document.getElementById('stat-total-denda').innerText = `Rp ${denda.toLocaleString('id-ID')}`;
    const feeds = document.getElementById('live-activity-feeds');
    if(feeds) feeds.innerHTML = sk.slice(-3).reverse().map(s => `<div class="text-xs p-2 border-b border-slate-100"><strong>${s.member}</strong> ${s.tglRealisasi ? 'mengembalikan':'meminjam'} <span class="italic text-teal-700">"${s.buku}"</span></div>`).join('');
}

function renderKategoriAdmin() {
    const wrapper = document.getElementById('wrapper-kategori-list');
    const selectBuku = document.getElementById('input-kategori-select');
    if (!wrapper) return;
    wrapper.innerHTML = kategoriBuku.map(kat => `
        <span class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            ${kat}
            <button onclick="hapusKategori('${kat}')" class="material-symbols-outlined text-xs text-red-500 hover:text-red-700 font-bold">close</button>
        </span>
    `).join('');
    if (selectBuku) {
        selectBuku.innerHTML = `<option value="">Pilih Kategori...</option>` + kategoriBuku.map(kat => `<option value="${kat}">${kat}</option>`).join('');
    }
}

function tambahKategoriBaru() {
    const input = document.getElementById('input-nama-kategori');
    const namaKat = input.value.trim();
    if (!namaKat) return;
    if (kategoriBuku.includes(namaKat)) { toastNotify("Kategori sudah ada!", "error"); return; }
    kategoriBuku.push(namaKat);
    localStorage.setItem('kategoriBuku', JSON.stringify(kategoriBuku));
    input.value = '';
    toastNotify("Kategori berhasil ditambahkan!");
    renderKategoriAdmin();
}

function hapusKategori(namaKat) {
    kategoriBuku = kategoriBuku.filter(k => k !== namaKat);
    localStorage.setItem('kategoriBuku', JSON.stringify(kategoriBuku));
    toastNotify("Kategori berhasil dihapus!");
    renderKategoriAdmin();
}

function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id)?.classList.remove('hidden');
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('sidebar-active'));
    document.getElementById(`btn-${id}`)?.classList.add('sidebar-active');
    if(id === 'tab-buku') { renderBuku(); renderAdminKatalogPreviewGrid(); }
    if(id === 'tab-kategori') renderKategoriAdmin();
    if(id === 'tab-anggota') renderAnggota();
    if(id === 'tab-sirkulasi') renderSirkulasi();
    renderDashboardStats();
}

function renderAdminKatalogPreviewGrid() {
    const el = document.getElementById('admin-catalog-preview-grid');
    if (!el) return;
    let coverIdx = 2;
    el.innerHTML = koleksiBuku.map(b => {
        coverIdx = coverIdx >= 7 ? 3 : coverIdx + 1;
        const imgSrc = b.sampul ? b.sampul : `http://googleusercontent.com/profile/picture/${coverIdx}`;
        const sisa = b.stok - b.terpinjam;
        return `
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between p-1">
                <div class="aspect-[3/4] bg-slate-100 relative overflow-hidden flex items-center justify-center rounded-lg">
                    <img alt="Book Cover" class="w-full h-full object-cover" src="${imgSrc}"/>
                </div>
                <div class="p-2 space-y-0.5">
                    <h4 class="font-bold text-slate-900 text-xs truncate">${b.judul}</h4>
                    <p class="text-[10px] text-slate-500 truncate">${b.penulis}</p>
                    <div class="flex justify-between items-center pt-1 text-[9px] text-slate-400">
                        <span>Stok: ${sisa}/${b.stok}</span>
                        <span class="font-semibold font-mono">${b.kategori}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderBuku() {
    const el = document.getElementById('table-buku-body'); if (!el) return;
    let coverIdx = 2;
    koleksiBuku = JSON.parse(localStorage.getItem('koleksiBuku')) || [];
    el.innerHTML = koleksiBuku.map(b => {
        coverIdx = coverIdx >= 7 ? 3 : coverIdx + 1;
        const imgSrc = b.sampul ? b.sampul : `http://googleusercontent.com/profile/picture/${coverIdx}`;
        return `
            <tr class="border-b text-sm hover:bg-slate-50 transition-colors">
                <td class="p-4"><img src="${imgSrc}" class="w-10 h-14 object-cover rounded shadow-sm border"/></td>
                <td class="p-4 font-mono text-xs">${b.id}</td>
                <td class="p-4 font-bold">${b.judul}</td>
                <td class="p-4 text-slate-600">${b.penulis}</td>
                <td class="p-4"><span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">${b.kategori || 'Umum'}</span></td>
                <td class="p-4 font-semibold">${b.stok - b.terpinjam} / ${b.stok} Unit</td>
                <td class="p-4"><span class="px-2 py-0.5 text-xs font-bold rounded-full ${(b.stok-b.terpinjam)>0?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}">${(b.stok-b.terpinjam)>0?'Tersedia':'Habis'}</span></td>
                <td class="p-4 text-center flex gap-2 justify-center">
                    <button onclick="bukaModalEditBuku('${b.id}')" class="text-blue-600 font-bold hover:underline text-xs">Edit</button>
                    <button onclick="hapusBuku('${b.id}')" class="text-red-600 font-bold hover:underline text-xs">Hapus</button>
                </td>
            </tr>
        `;
    }).join('');
}

function submitBuku(e) {
    e.preventDefault();
    const fileInput = document.getElementById('input-sampul-buku');

    const simpanBuku = (sampulData) => {
        const bukuBaru = {
            id: `B-${String(koleksiBuku.length + 1).padStart(3, '0')}`,
            judul: document.getElementById('input-judul').value,
            penulis: document.getElementById('input-penulis').value,
            kategori: document.getElementById('input-kategori-select').value,
            stok: parseInt(document.getElementById('input-stok').value),
            terpinjam: 0,
            sampul: sampulData,
            isbn: document.getElementById('input-isbn').value,
            penerbit: document.getElementById('input-penerbit').value,
            halaman: document.getElementById('input-halaman').value,
            lokasi: document.getElementById('input-lokasi').value,
            sinopsis: document.getElementById('input-sinopsis').value
        };
        koleksiBuku.push(bukuBaru);
        localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
        closeModal('modal-buku');
        document.getElementById('form-buku').reset();
        toastNotify("Buku berhasil disimpan!");
        renderBuku();
        renderAdminKatalogPreviewGrid();
        renderDashboardStats();
    };

    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => simpanBuku(event.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        simpanBuku('');
    }
}

// BARU: Edit Buku
function bukaModalEditBuku(id) {
    const b = koleksiBuku.find(x => x.id === id);
    if (!b) return;
    let modal = document.getElementById('modal-edit-buku');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-edit-buku';
        modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto pt-20';
        document.body.appendChild(modal);
    }
    // Populate kategori options
    const kOpts = kategoriBuku.map(k => `<option value="${k}" ${k === b.kategori ? 'selected' : ''}>${k}</option>`).join('');
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-lg p-6 border shadow-xl mx-4">
            <h3 class="text-lg font-bold text-primary mb-4">Edit Buku: ${b.judul}</h3>
            <div class="space-y-3">
                <input type="file" id="edit-sampul-buku" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#002045]"/>
                <input type="text" id="edit-judul" value="${b.judul}" placeholder="Judul Buku" required class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                <input type="text" id="edit-penulis" value="${b.penulis}" placeholder="Nama Penulis" required class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                <select id="edit-kategori" class="w-full border-slate-300 rounded-lg p-2.5 bg-white">${kOpts}</select>
                <div class="grid grid-cols-2 gap-2">
                    <input type="text" id="edit-isbn" value="${b.isbn||''}" placeholder="ISBN" class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                    <input type="text" id="edit-penerbit" value="${b.penerbit||''}" placeholder="Penerbit" class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" id="edit-halaman" value="${b.halaman||''}" placeholder="Jumlah Halaman" class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                    <input type="text" id="edit-lokasi" value="${b.lokasi||''}" placeholder="Lokasi Rak" class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                </div>
                <input type="number" id="edit-stok" value="${b.stok}" placeholder="Stok" min="1" required class="w-full border-slate-300 rounded-lg p-2.5 bg-white"/>
                <textarea id="edit-sinopsis" placeholder="Sinopsis..." class="w-full border-slate-300 rounded-lg p-2.5 bg-white h-20">${b.sinopsis||''}</textarea>
                <div class="flex justify-end gap-2 pt-2">
                    <button onclick="document.getElementById('modal-edit-buku').remove()" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button>
                    <button onclick="simpanEditBuku('${b.id}')" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    `;
}

function simpanEditBuku(id) {
    const idx = koleksiBuku.findIndex(b => b.id === id);
    if (idx === -1) return;
    const simpan = (sampulData) => {
        koleksiBuku[idx] = {
            ...koleksiBuku[idx],
            judul: document.getElementById('edit-judul').value,
            penulis: document.getElementById('edit-penulis').value,
            kategori: document.getElementById('edit-kategori').value,
            stok: parseInt(document.getElementById('edit-stok').value),
            isbn: document.getElementById('edit-isbn').value,
            penerbit: document.getElementById('edit-penerbit').value,
            halaman: document.getElementById('edit-halaman').value,
            lokasi: document.getElementById('edit-lokasi').value,
            sinopsis: document.getElementById('edit-sinopsis').value,
            sampul: sampulData || koleksiBuku[idx].sampul
        };
        localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
        document.getElementById('modal-edit-buku').remove();
        toastNotify("Buku berhasil diperbarui!");
        renderBuku();
        renderAdminKatalogPreviewGrid();
        renderDashboardStats();
    };
    const fileInput = document.getElementById('edit-sampul-buku');
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => simpan(e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        simpan(null);
    }
}

function hapusBuku(id) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    koleksiBuku = koleksiBuku.filter(b => b.id !== id);
    localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
    toastNotify("Buku dihapus!", "error");
    renderBuku(); renderAdminKatalogPreviewGrid(); renderDashboardStats();
}

function renderAnggota() {
    const el = document.getElementById('table-anggota-body'); if (!el) return;
    daftarAnggota = JSON.parse(localStorage.getItem('daftarAnggota')) || [];
    el.innerHTML = daftarAnggota.map(m => {
        const riwayat = logSirkulasi.filter(s => s.member === m.nama);
        const aktif = riwayat.filter(s => !s.tglRealisasi).length;
        return `
        <tr class="border-b text-sm hover:bg-slate-50">
            <td class="p-4 font-mono text-xs">${m.id}</td>
            <td class="p-4 font-bold">${m.nama}</td>
            <td class="p-4">${m.email}</td>
            <td class="p-4 text-center">
                <span class="text-xs ${aktif > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} font-bold px-2 py-0.5 rounded-full">${aktif} aktif</span>
            </td>
            <td class="p-4 text-center flex gap-2 justify-center">
                <button onclick="bukaDetailAnggota('${m.id}')" class="text-teal-600 font-bold hover:underline text-xs">Detail</button>
                <button onclick="hapusAnggota('${m.id}')" class="text-red-600 font-bold hover:underline text-xs">Hapus</button>
            </td>
        </tr>
    `}).join('');
}

// BARU: Detail Anggota
function bukaDetailAnggota(id) {
    const m = daftarAnggota.find(x => x.id === id);
    if (!m) return;
    const riwayat = logSirkulasi.filter(s => s.member === m.nama);
    const aktif = riwayat.filter(s => !s.tglRealisasi);
    const selesai = riwayat.filter(s => s.tglRealisasi);
    const today = new Date();

    let modal = document.getElementById('modal-detail-anggota');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-detail-anggota';
        modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto pt-20';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-lg p-6 border shadow-xl mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-primary">Detail Anggota</h3>
                <button onclick="document.getElementById('modal-detail-anggota').remove()" class="material-symbols-outlined text-slate-400">close</button>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl mb-4">
                <p class="font-bold text-slate-900 text-base">${m.nama}</p>
                <p class="text-sm text-slate-500">${m.email}</p>
                <p class="text-xs text-slate-400 font-mono mt-1">${m.id}</p>
            </div>
            <h4 class="text-sm font-bold text-amber-700 mb-2">Pinjaman Aktif (${aktif.length})</h4>
            ${aktif.length === 0
                ? `<p class="text-xs text-slate-400 italic mb-4">Tidak ada pinjaman aktif.</p>`
                : aktif.map(s => {
                    const batas = new Date(s.tglKembali);
                    const terlambat = today > batas;
                    const selisih = Math.ceil(Math.abs(today - batas) / (1000*60*60*24));
                    return `
                    <div class="${terlambat ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} border rounded-lg p-3 mb-2 text-xs">
                        <p class="font-bold">${s.buku}</p>
                        <p class="${terlambat ? 'text-red-600 font-bold' : 'text-slate-500'}">
                            ${terlambat ? `⚠ Terlambat ${selisih} hari · Denda: Rp ${(selisih*2000).toLocaleString('id-ID')}` : `Batas: ${s.tglKembali}`}
                        </p>
                    </div>`;
                }).join('')
            }
            <h4 class="text-sm font-bold text-teal-700 mb-2 mt-4">Riwayat Selesai (${selesai.length})</h4>
            ${selesai.length === 0
                ? `<p class="text-xs text-slate-400 italic">Belum ada riwayat.</p>`
                : selesai.slice().reverse().slice(0, 5).map(s => `
                    <div class="bg-white border border-slate-200 rounded-lg p-3 mb-2 text-xs flex justify-between">
                        <span class="font-bold text-slate-700">${s.buku}</span>
                        <span class="text-slate-400">Kembali: ${s.tglRealisasi}</span>
                    </div>`).join('')
            }
        </div>
    `;
}

function submitAnggota(e) {
    e.preventDefault();
    const nama = document.getElementById('input-nama-member').value;
    const email = document.getElementById('input-email-member').value;
    daftarAnggota.push({ id: `M-${String(daftarAnggota.length + 1).padStart(3, '0')}`, nama, email });
    let kp = JSON.parse(localStorage.getItem('kredensialPengunjung')) || [];
    kp.push({ email, password: "123", nama });
    localStorage.setItem('daftarAnggota', JSON.stringify(daftarAnggota));
    localStorage.setItem('kredensialPengunjung', JSON.stringify(kp));
    closeModal('modal-anggota');
    document.getElementById('form-anggota').reset();
    toastNotify("Member baru terdaftar!");
    renderAnggota();
    renderDashboardStats();
}

function hapusAnggota(id) {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    daftarAnggota = daftarAnggota.filter(m => m.id !== id);
    localStorage.setItem('daftarAnggota', JSON.stringify(daftarAnggota));
    renderAnggota();
    renderDashboardStats();
}

function renderSirkulasi() {
    const el = document.getElementById('table-sirkulasi-body'); if (!el) return;
    logSirkulasi = JSON.parse(localStorage.getItem('logSirkulasi')) || [];
    const today = new Date();
    el.innerHTML = logSirkulasi.map((s, idx) => {
        const batas = new Date(s.tglKembali);
        const realisasi = s.tglRealisasi ? new Date(s.tglRealisasi) : today;
        const terlambat = realisasi > batas;
        const selisih = terlambat ? Math.ceil(Math.abs(realisasi - batas) / (1000*60*60*24)) : 0;
        const denda = selisih * 2000;
        return `
            <tr class="border-b text-sm ${!s.tglRealisasi && terlambat ? 'bg-red-50' : 'hover:bg-slate-50'} transition-colors">
                <td class="p-4 font-bold">${s.member}</td>
                <td class="p-4 italic">${s.buku}</td>
                <td class="p-4 text-xs">${s.tglPinjam}</td>
                <td class="p-4 text-xs ${!s.tglRealisasi && terlambat ? 'text-red-600 font-bold' : ''}">${s.tglKembali}</td>
                <td class="p-4 font-bold text-xs">
                    ${s.tglRealisasi
                        ? `<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">${s.tglRealisasi}</span>`
                        : `<div class="flex items-center gap-2">
                            <span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded">${terlambat ? '⚠ Terlambat' : 'Dipinjam'}</span>
                            <button onclick="prosesKembalikanAdmin(${idx})" class="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm transition-colors">Kembalikan</button>
                           </div>`
                    }
                </td>
                <td class="p-4 text-right font-mono font-bold ${denda>0?'text-red-600':'text-emerald-600'}">Rp ${denda.toLocaleString('id-ID')}</td>
            </tr>
        `;
    }).join('');
}

// BARU: Kembalikan dari tabel sirkulasi admin
function prosesKembalikanAdmin(idx) {
    const s = logSirkulasi[idx];
    if (!s || s.tglRealisasi) return;
    const hariIni = new Date().toISOString().split('T')[0];
    logSirkulasi[idx].tglRealisasi = hariIni;
    // Update stok buku
    const buku = koleksiBuku.find(b => b.judul === s.buku);
    if (buku && buku.terpinjam > 0) {
        buku.terpinjam -= 1;
        localStorage.setItem('koleksiBuku', JSON.stringify(koleksiBuku));
    }
    localStorage.setItem('logSirkulasi', JSON.stringify(logSirkulasi));
    toastNotify(`Buku "${s.buku}" berhasil dikembalikan!`);
    renderSirkulasi();
    renderDashboardStats();
    renderBuku();
}

function submitSirkulasi(e) {
    e.preventDefault();
    logSirkulasi.push({
        member: document.getElementById('select-member').value,
        buku: document.getElementById('select-buku').value,
        tglPinjam: document.getElementById('input-tgl-pinjam').value,
        tglKembali: document.getElementById('input-tgl-kembali').value,
        tglRealisasi: document.getElementById('input-tgl-realisasi').value || null
    });
    localStorage.setItem('logSirkulasi', JSON.stringify(logSirkulasi));
    closeModal('modal-sirkulasi');
    document.getElementById('form-sirkulasi').reset();
    toastNotify("Transaksi manual diproses!");
    renderSirkulasi();
    renderDashboardStats();
}

function prosesGantiFotoProfil(input) {
    const file = input.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { toastNotify("Maksimal ukuran gambar 2MB!", "error"); return; }
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem('savedAdminAvatar', e.target.result);
            const imgEl = document.getElementById('avatar-admin-pic');
            const placeholder = document.getElementById('avatar-admin-placeholder');
            if (imgEl) { imgEl.src = e.target.result; imgEl.style.display = 'block'; }
            if (placeholder) placeholder.style.display = 'none';
            toastNotify("Foto profil berhasil diperbarui!");
        };
        reader.readAsDataURL(file);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const adminImg = document.getElementById('avatar-admin-pic');
    const adminPlaceholder = document.getElementById('avatar-admin-placeholder');
    const savedAdmin = localStorage.getItem('savedAdminAvatar');
    if (adminImg && savedAdmin) {
        adminImg.src = savedAdmin;
        adminImg.style.display = 'block';
        if (adminPlaceholder) adminPlaceholder.style.display = 'none';
    }
    renderBuku(); renderAdminKatalogPreviewGrid(); renderAnggota(); renderSirkulasi(); renderDashboardStats();
    cekNotifikasiDendaAdmin();
});

// Fungsi untuk render kategori (dipakai di katalog juga)
function renderKategoriPengunjung() {
    const el = document.getElementById('filter-kategori-pengunjung') || document.getElementById('filter-katalog-page');
    if (!el) return;
    let html = `<button onclick="filterKategoriBuku('Semua')" class="flex-shrink-0 flex items-center gap-2 ${kategoriTerpilih === 'Semua' ? 'bg-[#99efe5] text-[#006f67] font-bold' : 'bg-white text-slate-600'} border border-slate-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all">Semua</button>`;
    html += kategoriBuku.map(kat => `
        <button onclick="filterKategoriBuku('${kat}')" class="flex-shrink-0 flex items-center gap-2 ${kategoriTerpilih === kat ? 'bg-[#99efe5] text-[#006f67] font-bold' : 'bg-white text-slate-600'} border border-slate-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all">
            ${kat}
        </button>
    `).join('');
    el.innerHTML = html;
}
