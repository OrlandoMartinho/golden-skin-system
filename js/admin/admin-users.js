document.addEventListener('DOMContentLoaded', () => {
    
    // User modal handling
    const userModal = document.getElementById('user-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const userForm = document.getElementById('user-form');
    const modalTitle = document.getElementById('modal-title');
    let editUserId = null;

    window.openAddUserModal = () => {
        modalTitle.textContent = 'Adicionar Usuário';
        userForm.reset();
        userModal.classList.add('active');
    };

    window.editUser = (id) => {
        // Mock data for demonstration; replace with actual data fetching
        const users = {
            1: { name: 'João Silva', email: 'joao.silva@example.com', role: 'admin', status: 'active' },
            2: { name: 'Maria Oliveira', email: 'maria.oliveira@example.com', role: 'customer', status: 'active' },
            3: { name: 'Pedro Santos', email: 'pedro.santos@example.com', role: 'customer', status: 'inactive' }
        };

        const user = users[id];
        if (user) {
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-status').value = user.status;
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
        // Implement delete logic here
        console.log(`Deleting user with ID: ${editUserId}`);
        closeModal('confirm-modal');
    };

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            role: document.getElementById('user-role').value,
            status: document.getElementById('user-status').value
        };

        if (editUserId) {
            console.log(`Editing user ${editUserId}:`, userData);
        } else {
            console.log('Adding new user:', userData);
        }

        closeModal('user-modal');
    });

    // Search and filter functionality
    const searchInput = document.getElementById('user-search');
    const roleFilter = document.getElementById('user-role-filter');
    const statusFilter = document.getElementById('user-status-filter');

    const filterUsers = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const roleFilterValue = roleFilter.value;
        const statusFilterValue = statusFilter.value;

        const rows = document.querySelectorAll('.users-table tbody tr');
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            const role = row.cells[2].textContent.toLowerCase();
            const status = row.cells[3].querySelector('span').textContent.toLowerCase();

            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            const matchesRole = roleFilterValue === 'all' || role === roleFilterValue;
            const matchesStatus = statusFilterValue === 'all' || status === statusFilterValue;

            row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
        });
    };

    searchInput.addEventListener('input', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
});