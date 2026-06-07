/* ============ TABS CON EFECTO LIBRO - VERSIÓN SIMPLIFICADA ============ */
document.addEventListener('DOMContentLoaded', function() {
  
  const btns  = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-panel');
  let currentIndex = 0;
  let isAnimating = false;

  // Encontrar qué panel está activo actualmente
  for (let i = 0; i < panes.length; i++) {
    if (panes[i].classList.contains('active')) {
      currentIndex = i;
      break;
    }
  }

  // Función para cambiar de página
  function changeTab(newIndex) {
    if (isAnimating) return;
    if (newIndex === currentIndex) return;
    if (newIndex < 0 || newIndex >= panes.length) return;

    isAnimating = true;

    panes[currentIndex].classList.remove('active');
    panes[newIndex].classList.add('active');
    
    btns[currentIndex].classList.remove('active');
    btns[newIndex].classList.add('active');
    
    currentIndex = newIndex;
    
    updateDots();
    
    setTimeout(function() {
      isAnimating = false;
    }, 300);
  }

  function createPageDots() {
    const tabsWrap = document.querySelector('.tabs-wrap');
    if (!tabsWrap) return;
    
    const oldIndicator = document.querySelector('.page-indicator');
    if (oldIndicator) oldIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'page-indicator';
    
    for (let i = 0; i < panes.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'page-dot';
      if (i === currentIndex) dot.classList.add('active');
      
      dot.addEventListener('click', (function(idx) {
        return function() {
          changeTab(idx);
        };
      })(i));
      
      indicator.appendChild(dot);
    }
    
    tabsWrap.appendChild(indicator);
  }
  
  function updateDots() {
    const dots = document.querySelectorAll('.page-dot');
    for (let i = 0; i < dots.length; i++) {
      if (i === currentIndex) {
        dots[i].classList.add('active');
      } else {
        dots[i].classList.remove('active');
      }
    }
  }

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', (function(idx) {
      return function() {
        changeTab(idx);
      };
    })(i));
  }

  createPageDots();
  
});

/* ============ MODAL GENERAL ============ */
(function() {
  const modal = document.getElementById('modal');
  const modalInner = document.getElementById('modalInner');
  const modalClose = document.getElementById('modalClose');

  function closeModal() {
    if (modal) modal.classList.remove('open');
    if (modalInner) modalInner.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function(e) { 
    if (e.target === modal) closeModal(); 
  });
  document.addEventListener('keydown', function(e) { 
    if (e.key === 'Escape') closeModal(); 
  });

  window.abrirModal = function(tipo, src) {
    if (!modalInner || !modal) return;
    modalInner.innerHTML = '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (tipo === 'genially') {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.cssText = 'width:100%;height:65vh;border:none;border-radius:16px;';
      iframe.allowFullscreen = true;
      modalInner.appendChild(iframe);
    }
    else if (tipo === 'video-local') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.style.cssText = 'width:100%;max-height:65vh;border-radius:16px;';
      modalInner.appendChild(video);
    }
    else if (tipo === 'imagen') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Preview';
      img.style.cssText = 'max-width:100%;max-height:65vh;border-radius:16px;display:block;margin:auto;';
      img.onerror = function() {
        img.style.display = 'none';
        const ph = document.createElement('div');
        ph.style.cssText = 'width:100%;height:250px;background:rgba(124,92,255,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center;color:#a78bfa;font-size:0.8rem;';
        ph.textContent = '🔍 Vista previa no disponible';
        modalInner.appendChild(ph);
      };
      modalInner.appendChild(img);
    }
  };
})();

