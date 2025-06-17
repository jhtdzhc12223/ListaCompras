import { supabase } from './supabaseClient.js'

// Função para criar efeito de partículas
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 1;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    particlesContainer.appendChild(particle);
  }
}

createParticles();

// Função para mostrar/ocultar loading
function toggleLoading(show) {
  const btn = document.querySelector('#btn-cadastro');
  if (btn) {
    btn.disabled = show;
    btn.innerHTML = show ? 
      '<span class="spinner"></span> Processando...' : 
      'Criar conta';
  }
}

// Função para cadastrar novo usuário (completa)
window.cadastro = async function() {
  // Obter valores dos campos
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  // Validação dos campos
  if (!username || !email || !senha) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (username.length < 3) {
    alert('Nome de usuário deve ter pelo menos 3 caracteres');
    return;
  }

  if (senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres');
    return;
  }

  toggleLoading(true);

  try {
    // 1. Cadastro no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          username: username
        }
      }
    });

    if (authError) throw authError;

    // 2. Criação do perfil na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        username,
        email,
        created_at: new Date()
      }]);

    if (profileError) throw profileError;

    // Sucesso
    alert(`Cadastro realizado com sucesso! Verifique seu email (${email}) para confirmar.`);
    window.location.href = 'login.html';

  } catch (error) {
    console.error('Erro no cadastro:', error);
    alert(`Erro: ${error.message || 'Ocorreu um erro durante o cadastro'}`);
  } finally {
    toggleLoading(false);
  }
}

// Função para login
window.login = async function() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    alert('Erro no login: ' + error.message);
    return;
  }

  window.location.href = 'index.html';
}

// Evento de tecla Enter
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const path = window.location.pathname;
    if (path.includes('login')) login();
    else if (path.includes('cadastro')) cadastro();
  }
});

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registrado:', registration.scope);
        registration.update();
      })
      .catch(err => console.error('Falha no SW:', err));
  });
}
