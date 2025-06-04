
    // Lista de notificações
    const notifications = [
        {
            icon: 'fas fa-calendar-check',
            message: 'Novo agendamento confirmado',
            time: '10 minutos atrás'
        },
        {
            icon: 'fas fa-shopping-cart',
            message: 'Nova compra realizada',
            time: 'Hoje, 12:15'
        },
        {
            icon: 'far fa-comments',
            message: 'Nova mensagem recebida',
            time: 'Hoje, 11:00'
        }
    ];

    // Container onde as notificações serão inseridas
    const container = document.getElementById('notificationsDropdown');

    // Gerar HTML das notificações
    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        item.innerHTML = `
            <i class="${notification.icon}"></i>
            <div>
                <p>${notification.message}</p>
                <small>${notification.time}</small>
            </div>
        `;
        container.appendChild(item);
    });