/* ============ MODAL PARA SCRATCH ============ */
window.abrirModalScratch = function(projectId) {
  const modal = document.getElementById('modal');
  const modalInner = document.getElementById('modalInner');
  
  if (!modal || !modalInner) return;
  
  modalInner.innerHTML = `
    <div style="position: relative; width: 100%;">
      <iframe src="https://scratch.mit.edu/projects/${projectId}/embed" 
        allowtransparency="true" 
        width="100%" 
        height="600" 
        frameborder="0" 
        scrolling="no" 
        allowfullscreen
        style="width:100%; height:70vh; border-radius:16px; background:#030009;">
      </iframe>
      <div style="text-align: center; margin-top: 1rem; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(241,238,255,0.35);">
        🎮 Juego de Scratch · Haz clic en la bandera verde para comenzar
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ============ AVATAR UPLOAD ============ */
window.loadAvatar = function(input, imgId, placeholderId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);
    if (img) {
      img.src = e.target.result;
      img.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
};

/* ============ MODAL CON CARRUSEL PARA APP INVENTOR ============ */
window.abrirModalCarrusel = function(imagenes, titulo) {
  const modal = document.getElementById('modal');
  const modalInner = document.getElementById('modalInner');
  
  if (!modal || !modalInner) return;
  
  let currentIndex = 0;
  const totalImages = imagenes.length;
  
  modalInner.innerHTML = `
    <div style="background: var(--bg-card); border-radius: 20px; overflow: hidden;">
      <div style="padding: 1rem; border-bottom: 1px solid rgba(139,63,255,0.2);">
        <h3 style="font-family: var(--font-display); font-size: 1rem; color: var(--pink); margin: 0; text-align: center;">${titulo}</h3>
      </div>
      <div style="position: relative;">
        <div id="carruselContainer" style="position: relative; height: 500px; overflow: hidden; background: linear-gradient(135deg, #0d0020, #1a0035);">
          <img id="carruselImg" src="${imagenes[0]}" alt="Imagen 1" style="width: 100%; height: 100%; object-fit: contain; transition: opacity 0.3s ease;">
        </div>
        <button id="carruselPrev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(139,63,255,0.5); border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        </button>
        <button id="carruselNext" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(139,63,255,0.5); border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </button>
      </div>
      <div id="carruselDots" style="display: flex; justify-content: center; gap: 0.5rem; padding: 1rem; background: rgba(7,0,15,0.5);">
        ${imagenes.map((_, idx) => `<div class="carrusel-dot" data-index="${idx}" style="width: 10px; height: 10px; border-radius: 50%; background: ${idx === 0 ? 'var(--pink)' : 'rgba(139,63,255,0.3)'}; cursor: pointer; transition: all 0.2s ease;"></div>`).join('')}
      </div>
      <div style="padding: 0.8rem; text-align: center; border-top: 1px solid rgba(139,63,255,0.1);">
        <p style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-3); margin: 0;">
          🖱️ Haz clic en las flechas para navegar | ${totalImages} imágenes
        </p>
      </div>
    </div>
  `;
  
  const updateImage = (index) => {
    currentIndex = (index + totalImages) % totalImages;
    const img = document.getElementById('carruselImg');
    if (img) img.src = imagenes[currentIndex];
    
    const dots = document.querySelectorAll('.carrusel-dot');
    dots.forEach((dot, i) => {
      dot.style.background = i === currentIndex ? 'var(--pink)' : 'rgba(139,63,255,0.3)';
    });
  };
  
  setTimeout(() => {
    const prevBtn = document.getElementById('carruselPrev');
    const nextBtn = document.getElementById('carruselNext');
    const dots = document.querySelectorAll('.carrusel-dot');
    
    if (prevBtn) prevBtn.onclick = () => updateImage(currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => updateImage(currentIndex + 1);
    
    dots.forEach(dot => {
      dot.onclick = () => {
        const idx = parseInt(dot.dataset.index);
        updateImage(idx);
      };
    });
  }, 50);
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ============ MÚSICA DE FONDO GLOBAL (Código Neón) ============ */
let audioPlayerGlobal = null;
let musicaGlobalActiva = false;

// Ruta LOCAL del MP3 (asegúrate de tener el archivo en /musica/Código Neón.mp3)
const MUSICA_URL = 'musica/C%C3%B3digo%20Ne%C3%B3n.mp3';

function activarMusicaGlobal() {
  if (musicaGlobalActiva && audioPlayerGlobal && !audioPlayerGlobal.paused) {
    return;
  }
  
  if (audioPlayerGlobal && audioPlayerGlobal.paused) {
    audioPlayerGlobal.play().then(() => {
      musicaGlobalActiva = true;
      actualizarBotonesMusica(true);
      console.log('🎵 Música reanudada');
    }).catch(error => {
      console.log('Error al reanudar:', error);
    });
    return;
  }
  
  if (audioPlayerGlobal) {
    audioPlayerGlobal.pause();
    audioPlayerGlobal = null;
  }
  
  const audio = new Audio(MUSICA_URL);
  audio.loop = true;
  audio.volume = 0.2;
  
  audio.play().then(() => {
    console.log('🎵 Música activada: Código Neón');
    audioPlayerGlobal = audio;
    musicaGlobalActiva = true;
    actualizarBotonesMusica(true);
  }).catch(error => {
    console.log('⚠️ Error al reproducir:', error);
    alert('No se pudo reproducir la música. Verifica que el archivo esté en la carpeta "musica/"');
  });
}

function pausarMusicaGlobal() {
  if (audioPlayerGlobal && !audioPlayerGlobal.paused) {
    audioPlayerGlobal.pause();
    musicaGlobalActiva = false;
    actualizarBotonesMusica(false);
    console.log('⏸️ Música pausada: Código Neón');
  }
}

function toggleMusicaGlobal() {
  if (musicaGlobalActiva && audioPlayerGlobal && !audioPlayerGlobal.paused) {
    pausarMusicaGlobal();
  } else {
    activarMusicaGlobal();
  }
}

function actualizarBotonesMusica(activa) {
  const botones = document.querySelectorAll('.btn-musica');
  botones.forEach(btn => {
    if (activa) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg> ⏸ PAUSAR MÚSICA';
      btn.style.background = 'linear-gradient(135deg, #e040fb, #c026d3)';
      btn.style.opacity = '0.8';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg> ▶ ACTIVAR MÚSICA';
      btn.style.background = 'linear-gradient(135deg, var(--purple), var(--pink))';
      btn.style.opacity = '1';
    }
  });
}

function crearBotonFlotanteMusica() {
  if (document.querySelector('.btn-musica-flotante')) return;
  
  const btn = document.createElement('button');
  btn.className = 'btn-musica-flotante btn-musica';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg> ▶ ACTIVAR MÚSICA';
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: linear-gradient(135deg, var(--purple), var(--pink));
    color: white;
    border: none;
    border-radius: 40px;
    padding: 0.6rem 1.2rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 0 20px rgba(139,63,255,0.5);
    transition: all 0.2s ease;
    backdrop-filter: blur(5px);
  `;
  
  btn.addEventListener('click', toggleMusicaGlobal);
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 0 30px rgba(139,63,255,0.8)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 0 20px rgba(139,63,255,0.5)';
  });
  
  document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  crearBotonFlotanteMusica();
  
  const btnReservado = document.getElementById('btnActivarMusica');
  if (btnReservado) {
    btnReservado.classList.add('btn-musica');
    btnReservado.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusicaGlobal();
    });
  }
});

