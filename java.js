// ============================================
// RG DIGITAL SP - JavaScript Principal
// ============================================

// 🔴 VARIÁVEL GLOBAL DO CONTADOR
let qrInterval = null;
let qrStartTime = null;

// Estado da aplicação
const AppState = {
    currentScreen: 'login',
    passwordVisible: false,
    passwordValue: ''
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Mostra a tela de loading por 3 segundos
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');

    // Esconde a tela de login inicialmente
    if (loginScreen) {
        loginScreen.classList.remove('active');
    }

    // Após 1 segundo, esconde a tela de loading e mostra a tela de login
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove completamente após a animação
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        // Mostra a tela de login
        if (loginScreen) {
            loginScreen.classList.add('active');
        }

        // Inicializa o app
        initializeApp();
    }, 1000);
});

function initializeApp() {
    setupPasswordToggle();
    setupPasswordInput();
    setupLoginButton();
    setupTabNavigation();
    setupServiceItems();
    setupOptionItems();
    setupAddWalletButton();
    setupRGDetailScreen();

    // Garante que está na tela de login
    showScreen('login');
}

// ============================================
// NAVEGAÇÃO ENTRE TELAS
// ============================================

function showScreen(screenName) {
    // Oculta todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostra a tela selecionada
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenName;

        // Atualiza a tab bar ativa
        updateActiveTab(screenName);
    }
}

function updateActiveTab(screenName) {
    const tabItems = document.querySelectorAll('.tab-item');
    // Map logical screen to the tab that should be active
    const activeTabForScreen = {
        wallet: 'wallet',
        services: 'services',
        options: 'options',
        'rg-detail': 'wallet',
    };
    const targetTab = activeTabForScreen[screenName];
    tabItems.forEach((tab) => {
        tab.classList.remove('active');
        if (targetTab && tab.dataset.screen === targetTab) {
            tab.classList.add('active');
        }
    });
}

// ============================================
// TAB NAVIGATION
// ============================================

function setupTabNavigation() {
    const tabItems = document.querySelectorAll('.tab-item');

    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = tab.dataset.screen;

            // Não permite navegar para login pela tab bar
            if (targetScreen && targetScreen !== 'login') {
                showScreen(targetScreen);

                // Feedback tátil
                tab.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tab.style.transform = '';
                }, 150);
            }
        });
    });
}

// ============================================
// TELA DE LOGIN - Toggle de Senha
// ============================================

