<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#f8fafc] text-slate-800">
<!-- ============================================================================== -->
        <!-- 1. LOGIN SCREEN -->
        <!-- ============================================================================== -->
        <div v-if="!currentUser" class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 text-white mb-3">
                        <i class="mdi mdi-flower-poppy text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">Irandra <span class="text-emerald-600">Vendor</span></h1>
                    <p class="text-xs text-slate-400 font-semibold mt-0.5">Portal Pengambilan & Pengerjaan Pesanan Mitra</p>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40">
                    <h2 class="text-base font-black text-slate-800 mb-1">Masuk Ke Akun Anda</h2>
                    <p class="text-xs text-slate-400 font-medium mb-5">Pilih akun demonstrasi atau masukkan kredensial Anda</p>

                    <div class="mb-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 capitalize">Pilih Akun Demo (Autofill)</label>
                        <select @change="handleAccountSelect($event)" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
                            <option value="">-- Pilih Akun Cepat --</option>
                            <option value="admin_irandra">Admin Irandra (Budi Santoso - Kelola Pengguna Vendor)</option>
                            <option value="admin_vendor">Admin Tokoku Jakarta (Sarah Tan)</option>
                            <option value="staff_vendor">Staff Tokoku Jakarta (Alex Chen)</option>
                        </select>
                    </div>

                    <form @submit.prevent="handleLoginSubmit" class="space-y-4 text-xs">
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Nomor WhatsApp Atau Username</label>
                            <input v-model="loginForm.identifier" type="text" required placeholder="Contoh: sarah_tokoku atau 08123456789" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Kata Sandi (Password)</label>
                            <input v-model="loginForm.password" type="password" required placeholder="Masukkan kata sandi" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>
                        <div class="pt-2">
                            <button type="submit" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                                <span>Masuk Ke Dashboard</span>
                                <i class="mdi mdi-arrow-right"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- ============================================================================== -->
        <!-- 2. AUTHENTICATED DASHBOARD LAYOUT -->
        <!-- ============================================================================== -->
        <div v-else class="h-full min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
            <!-- Sidebar Overlay for Mobile -->
            <div v-if="drawer && isMobile" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300" @click="drawer = false"></div>

            <!-- SIDEBAR -->
            <aside class="fixed lg:relative left-0 top-0 h-screen !bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-[70] shadow-[4px_0_24px_rgba(0,0,0,0.01)]"
                :class="[
                    isMobile ? (drawer ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full') : (drawer ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full overflow-hidden opacity-0')
                ]">
                <div class="p-6 pb-2 min-w-[260px]">
                    <div class="flex items-center gap-3 group cursor-pointer" @click="navigateTo('dashboard', 'Semua')">
                        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                            <i class="mdi mdi-flower-poppy text-white text-xl"></i>
                        </div>
                        <div>
                            <span class="block font-black text-slate-900 tracking-tight leading-none text-base">Irandra</span>
                            <span class="text-[10px] font-bold text-emerald-600 tracking-wider">Vendor</span>
                        </div>
                    </div>
                    <div v-if="currentUser.vendor_id" class="mt-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                        <div class="font-black text-slate-800 truncate">{{ currentVendor?.nama_vendor || 'Vendor Mitra' }}</div>
                        <div class="text-[10px] text-slate-400 font-semibold">{{ currentVendor?.kota_vendor }} • Rupiah</div>
                    </div>
                </div>

                <!-- Navigation Menu -->
                <nav class="flex-grow overflow-y-auto py-4 px-4 scrollbar-hide space-y-4">
                    <div>
                        <div class="px-2 mb-2">
                            <span class="text-[10px] font-black text-slate-400 tracking-wider capitalize">Menu Utama</span>
                        </div>
                        <div class="space-y-1">
                            <button @click="navigateTo('dashboard', 'Semua')" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 text-left font-bold text-[13px]"
                                :class="[ isNavActive('dashboard') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600' ]">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="[ isNavActive('dashboard') ? 'bg-white/20' : 'bg-slate-50' ]">
                                    <i class="mdi mdi-clipboard-text-outline text-lg"></i>
                                </div>
                                <span>Daftar Pesanan</span>
                            </button>
                        </div>
                    </div>

                    <!-- Pengaturan Tim Vendor (Hanya Admin Irandra dan Admin Vendor) -->
                    <div v-if="canManageUsers">
                        <div class="px-2 mb-2">
                            <span class="text-[10px] font-black text-slate-400 tracking-wider capitalize">Pengaturan Tim</span>
                        </div>
                        <div class="space-y-1">
                            <button @click="navigateTo('users')" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 text-left font-bold text-[13px]"
                                :class="[ currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600' ]">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="[ currentView === 'users' ? 'bg-white/20' : 'bg-slate-50' ]">
                                    <i class="mdi mdi-account-group-outline text-lg"></i>
                                </div>
                                <span>Manajemen Pengguna</span>
                            </button>
                        </div>
                    </div>
                </nav>

                <!-- Trigger Demo Button -->
                <div @click="triggerIncomingOrder" class="px-4 py-2.5 text-[10px] text-slate-600 font-bold text-center bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-xl mx-3 mb-2 border border-slate-200 cursor-pointer transition-all select-none shadow-sm flex items-center justify-center gap-1.5" title="Klik 2x di layar atau tombol ini untuk pesanan baru">
                    <i class="mdi mdi-gesture-double-tap text-emerald-600 text-sm"></i>
                    <span>Klik 2x Layar (Order Masuk)</span>
                </div>

                <!-- User Profile & Logout -->
                <div class="mt-auto pt-3 px-3 pb-4">
                    <div class="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-200/50">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg overflow-hidden bg-emerald-50 border border-emerald-200 shrink-0">
                                <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentUser.name}`" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-grow min-w-0">
                                <div class="text-[12px] font-black text-slate-800 truncate leading-tight">{{ currentUser.name }}</div>
                                <div class="text-[9px] font-bold text-slate-400 tracking-wider truncate leading-tight mt-0.5">{{ currentUser.role }}</div>
                            </div>
                            <button @click="logout" class="flex items-center justify-center w-7 h-7 rounded-lg bg-white text-rose-500 border border-slate-200 hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Keluar">
                                <i class="mdi mdi-logout-variant text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- MAIN CONTENT AREA -->
            <main class="flex-grow h-screen overflow-y-auto relative flex flex-col transition-all duration-300">
                <header class="h-[64px] bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200/60 shadow-sm px-4 md:px-6 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <button @click="drawer = !drawer" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                            <i class="mdi mdi-menu text-xl"></i>
                        </button>
                    </div>
                </header>

                <div class="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">

                    <!-- ============================================================================== -->
                    <!-- VIEW A: DAFTAR PESANAN -->
                    <!-- ============================================================================== -->
                    <div v-if="currentView === 'dashboard'" class="space-y-6">
                        <!-- KPI Ringkasan Pesanan -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                                <div class="font-bold text-slate-400 mb-1">Total Pesanan</div>
                                <div class="text-2xl font-black text-slate-900">{{ orders.length }} <span class="text-xs font-bold text-slate-400">Order</span></div>
                                <div class="mt-2 text-[11px] text-emerald-600 font-bold">Ditugaskan Oleh PO Irandra</div>
                            </div>
                            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                                <div class="font-bold text-slate-400 mb-1">Perlu Dibuat (HJ)</div>
                                <div class="text-2xl font-black text-amber-600">{{ countOrdersByStatus('Diproses PO') + countOrdersByStatus('HJ Perlu Revisi') }} <span class="text-xs font-bold text-slate-400">Item</span></div>
                                <div class="mt-2 text-[11px] text-amber-600 font-bold">Unggah / Revisi Hasil Jadi</div>
                            </div>
                            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                                <div class="font-bold text-slate-400 mb-1">Pengantaran (HL)</div>
                                <div class="text-2xl font-black text-teal-600">{{ countOrdersByStatus('HJ Disetujui') + countOrdersByStatus('HL Perlu Revisi') }} <span class="text-xs font-bold text-slate-400">Item</span></div>
                                <div class="mt-2 text-[11px] text-teal-600 font-bold">Unggah / Revisi Hasil Lokasi</div>
                            </div>
                            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                                <div class="font-bold text-slate-400 mb-1">Total Pendapatan Vendor</div>
                                <div class="text-2xl font-black text-slate-900">{{ formatRupiah(totalVendorIncome) }}</div>
                                <div class="mt-2 text-[11px] text-slate-500 font-bold">(Dasar - Diskon) + Ongkir</div>
                            </div>
                        </div>

                        <!-- Orders List Table Card -->
                        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-slate-100 flex flex-col gap-4">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 class="text-base font-black text-slate-900">Daftar Penugasan Pesanan Masuk</h3>
                                        <p class="text-xs text-slate-400 font-medium">Pesanan yang ditugaskan oleh tim PO Irandra untuk dikerjakan</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs pt-1">
                                    <div class="sm:col-span-5 relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <i class="mdi mdi-magnify text-base"></i>
                                        </div>
                                        <input v-model="searchQuery" type="text" placeholder="Cari Order ID, produk, penerima..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500">
                                    </div>
                                    <div class="sm:col-span-4">
                                        <select v-model="orderFilter" @change="currentPage = 1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                            <option value="Semua">Semua Status Pesanan ({{ orders.length }})</option>
                                            <option value="Menunggu Respon Vendor">Pengajuan Masuk ({{ countOrdersByStatus('Menunggu Respon Vendor') }})</option>
                                            <option value="Menunggu Review Harga PO">Menunggu Review PO ({{ countOrdersByStatus('Menunggu Review Harga PO') }})</option>
                                            <option value="Diproses PO">Produksi HJ ({{ countOrdersByStatus('Diproses PO') + countOrdersByStatus('HJ Perlu Revisi') }})</option>
                                            <option value="HJ Disetujui">Pengiriman HL ({{ countOrdersByStatus('HJ Disetujui') + countOrdersByStatus('HL Perlu Revisi') }})</option>
                                            <option value="Selesai">Selesai ({{ countOrdersByStatus('Selesai') }})</option>
                                        </select>
                                    </div>
                                    <div class="sm:col-span-3 flex items-center gap-2">
                                        <select v-model="sortBy" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                            <option value="newest">Urutan: Terbaru</option>
                                            <option value="oldest">Urutan: Terlama</option>
                                            <option value="price_high">Harga: Tertinggi</option>
                                            <option value="price_low">Harga: Terendah</option>
                                        </select>
                                        <button v-if="searchQuery || orderFilter !== 'Semua'" @click="searchQuery = ''; orderFilter = 'Semua'" class="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center shrink-0 transition-all" title="Reset filter">
                                            <i class="mdi mdi-close"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="overflow-x-auto text-xs">
                                <table class="w-full text-left">
                                    <thead class="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 capitalize tracking-wider text-[10px]">
                                        <tr>
                                            <th class="py-3.5 px-6">Order ID & Produk</th>
                                            <th class="py-3.5 px-6">Tujuan & Waktu Kirim</th>
                                            <th class="py-3.5 px-6">Harga Dasar & Ongkir</th>
                                            <th class="py-3.5 px-6 whitespace-nowrap">Status Order</th>
                                            <th class="py-3.5 px-6 text-center whitespace-nowrap w-[170px]">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                                        <tr v-if="paginatedOrders.length === 0">
                                            <td colspan="5" class="py-8 text-center text-slate-400 font-bold">
                                                Tidak ada pesanan yang sesuai dengan kriteria pencarian.
                                            </td>
                                        </tr>
                                        <tr v-for="order in paginatedOrders" :key="order.order_id" class="hover:bg-slate-50/50 transition-colors">
                                            <td class="py-4 px-6">
                                                <div class="font-black text-slate-900">{{ order.order_id }}</div>
                                                <div class="text-emerald-700 font-extrabold text-[12px]">{{ order.produk }}</div>
                                                <div class="text-[11px] text-slate-400">{{ order.produk_ukuran }} • {{ order.jumlah_produk }} pcs</div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="font-bold text-slate-800">{{ order.alamat_pengiriman }}</div>
                                                <div class="text-[11px] text-slate-400 font-medium">{{ order.kota_pengiriman }} • {{ order.tanggal_pengiriman }} ({{ order.jam_pengiriman }})</div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="font-black text-slate-900">{{ formatRupiah(calculateNetVendorPay(order)) }}</div>
                                                <div class="text-[10px] text-slate-400">
                                                    Dasar: {{ formatRupiah(order.harga_dasar_vendor_pcs) }}
                                                    <span v-if="Number(order.discount_vendor_pcs) > 0" class="text-rose-500 font-bold"> (-{{ formatRupiah(order.discount_vendor_pcs) }})</span>
                                                    • Ongkir: {{ formatRupiah(order.total_ongkir_vendor) }}
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 whitespace-nowrap">
                                                <!-- Single line chip (inline-block whitespace-nowrap) -->
                                                <span :class="getStatusBadgeClass(order.status_order)" class="inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-black border">
                                                    {{ order.status_order }}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6 text-center whitespace-nowrap w-[170px]">
                                                <!-- Kolom Tindakan Tertata Rapi & Kompak (Vertikal Stack Bersih) -->
                                                <div class="flex flex-col items-center justify-center gap-1.5 w-full">
                                                    <!-- Jika Menunggu Respon Vendor -->
                                                    <button v-if="order.status_order === 'Menunggu Respon Vendor'" @click="openOfferModal(order)" class="w-full max-w-[140px] px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm transition-all">
                                                        Ambil Pesanan
                                                    </button>
                                                    
                                                    <!-- Jika Menunggu Review Harga PO -->
                                                    <template v-else-if="order.status_order === 'Menunggu Review Harga PO'">
                                                        <span class="w-full max-w-[140px] px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 text-center">
                                                            Menunggu ACC PO
                                                        </span>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian
                                                        </button>
                                                    </template>

                                                    <!-- Jika Diproses PO (Siap Upload HJ) -->
                                                    <template v-else-if="order.status_order === 'Diproses PO'">
                                                        <button @click="openQCCamera(order)" class="w-full max-w-[140px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1">
                                                            <i class="mdi mdi-camera"></i> Unggah HJ
                                                        </button>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian
                                                        </button>
                                                    </template>

                                                    <!-- Jika HJ Masuk (Menunggu SPV CS) -->
                                                    <template v-else-if="order.status_order === 'HJ Masuk'">
                                                        <span class="w-full max-w-[140px] px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 text-center">
                                                            Menunggu ACC HJ
                                                        </span>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian
                                                        </button>
                                                    </template>

                                                    <!-- Jika HJ Perlu Revisi (Ditolak SPV CS) -->
                                                    <template v-else-if="order.status_order === 'HJ Perlu Revisi'">
                                                        <button @click="openQCCamera(order)" class="w-full max-w-[140px] px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1 animate-pulse">
                                                            <i class="mdi mdi-refresh"></i> Unggah Ulang HJ
                                                        </button>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all">
                                                            Lihat Catatan
                                                        </button>
                                                    </template>

                                                    <!-- Jika HJ Disetujui (Siap Kirim & Upload HL) -->
                                                    <template v-else-if="order.status_order === 'HJ Disetujui'">
                                                        <button @click="openDeliveryView(order)" class="w-full max-w-[140px] px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1">
                                                            <i class="mdi mdi-truck-fast"></i> Unggah HL
                                                        </button>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian
                                                        </button>
                                                    </template>

                                                    <!-- Jika HL Masuk (Menunggu SPV CS) -->
                                                    <template v-else-if="order.status_order === 'HL Masuk'">
                                                        <span class="w-full max-w-[140px] px-2.5 py-1 rounded-xl text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 text-center">
                                                            Menunggu ACC HL
                                                        </span>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian
                                                        </button>
                                                    </template>

                                                    <!-- Jika HL Perlu Revisi (Ditolak SPV CS) -->
                                                    <template v-else-if="order.status_order === 'HL Perlu Revisi'">
                                                        <button @click="openDeliveryView(order)" class="w-full max-w-[140px] px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1 animate-pulse">
                                                            <i class="mdi mdi-refresh"></i> Unggah Ulang HL
                                                        </button>
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all">
                                                            Lihat Catatan
                                                        </button>
                                                    </template>

                                                    <!-- Jika Selesai -->
                                                    <template v-else-if="order.status_order === 'Selesai' || order.status_order === 'HL Disetujui'">
                                                        <button @click="openProductionDetail(order)" class="w-full max-w-[140px] px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
                                                            Rincian Lengkap
                                                        </button>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Paginasi Simpel -->
                            <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                <div class="text-slate-400 font-bold">
                                    Menampilkan {{ paginatedOrders.length }} dari {{ filteredOrders.length }} pesanan
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <button @click="currentPage--" :disabled="currentPage <= 1" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                    <span class="px-3 py-1.5 font-black text-slate-800">Hal {{ currentPage }} dari {{ totalPages }}</span>
                                    <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============================================================================== -->
                    <!-- VIEW B: USER MANAGEMENT (Admin Irandra & Admin Vendor) -->
                    <!-- ============================================================================== -->
                    <div v-else-if="currentView === 'users' && canManageUsers" class="space-y-6">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 class="text-base font-black text-slate-900">Manajemen Pengguna Vendor</h3>
                                <p class="text-xs text-slate-400 font-medium">
                                    {{ currentUser.role === 'Admin Irandra' ? 'Kelola pengguna untuk seluruh toko vendor mitra' : 'Kelola staf dan operator untuk ' + (currentVendor?.nama_vendor || 'Toko Mitra') }}
                                </p>
                            </div>
                            <button @click="openAddUserModal" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 self-start sm:self-auto">
                                <i class="mdi mdi-plus"></i> Tambah Pengguna Baru
                            </button>
                        </div>

                        <!-- Users Table Card -->
                        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div class="overflow-x-auto text-xs">
                                <table class="w-full text-left">
                                    <thead class="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 capitalize tracking-wider text-[10px]">
                                        <tr>
                                            <th class="py-3 px-6">Pengguna</th>
                                            <th class="py-3 px-6">Vendor Mitra</th>
                                            <th class="py-3 px-6">Peran (Role)</th>
                                            <th class="py-3 px-6">Nomor WhatsApp</th>
                                            <th class="py-3 px-6">Status</th>
                                            <th class="py-3 px-6 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                                        <tr v-for="user in visibleUsers" :key="user.id" class="hover:bg-slate-50/50">
                                            <td class="py-3.5 px-6 font-black text-slate-900 flex items-center gap-2.5">
                                                <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`" class="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200">
                                                <div>
                                                    <div>{{ user.name }}</div>
                                                    <div class="text-[10px] text-slate-400 font-normal">@{{ user.username }}</div>
                                                </div>
                                            </td>
                                            <td class="py-3.5 px-6 font-bold text-slate-800">
                                                {{ getVendorName(user.vendor_id) }}
                                            </td>
                                            <td class="py-3.5 px-6">
                                                <span :class="getRoleBadgeClass(user.role)" class="px-2 py-0.5 rounded-md text-[10px] font-black border">
                                                    {{ user.role }}
                                                </span>
                                            </td>
                                            <td class="py-3.5 px-6 font-bold">{{ user.whatsapp }}</td>
                                            <td class="py-3.5 px-6 text-emerald-600 font-bold">Aktif</td>
                                            <td class="py-3.5 px-6 text-right">
                                                <button v-if="user.id !== currentUser.id" @click="deleteUser(user.id)" class="text-rose-500 hover:text-rose-700 font-bold text-xs transition-all">
                                                    Hapus
                                                </button>
                                                <span v-else class="text-slate-300 font-bold text-[11px] italic">
                                                    Akun Anda
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- VIEW C: AKSES TERBATAS UNTUK STAFF VENDOR JIKA BUKA URL INI -->
                    <div v-else-if="currentView === 'users' && !canManageUsers" class="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
                        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center text-2xl">
                            <i class="mdi mdi-shield-lock-outline"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-black text-slate-900">Akses Terbatas Staf Vendor</h3>
                            <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                Halaman Manajemen Pengguna hanya dapat diakses oleh <b>Admin Irandra</b> atau <b>Admin Vendor (Sarah Tan)</b> untuk mengelola akun staf tokonya.
                            </p>
                        </div>
                        <button @click="navigateTo('dashboard', 'Semua')" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5">
                            <i class="mdi mdi-arrow-left"></i> Kembali Ke Daftar Pesanan
                        </button>
                    </div>
                </div>
            </main>

            <!-- ============================================================================== -->
            <!-- DIALOG 1: PENGAJUAN PESANAN BARU (INPUT HARGA DASAR, DISKON VENDOR, ONGKIR) -->
            <!-- ============================================================================== -->
            <div v-if="currentIncomingOrder" class="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4">
                <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative modal-dialog-content">
                    <button @click="closeIncomingOrderModal" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all" title="Tutup Dialog">
                        <i class="mdi mdi-close text-lg"></i>
                    </button>

                    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white text-center">
                        <div class="text-[10px] font-bold text-emerald-200 capitalize tracking-wider mb-0.5">Penugasan Pesanan Masuk (Antrean: {{ incomingOrderQueue.length }})</div>
                        <h3 class="text-lg font-black tracking-tight">PO Irandra Menugaskan Pesanan!</h3>

                        <div class="mt-3 inline-flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-white/20">
                            <span class="text-xs font-bold text-slate-300">Waktu Respon:</span>
                            <span class="text-sm font-black text-amber-400 font-mono tracking-wider">{{ timerCountdownFormatted }}</span>
                            <span class="text-[10px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">15 Menit</span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4 text-xs">
                        <div class="space-y-2 border-b border-slate-100 pb-3">
                            <div class="flex justify-between">
                                <span class="font-bold text-slate-400">Order ID:</span>
                                <span class="font-black text-slate-900">{{ currentIncomingOrder.order_id }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-slate-400">Produk:</span>
                                <span class="font-black text-slate-900 text-right">{{ currentIncomingOrder.produk }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-slate-400">Ukuran:</span>
                                <span class="font-black text-slate-700 text-right">{{ currentIncomingOrder.produk_ukuran }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-slate-400">Pengiriman:</span>
                                <span class="font-black text-rose-600 text-right">{{ currentIncomingOrder.kota_pengiriman }} • {{ currentIncomingOrder.tanggal_pengiriman }} ({{ currentIncomingOrder.jam_pengiriman }})</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-slate-400">Teks Redaksi:</span>
                                <span class="font-semibold italic text-slate-700 text-right max-w-xs truncate">"{{ currentIncomingOrder.nama_redaksi_tujuan }}"</span>
                            </div>
                        </div>

                        <div class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div class="font-black text-slate-800 text-[11px] capitalize">Input Penawaran Biaya Vendor</div>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block font-bold text-slate-600 mb-1">Harga Dasar / Pcs (Rp)</label>
                                    <input v-model.number="offerForm.harga_dasar" type="number" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-slate-900 text-xs focus:outline-none focus:border-emerald-500">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-600 mb-1">Diskon Vendor / Pcs (Rp)</label>
                                    <input v-model.number="offerForm.discount_vendor" type="number" placeholder="0" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-rose-600 text-xs focus:outline-none focus:border-emerald-500">
                                </div>
                            </div>

                            <div>
                                <label class="block font-bold text-slate-600 mb-1">Total Ongkir Pengiriman (Rp)</label>
                                <input v-model.number="offerForm.ongkir" type="number" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-slate-900 text-xs focus:outline-none focus:border-emerald-500">
                            </div>

                            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                                <div>
                                    <span class="text-[10px] font-bold text-emerald-800 block">Total Payout Vendor:</span>
                                    <span class="text-xs text-slate-500 font-medium">(Harga Dasar - Diskon) + Ongkir</span>
                                </div>
                                <span class="text-sm font-black text-emerald-700">
                                    {{ formatRupiah((Number(offerForm.harga_dasar || 0) - Number(offerForm.discount_vendor || 0)) + Number(offerForm.ongkir || 0)) }}
                                </span>
                            </div>
                        </div>

                        <div class="pt-2 grid grid-cols-2 gap-3">
                            <button @click="rejectOrderModal = true" class="w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-extrabold text-xs py-3 rounded-xl border border-slate-200 transition-all">
                                Tidak Bersedia
                            </button>
                            <button @click="acceptOrderWithOffer(currentIncomingOrder)" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5">
                                <i class="mdi mdi-check"></i>
                                <span>Kirim Penawaran Harga</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================================================== -->
            <!-- DIALOG 2: ALASAN TIDAK BERSEDIA (DENGAN FREE TEXT INPUT) -->
            <!-- ============================================================================== -->
            <div v-if="rejectOrderModal" class="fixed inset-0 modal-overlay z-[110] flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs modal-dialog-content">
                    <div>
                        <h4 class="text-sm font-black text-slate-900">Alasan Tidak Dapat Menerima Pesanan</h4>
                        <p class="text-slate-400 font-medium mt-0.5">Sistem akan segera menginformasikan ke tim PO Irandra untuk dialihkan ke vendor lain.</p>
                    </div>

                    <div class="space-y-2 font-bold text-slate-700">
                        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 cursor-pointer">
                            <input type="radio" value="Bahan baku / bunga kosong" v-model="rejectReason" class="text-rose-600">
                            <span>Bahan baku tertentu tidak mencukupi</span>
                        </label>
                        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 cursor-pointer">
                            <input type="radio" value="Kapasitas produksi penuh" v-model="rejectReason" class="text-rose-600">
                            <span>Kapasitas produksi hari ini sedang penuh</span>
                        </label>
                        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 cursor-pointer">
                            <input type="radio" value="Jadwal pengiriman tidak terkejar" v-model="rejectReason" class="text-rose-600">
                            <span>Jadwal pengiriman terlalu mepet / armada tidak tersedia</span>
                        </label>
                        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 cursor-pointer">
                            <input type="radio" value="Lainnya" v-model="rejectReason" class="text-rose-600">
                            <span>Alasan Lainnya (Tulis Sendiri)</span>
                        </label>
                    </div>

                    <!-- Free Text Area Alasan Menolak -->
                    <div v-if="rejectReason === 'Lainnya'" class="space-y-1 pt-1">
                        <label class="block font-bold text-slate-600">Tuliskan Alasan Penolakan</label>
                        <textarea v-model="rejectCustomText" rows="3" required placeholder="Tuliskan kendala secara spesifik agar tim PO memahami..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-rose-500"></textarea>
                    </div>

                    <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button @click="rejectOrderModal = false" class="px-3.5 py-2 font-bold text-slate-500 hover:text-slate-800">Kembali</button>
                        <button @click="confirmRejectOrder" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-sm">Konfirmasi Tolak</button>
                    </div>
                </div>
            </div>

            <!-- ============================================================================== -->
            <!-- DIALOG 3: RINCIAN PESANAN (STRUKTUR LENGKAP SESUAI TRANSACFORM) -->
            <!-- ============================================================================== -->
            <div v-if="detailDialog && selectedOrder" class="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4">
                <div class="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-xs max-h-[90vh] flex flex-col modal-dialog-content">
                    <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h3 class="text-sm font-black text-slate-900">Detail Order #{{ selectedOrder.order_id }}</h3>
                            <div class="text-[11px] text-slate-400 font-semibold">Customer: {{ selectedOrder.customer_name || 'Pelanggan Irandra' }} • Staf PO: {{ selectedOrder.po || 'PO Irandra Pusat' }}</div>
                        </div>
                        <button @click="detailDialog = false" class="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all">
                            <i class="mdi mdi-close text-lg"></i>
                        </button>
                    </div>

                    <div class="p-5 bg-slate-50 overflow-y-auto space-y-4">
                        <!-- Alert Banner Jika Ada Revisi dari SPV CS -->
                        <div v-if="selectedOrder.status_order === 'HJ Perlu Revisi' || selectedOrder.status_hasil_jadi === 'Revisi'" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                            <i class="mdi mdi-alert-circle text-rose-600 text-xl shrink-0 mt-0.5"></i>
                            <div>
                                <div class="font-black text-rose-800">Hasil Jadi Memerlukan Revisi!</div>
                                <div class="font-medium text-rose-700 mt-0.5">{{ selectedOrder.penilaian_hasil_jadi_vendor || selectedOrder.catatan_revisi_hj || 'Foto hasil rangkaian belum sesuai standar/referensi. Mohon perbaiki dan unggah ulang.' }}</div>
                            </div>
                        </div>

                        <div v-if="selectedOrder.status_order === 'HL Perlu Revisi' || selectedOrder.status_hasil_lokasi === 'Revisi'" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                            <i class="mdi mdi-alert-circle text-rose-600 text-xl shrink-0 mt-0.5"></i>
                            <div>
                                <div class="font-black text-rose-800">Hasil Lokasi Memerlukan Revisi!</div>
                                <div class="font-medium text-rose-700 mt-0.5">{{ selectedOrder.penilaian_hasil_lokasi_vendor || selectedOrder.catatan_revisi_hl || 'Foto bukti pengantaran di lokasi buram / tidak terlihat nomor gedung. Mohon kirimkan foto atau video ulang.' }}</div>
                            </div>
                        </div>

                        <!-- 1. Informasi Order -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
                            <h4 class="font-black text-[11px] capitalize tracking-wide text-emerald-800 border-b border-slate-100 pb-2">1. Informasi Order</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Order ID</span><span class="font-black text-slate-900">{{ selectedOrder.order_id }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Status Order</span><span class="font-black" :class="getStatusBadgeClass(selectedOrder.status_order)">{{ selectedOrder.status_order }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Produk</span><span class="font-bold text-slate-800">{{ selectedOrder.produk }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Ukuran & Jumlah</span><span class="font-bold text-slate-800">{{ selectedOrder.produk_ukuran }} ({{ selectedOrder.jumlah_produk }} pcs)</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Jadwal Pengiriman</span><span class="font-black text-slate-900">{{ selectedOrder.tanggal_pengiriman }} ({{ selectedOrder.jam_pengiriman }})</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Kontak Penerima</span><span class="font-black text-emerald-700">{{ selectedOrder.no_telp_penerima }}</span></div>
                            </div>
                            <div class="pt-1">
                                <span class="text-slate-400 font-bold block mb-0.5">Alamat Lengkap Pengiriman:</span>
                                <span class="font-bold text-slate-800">{{ selectedOrder.alamat_pengiriman }} ({{ selectedOrder.kota_pengiriman }})</span>
                            </div>
                        </div>

                        <!-- 2. Redaksi Kartu / Papan & Referensi Gambar -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h4 class="font-black text-[11px] capitalize tracking-wide text-emerald-800">2. Redaksi Kartu Ucapan / Papan Bunga</h4>
                                <button @click="copyText(selectedOrder.nama_redaksi_tujuan)" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[11px] hover:bg-emerald-100 flex items-center gap-1">
                                    <i class="mdi mdi-content-copy"></i> Salin Redaksi
                                </button>
                            </div>
                            <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                                <div class="text-[10px] font-bold text-amber-800 capitalize">Teks Ucapan:</div>
                                <p class="text-sm font-bold text-slate-800 whitespace-pre-line leading-relaxed">{{ selectedOrder.nama_redaksi_tujuan }}</p>
                                <div class="pt-2 border-t border-amber-200/60 font-bold text-slate-700">
                                    Pengirim (Di Papan/Pita): <span class="font-black text-slate-900">{{ selectedOrder.nama_pengirim_papan }}</span>
                                </div>
                            </div>
                            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <span class="text-[10px] font-bold text-slate-400 block mb-0.5">Catatan Khusus Pemesan:</span>
                                <span class="font-bold text-slate-800">{{ selectedOrder.note_permintaan || 'Kerjakan sesuai standar kerapian dan kualitas katalog.' }}</span>
                            </div>
                        </div>

                        <!-- 3. Pengecekan Kualitas & Bukti Dokumentasi (QC HJ & HL) -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                            <h4 class="font-black text-[11px] capitalize tracking-wide text-emerald-800 border-b border-slate-100 pb-2">3. Pengecekan Produksi & Pengiriman (QC)</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="font-black text-slate-800">Foto Hasil Jadi (HJ)</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-black" :class="selectedOrder.foto_hasil_jadi ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'">
                                            {{ selectedOrder.status_hasil_jadi || (selectedOrder.foto_hasil_jadi ? 'Sudah Diunggah' : 'Belum Ada') }}
                                        </span>
                                    </div>
                                    <div class="aspect-4/3 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center">
                                        <img v-if="selectedOrder.foto_hasil_jadi" :src="selectedOrder.foto_hasil_jadi" class="w-full h-full object-cover">
                                        <span v-else class="text-slate-400 italic font-semibold">Belum Diunggah</span>
                                    </div>
                                </div>

                                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="font-black text-slate-800">Foto & Video Hasil Lokasi (HL)</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-black" :class="selectedOrder.foto_hasil_lokasi ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'">
                                            {{ selectedOrder.status_hasil_lokasi || (selectedOrder.foto_hasil_lokasi ? 'Sudah Diunggah' : 'Belum Ada') }}
                                        </span>
                                    </div>
                                    <div class="aspect-4/3 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center">
                                        <img v-if="selectedOrder.foto_hasil_lokasi" :src="selectedOrder.foto_hasil_lokasi" class="w-full h-full object-cover">
                                        <span v-else class="text-slate-400 italic font-semibold">Belum Diunggah</span>
                                    </div>
                                    <div v-if="selectedOrder.video_hasil_lokasi" class="pt-1 text-[11px] font-bold text-teal-700 flex items-center gap-1">
                                        <i class="mdi mdi-video"></i> Video lokasi tersedia (1 lampiran)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 4. Rincian Tagihan & Biaya Vendor -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
                            <h4 class="font-black text-[11px] capitalize tracking-wide text-emerald-800 border-b border-slate-100 pb-2">4. Biaya Pengerjaan Vendor</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Harga Dasar Vendor</span><span class="font-bold text-slate-900">{{ formatRupiah(selectedOrder.harga_dasar_vendor_pcs) }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Diskon Vendor</span><span class="font-bold text-rose-600">-{{ formatRupiah(selectedOrder.discount_vendor_pcs) }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Total Ongkir Vendor</span><span class="font-bold text-slate-900">{{ formatRupiah(selectedOrder.total_ongkir_vendor) }}</span></div>
                                <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-400 font-bold">Total Payout Diterima</span><span class="font-black text-emerald-700 text-sm">{{ formatRupiah(calculateNetVendorPay(selectedOrder)) }}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================================================== -->
            <!-- ============================================================================== -->
            <!-- DIALOG 4: UNGGAH FOTO HASIL JADI (HJ) (DENGAN PENANGANAN REVISI) -->
            <!-- ============================================================================== -->
            <div v-if="qcCameraDialog && selectedOrder" class="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs modal-dialog-content">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                            <h3 class="text-base font-black text-slate-900">
                                {{ selectedOrder.status_order === 'HJ Perlu Revisi' ? 'Unggah Ulang Hasil Jadi (Revisi)' : 'Unggah Hasil Jadi (HJ)' }}
                            </h3>
                            <p class="text-slate-400 font-medium">{{ selectedOrder.order_id }} • {{ selectedOrder.produk }}</p>
                        </div>
                        <button @click="qcCameraDialog = false" class="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <i class="mdi mdi-close text-lg"></i>
                        </button>
                    </div>

                    <!-- Peringatan jika order dalam status revisi -->
                    <div v-if="selectedOrder.status_order === 'HJ Perlu Revisi'" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                        <div class="font-bold flex items-center gap-1.5"><i class="mdi mdi-alert"></i> Catatan Revisi SPV CS:</div>
                        <div class="mt-0.5 text-[11px]">{{ selectedOrder.penilaian_hasil_jadi_vendor || 'Susunan warna bunga bagian atas kurang seimbang. Harap dirapikan kembali.' }}</div>
                    </div>

                    <!-- Upload Input / Watermark Preview -->
                    <div class="aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden relative border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all">
                        <template v-if="uploadedHJPreview">
                            <img :src="uploadedHJPreview" class="w-full h-full object-cover">
                            <div class="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-3 text-white text-[11px] font-mono leading-tight flex items-end justify-between border border-white/20">
                                <div>
                                    <div class="text-emerald-400 font-bold mb-0.5">QC Foto Hasil Jadi (HJ)</div>
                                    <div>Order ID: {{ selectedOrder.order_id }}</div>
                                    <div>Vendor: {{ currentVendor?.nama_vendor }}</div>
                                    <div>Waktu: {{ new Date().toLocaleString('id-ID') }}</div>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold text-[10px]">Terkonfirmasi</span>
                            </div>
                        </template>
                        <template v-else>
                            <label class="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-slate-50 transition-all text-center">
                                <i class="mdi mdi-camera-plus text-3xl text-emerald-600 mb-2"></i>
                                <span class="font-black text-slate-800 text-xs">Pilih Foto Rangkaian Bunga (HJ)</span>
                                <span class="text-slate-400 font-semibold text-[10px] mt-1">Format JPG atau PNG (Maks 10 MB)</span>
                                <input type="file" accept="image/*" class="hidden" @change="onHJFileChange">
                            </label>
                        </template>
                    </div>

                    <div v-if="uploadedHJPreview" class="flex justify-end">
                        <label class="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1">
                            <i class="mdi mdi-refresh"></i> Ganti Foto Rangkaian
                            <input type="file" accept="image/*" class="hidden" @change="onHJFileChange">
                        </label>
                    </div>

                    <!-- Tombol Aksi & Uji Coba Status -->
                    <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div class="text-[10px] font-bold text-slate-500 capitalize tracking-wide">Uji Coba Respon SPV CS:</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="simulateHJRejection(selectedOrder)" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-all">
                                <i class="mdi mdi-close-circle"></i> Tolak QC (Revisi)
                            </button>
                            <button @click="submitHJ(selectedOrder)" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all">
                                <i class="mdi mdi-check-circle"></i> Kirim Ke SPV CS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================================================== -->
            <!-- DIALOG 5: UNGGAH FOTO & VIDEO HASIL LOKASI (HL) (DENGAN PENANGANAN REVISI) -->
            <!-- ============================================================================== -->
            <div v-if="deliveryDialog && selectedOrder" class="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-xs modal-dialog-content">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                            <h3 class="text-base font-black text-slate-900">
                                {{ selectedOrder.status_order === 'HL Perlu Revisi' ? 'Unggah Ulang Hasil Lokasi (Revisi)' : 'Unggah Hasil Lokasi (HL)' }}
                            </h3>
                            <p class="text-slate-400 font-medium">{{ selectedOrder.order_id }} • Pengantaran Tujuan</p>
                        </div>
                        <button @click="deliveryDialog = false" class="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <i class="mdi mdi-close text-lg"></i>
                        </button>
                    </div>

                    <!-- Peringatan jika order dalam status revisi HL -->
                    <div v-if="selectedOrder.status_order === 'HL Perlu Revisi'" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                        <div class="font-bold flex items-center gap-1.5"><i class="mdi mdi-alert"></i> Catatan Revisi SPV CS:</div>
                        <div class="mt-0.5 text-[11px]">{{ selectedOrder.penilaian_hasil_lokasi_vendor || 'Plang nomor gedung penerima terhalang. Harap unggah foto yang menampakkan lokasi jelas atau sertakan video singkat.' }}</div>
                    </div>

                    <!-- Address Box -->
                    <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div>
                            <div class="font-black text-slate-900 text-sm">Penerima: {{ selectedOrder.no_telp_penerima }}</div>
                            <div class="text-slate-600 font-medium mt-0.5">{{ selectedOrder.alamat_pengiriman }} ({{ selectedOrder.kota_pengiriman }})</div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <a :href="`https://maps.google.com/?q=${encodeURIComponent(selectedOrder.alamat_pengiriman + ' ' + selectedOrder.kota_pengiriman)}`" target="_blank" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-1.5 transition-all">
                                <i class="mdi mdi-map-marker"></i> Google Maps
                            </a>
                            <a :href="`https://wa.me/${selectedOrder.no_telp_penerima ? selectedOrder.no_telp_penerima.replace(/[^0-9]/g, '') : ''}`" target="_blank" class="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold flex items-center justify-center gap-1.5 transition-all">
                                <i class="mdi mdi-whatsapp text-emerald-600"></i> WhatsApp
                            </a>
                        </div>
                    </div>

                    <!-- Photo & Video HL Options -->
                    <div class="space-y-2">
                        <div class="aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden relative border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all">
                            <template v-if="uploadedHLPreview">
                                <img :src="uploadedHLPreview" class="w-full h-full object-cover">
                                <div class="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-3 text-white text-[11px] font-mono leading-tight flex items-end justify-between border border-white/20">
                                    <div>
                                        <div class="text-teal-400 font-bold mb-0.5">Bukti Hasil Lokasi (HL)</div>
                                        <div>Order ID: {{ selectedOrder.order_id }}</div>
                                        <div>Waktu: {{ new Date().toLocaleString('id-ID') }}</div>
                                    </div>
                                    <span class="px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 font-bold text-[10px]">Terkonfirmasi</span>
                                </div>
                            </template>
                            <template v-else>
                                <label class="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-slate-50 transition-all text-center">
                                    <i class="mdi mdi-camera-plus text-3xl text-teal-600 mb-2"></i>
                                    <span class="font-black text-slate-800 text-xs">Pilih Foto Bukti Lokasi (HL)</span>
                                    <span class="text-slate-400 font-semibold text-[10px] mt-1">Format JPG atau PNG (Maks 10 MB)</span>
                                    <input type="file" accept="image/*" class="hidden" @change="onHLFileChange">
                                </label>
                            </template>
                        </div>

                        <div v-if="uploadedHLPreview" class="flex justify-end">
                            <label class="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer flex items-center gap-1">
                                <i class="mdi mdi-refresh"></i> Ganti Foto Lokasi
                                <input type="file" accept="image/*" class="hidden" @change="onHLFileChange">
                            </label>
                        </div>

                        <!-- Opsi Video Hasil Lokasi (video_hasil_lokasi) -->
                        <div class="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i class="mdi mdi-video text-teal-700 text-lg"></i>
                                <div>
                                    <div class="font-black text-slate-800 text-[11px]">Video Bukti Penempatan Lokasi</div>
                                    <div class="text-[10px] text-slate-400 font-medium">Opsional jika dibutuhkan rekaman 360 derajat</div>
                                </div>
                            </div>
                            <label class="px-2.5 py-1 bg-white border border-teal-300 rounded-lg text-teal-700 font-extrabold text-[10px] cursor-pointer hover:bg-teal-50 transition-all">
                                <span>{{ selectedOrder.video_hasil_lokasi ? 'Video Dipilih' : 'Pilih Video' }}</span>
                                <input type="file" accept="video/*" class="hidden" @change="attachVideoHL">
                            </label>
                        </div>
                    </div>

                    <!-- Tombol Aksi & Uji Coba Status -->
                    <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div class="text-[10px] font-bold text-slate-500 capitalize tracking-wide">Uji Coba Respon SPV CS:</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="simulateHLRejection(selectedOrder)" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-all">
                                <i class="mdi mdi-close-circle"></i> Tolak QC (Revisi)
                            </button>
                            <button @click="submitHL(selectedOrder)" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all">
                                <i class="mdi mdi-check-circle"></i> Kirim Hasil Lokasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DIALOG 6: TAMBAH PENGGUNA VENDOR -->
            <div v-if="showAddUserModal" class="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 text-xs modal-dialog-content">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-black text-slate-900">Tambah Pengguna Vendor Baru</h3>
                            <p class="text-slate-400 font-medium">Buat akun untuk staf atau operator vendor mitra</p>
                        </div>
                        <button @click="showAddUserModal = false" class="text-slate-400 hover:text-slate-600"><i class="mdi mdi-close text-lg"></i></button>
                    </div>

                    <form @submit.prevent="saveNewUser" class="space-y-3.5">
                        <div v-if="currentUser.role === 'Admin Irandra'">
                            <label class="block font-bold text-slate-600 mb-1">Pilih Vendor Mitra</label>
                            <select v-model="newUserForm.vendor_id" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                <option v-for="v in vendors" :key="v.id" :value="v.id">{{ v.nama_vendor }} ({{ v.kota_vendor }})</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Nama Lengkap</label>
                            <input v-model="newUserForm.name" type="text" required placeholder="Contoh: Rian Maulana" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Username Login</label>
                            <input v-model="newUserForm.username" type="text" required placeholder="Contoh: rian_operator" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Peran (Role)</label>
                            <select v-model="newUserForm.role" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                <option value="Admin Vendor">Admin Vendor (Kelola Tim & Penawaran)</option>
                                <option value="Staff Vendor">Staff Vendor (Operasional Hasil Jadi & Lokasi)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Nomor WhatsApp</label>
                            <input v-model="newUserForm.whatsapp" type="tel" required placeholder="Contoh: 081234567890" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-600 mb-1">Kata Sandi (Password)</label>
                            <input v-model="newUserForm.password" type="password" required placeholder="Minimal 6 karakter" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                        </div>

                        <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
                            <button type="button" @click="showAddUserModal = false" class="px-4 py-2 font-bold text-slate-500 hover:text-slate-800">Batalkan</button>
                            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md shadow-emerald-600/20">Simpan Pengguna</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>

    <!-- Application Script -->
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';

const STORAGE_KEY_ORDERS = 'irandra_vendor_orders';
        const STORAGE_KEY_USERS = 'irandra_vendor_users';
        const STORAGE_KEY_AUTH = 'irandra_vendor_current_user';

        const initialVendors = [
            { id: 'vndr_tokoku', nama_vendor: 'Tokoku - Jakarta', kota_vendor: 'Jakarta' },
            { id: 'vndr_namia', nama_vendor: 'Namia Florist - Jakarta', kota_vendor: 'Jakarta' },
            { id: 'vndr_bintang', nama_vendor: 'Bintang Florist - Jakarta', kota_vendor: 'Jakarta' }
        ];

        const initialUsers = [
            { id: 'u1', username: 'budi_irandra', name: 'Budi Santoso', role: 'Admin Irandra', vendor_id: null, whatsapp: '081122334455' },
            { id: 'u2', username: 'sarah_tokoku', name: 'Sarah Tan', role: 'Admin Vendor', vendor_id: 'vndr_tokoku', whatsapp: '081234567890' },
            { id: 'u3', username: 'alex_tokoku', name: 'Alex Chen', role: 'Staff Vendor', vendor_id: 'vndr_tokoku', whatsapp: '081398765432' }
        ];

        const initialOrders = [
            {
                order_id: 'ORD-202330',
                vendor_id: 'vndr_tokoku',
                customer_name: 'PT. Cahaya Harapan Satya',
                po: 'PO Irandra Pusat',
                produk: 'Bunga Papan Duka Cita',
                produk_ukuran: 'Papan Kecil 2x1 Jambul 2',
                jumlah_produk: 1,
                nama_pengirim_papan: 'PT. Cahaya Harapan Satya Printing',
                nama_redaksi_tujuan: 'Turut Berduka Cita \nAtas Meninggalnya \nBpk. Ivan Sanjaya Tjeuw',
                note_permintaan: 'Sesuai contoh pada foto',
                alamat_pengiriman: 'Rumah Duka Husada Lantai 2 Ruangan Lily',
                kota_pengiriman: 'Jakarta',
                tanggal_pengiriman: '2026-09-01',
                jam_pengiriman: '15:00',
                no_telp_penerima: '085778027755',
                status_order: 'Diproses PO',
                status_hasil_jadi: 'Belum',
                status_hasil_lokasi: 'Belum',
                vendor: 'Tokoku - Jakarta',
                total_ongkir_vendor: 0,
                harga_dasar_vendor_pcs: 400000,
                discount_vendor_pcs: 0,
                foto_hasil_jadi: null,
                foto_hasil_lokasi: null,
                video_hasil_lokasi: null,
                created_time: 1788240455000
            },
            {
                order_id: 'ORD-203055',
                vendor_id: 'vndr_tokoku',
                customer_name: 'Robby & Haflaiza Family',
                po: 'PO Irandra Pusat',
                produk: 'Bunga Papan Wedding',
                produk_ukuran: 'Standard - 2 x 1.25 - Jambul 4',
                jumlah_produk: 1,
                nama_pengirim_papan: 'Full Logo Manual Freak Out',
                nama_redaksi_tujuan: 'Happy Wedding \nRobby & Haflaiza',
                note_permintaan: 'Model dan warna seperti contoh. Logo manual rapi.',
                alamat_pengiriman: 'Reve Space - Jl. Damai Raya No.16, Pesanggrahan',
                kota_pengiriman: 'Jakarta Selatan',
                tanggal_pengiriman: '2026-09-26',
                jam_pengiriman: '12:00',
                no_telp_penerima: '08159540000',
                status_order: 'HJ Disetujui',
                status_hasil_jadi: 'Disetujui',
                status_hasil_lokasi: 'Belum',
                vendor: 'Tokoku - Jakarta',
                total_ongkir_vendor: 15000,
                harga_dasar_vendor_pcs: 550000,
                discount_vendor_pcs: 25000,
                foto_hasil_jadi: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
                foto_hasil_lokasi: null,
                video_hasil_lokasi: null,
                created_time: 1790383148000
            },
            {
                order_id: 'ORD-201935',
                vendor_id: 'vndr_tokoku',
                customer_name: 'Cakra Bowling Club',
                po: 'PO Irandra Pusat',
                produk: 'Standing Flower Duka Cita',
                produk_ukuran: 'Exclusive',
                jumlah_produk: 1,
                nama_pengirim_papan: 'Cakra Bowling Club',
                nama_redaksi_tujuan: 'Turut Berduka Cita \nAtas Meninggalnya \nNy. Indrawati Hanafiah',
                note_permintaan: 'Model dan warna bunga segar sesuai referensi.',
                alamat_pengiriman: 'Tabitha Ukrida Ruang Eirene 3',
                kota_pengiriman: 'Jakarta Barat',
                tanggal_pengiriman: '2026-08-17',
                jam_pengiriman: '16:00',
                no_telp_penerima: '081380585722',
                status_order: 'Selesai',
                status_hasil_jadi: 'Disetujui',
                status_hasil_lokasi: 'Disetujui',
                vendor: 'Tokoku - Jakarta',
                total_ongkir_vendor: 0,
                harga_dasar_vendor_pcs: 535000,
                discount_vendor_pcs: 0,
                foto_hasil_jadi: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
                foto_hasil_lokasi: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
                video_hasil_lokasi: 'video_dok_lokasi.mp4',
                created_time: 1786949005000
            }
        ];

export default {
  name: 'App',
  setup() {
                const drawer = ref(true);
                const isMobile = ref(false);
                const currentView = ref('dashboard');
                const orderFilter = ref('Semua');

                const searchQuery = ref('');
                const sortBy = ref('newest');
                const currentPage = ref(1);
                const itemsPerPage = ref(5);

                const updateWindowSize = () => {
                    isMobile.value = window.innerWidth < 1024;
                    if (isMobile.value) drawer.value = false;
                    else drawer.value = true;
                };

                const vendors = ref(initialVendors);

                // Reset data saat reload halaman agar selalu fresh dari awal sesuai arahan
                localStorage.removeItem(STORAGE_KEY_USERS);
                localStorage.removeItem(STORAGE_KEY_ORDERS);

                const loadUsers = () => {
                    return [...initialUsers];
                };
                const users = ref(loadUsers());
                const saveUsers = () => {
                    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users.value));
                };

                const loadAuthUser = () => {
                    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
                    return saved ? JSON.parse(saved) : null;
                };
                const currentUser = ref(loadAuthUser());

                const loginForm = ref({ identifier: '', password: '' });

                const loadOrders = () => {
                    return JSON.parse(JSON.stringify(initialOrders));
                };
                const orders = ref(loadOrders());
                const saveOrders = () => {
                    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders.value));
                };

                const incomingOrderQueue = ref([]);
                const currentIncomingOrder = computed(() => {
                    return incomingOrderQueue.value.length > 0 ? incomingOrderQueue.value[0] : null;
                });

                const rejectOrderModal = ref(false);
                const rejectReason = ref('Kapasitas produksi penuh');
                const rejectCustomText = ref('');
                const selectedOrder = ref(null);
                const detailDialog = ref(false);
                const qcCameraDialog = ref(false);
                const deliveryDialog = ref(false);
                const showAddUserModal = ref(false);

                // File Upload Reactive State (tanpa mock awal, diisi saat vendor memilih file)
                const uploadedHJPreview = ref(null);
                const uploadedHLPreview = ref(null);

                const onHJFileChange = (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            uploadedHJPreview.value = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                };

                const onHLFileChange = (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            uploadedHLPreview.value = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                };

                const offerForm = ref({
                    harga_dasar: 450000,
                    discount_vendor: 0,
                    ongkir: 20000
                });

                const newUserForm = ref({
                    vendor_id: 'vndr_tokoku',
                    name: '',
                    username: '',
                    role: 'Staff Vendor',
                    whatsapp: '',
                    password: ''
                });

                const timerSeconds = ref(15 * 60 - 15);
                const timerCountdownFormatted = computed(() => {
                    const m = Math.floor(timerSeconds.value / 60);
                    const s = timerSeconds.value % 60;
                    return `${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
                });

                setInterval(() => {
                    if (timerSeconds.value > 0) timerSeconds.value--;
                }, 1000);

                let simOrderIndex = 1;

                const triggerIncomingOrder = () => {
                    if (!currentUser.value) return;

                    const simId = 'ORD-2032' + (50 + simOrderIndex++);
                    const newOrder = {
                        order_id: simId,
                        vendor_id: 'vndr_tokoku',
                        customer_name: 'PT. Sinar Jaya Abadi',
                        po: 'PO Irandra Pusat',
                        produk: 'Bunga Papan Congratulations',
                        produk_ukuran: 'Standard - 2 x 1.25 - Jambul 2',
                        jumlah_produk: 1,
                        nama_pengirim_papan: 'PT. Sinar Jaya Abadi',
                        nama_redaksi_tujuan: 'Selamat & Sukses \nAtas Pembukaan Kantor Cabang Baru \nPT. Maju Bersama Sejahtera',
                        note_permintaan: 'Bunga segar, warna cerah (merah/kuning), cantumkan logo perusahaan.',
                        alamat_pengiriman: 'Gedung Menara Astra Lantai 18, Jl. Jend. Sudirman Kav. 5-6',
                        kota_pengiriman: 'Jakarta Pusat',
                        tanggal_pengiriman: 'Hari Ini',
                        jam_pengiriman: '14:00',
                        no_telp_penerima: '081298765432',
                        status_order: 'Menunggu Respon Vendor',
                        status_hasil_jadi: 'Belum',
                        status_hasil_lokasi: 'Belum',
                        vendor: 'Tokoku - Jakarta',
                        total_ongkir_vendor: 25000,
                        harga_dasar_vendor_pcs: 450000,
                        discount_vendor_pcs: 0,
                        foto_hasil_jadi: null,
                        foto_hasil_lokasi: null,
                        video_hasil_lokasi: null,
                        created_time: Date.now()
                    };

                    incomingOrderQueue.value.push(newOrder);
                    offerForm.value.harga_dasar = 450000;
                    offerForm.value.discount_vendor = 0;
                    offerForm.value.ongkir = 25000;
                };

                const handleGlobalDblClick = (e) => {
                    if (e && e.target && (e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('button') || e.target.closest('.modal-dialog-content'))) {
                        return;
                    }
                    triggerIncomingOrder();
                };

                const closeIncomingOrderModal = () => {
                    if (incomingOrderQueue.value.length > 0) {
                        incomingOrderQueue.value.shift();
                    }
                };

                const basePath = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

                const navigateTo = (view, filter = 'Semua') => {
                    currentView.value = view;
                    orderFilter.value = filter;
                    currentPage.value = 1;
                    const subPath = view === 'users' ? '/manajemen-pengguna' : '/dashboard';
                    const targetUrl = (basePath ? basePath : '') + subPath;
                    window.history.pushState({}, '', targetUrl);
                };

                const setOrderFilter = (st) => {
                    orderFilter.value = st;
                    currentPage.value = 1;
                };

                const parseRoute = () => {
                    const path = window.location.pathname.toLowerCase();
                    const hash = window.location.hash.toLowerCase();
                    if (path.includes('manajemen') || hash.includes('manajemen')) {
                        currentView.value = 'users';
                    } else {
                        currentView.value = 'dashboard';
                    }
                    currentPage.value = 1;
                };

                const isNavActive = (view) => {
                    return currentView.value === view;
                };

                const handleAccountSelect = (e) => {
                    const val = e.target.value;
                    if (val === 'admin_irandra') {
                        loginForm.value.identifier = 'budi_irandra';
                        loginForm.value.password = 'password123';
                    } else if (val === 'admin_vendor') {
                        loginForm.value.identifier = 'sarah_tokoku';
                        loginForm.value.password = 'password123';
                    } else if (val === 'staff_vendor') {
                        loginForm.value.identifier = 'alex_tokoku';
                        loginForm.value.password = 'password123';
                    } else {
                        loginForm.value.identifier = '';
                        loginForm.value.password = '';
                    }
                };

                const handleLoginSubmit = () => {
                    const found = users.value.find(u => u.username === loginForm.value.identifier || u.whatsapp === loginForm.value.identifier);
                    currentUser.value = found || users.value[1];
                    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser.value));
                    navigateTo('dashboard', 'Semua');
                };

                const currentVendor = computed(() => {
                    if (!currentUser.value || !currentUser.value.vendor_id) return null;
                    return vendors.value.find(v => v.id === currentUser.value.vendor_id);
                });

                const canManageUsers = computed(() => {
                    return currentUser.value && (currentUser.value.role === 'Admin Irandra' || currentUser.value.role === 'Admin Vendor');
                });

                const visibleUsers = computed(() => {
                    if (!currentUser.value) return [];
                    if (currentUser.value.role === 'Admin Irandra') return users.value;
                    return users.value.filter(u => u.vendor_id === currentUser.value.vendor_id);
                });

                const filteredOrders = computed(() => {
                    let list = [...orders.value];
                    if (currentUser.value && currentUser.value.vendor_id) {
                        list = list.filter(o => o.vendor_id === currentUser.value.vendor_id);
                    }
                    if (orderFilter.value !== 'Semua') {
                        list = list.filter(o => o.status_order === orderFilter.value);
                    }
                    if (searchQuery.value.trim()) {
                        const q = searchQuery.value.toLowerCase().trim();
                        list = list.filter(o => 
                            o.order_id?.toLowerCase().includes(q) ||
                            o.produk?.toLowerCase().includes(q) ||
                            o.alamat_pengiriman?.toLowerCase().includes(q) ||
                            o.nama_redaksi_tujuan?.toLowerCase().includes(q) ||
                            o.nama_pengirim_papan?.toLowerCase().includes(q)
                        );
                    }

                    if (sortBy.value === 'newest') {
                        list.sort((a, b) => (b.created_time || 0) - (a.created_time || 0));
                    } else if (sortBy.value === 'oldest') {
                        list.sort((a, b) => (a.created_time || 0) - (b.created_time || 0));
                    } else if (sortBy.value === 'price_high') {
                        list.sort((a, b) => calculateNetVendorPay(b) - calculateNetVendorPay(a));
                    } else if (sortBy.value === 'price_low') {
                        list.sort((a, b) => calculateNetVendorPay(a) - calculateNetVendorPay(b));
                    }

                    return list;
                });

                const totalPages = computed(() => {
                    return Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage.value));
                });

                const paginatedOrders = computed(() => {
                    const start = (currentPage.value - 1) * itemsPerPage.value;
                    return filteredOrders.value.slice(start, start + itemsPerPage.value);
                });

                watch(searchQuery, () => {
                    currentPage.value = 1;
                });

                const calculateNetVendorPay = (order) => {
                    const dasar = Number(order.harga_dasar_vendor_pcs || 0);
                    const disc = Number(order.discount_vendor_pcs || 0);
                    const ongkir = Number(order.total_ongkir_vendor || 0);
                    return Math.max(0, dasar - disc) + ongkir;
                };

                const totalVendorIncome = computed(() => {
                    return orders.value
                        .filter(o => (!currentUser.value?.vendor_id || o.vendor_id === currentUser.value.vendor_id))
                        .reduce((sum, o) => sum + calculateNetVendorPay(o), 0);
                });

                const countOrdersByStatus = (status) => {
                    return orders.value.filter(o => o.status_order === status && (!currentUser.value?.vendor_id || o.vendor_id === currentUser.value.vendor_id)).length;
                };

                const formatRupiah = (val) => {
                    return `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
                };

                const getVendorName = (vId) => {
                    if (!vId) return 'Kantor Irandra';
                    const v = vendors.value.find(x => x.id === vId);
                    return v ? v.nama_vendor : 'Vendor Mitra';
                };

                const getStatusBadgeClass = (status) => {
                    if (status === 'Menunggu Respon Vendor') return 'bg-amber-50 text-amber-700 border-amber-200';
                    if (status === 'Menunggu Review Harga PO') return 'bg-blue-50 text-blue-700 border-blue-200';
                    if (status === 'Diproses PO') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (status === 'HJ Masuk') return 'bg-amber-50 text-amber-800 border-amber-200';
                    if (status === 'HJ Perlu Revisi') return 'bg-rose-50 text-rose-700 border-rose-200';
                    if (status === 'HJ Disetujui') return 'bg-teal-50 text-teal-700 border-teal-200';
                    if (status === 'HL Masuk') return 'bg-teal-50 text-teal-800 border-teal-200';
                    if (status === 'HL Perlu Revisi') return 'bg-rose-50 text-rose-700 border-rose-200';
                    if (status === 'Selesai' || status === 'HL Disetujui') return 'bg-slate-100 text-slate-700 border-slate-200';
                    return 'bg-slate-50 text-slate-600 border-slate-200';
                };

                const getRoleBadgeClass = (role) => {
                    if (role === 'Admin Irandra') return 'bg-purple-50 text-purple-700 border-purple-200';
                    if (role === 'Admin Vendor') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    return 'bg-amber-50 text-amber-700 border-amber-200';
                };

                const getSampleImage = (order) => {
                    if (order.produk?.includes('Duka Cita')) return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
                    return 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80';
                };

                const logout = () => {
                    currentUser.value = null;
                    loginForm.value.identifier = '';
                    loginForm.value.password = '';
                    localStorage.removeItem(STORAGE_KEY_AUTH);
                    window.location.hash = '';
                };

                const openOfferModal = (order) => {
                    incomingOrderQueue.value.unshift(order);
                    offerForm.value.harga_dasar = order.harga_dasar_vendor_pcs || 450000;
                    offerForm.value.discount_vendor = order.discount_vendor_pcs || 0;
                    offerForm.value.ongkir = order.total_ongkir_vendor || 20000;
                };

                // Flow Sesuai Dokumen: Vendor Mengajukan Harga -> Status Jadi "Menunggu Review Harga PO"
                const acceptOrderWithOffer = (order) => {
                    order.harga_dasar_vendor_pcs = offerForm.value.harga_dasar;
                    order.discount_vendor_pcs = offerForm.value.discount_vendor || 0;
                    order.total_ongkir_vendor = offerForm.value.ongkir;
                    order.status_order = 'Menunggu Review Harga PO';

                    const existing = orders.value.find(o => o.order_id === order.order_id);
                    if (!existing) {
                        orders.value.unshift({ ...order });
                    }
                    saveOrders();
                    
                    incomingOrderQueue.value.shift();

                    alert(`Penawaran biaya pesanan ${order.order_id} berhasil dikirim! Menunggu konfirmasi persetujuan dari tim PO Irandra.`);
                };

                const confirmRejectOrder = () => {
                    const finalReason = rejectReason.value === 'Lainnya' ? (rejectCustomText.value || 'Alasan khusus vendor') : rejectReason.value;
                    alert(`Pesanan ditolak: "${finalReason}". Tim PO Irandra akan menugaskan pesanan ini ke vendor rekanan lain.`);
                    rejectOrderModal.value = false;
                    rejectCustomText.value = '';
                    
                    incomingOrderQueue.value.shift();
                };

                const openProductionDetail = (order) => {
                    selectedOrder.value = order;
                    detailDialog.value = true;
                };

                const openQCCamera = (order) => {
                    selectedOrder.value = order;
                    uploadedHJPreview.value = order.foto_hasil_jadi || null;
                    qcCameraDialog.value = true;
                };

                const openDeliveryView = (order) => {
                    selectedOrder.value = order;
                    uploadedHLPreview.value = order.foto_hasil_lokasi || null;
                    deliveryDialog.value = true;
                };

                // Upload HJ
                const submitHJ = (order) => {
                    order.status_order = 'HJ Masuk';
                    order.status_hasil_jadi = 'Sudah';
                    order.foto_hasil_jadi = uploadedHJPreview.value || getSampleImage(order);
                    saveOrders();
                    qcCameraDialog.value = false;
                    alert(`Foto Hasil Jadi ${order.order_id} berhasil dikirim! Status pesanan: Menunggu ACC HJ oleh SPV CS.`);
                };

                // Uji Coba SPV CS Menolak HJ (Status Menjadi HJ Perlu Revisi)
                const simulateHJRejection = (order) => {
                    order.status_order = 'HJ Perlu Revisi';
                    order.status_hasil_jadi = 'Revisi';
                    order.penilaian_hasil_jadi_vendor = 'Bunga bagian samping kiri terlihat kurang simetris. Mohon dirapikan dan difoto ulang.';
                    saveOrders();
                    qcCameraDialog.value = false;
                    alert(`Foto Hasil Jadi ditolak SPV CS dengan catatan: "${order.penilaian_hasil_jadi_vendor}". Status pesanan berubah menjadi HJ Perlu Revisi.`);
                };

                // Upload HL
                const submitHL = (order) => {
                    order.status_order = 'HL Masuk';
                    order.status_hasil_lokasi = 'Sudah';
                    order.foto_hasil_lokasi = uploadedHLPreview.value || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
                    saveOrders();
                    deliveryDialog.value = false;
                    alert(`Bukti Hasil Lokasi ${order.order_id} terkirim! Status pesanan: Menunggu ACC HL oleh SPV CS.`);
                };

                // Uji Coba SPV CS Menolak HL (Status Menjadi HL Perlu Revisi)
                const simulateHLRejection = (order) => {
                    order.status_order = 'HL Perlu Revisi';
                    order.status_hasil_lokasi = 'Revisi';
                    order.penilaian_hasil_lokasi_vendor = 'Nomor pintu/gedung tidak tampak di foto. Silakan ambil foto dari sudut yang menampakkan lokasi pengantaran dengan jelas.';
                    saveOrders();
                    deliveryDialog.value = false;
                    alert(`Hasil Lokasi ditolak SPV CS dengan catatan: "${order.penilaian_hasil_lokasi_vendor}". Status pesanan berubah menjadi HL Perlu Revisi.`);
                };

                const attachVideoHL = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        if (selectedOrder.value) {
                            selectedOrder.value.video_hasil_lokasi = e.target.files[0].name;
                            saveOrders();
                            alert(`Lampiran video "${e.target.files[0].name}" berhasil disematkan!`);
                        }
                    }
                };

                const copyText = (txt) => {
                    if (!txt) return;
                    navigator.clipboard.writeText(txt);
                    alert('Teks berhasil disalin!');
                };

                const openAddUserModal = () => {
                    newUserForm.value = {
                        vendor_id: currentUser.value.vendor_id || 'vndr_tokoku',
                        name: '',
                        username: '',
                        role: 'Staff Vendor',
                        whatsapp: '',
                        password: ''
                    };
                    showAddUserModal.value = true;
                };

                const saveNewUser = () => {
                    const newId = 'u' + (users.value.length + 1);
                    users.value.push({
                        id: newId,
                        username: newUserForm.value.username,
                        name: newUserForm.value.name,
                        role: newUserForm.value.role,
                        vendor_id: newUserForm.value.vendor_id,
                        whatsapp: newUserForm.value.whatsapp
                    });
                    saveUsers();
                    showAddUserModal.value = false;
                    alert(`Pengguna vendor ${newUserForm.value.name} (${newUserForm.value.role}) berhasil ditambahkan!`);
                };

                const deleteUser = (uId) => {
                    if (currentUser.value && uId === currentUser.value.id) {
                        alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk!');
                        return;
                    }
                    if (confirm('Yakin ingin menghapus pengguna ini?')) {
                        users.value = users.value.filter(u => u.id !== uId);
                        saveUsers();
                    }
                };

                onMounted(() => {
                    updateWindowSize();
                    window.addEventListener('resize', updateWindowSize);
                    window.addEventListener('hashchange', parseRoute);
                    window.addEventListener('popstate', parseRoute);
                    window.addEventListener('dblclick', handleGlobalDblClick);
                    parseRoute();
                });

                return {
                    drawer,
                    isMobile,
                    currentView,
                    orderFilter,
                    searchQuery,
                    sortBy,
                    currentPage,
                    totalPages,
                    paginatedOrders,
                    vendors,
                    users,
                    currentUser,
                    currentVendor,
                    canManageUsers,
                    visibleUsers,
                    orders,
                    filteredOrders,
                    totalVendorIncome,
                    incomingOrderQueue,
                    currentIncomingOrder,
                    rejectOrderModal,
                    rejectReason,
                    rejectCustomText,
                    selectedOrder,
                    detailDialog,
                    qcCameraDialog,
                    deliveryDialog,
                    uploadedHJPreview,
                    uploadedHLPreview,
                    onHJFileChange,
                    onHLFileChange,
                    showAddUserModal,
                    newUserForm,
                    loginForm,
                    offerForm,
                    timerCountdownFormatted,
                    triggerIncomingOrder,
                    handleGlobalDblClick,
                    handleAccountSelect,
                    handleLoginSubmit,
                    setOrderFilter,
                    countOrdersByStatus,
                    formatRupiah,
                    calculateNetVendorPay,
                    getVendorName,
                    getStatusBadgeClass,
                    getRoleBadgeClass,
                    getSampleImage,
                    logout,
                    navigateTo,
                    isNavActive,
                    closeIncomingOrderModal,
                    openOfferModal,
                    acceptOrderWithOffer,
                    confirmRejectOrder,
                    openProductionDetail,
                    openQCCamera,
                    openDeliveryView,
                    submitHJ,
                    simulateHJRejection,
                    submitHL,
                    simulateHLRejection,
                    attachVideoHL,
                    copyText,
                    openAddUserModal,
                    saveNewUser,
                    deleteUser
                };
            }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.modal-overlay {
    background-color: rgba(15, 23, 42, 0.72);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: opacity 0.25s ease-out;
}
.modal-dialog-content {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalPop {
    0% { opacity: 0; transform: scale(0.96) translateY(6px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
