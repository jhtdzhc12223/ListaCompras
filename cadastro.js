// Scripts específicos para a página de cadastro
document.addEventListener('DOMContentLoaded', () => {
    // Foco automático no primeiro campo
    const usernameField = document.getElementById('username');
    if (usernameField) usernameField.focus();
    
    // Verificar erros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
        alert(error);
        history.replaceState(null, '', window.location.pathname);
    }
    
    // Configurar o formulário
    const form = document.getElementById('form-cadastro');
    if (form) {
        form.addEventListener('submit', () => {
            const btn = document.getElementById('btn-cadastro');
            if (btn) {
                btn.classList.add('carregando');
                btn.disabled = true;
            }
        });
    }
});
