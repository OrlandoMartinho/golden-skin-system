document.addEventListener('DOMContentLoaded', () => {
  let chartInstance = null;
  let currentReportData = []; // Armazenar dados do relatório para exportação

  async function fetchAllData() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log('Access Token:', accessToken ? 'Present' : 'Missing');

      let vendas = [];
      let assinantes = [];
      let agendamentos = [];
      let products = [];
      let mensagens = [];
      let users = [];

      // Busca vendas
      const result = await getAllShoppings(accessToken);
      console.log('Vendas Result:', result);
      if (result.status === 200) {
        vendas = result.data || [];
        console.log('Vendas Data:', vendas);
      } else {
        console.warn("Ocorreu um erro ao carregar as vendas:", result.status, result.message);
      }

      // Busca assinantes
      const result2 = await getAllSubscribers(accessToken);
      console.log('Assinantes Result:', result2);
      if (result2.status === 200) {
        assinantes = result2.data || [];
        console.log('Assinantes Data:', assinantes);
      } else {
        console.warn("Ocorreu um erro ao carregar os assinantes:", result2.status, result2.message);
      }

      // Busca agendamentos
      const result3 = await getAllAppointments(accessToken);
      console.log('Agendamentos Result:', result3);
      if (result3.status === 200) {
        agendamentos = result3.data || [];
        console.log('Agendamentos Data:', agendamentos);
      } else {
        console.warn("Ocorreu um erro ao carregar os agendamentos:", result3.status, result3.message);
      }

      // Busca produtos
      const result4 = await getAllProducts(accessToken);
      console.log('Produtos Result:', result4);
      if (result4.status === 200) {
        products = result4.data || [];
        console.log('Produtos Data:', products);
      } else {
        console.warn("Ocorreu um erro ao carregar os produtos:", result4.status, result4.message);
      }

      // Busca mensagens
      const result5 = await getAllMessages(accessToken);
      console.log('Mensagens Result:', result5);
      if (result5.status === 200) {
        mensagens = result5.data || [];
        console.log('Mensagens Data:', mensagens);
      } else {
        console.warn("Ocorreu um erro ao carregar as mensagens:", result5.status, result5.message);
      }

      // Busca usuários
      const result6 = await getAllUser(accessToken);
      console.log('Usuários Result:', result6);
      if (result6 === 200) {
        users = localStorage.getItem("users") || []
        console.log('Usuários Data:', users);
      } else {
        console.warn("Ocorreu um erro ao carregar os usuários:", result6, result6.message);
      }

      return {
        vendas,
        assinantes,
        agendamentos,
        products,
        mensagens,
        users
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { vendas: [], assinantes: [], agendamentos: [], products: [], mensagens: [], users: [] };
    }
  }

  // Modal control functions
  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      console.log(`Modal ${modalId} fechado`);
    } else {
      console.error(`Modal ${modalId} não encontrado`);
    }
  };

  window.confirmAction = function() {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    const action = messageElement.dataset.action;

    console.log('Confirm Action:', action);

    if (action === 'exportReport') {
      generatePDF();
    }

    if (modal) {
      modal.classList.remove('active');
      console.log('Modal de confirmação fechado');
    }
    alert('Ação realizada com sucesso!');
  };

  // Form submission
  document.getElementById('report-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    console.log('Form Submitted:', { reportType, startDate, endDate });

    if (!startDate || !endDate) {
      alert('Por favor, selecione as datas inicial e final.');
      console.warn('Datas não selecionadas');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('A data final deve ser posterior à data inicial.');
      console.warn('Data final anterior à inicial');
      return;
    }

    // Buscar dados dinamicamente
    const allData = await fetchAllData();
    console.log('All Data Fetched:', allData);
    
    // Filtrar dados por tipo de relatório e intervalo de datas
    currentReportData = allData[reportType].filter(item => {
      const itemDate = new Date(item.createdIn || item.appointmentDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const isWithinRange = itemDate >= start && itemDate <= end;
      console.log(`Filtering ${reportType} item:`, { itemDate, isWithinRange });
      return isWithinRange;
    });

    console.log('Filtered Report Data:', currentReportData);

    updateReportTable(currentReportData, reportType);
    updateReportChart(currentReportData, reportType);
  });

  // Update report table
  function updateReportTable(data, reportType) {
    const tbody = document.getElementById('report-data');
    if (!tbody) {
      console.error('Elemento com ID "report-data" não encontrado.');
      return;
    }

    console.log(`Updating table for ${reportType} with ${data.length} items`);

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">Nenhum dado encontrado.</td></tr>';
      console.log('No data found for table');
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');
      let date, description, value;

      switch (reportType) {
        case 'vendas':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `Compra ID ${item.idShopping} (${item.status ? 'Ativa' : 'Inativa'})`;
          value = 'N/A';
          break;
        case 'assinantes':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.subscriberName} (Plano ID ${item.idPlan})`;
          value = 'N/A';
          break;
        case 'agendamentos':
          date = new Date(item.appointmentDate).toLocaleDateString('pt-BR');
          description = `${item.name} com ${item.employeeName}`;
          value = 'N/A';
          break;
        case 'products':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.category}, Estoque: ${item.amount})`;
          value = `AOA ${(item.priceInCents / 100).toFixed(2)}`;
          break;
        case 'mensagens':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.username} (Chat ID ${item.idChat})`;
          value = 'N/A';
          break;
        case 'users':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.email})`;
          value = 'N/A';
          break;
        default:
          date = description = value = 'N/A';
      }

      row.innerHTML = `
        <td>${date}</td>
        <td>${description}</td>
        <td>${value}</td>
      `;
      tbody.appendChild(row);
      console.log(`Table row added:`, { date, description, value });
    });
  }

  // Update report chart
  function updateReportChart(data, reportType) {
    const canvas = document.getElementById('reportChart');
    if (!canvas) {
      console.error('Canvas element with ID "reportChart" not found.');
      return;
    }

    console.log(`Updating chart for ${reportType} with ${data.length} items`);

    const labels = data.map(item => new Date(item.createdIn || item.appointmentDate).toLocaleDateString('pt-BR'));
    const values = reportType === 'products'
      ? data.map(item => item.priceInCents / 100)
      : data.map(() => 1); // Contagem para outros tipos

    console.log('Chart Data:', { labels, values, reportType });

    ```chartjs
    {
      "type": "bar",
      "data": {
        "labels": ${JSON.stringify(labels)},
        "datasets": [{
          "label": "${reportType.charAt(0).toUpperCase() + reportType.slice(1)}",
          "data": ${JSON.stringify(values)},
          "backgroundColor": "#8B4513",
          "borderColor": "#8B4513",
          "borderWidth": 1
        }]
      },
      "options": {
        "scales": {
          "y": {
            "beginAtZero": true,
            "title": {
              "display": true,
              "text": "${reportType === 'products' ? 'Valor (AOA)' : 'Contagem'}"
            }
          },
          "x": {
            "title": {
              "display": true,
              "text": "Data"
            }
          }
        },
        "plugins": {
          "legend": {
            "display": true
          }
        }
      }
    }
    ```

    console.log('Chart updated for', reportType);
  }

  // Export report to PDF
  window.exportReport = function() {
    showConfirmModal('Deseja exportar o relatório atual?', 'exportReport');
    console.log('Export report initiated');
  };

  // Generate PDF
  async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    console.log('Generating PDF for:', { reportType, startDate, endDate });

    // Definir logoY e logoHeight fora do try para evitar ReferenceError
    let logoY = 10; // Margem superior padrão
    let logoHeight = 10; // Altura padrão caso o logo não carregue

    // Adicionar logotipo sem fundo ou borda
    const logo = new Image();
    logo.src = '../../assets/img/logo.png';
    try {
      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = () => reject(new Error('Erro ao carregar o logotipo'));
      });

      // Calcular proporções para manter a proporção da imagem
      const logoWidth = 25; // Largura reduzida do logotipo
      logoHeight = (logo.height / logo.width) * logoWidth; // Manter proporção
      const logoX = 10; // Margem esquerda
      logoY = 10; // Margem superior

      doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      console.log('Logo added to PDF');
    } catch (error) {
      console.error('Erro ao carregar logotipo:', error.message);
    }

    // Título do relatório (ajustado para não sobrepor o logotipo)
    const titleY = Math.max(logoY + logoHeight + 10, 40);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(`Relatório de ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 10, titleY);
    doc.setFontSize(12);
    doc.text(`Período: ${startDate} a ${endDate}`, 10, titleY + 10);
    console.log('PDF title and period added');

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.setDrawColor(139, 69, 19); // Cor marrom (#8B4513)
    doc.line(10, titleY + 15, 200, titleY + 15);
    console.log('Divider line added');

    // Dados da tabela para o PDF
    const headers = ['Data', 'Descrição', 'Valor'];
    const rows = currentReportData.map(item => {
      let date, description, value;
      switch (reportType) {
        case 'vendas':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `Compra ID ${item.idShopping} (${item.status ? 'Ativa' : 'Inativa'})`;
          value = 'N/A';
          break;
        case 'assinantes':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.subscriberName} (Plano ID ${item.idPlan})`;
          value = 'N/A';
          break;
        case 'agendamentos':
          date = new Date(item.appointmentDate).toLocaleDateString('pt-BR');
          description = `${item.name} com ${item.employeeName}`;
          value = 'N/A';
          break;
        case 'products':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.category}, Estoque: ${item.amount})`;
          value = `AOA ${(item.priceInCents / 100).toFixed(2)}`;
          break;
        case 'mensagens':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.username} (Chat ID ${item.idChat})`;
          value = 'N/A';
          break;
        case 'users':
          date = new Date(item.createdIn).toLocaleDateString('pt-BR');
          description = `${item.name} (${item.email})`;
          value = 'N/A';
          break;
        default:
          date = description = value = 'N/A';
      }
      console.log('PDF row data:', { date, description, value });
      return [date, description, value];
    });

    // Usar autoTable para a tabela
    try {
      doc.autoTable({
        startY: titleY + 20,
        head: [headers],
        body: rows,
        theme: 'striped',
        headStyles: {
          fillColor: [124, 93, 39], 
          textColor: [255, 255, 255],
          fontSize: 12
        },
        bodyStyles: {
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [245, 245, 220] 
        },
        margin: { top: titleY + 20, left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 30 }, 
          1: { cellWidth: 100 }, 
          2: { cellWidth: 50 } 
        }
      });
      console.log('PDF table generated with', rows.length, 'rows');
    } catch (error) {
      console.error('Erro ao gerar a tabela no PDF:', error);
      doc.text('Erro ao gerar a tabela.', 10, titleY + 20);
    }

    // Adicionar rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(124, 93, 39); 
      doc.text(`Página ${i} de ${pageCount}`, 190, 290, { align: 'right' });
      doc.text('Pele Douro - Relatórios', 10, 290);
      console.log(`Footer added to page ${i}`);
    }

    // Salvar o PDF
    try {
      doc.save(`Relatorio_${reportType}_${startDate}_${endDate}.pdf`);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Erro ao salvar o PDF:', error);
      alert('Falha ao salvar o PDF. Tente novamente.');
    }
  }

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    
    if (modal && messageElement) {
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
      console.log('Confirm modal shown:', { message, action });
    } else {
      console.error('Elementos do modal não encontrados.');
    }
  }
});