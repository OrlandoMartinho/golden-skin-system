document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    
    // Modal control functions
    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('admin-name').value = user.name || '';
    document.getElementById('admin-phone').value = user.phoneNumber || '';


    window.confirmAction = function () {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        const action = messageElement.dataset.action;

        if (action === 'saveName') executeSaveName();
        else if (action === 'savePhone') executeSavePhone();
        else if (action === 'uploadPhoto') executeUploadPhoto();
        else if (action === 'saveEmail') executeSaveEmail();
        else if (action === 'savePassword') executeSavePassword();
        else if (action === 'saveClinicName') executeSaveClinicName();

        modal.classList.remove('active');
    };

    // Tab switching
    document.querySelectorAll('.settings-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');

            document.querySelectorAll('.settings-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.settings-content').forEach((content) => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Photo preview
    window.previewPhoto = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('profile-photo-preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // Save name
    window.saveName = function () {
        const name = document.getElementById('admin-name').value.trim();
        if (!name) {
            showMessageModal('error', 'Erro!', 'Por favor, digite um nome válido.', {
                buttonText: 'Entendido',
            });
            return;
        }
        showConfirmModal('Deseja salvar o novo nome?', 'saveName');
    };

    function executeSaveName() {
        const name = document.getElementById('admin-name').value.trim();
        console.log('Iniciando requisição para atualizar nome:', { name });
        
        fetch(`${api_host}/api/users/update-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: accessToken
            },
            body: JSON.stringify({ name }),
        })
            .then((response) => {
                console.log('Resposta da requisição de nome:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos da atualização de nome:', data);
                if (data.message) {
                    showMessageModal('sucess', 'Sucesso!', 'Nome atualizado com sucesso!', {
                        buttonText: 'Entendido',
                    });
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar o nome.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de nome:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor.', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Save phone
    window.savePhone = function () {
        const phone = document.getElementById('admin-phone').value.trim();
       if (!phone.match(/^\+244\s\d{3}\s\d{3}\s\d{3}$/)) {
            showMessageModal('error', 'Erro!', 'Por favor, digite um número de telefone válido (ex: +244 923 456 789).', {
                buttonText: 'Entendido',
            });
            return;
        }

        showConfirmModal('Deseja salvar o novo número de telefone?', 'savePhone');
    };

    function executeSavePhone() {
        const phone = document.getElementById('admin-phone').value.trim();
        console.log('Iniciando requisição para atualizar telefone:', { phone });
        
        fetch(`${api_host}/api/users/update-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: accessToken,
            },
            body: JSON.stringify({ phoneNumber: phone }),
        })
            .then((response) => {
                console.log('Resposta da requisição de telefone:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos da atualização de telefone:', data);
                if (data.message) {
                    showMessageModal('sucess', 'Sucesso!', 'Número de telefone atualizado com sucesso!', {
                        buttonText: 'Entendido',
                    });
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar o número de telefone.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de telefone:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor.', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Upload photo
    window.uploadPhoto = function () {
        const fileInput = document.getElementById('admin-photo');
        if (!fileInput.files.length) {
            showMessageModal('error', 'Erro!', 'Por favor, selecione uma imagem.', {
                buttonText: 'Entendido',
            });
            return;
        }
        showConfirmModal('Deseja atualizar a foto de perfil?', 'uploadPhoto');
    };

    function executeUploadPhoto() {
        const fileInput = document.getElementById('admin-photo');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('photo', file);
        console.log('Iniciando requisição para upload de foto:', { fileName: file.name });
        
        fetch(`${api_host}/api/users/upload-photo`, {
            method: 'PATCH',
            headers: {
                token: accessToken,
            },
            body: formData,
        })
            .then((response) => {
                console.log('Resposta da requisição de upload de foto:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos do upload de foto:', data);
                if (data.url) {
                    
                    showMessageModal('success', 'Sucesso!', 'Foto de perfil atualizada com sucesso!', {
                        buttonText: 'Ótimo!'});
                    document.getElementById('profile-photo-preview').src = data.url;
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar a foto de perfil.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de upload de foto:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor.', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Save email
    window.saveEmail = function () {
        const email = document.getElementById('admin-email').value.trim();
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,64}$/)) {
            showMessageModal('error', 'Erro!', 'Por favor, digite um e-mail válido.', {
                buttonText: 'Entendido',
            });
            return;
        }
        showConfirmModal('Deseja salvar o novo e-mail?', 'saveEmail');
    };

    function executeSaveEmail() {
        const email = document.getElementById('admin-email').value.trim();
        console.log('Iniciando requisição para atualizar email:', { email });
        
        fetch(`${api_host}/api/users/update-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: accessToken,
            },
            body: JSON.stringify({ email }),
        })
            .then((response) => {
                console.log('Resposta da requisição de email:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos da atualização de email:', data);
                if (data.message) {
                    showMessageModal('success', 'Sucesso!', 'E-mail atualizado com sucesso!', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar o e-mail.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de email:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor.', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Save password
    window.savePassword = function () {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos de senha.', {
                buttonText: 'Entendido',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessageModal('error', 'Erro!', 'As novas senhas não coincidem.', { buttonText: 'Entendido' });
            return;
        }

        if (newPassword.length < 8) {
            showMessageModal('error', 'Erro!', 'A nova senha deve ter pelo menos 7 caracteres.', { buttonText: 'Ótimo!' });
            return;
        }

        showConfirmModal('Deseja salvar a nova senha?', 'savePassword');
    };

    function executeSavePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        console.log('Iniciando requisição para atualizar senha');
        
        fetch(`${api_host}/api/users/update-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: accessToken,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        })
            .then((response) => {
                console.log('Resposta da requisição de senha:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos da atualização de senha:', data);
                if (data.message) {
                    showMessageModal('success', 'Sucesso!', 'Senha atualizada com sucesso!', { buttonText: 'Ótimo!' });
                    document.getElementById('current-password').value = '';
                    document.getElementById('new-password').value = '';
                    document.getElementById('confirm-password').value = '';
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar a senha.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de senha:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Save clinic name
    window.saveClinicName = function () {
        const clinicName = document.getElementById('clinic-name').value.trim();
        if (!clinicName) {
            alert('Por favor, digite um nome válido para a clínica.');
            return;
        }
        showConfirmModal('Deseja salvar o novo nome da clínica?', 'saveClinicName');
    };

    function executeSaveClinicName() {
        const clinicName = document.getElementById('clinic-name').value.trim();
        console.log('Iniciando requisição para atualizar nome da clínica:', { clinicName });
        
        fetch(`${api_host}/api/users/update-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: accessToken,
            },
            body: JSON.stringify({ name: clinicName }),
        })
            .then((response) => {
                console.log('Resposta da requisição de nome da clínica:', response.status, response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos da atualização de nome da clínica:', data);
                if (data.message) {
                    showMessageModal('success', 'Sucesso!', 'Nome da clínica atualizado com sucesso!', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Erro ao atualizar o nome da clínica.', {
                        buttonText: 'Entendido',
                    });
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de nome da clínica:', error);
                showMessageModal('error', 'Erro!', 'Falha na comunicação com o servidor.', {
                    buttonText: 'Entendido',
                });
            });
    }

    // Helper function to show confirmation modal
    function showConfirmModal(message, action) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');

        messageElement.textContent = message;
        messageElement.dataset.action = action;
        modal.classList.add('active');
    }
});