function setupPasswordToggle() {
    const toggleButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password-input');

    if (!toggleButton || !passwordInput) return;

    toggleButton.addEventListener('click', () => {
        AppState.passwordVisible = !AppState.passwordVisible;

        if (AppState.passwordVisible) {
            passwordInput.type = 'text';
            toggleButton.setAttribute('aria-label', 'Ocultar senha');
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleButton.setAttribute('aria-label', 'Mostrar senha');
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            `;
        }

        // Animação de fade
        toggleButton.style.opacity = '0.5';
        setTimeout(() => {
            toggleButton.style.opacity = '1';
        }, 150);

        // Foca de volta no input
        passwordInput.focus();
    });
}

// ============================================
// TELA DE LOGIN - Validação de Senha
// ============================================

function setupPasswordInput() {
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');

    if (!passwordInput || !loginButton) return;

    passwordInput.addEventListener('input', (e) => {
        AppState.passwordValue = e.target.value.trim();
        updateLoginButtonState();
    });

    // Valida ao perder o foco também
    passwordInput.addEventListener('blur', () => {
        updateLoginButtonState();
    });
}

function updateLoginButtonState() {
    const loginButton = document.getElementById('login-button');
    if (!loginButton) return;

    const hasPassword = AppState.passwordValue.length >= 5;

    if (hasPassword) {
        loginButton.disabled = false;
        loginButton.style.cursor = 'pointer';
    } else {
        loginButton.disabled = true;
        loginButton.style.cursor = 'not-allowed';
    }
}

// ============================================
// TELA DE LOGIN - Toggle de Senha + Validação Persistente
// ============================================

let loginError = false; // Flag global para manter o erro

function setupPasswordToggle() {
    const toggleButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password-input');

    if (!toggleButton || !passwordInput) return;

    // ✅ Estado inicial: senha oculta e ícone de olho fechado
    AppState.passwordVisible = false;
    passwordInput.type = 'password';
    toggleButton.setAttribute('aria-label', 'Mostrar senha');
    toggleButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    `;

    toggleButton.addEventListener('click', () => {
        AppState.passwordVisible = !AppState.passwordVisible;

        if (AppState.passwordVisible) {
            // 🔓 Senha visível → ícone de olho aberto
            passwordInput.type = 'text';
            toggleButton.setAttribute('aria-label', 'Ocultar senha');
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            `;
        } else {
            // 🔒 Senha oculta → ícone de olho fechado
            passwordInput.type = 'password';
            toggleButton.setAttribute('aria-label', 'Mostrar senha');
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            `;
        }

        // Mantém vermelho se login errado
        if (loginError) toggleButton.classList.add('error');
        else toggleButton.classList.remove('error');

        passwordInput.focus();
    });
}

function setupPasswordInput() {
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');

    if (!passwordInput || !loginButton) return;

    passwordInput.addEventListener('input', (e) => {
        AppState.passwordValue = e.target.value.trim();
        updateLoginButtonState();

        // Só remove erro se o usuário acertou a senha
        if (loginError && AppState.passwordValue === "181008") {
            loginError = false;
            passwordInput.classList.remove('input-error');
            document.getElementById('toggle-password').classList.remove('error');
            document.getElementById('password-error').style.display = 'none';
        }
    });

    passwordInput.addEventListener('blur', () => {
        updateLoginButtonState();
    });
}

function updateLoginButtonState() {
    const loginButton = document.getElementById('login-button');
    if (!loginButton) return;

    const hasPassword = AppState.passwordValue.length >= 5;

    if (hasPassword) {
        loginButton.disabled = false;
        loginButton.style.cursor = 'pointer';
    } else {
        loginButton.disabled = true;
        loginButton.style.cursor = 'not-allowed';
    }
}

function setupLoginButton() {
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password-input');

    if (!loginButton || !passwordInput) return;

    // Cria span para mensagem de erro se não existir
    let errorMsg = document.getElementById('password-error');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.id = 'password-error';
        errorMsg.className = 'password-error';
        errorMsg.style.display = 'none';
        passwordInput.parentNode.appendChild(errorMsg);
    }

    loginButton.addEventListener('click', () => {
        const senhaDigitada = passwordInput.value.trim();
        const senhaCorreta = "181008"; // senha fixa

        if (senhaDigitada === senhaCorreta) {
            // Limpa erro
            loginError = false;
            passwordInput.classList.remove('input-error');
            document.getElementById('toggle-password').classList.remove('error');
            errorMsg.style.display = 'none';

            // Navega para a carteira
            showScreen('wallet');
        } else {
            // Mostra erro persistente
            loginError = true;
            passwordInput.classList.add('input-error');
            document.getElementById('toggle-password').classList.add('error');
            errorMsg.textContent = 'Senha incorreta.';
            errorMsg.style.display = 'block';
        }
    });
}



// ============================================
// TELA SERVIÇOS - Itens Clicáveis
// ============================================

function setupServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // O feedback visual é feito pelo CSS :active
            // Simula navegação para detalhe do serviço
            const serviceTitle = item.querySelector('.service-title').textContent;
            showToast(`Abrindo: ${serviceTitle}`);

            // Em produção, aqui abriria a tela de detalhe ou modal
            // showServiceDetail(serviceTitle);
        });
    });
}

// ============================================
// TELA OPÇÕES - Itens Clicáveis
// ============================================

