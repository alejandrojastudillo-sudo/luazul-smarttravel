/* ============================================================
   LUAZUL Smart Travel — Mariposa Luazul 🦋
   Versión Conversacional (reglas + contexto + cuotas flexibles)
   Sin IA externa — respuestas instantáneas, flujo amigable.
   ============================================================ */

(function () {
  'use strict';

  // ========== CONFIGURACIÓN ==========
  const WA_NUMBER = '5492974726449';  // Alejandro

  // ========== VARIABLES GLOBALES ==========
  let isOpen = false;
  let hasGreeted = false;
  let contexto = {
    personas: null,
    destino: null,
    interes_precio: false,
    ya_pregunto_precio: false,
    ya_pregunto_incluye: false,
    modo_contacto: false
  };

  const dom = {};

  // ========== AVATAR ==========
  const AVATAR_SRC = (window.location.pathname.indexOf('/destinos/') >= 0 ? '../images/' : 'images/') + 'mariposa-avatar.png';
  const AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%230B3D91'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='46'%3E🦋%3C/text%3E%3C/svg%3E";

  function avatarImg() {
    const img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'Mariposa Luazul';
    img.onerror = () => { img.src = AVATAR_FALLBACK; };
    return img;
  }

  // ========== CONOCIMIENTO LOCAL ==========
  const SALUDOS = [
    "🦋 ¡Hola! Soy Mariposa Luazul, tu exploradora de viajes. ¿Sabías que podés cumplir el sueño de viajar a Brasil pagando cuotas mensuales desde USD 87? 🌊✨ Contame, ¿para cuántas personas pensás viajar?",
    "¡Hola! 🌴 Qué lindo que estés pensando en Brasil. En Luazul podés empezar a pagar tu viaje hoy con cuotas fijas, sin intereses, y elegir la fecha cuando tu plan esté casi completo. ¿Te gustaría saber cómo funciona?",
    "¡Qué emoción! Un viaje a Brasil está más cerca de lo que pensás. Con nuestras cuotas accesibles, podés asegurar tu lugar ahora y decidir la fecha después. 🦋 Contame, ¿viajás solo o en grupo?"
  ];

  const RESPUESTAS = {
    precio: [
      "💰 ¡Claro que sí! Nuestros planes se pagan en cuotas fijas en DÓLARES, sin intereses:\n\n• Para 2 personas: USD 870 total → 10 cuotas de USD 87/mes\n• Para 4 personas: USD 1.450 total → 10 cuotas de USD 145/mes\n• Para 6 personas: USD 1.740 total → 10 cuotas de USD 174/mes\n\nPodés elegir entre 6, 10, 12 o 18 cuotas. Empezás a pagar hoy y cuando tu plan esté al 80% coordinamos la fecha. ¡Flexibilidad total!",
      "🦋 El plan arranca desde USD 87 por mes (para 2 personas). Si son más, el costo por persona baja mucho. No necesitás definir la fecha ahora: empezás a pagar y cuando llevés el 80% del plan, elegís cuándo querés viajar. ¿Cuántos son en el grupo?",
      "La parte linda: pagar en cuotas sin que duela. 💸 Un viaje para dos cuesta USD 870 en total → 10 cuotas de USD 87. Eso es menos de lo que gastás en una noche de boliche. ¿Te imaginás pagando tu viaje mientras seguís con tu vida normal? 🌊"
    ],
    incluye: [
      "🏨 Tu paquete incluye TODO para que solo te preocupes por disfrutar:\n• 7 noches frente al mar\n• Traslados privados aeropuerto ↔ hotel\n• Día completo en Río (Cristo + Pan de Azúcar)\n• Paseo de barco en Arraial do Cabo con almuerzo\n• Excursión en Buggy\n• Asesoría personalizada y App exclusiva\n\n¿Querés que te cuente alguna excursión en detalle?",
      "¡El paquete es bien completo! Alojamiento frente al mar, traslados privados, tours, excursiones y asistencia. Lo único que no incluimos son los vuelos — y eso es a propósito para que tengas libertad. ¿Te explico por qué es una ventaja?",
      "📦 Hospedaje en hoteles frente al mar, excursiones premium (Río, Arraial, Buggy), traslados privados y app exclusiva. Todo solucionado antes de que aterrizés."
    ],
    vuelo_libre: [
      "✈️ ¡Excelente pregunta! En Luazul NO incluimos los vuelos, y eso es justamente para darte LIBERTAD TOTAL:\n• Usás tus millas o cazás ofertas.\n• Elegís desde qué ciudad salís.\n• Llegás antes o te quedás más días.\n• Nosotros te esperamos en el aeropuerto el día que vos elijas.\n\n¡Vos sos el dueño del cielo; nosotros expertos en tierra!",
      "¡No incluimos vuelos a propósito! Así vos tenés el control: tu aerolínea favorita, tus horarios, tus millas. Nosotros te recibimos con traslado privado cuando llegás. ¿Genial, no? 🦋",
      "Tu vuelo, tu autonomía. 🦋 Preferimos no atarte a un paquete rígido. Vos decidís cuándo salís, con qué aerolínea, y hasta podés extender tu estadía. Nos encargamos de todo lo demás."
    ],
    sin_mora: [
      "✅ TRANQUILIDAD TOTAL: Si un mes se te complica pagar la cuota, NO hay recargo ni multa. Solo se pausa el voucher hasta que regularices. Queremos que ahorres sin estrés.",
      "¡Olvidate de las preocupaciones! Si te atrasás en una cuota, no cobramos recargo punitorio. Nuestra prioridad es que viajes, no castigarte. 🦋",
      "📌 Sin mora, sin estrés: podés retrasar una cuota sin que te apliquen intereses. Solo se bloquea el voucher momentáneamente. Así de simple."
    ],
    fechas: [
      "📅 En Luazul no te atamos a una fecha fija desde el principio. Empezás a pagar tus cuotas hoy y cuando hayas completado el 80% de tu plan, coordinamos la fecha de viaje que mejor te quede. ¡Libertad total para elegir cuándo tomarte esas merecidas vacaciones! 🌊",
      "La fecha la elegís vos, no nosotros. Empezás a pagar ahora y cuando ya tengas el 80% del plan cubierto, definimos los días de viaje juntos. ¿Te parece bien así? 🦋"
    ],
    efecto_boliche: [
      "🍹 USD 87 por mes (la cuota para 2 personas) es lo que gastarías en UNA o DOS noches de boliche. ¿Preferís una noche de fiesta o empezar a pagar tu viaje a Brasil? Y lo mejor: la fecha la elegís después. 🦋",
      "Comparalo así: salir un sábado te cuesta fácil USD 50-70. Con USD 87 por mes te estás pagando un viaje entero a Brasil. ¿Vale la pena?",
      "¿Sabías que la cuota de tu viaje (USD 87) es similar a lo que gastás en una salida nocturna? Empezar hoy no duele, y cuando llegués al 80% elegís cuándo ir. ¡Vos decidís! 🌊"
    ],
    contacto: [
      "🦋 ¡Genial! Solo necesito tu nombre para que Alejandro te contacte por WhatsApp. ¿Me lo dejás?",
      "Perfecto. Decime tu nombre y le paso tu consulta a Alejandro. Él te escribe enseguida. 📲",
      "¡Dale! Para que el asesor te pueda ayudar, necesito tu nombre. ¿Completamos eso y listo?"
    ],
    despedida_contacto: [
      "✅ ¡Listo! Ya le pasé tus datos a Alejandro. En breve te contactará por WhatsApp para ayudarte a cerrar tu viaje soñado. 🦋✨\n\n¡Nos vemos en Brasil!",
      "Perfecto, ya está. Alejandro te escribe en los próximos minutos. ¡Preparate para empezar a disfrutar! 🌊"
    ],
    default: [
      "🦋 Gracias por tu consulta. ¿Para cuántas personas pensás viajar? Así te armo el plan ideal con cuotas accesibles.",
      "¡Qué bueno que estés averiguando! ¿Viajás con amigos, en pareja o solo? Empezar a pagar hoy es más fácil de lo que creés.",
      "Me encantaría ayudarte. Si me contás cuántos son, puedo darte los precios y explicarte cómo funciona la flexibilidad de la fecha. 🦋"
    ]
  };

  function randomRespuesta(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ========== MOTOR DE INTENCIÓN ==========
  function analizarIntencion(texto) {
    const t = texto.toLowerCase();
    let respuestaKey = null;

    // Actualizar contexto de personas
    if (t.includes('2 personas') || t.includes('dos personas') || t.includes('pareja') || (t.includes('2') && t.includes('viajamos'))) {
      contexto.personas = '2';
    } else if (t.includes('4 personas') || t.includes('cuatro personas') || (t.includes('4') && t.includes('viajamos'))) {
      contexto.personas = '4';
    } else if (t.includes('6 personas') || t.includes('seis personas') || (t.includes('6') && t.includes('viajamos'))) {
      contexto.personas = '6';
    } else if (t.includes('amigos') && !contexto.personas) {
      contexto.personas = '4';
    } else if ((t.includes('solo') || t.includes('individual')) && !contexto.personas) {
      contexto.personas = '2';
    }

    // Actualizar destino
    if (t.includes('cabo frio') || t.includes('cabo frío')) contexto.destino = 'cabo_frio';
    else if (t.includes('arraial'))                          contexto.destino = 'arraial';
    else if (t.includes('buzios') || t.includes('búzios'))  contexto.destino = 'buzios';
    else if (t.includes('rio de janeiro') || t.includes('río de janeiro')) contexto.destino = 'rio';

    // Detección de intenciones (en orden de prioridad)
    if (t.includes('hola') || t.includes('buenas') || t.includes('saludos') || t.includes('mariposa') || t.includes('ayuda')) {
      respuestaKey = 'saludo';
    } else if (t.includes('precio') || t.includes('costo') || t.includes('cuota') || t.includes('dolar') || t.includes('dólar') || t.includes('pagar') || t.includes('cuanto') || t.includes('cuánto')) {
      respuestaKey = 'precio';
      contexto.interes_precio = true;
      contexto.ya_pregunto_precio = true;
    } else if (t.includes('incluye') || t.includes('incluido') || t.includes('que viene') || t.includes('que tiene') || t.includes('paquete')) {
      respuestaKey = 'incluye';
      contexto.ya_pregunto_incluye = true;
    } else if (t.includes('vuelo') || t.includes('aereo') || t.includes('aéreo') || t.includes('avion') || t.includes('avión') || t.includes('aerolinea') || t.includes('aerolínea')) {
      respuestaKey = 'vuelo_libre';
    } else if (t.includes('mora') || t.includes('recargo') || t.includes('atraso') || t.includes('no puedo pagar') || t.includes('me atraso')) {
      respuestaKey = 'sin_mora';
    } else if (t.includes('fecha') || t.includes('cuando') || t.includes('cuándo') || t.includes('temporada') || t.includes('epoca') || t.includes('diciembre') || t.includes('enero') || t.includes('verano')) {
      respuestaKey = 'fechas';
    } else if (t.includes('boliche') || t.includes('fiesta') || t.includes('efecto')) {
      respuestaKey = 'efecto_boliche';
    } else if (t.includes('contactar') || t.includes('asesor') || t.includes('hablar') || t.includes('llamar') || t.includes('whatsapp') || t.includes('telefono') || t.includes('teléfono') || t.includes('datos')) {
      respuestaKey = 'contacto';
      contexto.modo_contacto = true;
    } else {
      respuestaKey = 'default';
    }

    // Lógica contextual: si ya sabemos las personas y no respondimos precio, hacerlo ahora
    if (respuestaKey === 'default' && contexto.personas && !contexto.ya_pregunto_precio) {
      respuestaKey = 'precio';
      contexto.ya_pregunto_precio = true;
    }

    // Si ya hubo intercambio y el mensaje sigue siendo genérico, ofrecer contacto
    if (respuestaKey === 'default' && (contexto.ya_pregunto_precio || contexto.ya_pregunto_incluye)) {
      respuestaKey = 'contacto';
      contexto.modo_contacto = true;
    }

    // Generar texto de respuesta
    let respuesta;
    if (respuestaKey === 'saludo') {
      respuesta = randomRespuesta(SALUDOS);
    } else if (respuestaKey && RESPUESTAS[respuestaKey]) {
      respuesta = randomRespuesta(RESPUESTAS[respuestaKey]);
    } else {
      respuesta = randomRespuesta(RESPUESTAS.default);
    }

    return {
      respuesta,
      necesitaContacto: (respuestaKey === 'contacto')
    };
  }

  // ========== RESUMEN LOCAL DE CONVERSACIÓN ==========
  function generarResumen() {
    const mensajes = dom.messages
      ? Array.from(dom.messages.querySelectorAll('.mp-msg-user-bubble, .mp-msg-bot-bubble'))
      : [];
    const ultimos = mensajes.slice(-8);
    let resumen = '';
    ultimos.forEach(bubble => {
      const esUsuario = bubble.classList.contains('mp-msg-user-bubble');
      const texto = (bubble.innerText || bubble.textContent || '').trim();
      if (texto) resumen += (esUsuario ? '👤 Cliente' : '🦋 Mariposa') + ': ' + texto.substring(0, 180) + '\n';
    });
    if (resumen.length > 800) resumen = resumen.substring(0, 800) + '…';
    return resumen || 'Sin mensajes registrados.';
  }

  // ========== RENDER DE MENSAJES ==========
  function appendBotMessage(html, showContactButton) {
    if (showContactButton === undefined) showContactButton = false;
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
      contactBtn.style.marginTop = '10px';
      contactBtn.innerHTML = '<span class="mp-opt-icon">📲</span> Quiero que me contacte un asesor';
      contactBtn.addEventListener('click', function() { showContactModal(); });
      bubble.appendChild(contactBtn);
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
    for (var i = 0; i < 3; i++) dots.appendChild(document.createElement('span'));

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(dots);
    dom.messages.appendChild(typingDiv);
    scrollToBottom();

    setTimeout(function() {
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);
      callback();
    }, 700);
  }

  function scrollToBottom() {
    if (dom.messages) dom.messages.scrollTop = dom.messages.scrollHeight;
  }

  // ========== MODAL DE CONTACTO ==========
  function showContactModal() {
    if (document.getElementById('mariposa-contact-modal')) return;
    var resumen = generarResumen();

    var modal = document.createElement('div');
    modal.id = 'mariposa-contact-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:100000;display:flex;align-items:center;justify-content:center;';

    var modalContent = document.createElement('div');
    modalContent.style.cssText = 'background:#0a1a3e;border-radius:24px;padding:24px;max-width:420px;width:90%;border:1px solid rgba(126,184,255,0.3);box-shadow:0 20px 40px rgba(0,0,0,0.5);font-family:Montserrat,sans-serif;color:white;max-height:85vh;overflow-y:auto;';

    modalContent.innerHTML =
      '<h3 style="font-size:1.2rem;margin-bottom:8px;">📲 ¡Último paso!</h3>' +
      '<p style="font-size:0.85rem;margin-bottom:16px;">Compartí tu nombre y Alejandro te contactará por WhatsApp para armar tu viaje a medida.</p>' +
      '<div style="background:rgba(126,184,255,0.08);border-radius:12px;padding:12px;margin-bottom:16px;font-size:0.75rem;border-left:3px solid #7eb8ff;">' +
        '<strong>📋 Resumen de la conversación:</strong>' +
        '<div style="max-height:120px;overflow-y:auto;margin-top:6px;white-space:pre-wrap;">' + resumen.replace(/\n/g, '<br>') + '</div>' +
      '</div>' +
      '<input type="text" id="mp-contact-name" placeholder="Tu nombre completo" style="width:100%;padding:12px;margin-bottom:20px;border-radius:12px;border:none;background:#0f2a50;color:white;font-size:0.9rem;box-sizing:border-box;font-family:Montserrat,sans-serif;">' +
      '<div style="display:flex;gap:10px;">' +
        '<button id="mp-contact-send" style="flex:1;background:linear-gradient(135deg,#1a5bb5,#0B3D91);border:none;border-radius:40px;padding:12px;color:white;font-weight:bold;cursor:pointer;font-family:Montserrat,sans-serif;">📲 Enviar a WhatsApp</button>' +
        '<button id="mp-contact-cancel" style="flex:1;background:transparent;border:1px solid #7eb8ff;border-radius:40px;padding:12px;color:#7eb8ff;cursor:pointer;font-family:Montserrat,sans-serif;">Cancelar</button>' +
      '</div>';

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modalContent.querySelector('#mp-contact-send').onclick = function() {
      var name = document.getElementById('mp-contact-name').value.trim();
      if (!name) { alert('Por favor completá tu nombre para que el asesor sepa cómo llamarte.'); return; }
      var msg =
        '🦋 *NUEVO LEAD DESDE MARIPOSA*\n\n' +
        '👤 *Nombre:* ' + name + '\n\n' +
        '📋 *Conversación reciente:*\n' + resumen + '\n\n' +
        '🔔 *Acción:* Contactar al cliente para armar presupuesto.';
      window.open('https://wa.me/5492974726449?text=' + encodeURIComponent(msg), '_blank');
      modal.remove();
      appendBotMessage(randomRespuesta(RESPUESTAS.despedida_contacto), false);
      contexto.modo_contacto = false;
    };

    modalContent.querySelector('#mp-contact-cancel').onclick = function() { modal.remove(); };
  }

  // ========== ENVÍO DE MENSAJE ==========
  function sendUserMessage() {
    var text = dom.textInput.value.trim();
    if (!text) return;
    dom.textInput.value = '';
    appendUserMessage(text);
    var resultado = analizarIntencion(text);
    showTypingIndicator(function() {
      appendBotMessage(resultado.respuesta, resultado.necesitaContacto);
    });
  }

  // ========== UI: BUBBLE ==========
  function buildBubble() {
    var bubble = document.createElement('div');
    bubble.id = 'mp-bubble';
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('aria-label', 'Abrir asistente Mariposa Luazul');
    bubble.innerHTML =
      '<div id="mp-bubble-avatar">' + avatarImg().outerHTML + '</div>' +
      '<div id="mp-bubble-text"><div class="mp-bt-name">Mariposa Luazul</div><div class="mp-bt-sub">Asistente de Viaje</div></div>' +
      '<div id="mp-notif-dot"></div>';
    bubble.addEventListener('click', toggleChat);
    return bubble;
  }

  // ========== UI: WINDOW ==========
  function buildWindow() {
    var win = document.createElement('div');
    win.id = 'mp-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat Mariposa Luazul');
    win.innerHTML =
      '<div id="mp-header">' +
        '<div id="mp-header-avatar">' + avatarImg().outerHTML + '</div>' +
        '<div id="mp-header-info">' +
          '<div id="mp-header-name">Mariposa Luazul 🦋</div>' +
          '<div id="mp-header-status">En línea ahora</div>' +
        '</div>' +
        '<button id="mp-close-btn" aria-label="Cerrar chat">✕</button>' +
      '</div>' +
      '<div id="mp-messages"></div>' +
      '<div id="mp-input-row">' +
        '<input type="text" id="mp-text-input" placeholder="Escribe tu pregunta..." autocomplete="off">' +
        '<button id="mp-send-btn" aria-label="Enviar"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
      '</div>' +
      '<div id="mp-footer">LUAZUL Smart Travel · Asistente Digital</div>';
    return win;
  }

  // ========== TOGGLE ==========
  function toggleChat() {
    isOpen = !isOpen;
    var win = document.getElementById('mp-window');
    if (isOpen) {
      win.classList.add('mp-open');
      var dot = document.getElementById('mp-notif-dot');
      if (dot) dot.style.display = 'none';
      if (!hasGreeted) {
        hasGreeted = true;
        setTimeout(function() { appendBotMessage(randomRespuesta(SALUDOS), false); }, 300);
      }
      setTimeout(function() { if (dom.textInput) dom.textInput.focus(); }, 350);
    } else {
      win.classList.remove('mp-open');
    }
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    if (!document.querySelector('link[href*="mariposa-chat.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = (window.location.pathname.indexOf('/destinos/') >= 0 ? '../' : '') + 'mariposa-chat.css';
      document.head.appendChild(link);
    }

    var bubble = buildBubble();
    var win    = buildWindow();
    document.body.appendChild(bubble);
    document.body.appendChild(win);

    dom.messages  = document.getElementById('mp-messages');
    dom.textInput = document.getElementById('mp-text-input');

    var sendBtn  = document.getElementById('mp-send-btn');
    var closeBtn = document.getElementById('mp-close-btn');

    if (sendBtn)       sendBtn.addEventListener('click', sendUserMessage);
    if (closeBtn)      closeBtn.addEventListener('click', toggleChat);
    if (dom.textInput) dom.textInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendUserMessage(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
