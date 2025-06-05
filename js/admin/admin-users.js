const accessToken = localStorage.getItem("accessToken");
let usersData = [];

// Function to format date-time for display
function formatDateTime(isoString) {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

// Function to get role text based on role value
function getRoleText(role) {
    const roles = {
     
        1: 'Cliente',
        2: 'Funcionário'
    };
    return roles[role] || 'Desconhecido';
}

// Function to populate the users table
function populateUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = ''; // Clear existing rows
    users
    .filter(user => user.role !== 0) // Filtra usuários cujo role é diferente de 0
    .forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${user.idUser || '-'}</td>
          <td>${user.name || '-'}</td>
          <td>${user.email || '-'}</td>
          <td>${user.phoneNumber || '-'}</td>
          <td>${getRoleText(user.role)}</td>
          <td><span class="status-${user.status ? 'active' : 'inactive'}">${user.status ? 'Ativo' : 'Inativo'}</span></td>
          <td>${formatDateTime(user.createdIn)}</td>
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
    try {
        // Fetch users data
        const resultUsers = await getAllUser(accessToken);
        
        if (resultUsers === 200) {
            const storedUsers = localStorage.getItem("users");
            usersData = storedUsers ? JSON.parse(storedUsers) : [];
        } else {
            showMessageModal('error', 'Erro!', 'Falha ao carregar usuários', {
                buttonText: 'Entendido'
            });
        }

        const userModal = document.getElementById('user-modal');
        const confirmModal = document.getElementById('confirm-modal');
        const userForm = document.getElementById('user-form');
        const modalTitle = document.getElementById('modal-title');
        let editUserId = null;

        window.openAddUserModal = () => {
            if (!userModal || !userForm) return;
            modalTitle.textContent = 'Adicionar Usuário';
            userForm.reset();
            editUserId = null;
            userModal.classList.add('active');
        };

        window.editUser = (id) => {
            if (!userModal || !userForm) return;
            const user = usersData.find(u => u.idUser === id);
            if (user) {
                document.getElementById('user-name').value = user.name || '';
                document.getElementById('user-email').value = user.email || '';
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
            if (!confirmModal) return;
            editUserId = id;
            document.getElementById('confirm-message').textContent = 'Tem certeza que deseja excluir este usuário?';
            confirmModal.classList.add('active');
        };

        window.closeModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                editUserId = null;
            }
        };

        window.confirmAction = async () => {
            if (!editUserId) return;
            
            try {
                const result = await deleteAnyUser(accessToken, editUserId);
                
                if (result === 200) {
                    showMessageModal('success', 'Sucesso!', 'Usuário eliminado com sucesso', {
                        buttonText: 'Ótimo!'
                    });
                    usersData = usersData.filter(u => u.idUser !== editUserId);
                    populateUsersTable(usersData);
                } else {
                    throw new Error('Falha na exclusão');
                }
            } catch (error) {
                showMessageModal('error', 'Erro!', 'Ocorreu um erro ao tentar eliminar o usuário', {
                    buttonText: 'Entendido'
                });
            } finally {
                closeModal('confirm-modal');
            }
        };

        if (userForm) {
            userForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const userData = {
                    name: document.getElementById('user-name').value.trim(),
                    email: document.getElementById('user-email').value.trim(),
                    phoneNumber: document.getElementById('user-phone').value.trim() || null,
                    role:document.getElementById('user-role').value === 'customer' ? 1 : 2,
                    status: document.getElementById('user-status').value === 'active'
                };

                console.log("data:",userData)

                try {
                    if (editUserId !== null) {
                        // Update existing user
                        const response = await updateAnyUser(accessToken,userData,editUserId);
                        if (response === 200) {
                            const index = usersData.findIndex(u => u.idUser === editUserId);
                            if (index !== -1) {
                                usersData[index] = {
                                    ...usersData[index],
                                    ...userData,
                                    updatedIn: new Date().toISOString()
                                };
                                showMessageModal('success', 'Sucesso!', 'Funcionário atualizado com sucesso', {
                                    buttonText: 'Ótimo!'
                                });
                            }
                        }else if(response === 409){
                            showMessageModal('error', 'Erro!', 'Este email já foi cadastrado na plataforma', {
                                buttonText: 'Entendido'
                            });
                        }else{
                            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o Funcionário', {
                                buttonText: 'Entendido'
                            }); 
                        }
                    } else {
                        // Add new user
                        const response = await registerUser(userData,accessToken);
                        
                        if (response === 200) {
                           
                            showMessageModal('success', 'Sucesso!', 'Usuário criado com sucesso', {
                                buttonText: 'Ótimo!'
                            });
                        }else if(response === 409){
                            showMessageModal('error', 'Erro!', 'Este email já foi cadastrado na plataforma', {
                                buttonText: 'Entendido'
                            });
                        }else{
                            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o Funcionário', {
                                buttonText: 'Entendido'
                            }); 
                        }
                    }
                    closeModal('user-modal');
                    populateUsersTable(usersData);
                } catch (error) {
                    showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o usuário', {
                        buttonText: 'Entendido'
                    });
                }
            });
        }

        // Search and filter functionality
        const searchInput = document.getElementById('user-search');
        const roleFilter = document.getElementById('user-role-filter');
        const statusFilter = document.getElementById('user-status-filter');

        const filterUsers = () => {
            if (!searchInput || !roleFilter || !statusFilter) return;

            const searchTerm = searchInput.value.toLowerCase().trim();
            const roleFilterValue = roleFilter.value;
            const statusFilterValue = statusFilter.value;

            const filteredUsers = usersData.filter(user => {
                const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm) ||
                                    (user.email || '').toLowerCase().includes(searchTerm) ||
                                    (user.phoneNumber || '').toLowerCase().includes(searchTerm);
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

        if (searchInput) searchInput.addEventListener('input', filterUsers);
        if (roleFilter) roleFilter.addEventListener('change', filterUsers);
        if (statusFilter) statusFilter.addEventListener('change', filterUsers);

        // Initial population of the table
        populateUsersTable(usersData);

    } catch (error) {
        
        showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', {
            buttonText: 'Entendido'
        });
    }
});