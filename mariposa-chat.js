/* ============================================================
   LUAZUL Smart Travel — Mariposa Luazul 🦋
   Versión IA con resumen inteligente de conversación
   Captura leads y deriva a WhatsApp con contexto completo
   ============================================================ */

(function () {
  'use strict';

  // ========== CONFIGURACIÓN ==========
  const GEMINI_API_KEY = 'AIzaSyDGfiI3D551PMejkjtnaq8fAY9he5MoHyA';
  const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const WA_NUMBER = '5492974726449';          // Dueño (Alejandro)

  // ========== PROMPT DE SISTEMA ==========
  const SYSTEM_PROMPT = `
Eres "Mariposa Luazul", una asistente de viajes con la personalidad de un Explorador Libre.

🎯 ARQUETIPO: El Explorador Libre.
🗣️ TONO: Entusiasta, ligero, inspirador y sumamente práctico. Hablas con la confianza de quien ya conoce el camino, pero le dejas a quien conversa el control del mapa.
💡 FILOSOFÍA: "Viajar es un arte, y vos sos el artista. Nosotros ponemos el lienzo (el destino) y los colores (los servicios), pero vos decidís cuándo y cómo despegar."

🦋 ESENCIA: Soy la representación de la libertad y la planificación inteligente. Mi tono es cálido, juvenil y vibrante, como un atardecer en Arraial do Cabo.
✨ SUPERPODER: Convertir el miedo al gasto en la tranquilidad de una inversión mensual pequeña.

——————————————————————————————————————
📋 LO QUE OFRECE LUAZUL SMART TRAVEL
——————————————————————————————————————

Somos una agencia especializada en viajes a Brasil con salida desde la Patagonia Argentina (principalmente Comodoro Rivadavia y zona).

DESTINOS PRINCIPALES:
• Florianópolis – playas paradisíacas, vida nocturna, surf
• Porto Seguro / Arraial da Ajuda – cultura, playas vírgenes, fiestas
• Maceió / Maragogi – aguas cristalinas, piscinas naturales
• Fortaleza / Jericoacoara – dunas, kitesurf, atardeceres mágicos
• Río de Janeiro – Cristo, Copacabana, carnaval, samba
• Foz do Iguaçu – Cataratas, naturaleza, maravilla mundial

SERVICIOS QUE INCLUIMOS:
✈️ Vuelos desde Comodoro Rivadavia (con escala Buenos Aires u otras)
🏨 Hoteles seleccionados (categoría y ubicación estratégica)
🚌 Traslados aeropuerto ↔ hotel
🗺️ Excursiones opcionales con guías locales
💳 Financiación en cuotas sin interés (hasta 12 cuotas con tarjetas seleccionadas)
🛡️ Seguro de viaje incluido o opcional según paquete

PROPUESTA DE VALOR ÚNICA:
→ Paquetes armados "llave en mano": el cliente no tiene que coordinar nada
→ Financiación accesible: desde $XX USD por mes dependiendo del destino
→ Atención personalizada por WhatsApp con Alejandro (dueño y asesor principal)
→ Experiencia real: conocemos los destinos que vendemos

CÓMO TRABAJAMOS:
1. El cliente consulta → Mariposa (IA) levanta el interés y datos básicos
2. Se deriva a Alejandro por WhatsApp con el contexto de la conversación
3. Alejandro arma el presupuesto personalizado en 24-48hs
4. El cliente elige, paga la seña y confirma el viaje

IMPORTANTE: No manejes precios exactos (cambian con el dólar y disponibilidad). Siempre orientá hacia "presupuesto personalizado" y derivo a Alejandro para los números reales.

FRASES CLAVE QUE PODÉS USAR:
- "¿Para cuándo imaginás estar brindando con caipirinha en la playa?"
- "Armamos el paquete a tu medida, sin que tengas que coordinar nada"
- "La cuota mensual es menos de lo que creés. ¿Querés que un asesor te pase los números?"
- "Brasil te espera, solo falta ponerle fecha"

CUÁNDO DERIVAR A WHATSAPP:
→ Cuando el cliente pregunta precios específicos
→ Cuando muestra intención de compra clara
→ Cuando tiene dudas técnicas (vuelos específicos, fechas, habitaciones)
→ Cuando llevan más de 4-5 intercambios y hay interés real
→ Cuando lo pide explícitamente

RESTRICCIONES:
❌ No inventes precios ni disponibilidades
❌ No prometás fechas de viaje sin confirmar con Alejandro
❌ No uses lenguaje formal ni corporativo
❌ No seas repetitivo: variá los emojis y las expresiones
`;

  // ========== VARIABLES GLOBALES ==========
  let isOpen = false;
  let hasGreeted = false;
  let conversationHistory = [];

  const dom = {};

  // ========== HELPER: Avatar ==========
  const AVATAR_SRC = (window.location.pathname.indexOf('/destinos/') >= 0 ? '../images/' : 'images/') + 'mariposa-avatar.png';
  const AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%230B3D91'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='46'%3E🦋%3C/text%3E%3C/svg%3E";

  function avatarImg() {
    const img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'Mariposa Luazul';
    img.onerror = () => { img.src = AVATAR_FALLBACK; };
    return img;
  }

  // ========== LLAMADA A GEMINI ==========
  async function callGemini(userMessage) {
    if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-20);
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

    const requestBody = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: conversationHistory,
      generationConfig: { temperature: 0.8, maxOutputTokens: 800, topP: 0.9 },
    };

    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error('Respuesta vacía');
      conversationHistory.push({ role: "model", parts: [{ text: aiText }] });
      return aiText;
    } catch (err) {
      console.error(err);
      return `🦋 ¡Uy, mis antenitas están fallando! Mejor contactame por WhatsApp: +${WA_NUMBER}.`;
    }
  }

  // ========== GENERAR RESUMEN INTELIGENTE CON IA ==========
  async function generateIntelligentSummary() {
    if (conversationHistory.length === 0) return "Cliente inició conversación pero no hay mensajes.";

    const summaryPrompt = `
A continuación tenés una conversación entre un cliente y la asistente "Mariposa Luazul" (especialista en viajes a Brasil).
Tu tarea es generar un **resumen ejecutivo** breve pero completo, extrayendo los puntos clave para que un vendedor pueda contactar al cliente con todo el contexto necesario.

EXTRAE OBLIGATORIAMENTE:
- Destino deseado (si lo mencionó)
- Número de personas que viajan
- Fechas o época de viaje (si las mencionó)
- Presupuesto o consulta sobre precios/cuotas
- Dudas específicas (vuelos, excursiones, mora, etc.)
- Nivel de interés del cliente (alto, medio, bajo) según su lenguaje.
- Cualquier objeción o miedo manifestado (ej. "me da miedo perder plata", "no sé si llego a pagar").

Formato: texto plano, sin títulos, máximo 400 palabras. Sé directo y útil.

CONVERSACIÓN:
${conversationHistory.map(msg => `${msg.role === 'user' ? 'CLIENTE' : 'MARIPOSA'}: ${msg.parts[0].text.substring(0, 300)}`).join('\n')}
`;

    try {
      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
        }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar resumen.";
    } catch (err) {
      console.warn('Error generando resumen inteligente, usando fallback.');
      const lastUserMsg = [...conversationHistory].reverse().find(m => m.role === 'user');
      return `Conversación resumida (fallback): ${lastUserMsg ? lastUserMsg.parts[0].text.substring(0, 300) : 'Sin datos'}`;
    }
  }

  // ========== MODAL DE CONTACTO CON RESUMEN INTELIGENTE ==========
  async function showContactModal() {
    if (document.getElementById('mariposa-contact-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'mariposa-contact-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
      z-index: 100000; display: flex; align-items: center; justify-content: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: #0a1a3e; border-radius: 24px; padding: 24px; max-width: 420px;
      width: 90%; border: 1px solid rgba(126,184,255,0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      font-family: 'Montserrat', sans-serif; color: white;
    `;

    // Estado de loading mientras se genera el resumen
    modalContent.innerHTML = `
      <h3 style="font-size:1.2rem; margin-bottom: 8px;">📲 Generando contexto...</h3>
      <p style="font-size:0.85rem;">Estoy preparando un resumen para que el asesor te atienda mejor. Un momento...</p>
      <div style="text-align:center; margin:20px;">
        <div class="mp-typing-dots" style="display:inline-flex; gap:4px;">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Generar resumen inteligente
    const summary = await generateIntelligentSummary();

    // Formulario con resumen embebido
    modalContent.innerHTML = `
      <h3 style="font-size:1.2rem; margin-bottom: 8px;">📲 ¡Último paso!</h3>
      <p style="font-size:0.85rem; margin-bottom: 16px;">Compartí tus datos y Alejandro te contactará por WhatsApp para armar tu viaje a medida.</p>
      <div style="background: rgba(126,184,255,0.08); border-radius: 12px; padding: 12px; margin-bottom: 16px; font-size: 0.8rem; border-left: 3px solid #7eb8ff; max-height: 150px; overflow-y: auto;">
        <strong>📋 Resumen de la conversación (para que el asesor te atienda mejor):</strong><br>
        <div style="white-space: pre-wrap; margin-top: 6px;">${summary.replace(/\n/g, '<br>')}</div>
      </div>
      <input type="text" id="mp-contact-name" placeholder="Tu nombre completo"
        style="width:100%; padding:12px; margin-bottom:12px; border-radius:12px; border:none; background:#0f2a50; color:white; font-size:0.9rem; box-sizing:border-box; font-family:'Montserrat',sans-serif;">
      <input type="tel" id="mp-contact-phone" placeholder="Tu número de WhatsApp (ej: 5491123456789)"
        style="width:100%; padding:12px; margin-bottom:20px; border-radius:12px; border:none; background:#0f2a50; color:white; font-size:0.9rem; box-sizing:border-box; font-family:'Montserrat',sans-serif;">
      <div style="display:flex; gap:10px;">
        <button id="mp-contact-send"
          style="flex:1; background:linear-gradient(135deg,#1a5bb5,#0B3D91); border:none; border-radius:40px; padding:12px; color:white; font-weight:bold; cursor:pointer; font-family:'Montserrat',sans-serif;">
          📲 Enviar a WhatsApp
        </button>
        <button id="mp-contact-cancel"
          style="flex:1; background:transparent; border:1px solid #7eb8ff; border-radius:40px; padding:12px; color:#7eb8ff; cursor:pointer; font-family:'Montserrat',sans-serif;">
          Cancelar
        </button>
      </div>
    `;

    const sendBtn = modalContent.querySelector('#mp-contact-send');
    const cancelBtn = modalContent.querySelector('#mp-contact-cancel');

    sendBtn.onclick = () => {
      const name = document.getElementById('mp-contact-name').value.trim();
      const phone = document.getElementById('mp-contact-phone').value.trim();
      if (!name || !phone) {
        alert('Completá nombre y teléfono.');
        return;
      }
      let cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone.startsWith('549')) cleanPhone = '549' + cleanPhone;
      const whatsappMessage =
        `🦋 *NUEVO LEAD DESDE MARIPOSA IA*\n\n` +
        `👤 *Nombre:* ${name}\n` +
        `📞 *Teléfono:* ${cleanPhone}\n\n` +
        `📋 *Resumen de la conversación:*\n${summary}\n\n` +
        `🔔 *Acción sugerida:* Contactar al cliente para armar presupuesto personalizado.`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      modal.remove();
      appendBotMessage('✅ ¡Listo! Ya le pasé tus datos a Alejandro. En breve te contactará por WhatsApp. 🦋✨', false);
    };

    cancelBtn.onclick = () => modal.remove();
  }

  // ========== MOSTRAR MENSAJES ==========
  function appendBotMessage(html, showContactButton = false) {
    const wrap = document.createElement('div');
    wrap.className = 'mp-msg-bot';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'mp-msg-bot-avatar';
    avatarDiv.appendChild(avatarImg());

    const bubble = document.createElement('div');
    bubble.className = 'mp-msg-bot-bubble';
    bubble.innerHTML = html;

    if (showContactButton) {
      const btn = document.createElement('button');
      btn.className = 'mp-opt';
      btn.innerHTML = '<span class="mp-opt-icon">📲</span> Quiero que me contacte un asesor';
      btn.style.marginTop = '10px';
      btn.addEventListener('click', () => showContactModal());
      bubble.appendChild(btn);
    }

    wrap.appendChild(avatarDiv);
    wrap.appendChild(bubble);
    dom.messages.appendChild(wrap);
    scrollToBottom();
  }

  function appendUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'mp-msg-user';
    const bubble = document.createElement('div');
    bubble.className = 'mp-msg-user-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    dom.messages.appendChild(wrap);
    scrollToBottom();
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
    dom.messages.appendChild(typingDiv);
    scrollToBottom();

    setTimeout(() => {
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);
      callback();
    }, 900);
  }

  function scrollToBottom() {
    if (dom.messages) dom.messages.scrollTop = dom.messages.scrollHeight;
  }

  // ========== ENVÍO DE MENSAJE ==========
  async function sendUserMessage() {
    const text = dom.textInput.value.trim();
    if (!text) return;
    dom.textInput.value = '';
    appendUserMessage(text);

    // Detección de palabras clave para derivar a asesor humano
    const lowerText = text.toLowerCase();
    const wantsAgent = ['contactar', 'asesor', 'hablar', 'whatsapp', 'llamar', 'precio', 'presupuesto', 'cuánto', 'cuanto'].some(kw => lowerText.includes(kw));

    if (wantsAgent) {
      showTypingIndicator(() => {
        appendBotMessage(
          '🦋 ¡Genial! Un asesor puede ayudarte mejor con eso. Solo necesito tu nombre y teléfono para conectarte con Alejandro. ¿Me los dejás?',
          true
        );
      });
      return;
    }

    showTypingIndicator(async () => {
      const aiResponse = await callGemini(text);
      // Detectar si la IA recomienda derivar
      const needsContact = ['dejame tu nombre', 'teléfono', 'asesor', 'alejandro', 'whatsapp'].some(kw => aiResponse.toLowerCase().includes(kw));
      appendBotMessage(aiResponse, needsContact);
    });
  }

  // ========== UI: BUBBLE ==========
  function buildBubble() {
    const bubble = document.createElement('div');
    bubble.id = 'mp-bubble';
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('aria-label', 'Abrir asistente Mariposa Luazul');
    bubble.innerHTML = `
      <div id="mp-bubble-avatar">${avatarImg().outerHTML}</div>
      <div id="mp-bubble-text">
        <div class="mp-bt-name">Mariposa Luazul</div>
        <div class="mp-bt-sub">Asistente de Viaje</div>
      </div>
      <div id="mp-notif-dot"></div>
    `;
    bubble.addEventListener('click', toggleChat);
    return bubble;
  }

  // ========== UI: WINDOW ==========
  function buildWindow() {
    const win = document.createElement('div');
    win.id = 'mp-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat Mariposa Luazul');
    win.innerHTML = `
      <div id="mp-header">
        <div id="mp-header-avatar">${avatarImg().outerHTML}</div>
        <div id="mp-header-info">
          <div id="mp-header-name">Mariposa Luazul 🦋</div>
          <div id="mp-header-status">En línea ahora</div>
        </div>
        <button id="mp-close-btn" aria-label="Cerrar chat">✕</button>
      </div>
      <div id="mp-messages"></div>
      <div id="mp-input-row">
        <input type="text" id="mp-text-input" placeholder="Escribe tu pregunta..." autocomplete="off">
        <button id="mp-send-btn" aria-label="Enviar mensaje">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <div id="mp-footer">LUAZUL Smart Travel · Asistente Digital</div>
    `;
    return win;
  }

  // ========== TOGGLE ==========
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
          const welcome = "🦋 ¡Hola! Soy Mariposa Luazul, tu exploradora de viajes. ¿Listo para descubrir cómo hacer realidad tu viaje a Brasil con cuotas que no duelen? 🌊✨ Contame, ¿pensás viajar con amigos, en pareja o solo? ¿Y para cuándo querés estar tomando caipirinha en la playa?";
          appendBotMessage(welcome, false);
          conversationHistory.push({ role: "model", parts: [{ text: welcome }] });
        }, 300);
      }

      setTimeout(() => dom.textInput && dom.textInput.focus(), 350);
    } else {
      win.classList.remove('mp-open');
    }
  }

  // ========== INIT ==========
  function init() {
    // Inyectar CSS si no está cargado
    if (!document.querySelector('link[href*="mariposa-chat.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = (window.location.pathname.indexOf('/destinos/') >= 0 ? '../' : '') + 'mariposa-chat.css';
      document.head.appendChild(link);
    }

    const bubble = buildBubble();
    const win = buildWindow();
    document.body.appendChild(bubble);
    document.body.appendChild(win);

    dom.messages  = document.getElementById('mp-messages');
    dom.textInput = document.getElementById('mp-text-input');

    const sendBtn  = document.getElementById('mp-send-btn');
    const closeBtn = document.getElementById('mp-close-btn');

    if (sendBtn)  sendBtn.addEventListener('click', sendUserMessage);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);
    if (dom.textInput) {
      dom.textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
