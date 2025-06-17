// auth.js atualizado
import { supabase } from './supabaseClient.js'

// Função para criar efeito de partículas (mantida igual)
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

// Função para login do usuário (alterada para incluir username)
window.login = async function () {
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) {
    alert('Erro no login: ' + error.message)
  } else {
    window.location.href = 'index.html'
  }
}

// Função para cadastrar novo usuário (atualizada para incluir username)
window.cadastro = async function () {
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value
  const username = document.getElementById('username').value

  // Primeiro fazemos o cadastro no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({ 
    email, 
    password: senha,
    options: {
      data: {
        username: username
      }
    }
  })

  if (authError) {
    alert('Erro no cadastro: ' + authError.message)
    return
  }

  // Depois inserimos o username na tabela de perfis
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      { 
        id: authData.user.id, 
        username: username,
        email: email
      }
    ])

  if (profileError) {
    alert('Erro ao criar perfil: ' + profileError.message)
    return
  }

  alert('Cadastro realizado! Verifique seu email para confirmar sua conta. Após a confirmação, você poderá fazer login.')
  window.location.href = 'login.html'
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
