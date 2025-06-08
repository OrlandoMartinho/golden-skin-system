

document.addEventListener('DOMContentLoaded', async () => {
   
 const accessToken = localStorage.getItem("accessToken");
    const container = document.getElementById('notificationsDropdown');
    container.innerHTML = ''; // Limpar antes de renderizar

    try {
        const result = await getNotifications(accessToken);

        if (result && Array.isArray(result)) {
            document.getElementById('TotalDeNotificacoes').textContent = result.length;
            result.forEach(notification => {
                // Determinar o ícone com base na descrição
                let icon = 'fa-solid fa-bell';

                if (notification.description.includes("mensagem")) {
                    icon = "far fa-comments";
                } else if (notification.description.includes("agendamento")) {
                    icon = 'fas fa-calendar-check';
                } else if (
                    notification.description.includes("compra") ||
                    notification.description.includes("venda") ||
                    notification.description.includes("produto")
                ) {
                    icon = 'fas fa-shopping-cart';
                }

                // Criar o item de notificação
                const item = document.createElement('div');
                item.className = 'notification-item';
                item.innerHTML = `
                    <i class="${icon}"></i>
                    <div>
                        <p>${notification.description}</p>
                        <small>${notification.notificationTime}</small>
                        <i class="fa-solid fa-trash"></i>
                        <i class="fa-regular fa-eye"></i>
                    </div>
                `;
                container.appendChild(item);
            });

            if(result.length == 0){
                const item = document.createElement('div');
                item.className = 'notification-item';
                item.innerHTML = `
                    <i class="fa-regular fa-envelope-open"></i>
                    <div>
                        <p>Não há notificações</p>
             
                    </div>
                `;
                  container.appendChild(item);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
    }
});