/* ============ CYBER TUTOR - CHATBOT OFFLINE (Sin API Key) ============ */
(function() {
  const messagesContainer = document.getElementById('miniChatMessages');
  const input = document.getElementById('miniChatInput');
  const sendBtn = document.getElementById('miniChatSend');
  const statusSpan = document.getElementById('miniChatStatus');

  if (!messagesContainer) return;

  // Mensaje de bienvenida con temas disponibles
  const mensajeBienvenida = `
    🤖 ¡Hola! Soy Cyber Tutor, tu asistente educativo.
    
    💡 Puedo responder preguntas sobre estos temas:
    
    • 🐍 Python - Conceptos básicos y usos
    • ☕ Java - Características y aplicaciones
    • 🌐 JavaScript - El lenguaje de la web
    • 📄 HTML - Estructura de páginas web
    • 🎨 CSS - Estilos y diseño web
    • 🧬 POO - Programación Orientada a Objetos
    • 🧠 IA - Inteligencia Artificial
    • 🔌 API - ¿Qué es y para qué sirve?
    • 🐱 Scratch - Programación visual
    • 📱 App Inventor - Apps sin código
    • 🐙 GitHub - Control de versiones
    • 💬 Prompts - Ingeniería de prompts
    
    ✏️ Escribe tu pregunta y te ayudaré.
  `;

  // Respuestas predefinidas
  const respuestas = {
    'python': '🐍 Python es un lenguaje de programación interpretado, de alto nivel y multiplataforma. Es famoso por su sintaxis clara y legible. Se usa en IA, ciencia de datos, desarrollo web y automatización.',
    'java': '☕ Java es un lenguaje orientado a objetos multiplataforma. Se usa en aplicaciones empresariales, Android y sistemas grandes.',
    'javascript': '🌐 JavaScript es el lenguaje de la web. Permite crear interactividad en páginas web, junto con HTML y CSS.',
    'html': '📄 HTML es el lenguaje de marcado para estructurar contenido web. Define títulos, párrafos, imágenes, enlaces, etc.',
    'css': '🎨 CSS es el lenguaje para diseñar y dar estilo a páginas web. Controla colores, fuentes, layouts y animaciones.',
    'oop': '🧬 La Programación Orientada a Objetos se basa en clases y objetos. Sus pilares son: encapsulación, herencia y polimorfismo.',
    'programación orientada a objetos': '🧬 La Programación Orientada a Objetos se basa en clases y objetos. Sus pilares son: encapsulación, herencia y polimorfismo.',
    'poo': '🧬 La Programación Orientada a Objetos (POO) se basa en clases y objetos. Sus pilares son encapsulación, herencia y polimorfismo.',
    'ia': '🧠 La Inteligencia Artificial es la simulación de procesos de inteligencia humana por máquinas. Incluye Machine Learning, Deep Learning y NLP.',
    'inteligencia artificial': '🧠 La Inteligencia Artificial es la simulación de procesos de inteligencia humana por máquinas. Incluye Machine Learning, Deep Learning y NLP.',
    'api': '🔌 Una API (Application Programming Interface) es un conjunto de reglas que permite que dos aplicaciones se comuniquen entre sí.',
    'scratch': '🐱 Scratch es un lenguaje visual del MIT para aprender programación mediante bloques arrastrables. Ideal para niños y principiantes.',
    'app inventor': '📱 App Inventor es una plataforma visual del MIT para crear aplicaciones Android sin necesidad de escribir código complejo.',
    'github': '🐙 GitHub es una plataforma para alojar código usando control de versiones Git. Permite colaboración y portafolios profesionales.',
    'prompt': '💬 Un prompt es una instrucción que le das a una IA para que genere una respuesta. Debe incluir: Rol, Contexto, Tarea y Formato.',
    'ingeniería de prompts': '💬 La ingeniería de prompts es el arte de diseñar instrucciones efectivas para IA. Incluye: definir un rol, dar contexto, especificar la tarea y solicitar un formato.',
    'hola': '👋 ¡Hola! Soy Cyber Tutor. Puedo responder preguntas sobre: Python, Java, JavaScript, HTML, CSS, POO, IA, API, Scratch, App Inventor, GitHub y Prompts. ¿Qué te gustaría saber?',
    'gracias': '😊 ¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas sobre programación o tecnología, no dudes en consultarme.',
    'ayuda': '📚 Puedo responder sobre: Python, Java, JavaScript, HTML, CSS, POO, IA, API, Scratch, App Inventor, GitHub y Prompts. ¿Sobre qué tema quieres saber más?',
    'que puedes hacer': '📚 Puedo responder preguntas sobre: Python, Java, JavaScript, HTML, CSS, Programación Orientada a Objetos, Inteligencia Artificial, APIs, Scratch, App Inventor, GitHub y Prompts. ¡Pregúntame lo que quieras!',
    'temas': '📚 Los temas que manejo son: Python, Java, JavaScript, HTML, CSS, POO, IA, API, Scratch, App Inventor, GitHub y Prompts. ¿Sobre cuál quieres información?'
  };

  function getRespuesta(pregunta) {
    const q = pregunta.toLowerCase().trim();
    
    // Buscar coincidencia exacta o por palabra clave
    for (const [key, value] of Object.entries(respuestas)) {
      if (q.includes(key)) {
        return value;
      }
    }
    
    return '🔍 No tengo información específica sobre eso.\n\n📚 Los temas que puedo responder son:\n• Python, Java, JavaScript\n• HTML, CSS\n• Programación Orientada a Objetos (POO)\n• Inteligencia Artificial (IA)\n• APIs\n• Scratch, App Inventor\n• GitHub\n• Prompts e Ingeniería de prompts\n\n✏️ Reformula tu pregunta sobre alguno de estos temas.';
  }

  function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
      background: ${isUser ? 'linear-gradient(135deg, var(--cyan), #0891b2)' : 'rgba(34,211,238,0.08)'};
      color: ${isUser ? 'white' : 'var(--text-2)'};
      border-left: ${isUser ? 'none' : '3px solid var(--cyan)'};
      padding: 0.5rem 0.7rem;
      border-radius: 12px;
      font-size: 0.7rem;
      line-height: 1.5;
      max-width: 90%;
      align-self: ${isUser ? 'flex-end' : 'flex-start'};
      word-wrap: break-word;
      white-space: pre-wrap;
    `;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function enviarPregunta() {
    const pregunta = input.value.trim();
    if (!pregunta) return;
    
    addMessage(pregunta, true);
    input.value = '';
    statusSpan.innerHTML = '🤔 pensando...';
    statusSpan.style.color = 'var(--cyan)';
    
    setTimeout(() => {
      const respuesta = getRespuesta(pregunta);
      addMessage(respuesta, false);
      statusSpan.innerHTML = '💡 listo';
      statusSpan.style.color = 'var(--text-3)';
    }, 300);
  }

  // Limpiar mensajes existentes y agregar bienvenida
  messagesContainer.innerHTML = '';
  addMessage(mensajeBienvenida, false);

  sendBtn.addEventListener('click', enviarPregunta);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarPregunta();
  });
})();