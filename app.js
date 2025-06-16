// Adicione no início do app.js
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de digitação no título
    const titulo = document.querySelector('.titulo');
    if (titulo) {
        const textoOriginal = titulo.textContent;
        titulo.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < textoOriginal.length) {
                titulo.textContent += textoOriginal.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 100);
    }
    
    // Efeito sonoro para interações
    const playSound = (type) => {
        if (typeof Audio !== 'undefined') {
            const sound = new Audio();
            sound.src = type === 'add' ? 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3' : 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3';
            sound.volume = 0.2;
            sound.play();
        }
    };
    
    // Modifique a função adicionarItem para incluir o som
    window.adicionarItem = async function() {
        playSound('add');
        // ... restante do código existente
    };
    
    // Modifique a função removerItem para incluir o som
    window.removerItem = async function(id) {
        playSound('remove');
        // ... restante do código existente
    };
});
