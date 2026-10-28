let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Fitur 1: Update Task Counter secara dinamis
function updateCounter() {
  const total = tasks.length;
  const selesai = tasks.filter(t => t.completed).length;
  const belumSelesai = total - selesai;
  
  const counterEl = document.getElementById('taskCounter');
  if (counterEl) {
    counterEl.textContent = `Total: ${total} Tugas | Selesai: ${selesai} | Belum Selesai: ${belumSelesai}`;
  }
}

// Render daftar tugas
function renderTasks() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;
  
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    
    // Teks Tugas
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('completed');
    }

    // Wadah tombol aksi
    const actionContainer = document.createElement('div');
    actionContainer.className = 'action-buttons';

    // Tombol Selesai / Batal
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Batal' : 'Selesai';
    completeBtn.className = task.completed ? 'btn-undo' : 'btn-complete';
    completeBtn.onclick = () => toggleTask(index);

    // Fitur 3: Tombol Hapus dengan Konfirmasi
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'btn-delete';
    deleteBtn.onclick = () => deleteTask(index);

    actionContainer.appendChild(completeBtn);
    actionContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actionContainer);
    taskList.appendChild(li);
  });

  updateCounter();
}

// Tambah tugas baru
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (text !== '') {
    tasks.push({ text: text, completed: false });
    input.value = '';
    saveAndRender();
  }
}

// Mengubah status selesai/belum
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

// Fitur 3: Konfirmasi sebelum menghapus
function deleteTask(index) {
  const sure = confirm('Apakah Anda yakin ingin menghapus tugas ini?');
  if (sure) {
    tasks.splice(index, 1);
    saveAndRender();
  }
}

// Fitur 2: Menghapus hanya tugas berstatus completed: true
function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveAndRender();
}

// Load otomatis saat halaman dimuat
document.addEventListener