function setupOptionItems() {
    const optionItems = document.querySelectorAll('.option-item');

    optionItems.forEach(item => {
        item.addEventListener('click', () => {
            // Feedback visual
            item.style.transform = 'translateX(4px)';
            item.style.backgroundColor = 'var(--color-bg-light)';

            setTimeout(() => {
                item.style.transform = '';
                item.style.backgroundColor = '';
            }, 200);

            // Simula ação
            const optionTitle = item.querySelector('.option-title').textContent;
            showToast(`Abrindo: ${optionTitle}`);

            // Em produção, cada opção teria sua ação específica
            handleOptionClick(optionTitle);
        });
    });
}

function handleOptionClick(optionTitle) {
    // Simula diferentes ações para cada opção
    const actions = {
        'Alteração de senha': () => showToast('Redirecionando para alteração de senha...'),
        'Acesso com biometria': () => showToast('Abrindo configurações de biometria...'),
        'Perguntas frequentes': () => showToast('Carregando FAQ...'),
        'Chat de atendimento': () => showToast('Iniciando chat...'),
        'Termos e condições de uso': () => showToast('Abrindo termos e condições...'),
        'Política de privacidade': () => showToast('Abrindo política de privacidade...')
    };

    if (actions[optionTitle]) {
        actions[optionTitle]();
    }
}

// ============================================
// TELA CARTEIRA - Botão Adicionar
// ============================================

function setupAddWalletButton() {
    const addWalletButton = document.getElementById('add-wallet-button');

    if (!addWalletButton) return;

    addWalletButton.addEventListener('click', () => {
        // Feedback visual
        addWalletButton.style.transform = 'scale(0.98)';
        addWalletButton.style.backgroundColor = 'rgba(11, 75, 90, 0.05)';

        setTimeout(() => {
            addWalletButton.style.transform = '';
            addWalletButton.style.backgroundColor = '';
        }, 150);

        // Simula ação de adicionar carteira
        showToast('Abrindo fluxo de adição de carteira...');

        // Em produção, aqui abriria o formulário/modal de adição
        // showAddWalletModal();
    });
}

// ============================================
// MODAL DA CARTEIRA
// ============================================

function setupRGDetailScreen() {
    const rgCard = document.querySelector('.rg-card');
    const backButton = document.querySelector('[data-rg-back]');
    const tabButtons = document.querySelectorAll('.rg-detail-tabs .rg-tab-button');
    const panels = document.querySelectorAll('.rg-detail-panel');

    if (!rgCard || !backButton) return;

    const setActivePanel = (target) => {
        tabButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.rgTab === target);
        });
        panels.forEach((panel) => {
            panel.classList.toggle('active', panel.dataset.rgPanel === target);
        });
    };

    rgCard.addEventListener('click', () => {
    showScreen('rg-detail');
    setActivePanel('front');

    // INICIA O CONTADOR
    setTimeout(() => {
        iniciarContadorQR();
    }, 300);
});

    backButton.addEventListener('click', () => {

    // 🔴 PARA o contador ao sair
    if (qrInterval) {
        clearInterval(qrInterval);
        qrInterval = null;
    }

    showScreen('wallet');
});

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.rgTab;
            if (target) {
                setActivePanel(target);
            }
        });
    });
}

// ============================================
// LINKS E NAVEGAÇÃO SECUNDÁRIA
// ============================================

// Link "Esqueci minha senha"
document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Redirecionando para recuperação de senha...');
            // Em produção: window.location.href = '/recuperar-senha';
        });
    }

    // Links do footer (Ajuda, Privacidade, Termos)
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            showToast(`Abrindo: ${linkText}`);
            // Em produção, cada link abriria sua respectiva página/modal
        });
    });
});

// ============================================
// UTILITÁRIOS - Toast Notifications
// ============================================

