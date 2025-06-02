class DynamicMessageModal {
  constructor() {
    this.createModalStructure();
    this.initEvents();
  }

  createModalStructure() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-message-overlay';

    this.container = document.createElement('div');
    this.container.className = 'modal-message-container';

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'modal-message-close';
    this.closeBtn.innerHTML = '×';

    const header = document.createElement('div');
    header.className = 'modal-message-header';

    this.icon = document.createElement('div');
    this.icon.className = 'modal-message-icon';

    this.iconType = document.createElement('i');
    this.iconType.className = 'fas';
    this.icon.appendChild(this.iconType);

    this.title = document.createElement('h3');
    this.title.className = 'modal-message-title';
    this.title.textContent = 'Título';

    header.appendChild(this.icon);
    header.appendChild(this.title);

    this.body = document.createElement('div');
    this.body.className = 'modal-message-body';
    const bodyParagraph = document.createElement('p');
    bodyParagraph.textContent = 'Mensagem do modal aqui.';
    this.body.appendChild(bodyParagraph);

    const footer = document.createElement('div');
    footer.className = 'modal-message-footer';

    this.actionBtn = document.createElement('button');
    this.actionBtn.className = 'modal-message-btn';
    this.actionBtn.textContent = 'OK';
    footer.appendChild(this.actionBtn);

    this.container.appendChild(this.closeBtn);
    this.container.appendChild(header);
    this.container.appendChild(this.body);
    this.container.appendChild(footer);
    this.overlay.appendChild(this.container);

    document.body.appendChild(this.overlay);
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal-message-overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
      }

      .modal-message-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .modal-message-container {
        background-color: #FFF8F0;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
        width: 90%;
        max-width: 450px;
        padding: 30px;
        transform: translateY(30px) scale(0.95);
        transition: all 0.4s ease;
        position: relative;
      }

      .modal-message-overlay.active .modal-message-container {
        transform: translateY(0) scale(1);
      }

      .modal-message-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .modal-message-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 1.5rem;
        background-color: #EEDFCC;
        color: #8B4513;
        animation: modalMessageIconBounce 0.6s ease forwards;
      }

      .modal-message-success .modal-message-icon {
        background-color: #F5DEB3;
        color: #8B4513;
      }

      .modal-message-error .modal-message-icon {
        background-color: #FFE4E1;
        color: #A52A2A;
      }

      .modal-message-title {
        font-size: 1.5rem;
        color: #4B2E1E;
        margin: 0;
        font-weight: bold;
      }

      .modal-message-body {
        margin-bottom: 25px;
        line-height: 1.6;
        color: #4B2E1E;
        padding-left: 65px;
      }

      .modal-message-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 15px;
        border-top: 1px solid #D2B48C;
      }

      .modal-message-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #F5F5DC;
        border: 1px solid #D2B48C;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 1.2rem;
        color: #8B4513;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s ease;
      }

      .modal-message-close:hover {
        background: #DEB887;
        color: white;
        transform: rotate(90deg);
      }

      .modal-message-btn {
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: #A0522D;
        color: white;
        position: relative;
        overflow: hidden;
      }

      .modal-message-btn:hover {
        background-color: #8B4513;
      }

      .modal-message-btn .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      @keyframes modalMessageIconBounce {
        0% {
          transform: scale(0);
        }
        60% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes modalMessageFadeIn {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-message-container {
        animation: modalMessageFadeIn 0.4s ease forwards;
      }
    `;
    document.head.appendChild(style);
  }

  initEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.actionBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.actionBtn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  show(type, title, message, options = {}) {
    this.container.classList.remove('modal-message-success', 'modal-message-error');
    this.container.classList.add(`modal-message-${type}`);

    this.iconType.className =
      type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

    this.title.textContent = title;
    this.body.innerHTML = message;

    if (options.buttonText) {
      this.actionBtn.textContent = options.buttonText;
    }

    if (options.buttonAction) {
      const newBtn = this.actionBtn.cloneNode(true);
      this.actionBtn.replaceWith(newBtn);
      this.actionBtn = newBtn;
      this.actionBtn.addEventListener('click', () => {
        options.buttonAction();
        this.close();
      });

      this.actionBtn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    }

    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.escKeyHandler = (e) => e.key === 'Escape' && this.close();
    document.addEventListener('keydown', this.escKeyHandler);
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', this.escKeyHandler);
  }
}

// Auto-inicialização
const initModalMessage = () => {
  window.messageModal = new DynamicMessageModal();
  window.showMessageModal = (type, title, message, options) => {
    window.messageModal.show(type, title, message, options);
  };
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalMessage);
} else {
  initModalMessage();
}
