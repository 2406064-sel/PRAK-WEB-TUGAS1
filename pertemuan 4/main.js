
"use strict";

// ==========================================
// 1. DATA AWAL PROYEK
// ==========================================

let projects = [
    {
        id: Date.now() + 1,
        title: "Website Portfolio",
        category: "Web App",
        budget: 2500000,
        completed: true,
        createdAt: new Date()
    },
    {
        id: Date.now() + 2,
        title: "Aplikasi Kasir",
        category: "Desktop App",
        budget: 5000000,
        completed: false,
        createdAt: new Date()
    },
    {
        id: Date.now() + 3,
        title: "Desain Aplikasi Mobile",
        category: "UI/UX Design",
        budget: 1500000,
        completed: false,
        createdAt: new Date()
    }
];

// ==========================================
// 2. MENGAMBIL ELEMEN HTML
// ==========================================

const projectForm = document.getElementById("projectForm");
const projectTitle = document.getElementById("projectTitle");
const projectCategory = document.getElementById("projectCategory");
const projectBudget = document.getElementById("projectBudget");
const projectCompleted = document.getElementById("projectCompleted");
const searchInput = document.getElementById("searchInput");
const projectList = document.getElementById("projectList");
const formMessage = document.getElementById("formMessage");

const totalProjects = document.getElementById("totalProjects");
const completedProjects = document.getElementById("completedProjects");
const totalBudget = document.getElementById("totalBudget");

// ==========================================
// 3. FORMAT ANGKA MENJADI RUPIAH
// ==========================================

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

// ==========================================
// 4. MENAMPILKAN PESAN FORM
// ==========================================

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "message " + type;
}

// ==========================================
// 5. RENDER KARTU DAN STATISTIK
// ==========================================

function renderProjects() {
    const keyword = searchInput.value.trim().toLowerCase();

    // Live Search: memfilter judul proyek
    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(keyword)
    );

    projectList.replaceChildren();

    // Menampilkan kartu proyek
    if (filteredProjects.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = keyword
            ? "Proyek tidak ditemukan. Coba kata kunci lain."
            : "Belum ada proyek. Silakan tambahkan proyek baru.";

        projectList.appendChild(emptyState);
    } else {
        filteredProjects.forEach(project => {
            const card = document.createElement("article");

            card.className = "project-card" +
                (project.completed ? " completed" : "");

            const title = document.createElement("h3");
            title.textContent = project.title;

            const category = document.createElement("span");
            category.className = "project-category";
            category.textContent = project.category;

            const info = document.createElement("div");
            info.className = "project-info";

            const budget = document.createElement("p");
            budget.textContent =
                "Anggaran: " + formatRupiah(project.budget);

            const statusLabel = document.createElement("p");
            statusLabel.textContent = "Status: ";

            const status = document.createElement("span");
            status.className = "status " +
                (project.completed
                    ? "status-completed"
                    : "status-progress");

            status.textContent = project.completed
                ? "Selesai"
                : "Dalam Pengerjaan";

            statusLabel.appendChild(status);
            info.append(budget, statusLabel);

            const actions = document.createElement("div");
            actions.className = "card-actions";

            // Tombol Ubah Status
            const statusButton = document.createElement("button");
            statusButton.type = "button";
            statusButton.className = "btn-status";
            statusButton.textContent = project.completed
                ? "Ubah ke Pengerjaan"
                : "Ubah Status";

            statusButton.addEventListener("click", () => {
                toggleProjectStatus(project.id);
            });

            // Tombol Hapus Proyek
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn-delete";
            deleteButton.textContent = "Hapus";

            deleteButton.addEventListener("click", () => {
                deleteProject(project.id);
            });

            actions.append(statusButton, deleteButton);
            card.append(title, category, info, actions);
            projectList.appendChild(card);
        });
    }

    // Statistik tetap menghitung seluruh proyek,
    // bukan hanya proyek yang cocok dengan pencarian.
    updateStatistics();
}

// ==========================================
// 6. MEMPERBARUI STATISTIK OTOMATIS
// ==========================================

function updateStatistics() {
    const total = projects.length;

    const completed = projects.filter(
        project => project.completed
    ).length;

    const budget = projects.reduce(
        (sum, project) => sum + project.budget,
        0
    );

    totalProjects.textContent = total;
    completedProjects.textContent = completed;
    totalBudget.textContent = formatRupiah(budget);
}

// ==========================================
// 7. FORM HANDLING DAN VALIDASI
// ==========================================

projectForm.addEventListener("submit", function(event) {
    // Mencegah halaman dimuat ulang
    event.preventDefault();

    const title = projectTitle.value.trim();
    const category = projectCategory.value;
    const budget = Number(projectBudget.value);
    const completed = projectCompleted.checked;

    // Validasi judul
    if (title === "") {
        showMessage("Judul proyek tidak boleh kosong.", "error");
        projectTitle.focus();
        return;
    }

    // Validasi kategori
    const allowedCategories = [
        "Web App",
        "Mobile App",
        "Desktop App",
        "UI/UX Design"
    ];

    if (!allowedCategories.includes(category)) {
        showMessage("Silakan pilih kategori proyek.", "error");
        projectCategory.focus();
        return;
    }

    // Validasi anggaran
    if (
        projectBudget.value.trim() === "" ||
        !Number.isFinite(budget) ||
        budget <= 0 ||
        !Number.isSafeInteger(budget)
    ) {
        showMessage(
            "Anggaran harus berupa bilangan bulat lebih besar dari 0.",
            "error"
        );
        projectBudget.focus();
        return;
    }

    // Membuat objek proyek baru
    const newProject = {
        id: Date.now() + Math.random(),
        title: title,
        category: category,
        budget: budget,
        completed: completed,
        createdAt: new Date()
    };

    // Menambahkan proyek ke array
    projects.push(newProject);

    // Merender ulang daftar dan statistik
    renderProjects();

    // Mengosongkan form setelah berhasil
    projectForm.reset();

    showMessage(
        "Proyek berhasil ditambahkan!",
        "success"
    );

    projectTitle.focus();
});

// ==========================================
// 8. LIVE SEARCH
// ==========================================

searchInput.addEventListener("input", function() {
    renderProjects();
});

// ==========================================
// 9. TOGGLE STATUS PROYEK
// ==========================================

function toggleProjectStatus(id) {
    const project = projects.find(item => item.id === id);

    if (!project) {
        return;
    }

    // Membalik status selesai menjadi pengerjaan,
    // atau pengerjaan menjadi selesai.
    project.completed = !project.completed;

    renderProjects();
}

// ==========================================
// 10. MENGHAPUS PROYEK
// ==========================================

function deleteProject(id) {
    const project = projects.find(item => item.id === id);

    if (!project) {
        return;
    }

    const confirmation = confirm(
        'Apakah Anda yakin ingin menghapus proyek "' +
        project.title + '"?'
    );

    if (!confirmation) {
        return;
    }

    // Menghapus objek dari array berdasarkan ID
    projects = projects.filter(item => item.id !== id);

    // Memperbarui kartu dan statistik secara instan
    renderProjects();
}

// ==========================================
// 11. RENDER AWAL SAAT HALAMAN DIBUKA
// ==========================================

renderProjects();
