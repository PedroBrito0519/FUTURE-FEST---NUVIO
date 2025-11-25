window.addEventListener('offline', function() {
    window.location.href = 'error.html'; // Redireciona quando estiver offline
});
function reportError() {
           
    alert('Erro reportado com sucesso!'); // Simulação de envio
}



const glowEffect = document.createElement('div');
glowEffect.className = 'glow-effect';
document.body.appendChild(glowEffect);

document.addEventListener('mousemove', (event) => {
glowEffect.style.left = `${event.pageX - 50}px`; // Centraliza o brilho
glowEffect.style.top = `${event.pageY - 50}px`; // Centraliza o brilho
glowEffect.style.opacity = '50'; // Torna o brilho visível

// Após 0.2 segundos, remove a opacidade
setTimeout(() => {
glowEffect.style.opacity = '0'; 
}, 200);
});



document.addEventListener('mousemove', (e) => {
const pixel = document.createElement('div');
pixel.className = 'pixel';
pixel.style.left = `${e.clientX}px`;
pixel.style.top = `${e.clientY}px`;
document.body.appendChild(pixel);

// Remove o pixel após a animação
setTimeout(() => {
pixel.remove();
}, 500); // Tempo para a bolinha sumir
});