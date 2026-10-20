document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    if (toggleBtn && chatWindow) {
        toggleBtn.addEventListener('click', () => {
            if (chatWindow.classList.contains('hidden')) {
                chatWindow.classList.remove('hidden');
                chatWindow.style.display = 'flex';
                if (iconOpen) iconOpen.style.display = 'none';
                if (iconClose) iconClose.style.display = 'block';
            } else {
                chatWindow.classList.add('hidden');
                chatWindow.style.display = 'none';
                if (iconOpen) iconOpen.style.display = 'block';
                if (iconClose) iconClose.style.display = 'none';
            }
        });
    }

    if (sendBtn) sendBtn.addEventListener('click', enviarMensaje);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensaje();
        });
    }
});

async function enviarMensaje() {
    const input = document.getElementById('chat-input');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    agregarMensaje(mensaje, 'user');
    input.value = '';

    try {
        // Petición corregida con ruta relativa
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            message: mensaje,
            language: document.documentElement.lang || "es"})
        });

        if (!res.ok) throw new Error('Error en la respuesta del servidor');

        const data = await res.json();
        agregarMensaje(data.response || 'Sin respuesta', 'bot');
    } catch (err) {
        agregarMensaje('Ocurrió un error al conectar.', 'bot');
    }
}

function agregarMensaje(texto, tipo) {
    const box = document.getElementById('chat-messages');
    if (!box) return;

    const wrapper = document.createElement('div');
    
    if (tipo === 'user') {
        wrapper.style.cssText = "display: flex; justify-content: flex-end;";
        wrapper.innerHTML = `
            <div style="background-color: #2e261d; color: #ffffff; padding: 10px 14px; border-radius: 14px; border-top-right-radius: 2px; max-width: 80%; line-height: 1.4;">
                ${escapeHTML(texto)}
            </div>
        `;
    } else {
        wrapper.style.cssText = "display: flex; gap: 8px; align-items: flex-start;";
        wrapper.innerHTML = `
            <div style="width: 28px; height: 28px; background-color: #2e261d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; color: #fff;">
                🥛
            </div>
            <div style="background-color: #f0ebe1; color: #2e261d; padding: 10px 14px; border-radius: 14px; border-top-left-radius: 2px; max-width: 80%; line-height: 1.4;">
                ${texto}
            </div>
        `;
    }

    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight;
}

// Función auxiliar para evitar inyección de código (XSS) al mostrar el mensaje del usuario
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}