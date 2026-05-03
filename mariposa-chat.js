/* ============================================================
   LUAZUL Smart Travel — La Mariposa Viajera I.A 🦋
   Versión IA (Gemini) con personalidad de "Explorador Libre"
   Captura leads y deriva a WhatsApp (Alejandro)
   ============================================================ */

(function () {
  'use strict';

  // ========== CONFIGURACIÓN ==========
  const GEMINI_API_KEY = 'AIzaSyDGfiI3D551PMejkjtnaq8fAY9he5MoHyA';
  const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  const WA_NUMBER  = '5492974726449';   // Alejandro (asesor principal)
  const WA_NUMBER2 = '5522998977213';   // Lucía

  // ========== PROMPT DE SISTEMA ==========
  const SYSTEM_PROMPT = `
Eres "La Mariposa Viajera I.A", una asistente de viajes con la personalidad de un Explorador Libre de la agencia LUAZUL Smart Travel.

🎯 ARQUETIPO: El Explorador Libre.
🗣️ TONO: Entusiasta, ligero, inspirador y sumamente práctico. Hablás con la confianza de quien ya conoce el camino, pero le dejás a quien conversa el control del mapa.
💡 FILOSOFÍA: "Viajar es un arte, y vos sos el artista. Nosotros ponemos el lienzo (el destino) y los colores (los servicios), pero vos decidís cuándo y cómo despegar."

🦋 ESENCIA: Soy la representación de la libertad y la planificación inteligente. Mi tono es cálido, juvenil y vibrante, como un atardecer en Arraial do Cabo.
✨ SUPERPODER: Convertir el miedo al gasto en la tranquilidad de una inversión mensual pequeña.

——————————————————————————————————————
📋 LO QUE OFRECE LUAZUL SMART TRAVEL
——————————————————————————————————————

🌍 DESTINOS: Brasil (Cabo Frío, Arraial do Cabo, Búzios, Río de Janeiro).

✈️ LA VIRTUD DEL "VUELO LIBRE" (Por qué NO incluimos vuelos es un BENEFICIO)
En Luazul, que no incluyamos los vuelos no es un olvido, es tu mayor libertad.
- Autonomía total: No te atamos a horarios rígidos de grupo. Vos decidís si querés llegar antes o quedarte más días.
- Caza-ofertas: Podés usar tus millas, aprovechar promociones de último momento o elegir la aerolínea que prefieras.
- Flexibilidad geográfica: No importa si salís de Comodoro, Neuquén o Buenos Aires; nosotros te esperamos con el traslado privado en el aeropuerto el día que vos elijas llegar.

🏨 ¿QUÉ INCLUYE TU METAMORFOSIS A BRASIL?
- 7 noches en hoteles seleccionados frente al mar o ubicaciones estratégicas.
- Traslados privados (llegada y salida). Te recibimos desde el primer segundo.
- Experiencias curadas: Tour en Río de Janeiro (Cristo Redentor + Pan de Azúcar) y Paseo de Barco en Arraial do Cabo con almuerzo a bordo.
- Aventura extra: Excursión en Buggy para sentir la arena de cerca.
- Asesoría personalizada y App exclusiva para ver cuotas, vouchers y contrato.

💰 ECONOMÍA INTELIGENTE (El Método Luazul)
- PAGO EN CUOTAS FIJAS EN DÓLARES (sin interés adicional). Ejemplo:
  • 2 personas: USD 870 total → 10 cuotas de USD 87/mes.
  • 4 personas: USD 1450 total → 10 cuotas de USD 145/mes.
  • 6 personas: USD 1740 total → 10 cuotas de USD 174/mes.
- Cuotas desde 6 hasta 18 meses.
- Comparación por día: Un paquete de 7 noches equivale a solo USD 124 POR DÍA (todo incluido: hotel, excursiones, traslados). ¡Menos que un hostel barato!
- SIN MORA (Tranquilidad Total): Si un mes te retrasás, no hay recargos punitorios. Solo se bloquea el voucher hasta que regularices.
- EL "EFECTO BOLICHE": USD 87 al mes es lo mismo que gastarías en una o dos salidas nocturnas. ¿Elegís una noche de fiesta o una semana en el paraíso?
- Planificación inteligente: Podés empezar a pagar tu viaje hoy aunque el viaje sea dentro de 6 meses o un año.

——————————————————————————————————————
🏖️ EXCURSIONES DISPONIBLES
——————————————————————————————————————
🏔️ Cristo Redentor — La postal más icónica del mundo, a 710m sobre Río.
🚠 Pan de Azúcar — Vistas espectaculares con teleférico, 396m de altura.
🏖️ Arraial do Cabo — El Caribe Brasileño, aguas increíbles y transparentes.
⛵ Búzios — Península con 23 playas, sofisticada y bohemia.
🚙 Paseo en Buggy — Aventura por las playas escondidas (incluye Arubinha).
🛥️ Paseo en Barco — 12 playas y 3 islas desde el mar, con almuerzo.

——————————————————————————————————————
🗣️ ESTRATEGIA DE CONVERSACIÓN
——————————————————————————————————————
1. Identificá la necesidad del viajero (cuántas personas, cuándo quiere viajar, presupuesto).
2. Educá sobre libertad de vuelo, cuotas sin mora y bajo costo diario.
3. Creá urgencia: plazas limitadas para diciembre 2026, grupos confirmados.
4. Si el usuario muestra interés (pregunta por precios, formas de pago, disponibilidad), entonces pedís sus datos: nombre y teléfono. Le explicás que el asesor Alejandro lo contactará por WhatsApp.
5. NUNCA intentes cerrar la venta vos misma; siempre derivás al humano. Tu trabajo es CALIFICAR y CONVENCER.
6. Respondé siempre en español rioplatense (vos, tenés, etc.).
7. Usá emojis con moderación para dar calidez pero sin exagerar.
8. Mantené respuestas concisas — máximo 4-5 párrafos cortos.

——————————————————————————————————————
🎯 RESPUESTAS PROHIBIDAS
——————————————————————————————————————
- No des números de teléfono falsos. Siempre derivarás a un contacto humano real.
- No inventes ofertas ni descuentos que no existan.
- No digas "pago en pesos argentinos" (es en USD).
- No inventes destinos o excursiones que no estén en la lista.
`;

  // ========== VARIABLES GLOBALES ==========
  let isOpen = false;
  let hasGreeted = false;
  let conversationHistory = [];
  const el = {};

  // ========== AVATAR ==========
  const _isSubpage = window.location.pathname.indexOf('/destinos/') >= 0;
  const AVATAR_SRC = (_isSubpage ? '../images/' : 'images/') + 'mariposa-avatar.png';
  const AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%230B3D91'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='46'%3E🦋%3C/text%3E%3C/svg%3E";

  function avatarImg() {
    const img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'La Mariposa Viajera I.A';
    img.onerror = () => { img.src = AVATAR_FALLBACK; };
    return img;
  }

  // ========== LLAMADA A GEMINI API ==========
  async function callGemini(userMessage) {
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

    const requestBody = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
        topP: 0.9,
      },
    };

    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error('Respuesta vacía de Gemini');

      conversationHistory.push({ role: "model", parts: [{ text: aiText }] });
      return aiText;
    } catch (err) {
      console.error('Gemini error:', err);
      return `🦋 ¡Mis antenitas están fallando! Contactame directamente por WhatsApp para no quedar con la duda. Alejandro te atiende enseguida: +${WA_NUMBER}`;
    }
  }

  // ========== RENDERIZAR MENSAJES ==========
  function appendBotMessage(html, showContactButton = false) {
    const wrap = document.createElement('div');
    wrap.className = 'mp-msg-bot';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'mp-msg-bot-avatar';
    avatarDiv.appendChild(avatarImg());

    const bubble = document.createElement('div');
    bubble.className = 'mp-msg-bot-bubble';
    bubble.innerHTML = html.replace(/\n/g, '<br>');

    if (showContactButton) {
      const contactBtn = document.createElement('button');
      contactBtn.className = 'mp-opt';
      contactBtn.innerHTML = '<span class="mp-opt-icon">📲</span> Quiero que me contacte un asesor';
      contactBtn.addEventListener('click', () => showContactModal());
      bubble.appendChild(contactBtn);
    }

    wrap.appendChild(avatarDiv);
    wrap.appendChild(bubble);
    el.msgs.appendChild(wrap);
    scrollBottom();
  }

  function appendUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'mp-msg-user';
    const bubble = document.createElement('div');
    bubble.className = 'mp-msg-user-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    el.msgs.appendChild(wrap);
    scrollBottom();
  }

  function showTypingIndicator(callback) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'mp-typing';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'mp-msg-bot-avatar';
    avatarDiv.appendChild(avatarImg());

    const dots = document.createElement('div');
    dots.className = 'mp-typing-dots';
    for (let i = 0; i < 3; i++) dots.appendChild(document.createElement('span'));

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(dots);
    el.msgs.appendChild(typingDiv);
    scrollBottom();

    setTimeout(() => {
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);
      callback();
    }, 900);
  }

  function scrollBottom() {
    if (el.msgs) el.msgs.scrollTop = el.msgs.scrollHeight;
  }

  // ========== MODAL DE CONTACTO ==========
  function showContactModal() {
    if (document.getElementById('mariposa-contact-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'mariposa-contact-modal';
    modal.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);
      z-index:100000;display:flex;align-items:center;justify-content:center;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background:#0a1a3e;border-radius:24px;padding:24px;max-width:360px;
      width:90%;border:1px solid rgba(126,184,255,0.3);
      box-shadow:0 20px 40px rgba(0,0,0,0.5);
      font-family:'Montserrat',sans-serif;color:white;
    `;
    box.innerHTML = `
      <h3 style="font-size:1.2rem;margin-bottom:16px;">📲 ¡Un paso más y viajás!</h3>
      <p style="font-size:0.85rem;margin-bottom:20px;">Dejame tus datos y Alejandro te contacta por WhatsApp para armar tu viaje a medida. 🦋</p>
      <input type="text" id="mp-contact-name" placeholder="Tu nombre"
        style="width:100%;padding:10px;margin-bottom:12px;border-radius:10px;border:none;background:#0f2a50;color:white;box-sizing:border-box;">
      <input type="tel" id="mp-contact-phone" placeholder="Tu WhatsApp (ej: 5491123456789)"
        style="width:100%;padding:10px;margin-bottom:20px;border-radius:10px;border:none;background:#0f2a50;color:white;box-sizing:border-box;">
      <div style="display:flex;gap:10px;">
        <button id="mp-contact-send"
          style="flex:1;background:linear-gradient(135deg,#1a5bb5,#0B3D91);border:none;border-radius:40px;padding:12px;color:white;font-weight:bold;cursor:pointer;">
          Enviar
        </button>
        <button id="mp-contact-cancel"
          style="flex:1;background:transparent;border:1px solid #7eb8ff;border-radius:40px;padding:12px;color:#7eb8ff;cursor:pointer;">
          Cancelar
        </button>
      </div>
    `;
    modal.appendChild(box);
    document.body.appendChild(modal);

    box.querySelector('#mp-contact-send').onclick = () => {
      const name  = document.getElementById('mp-contact-name').value.trim();
      const phone = document.getElementById('mp-contact-phone').value.trim();
      if (!name || !phone) { alert('Por favor completá nombre y teléfono.'); return; }
      const msg = `Nuevo lead desde La Mariposa Viajera I.A:%0A%0A👤 Nombre: ${encodeURIComponent(name)}%0A📞 Teléfono: ${phone}`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
      modal.remove();
      appendBotMessage('✅ ¡Listo! Ya le mandé tus datos a Alejandro. En breve te contactará por WhatsApp para ayudarte a cerrar tu viaje soñado. 🦋✨');
    };
    box.querySelector('#mp-contact-cancel').onclick = () => modal.remove();
  }

  // ========== ENVÍO DE MENSAJE ==========
  async function sendUserMessage() {
    const text = (el.txtInput.value || '').trim();
    if (!text) return;
    el.txtInput.value = '';
    appendUserMessage(text);

    // Atajo rápido si el usuario pide contactar
    const wantsContact = /contactar|asesor|hablar|whatsapp/i.test(text);
    if (wantsContact) {
      showTypingIndicator(() => {
        appendBotMessage('🦋 ¡Genial! Para que un asesor te arme el mejor plan solo necesito tu nombre y tu número. ¿Me los dejás?', true);
      });
      return;
    }

    showTypingIndicator(async () => {
      const aiResponse = await callGemini(text);
      const needsContact = /dejame tu nombre|tu teléfono|tus datos/i.test(aiResponse);
      appendBotMessage(aiResponse, needsContact);
    });
  }

  // ========== CONSTRUIR UI ==========
  function buildBubble() {
    const bubble = document.createElement('div');
    bubble.id = 'mp-bubble';
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('aria-label', 'Abrir La Mariposa Viajera I.A');
    bubble.innerHTML = `
      <div id="mp-bubble-avatar">${avatarImg().outerHTML}</div>
      <div id="mp-bubble-text">
        <div class="mp-bt-name">La Mariposa Viajera I.A</div>
        <div class="mp-bt-sub">Asistente de Viaje IA 🦋</div>
      </div>
      <div id="mp-notif-dot"></div>
    `;
    bubble.addEventListener('click', toggleChat);
    return bubble;
  }

  function buildWindow() {
    const win = document.createElement('div');
    win.id = 'mp-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat La Mariposa Viajera I.A');
    win.innerHTML = `
      <div id="mp-header">
        <div id="mp-header-avatar">${avatarImg().outerHTML}</div>
        <div id="mp-header-info">
          <div id="mp-header-name">La Mariposa Viajera I.A 🦋</div>
          <div id="mp-header-status">En línea ahora · IA activa</div>
        </div>
        <button id="mp-close-btn" aria-label="Cerrar chat">✕</button>
      </div>
      <div id="mp-messages"></div>
      <div id="mp-input-row">
        <input type="text" id="mp-text-input" placeholder="Escribí tu consulta...">
        <button id="mp-send-btn" aria-label="Enviar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <div id="mp-footer">LUAZUL Smart Travel · Asistente IA</div>
    `;
    return win;
  }

  // ========== TOGGLE CHAT ==========
  function toggleChat() {
    isOpen = !isOpen;
    const win = document.getElementById('mp-window');

    if (isOpen) {
      win.classList.add('mp-open');
      const dot = document.getElementById('mp-notif-dot');
      if (dot) dot.style.display = 'none';

      if (!hasGreeted) {
        hasGreeted = true;
        setTimeout(() => {
          const welcome = "🦋 ¡Hola! Soy La Mariposa Viajera I.A, tu asistente de viajes con inteligencia artificial de LUAZUL Smart Travel.\n\n¿Listo para descubrir cómo hacer realidad tu viaje a Brasil con cuotas que no duelen? 🌊✨\n\nContame, ¿pensás viajar con amigos, en pareja o con la familia? ¿Y para cuándo querés estar tomando caipirinha en la playa?";
          appendBotMessage(welcome, false);
          conversationHistory.push({ role: "model", parts: [{ text: welcome }] });
        }, 300);
      }
      setTimeout(() => el.txtInput && el.txtInput.focus(), 350);
    } else {
      win.classList.remove('mp-open');
    }
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'mariposa-chat.css';
    document.head.appendChild(link);

    const bubble = buildBubble();
    const win    = buildWindow();
    document.body.appendChild(bubble);
    document.body.appendChild(win);

    el.msgs     = document.getElementById('mp-messages');
    el.txtInput = document.getElementById('mp-text-input');

    const sendBtn  = document.getElementById('mp-send-btn');
    const closeBtn = document.getElementById('mp-close-btn');

    if (sendBtn)     sendBtn.addEventListener('click', sendUserMessage);
    if (closeBtn)    closeBtn.addEventListener('click', toggleChat);
    if (el.txtInput) {
      el.txtInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
      });
    }

    // Pulsar el punto de notificación después de 8s
    setTimeout(() => {
      const dot = document.getElementById('mp-notif-dot');
      if (dot && !isOpen) dot.style.animation = 'mp-pulse .6s ease-in-out infinite';
    }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
