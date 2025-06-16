// auth.js corrigido
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

// Inicia o efeito de partículas
createParticles();

// Função para login do usuário
window.login = async function () {
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  // Autentica com Supabase
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) {
    alert('Erro no login: ' + error.message)
  } else {
    // Redireciona para página principal
    window.location.href = 'index.html'
  }
}

// Função para cadastrar novo usuário (CORRIGIDA)
window.cadastro = async function () {
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  // Tenta cadastrar o usuário
  const { error } = await supabase.auth.signUp({ email, password: senha })
  
  if (error) {
    alert('Erro no cadastro: ' + error.message)
    return
  }

  // Tenta fazer login automaticamente após cadastro
  const { error: loginError } = await supabase.auth.signInWithPassword({ 
    email, 
    password: senha 
  })
  
  if (loginError) {
    alert('Cadastro realizado! Faça login manualmente.')
    return
  }

  // Verifica se o login foi bem sucedido
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Redireciona para página principal
    window.location.href = 'index.html'
  } else {
    alert('Autenticação falhou após cadastro. Faça login manualmente.')
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const caminho = window.location.pathname
    if (caminho.includes('login')) {
      login()
    } else if (caminho.includes('cadastro')) {
      cadastro()
    }
  }
})
