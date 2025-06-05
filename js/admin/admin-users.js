const accessToken = localStorage.getItem("accessToken");
let usersData = [];

// Function to format date-time for display
function formatDateTime(isoString) {
    return new Date(isoString).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

// Function to get role text based on role value
function getRoleText(role) {
    switch (role) {
        case 0:
            return 'Administrador';
        case 1:
            return 'Cliente';
        case 2:
            return 'Funcionário';
        default:
            return 'Desconhecido';
    }
}

// Function to populate the users table
function populateUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const roleText = getRoleText(user.role);
        const statusText = user.status ? 'Ativo' : 'Inativo';
        const statusClass = user.status ? 'status-active' : 'status-inactive';
        const createdInFormatted = formatDateTime(user.createdIn);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.idUser}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber || '-'}</td>
            <td>${roleText}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${createdInFormatted}</td>
            <td>
                <button class="action-btn" onclick="editUser(${user.idUser})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteUser(${user.idUser})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch users data
    const resultUsers = await getAllUser(accessToken);

    if (resultUsers == 200) {
        usersData = JSON.parse(localStorage.getItem("users"));
    }

    const userModal = document.getElementById('user-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const userForm = document.getElementById('user-form');
    const modalTitle = document.getElementById('modal-title');
    let editUserId = null;

    window.openAddUserModal = () => {
        modalTitle.textContent = 'Adicionar Usuário';
        userForm.reset();
        editUserId = null;
        userModal.classList.add('active');
    };

    window.editUser = (id) => {
        const user = usersData.find(u => u.idUser === id);
        if (user) {
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-phone').value = user.phoneNumber || '';
            document.getElementById('user-role').value = 
                user.role === 0 ? 'admin' : 
                user.role === 1 ? 'customer' : 'employee';
            document.getElementById('user-status').value = user.status ? 'active' : 'inactive';
            modalTitle.textContent = 'Editar Usuário';
            editUserId = id;
            userModal.classList.add('active');
        }
    };

    window.deleteUser = (id) => {
        editUserId = id;
        document.getElementById('confirm-message').textContent = 'Tem certeza que deseja excluir este usuário?';
        confirmModal.classList.add('active');
    };

    window.closeModal = (modalId) => {
        document.getElementById(modalId).classList.remove('active');
        editUserId = null;
    };

    window.confirmAction = () => {
        // Implement delete logic here (e.g., API call)
        console.log(`Deleting user with ID: ${editUserId}`);
        closeModal('confirm-modal');
        // Refresh table after deletion
        usersData = usersData.filter(u => u.idUser !== editUserId);
        populateUsersTable(usersData);
    };

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            phoneNumber: document.getElementById('user-phone').value || null,
            role: document.getElementById('user-role').value === 'admin' ? 0 :
                  document.getElementById('user-role').value === 'customer' ? 1 : 2,
            status: document.getElementById('user-status').value === 'active'
        };

        if (editUserId !== null) {
            // Update existing user
            console.log(`Editing user ${editUserId}:`, userData);
            const index = usersData.findIndex(u => u.idUser === editUserId);
            if (index !== -1) {
                usersData[index] = {
                    ...usersData[index],
                    ...userData,
                    updatedIn: new Date().toISOString()
                };
            }
        } else {
            // Add new user
            const newId = usersData.length ? Math.max(...usersData.map(u => u.idUser)) + 1 : 0;
            const newUser = {
                ...userData,
                idUser: newId,
                password: "hashed_password_default", // Replace with actual password hashing
                token: `token_${newId}`,
                photo: "path/to/default_photo.jpg",
                path: "string",
                createdIn: new Date().toISOString(),
                updatedIn: new Date().toISOString()
            };
            usersData.push(newUser);
            console.log('Adding new user:', newUser);
        }

        closeModal('user-modal');
        populateUsersTable(usersData);
    });

    // Search and filter functionality
    const searchInput = document.getElementById('user-search');
    const roleFilter = document.getElementById('user-role-filter');
    const statusFilter = document.getElementById('user-status-filter');

    const filterUsers = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const roleFilterValue = roleFilter.value;
        const statusFilterValue = statusFilter.value;

        const filteredUsers = usersData.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                 user.email.toLowerCase().includes(searchTerm) ||
                                 (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm));
            const matchesRole = roleFilterValue === 'all' ||
                              (roleFilterValue === 'admin' && user.role === 0) ||
                              (roleFilterValue === 'customer' && user.role === 1) ||
                              (roleFilterValue === 'employee' && user.role === 2);
            const matchesStatus = statusFilterValue === 'all' ||
                               (statusFilterValue === 'active' && user.status) ||
                               (statusFilterValue === 'inactive' && !user.status);
            return matchesSearch && matchesRole && matchesStatus;
        });

        populateUsersTable(filteredUsers);
    };

    searchInput.addEventListener('input', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);

    // Initial population of the table
    populateUsersTable(usersData);
});