function showToast(message, duration = 2000) {
    // Remove toast existente se houver
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        animation: toastSlideIn 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;

    // Adiciona animação CSS
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes toastSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove após duração
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// ============================================
// PREVENÇÃO DE COMPORTAMENTOS PADRÃO
// ============================================

// Previne scroll em elementos não-scrolláveis
document.addEventListener('touchmove', (e) => {
    const target = e.target;
    const isScrollable = target.closest('.screen-content, .login-container');

    if (!isScrollable && target.closest('.screen')) {
        // Permite scroll apenas em áreas específicas
    }
}, {
    passive: true
});

// Previne zoom em double-tap (opcional)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ============================================
// ACESSIBILIDADE
// ============================================

// Adiciona labels de acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    // Tab items
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        const label = tab.querySelector('.tab-label').textContent;
        tab.setAttribute('aria-label', `Navegar para ${label}`);
        tab.setAttribute('role', 'button');
    });

    // Service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const title = item.querySelector('.service-title').textContent;
        item.setAttribute('aria-label', `Abrir ${title}`);
        item.setAttribute('role', 'button');
    });

    // Option items
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        const title = item.querySelector('.option-title').textContent;
        item.setAttribute('aria-label', `Abrir ${title}`);
        item.setAttribute('role', 'button');
    });

    // Botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
});

// ============================================
// EXPORT (para uso em módulos, se necessário)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showScreen,
        showToast,
        AppState
    };
}

// ============================================
// SCROLL LATERAL SUAVE - RG DETAIL
// ============================================

let startX = 0;
let endX = 0;
let isScrolling = false;

const content = document.querySelector(".rg-detail-content");

// Propriedades de scroll suave
if (content) {
    content.style.scrollBehavior = 'smooth';
}

content.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isScrolling = false;
});

content.addEventListener("touchmove", (e) => {
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 10) {
        isScrolling = true;
    }
});

content.addEventListener("touchend", (e) => {
    if (!isScrolling) return;
    
    endX = e.changedTouches[0].clientX;
    handleSwipeSuave();
});

function handleSwipeSuave() {
    const diff = startX - endX;
    
    if (Math.abs(diff) < 30) return;
    
    const current = document.querySelector(".rg-tab-button.active");
    let next;
    
    if (diff > 0) {
        next = current.nextElementSibling;
    } else {
        next = current.previousElementSibling;
    }
    
    if (next && next.classList.contains("rg-tab-button")) {
        next.style.transition = 'all 0.3s ease-out';
        next.click();
    }
}

let isMouseDown = false;
let mouseStartX = 0;

content.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    mouseStartX = e.clientX;
    content.style.cursor = 'grabbing';
});

content.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    const diff = mouseStartX - e.clientX;
    content.style.cursor = Math.abs(diff) > 10 ? 'grabbing' : 'grab';
});

content.addEventListener("mouseup", (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    content.style.cursor = 'grab';
    
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 30) {
        startX = mouseStartX;
        endX = e.clientX;
        handleSwipeSuave();
    }
});

// ============================================
// CONTADOR DO QR CODE (60s)
// ============================================

function iniciarContadorQR() {
    const duracao = 60;

    const timer = document.getElementById("qr-timer");
    const barra = document.querySelector(".qr-progress");

    if (!timer || !barra) return;

    // 🔴 só inicia o tempo uma vez
    if (!qrStartTime) {
        qrStartTime = Date.now();
    }

    // limpa intervalo antigo
    if (qrInterval) {
        clearInterval(qrInterval);
    }

    qrInterval = setInterval(() => {
        const agora = Date.now();
        const tempoPassado = Math.floor((agora - qrStartTime) / 1000);
        let tempoRestante = duracao - tempoPassado;

        // reinicia automático quando zera
        if (tempoRestante <= 0) {
            qrStartTime = Date.now();
            tempoRestante = duracao;
        }

        let segundos = tempoRestante < 10 ? "0" + tempoRestante : tempoRestante;
        timer.textContent = "00:" + segundos;

        let porcentagem = ((duracao - tempoRestante) / duracao) * 100;
        barra.style.width = porcentagem + "%";

    }, 1000);
}
function atualizarHorario() {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const hora = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');

    const formato = `${dia}/${mes}/${ano} - ${hora}:${min}`;

    const elementos = document.querySelectorAll('.rg-update-text');

    elementos.forEach(el => {
        el.textContent = "Última atualização em: " + formato;
    });
}
const rgCard = document.querySelector('.rg-card');
if (rgCard) {
    rgCard.addEventListener('click', () => {
        atualizarHorario();
    });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}