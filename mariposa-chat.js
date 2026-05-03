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
    "🦋 ¡Hola! Soy Mariposa Luazul, tu exploradora de viajes. ¿Sabías que podés viajar a Brasil por menos de USD 1.45 por día por persona? Eso es menos de lo que cuesta un café en cualquier ciudad. 🌊✨ Contame, ¿para cuántas personas pensás viajar?",
    "¡Hola! 🌴 Qué lindo que estés pensando en Brasil. En Luazul podés pagar tu viaje en cuotas que equivalen a menos de un café por día. ¿Te gustaría saber cómo funciona?",
    "¡Qué emoción! Un viaje a Brasil está más cerca de lo que pensás. Con menos de USD 1.45 por día por persona podés hacerlo realidad. 🦋 Contame, ¿viajás solo o en grupo?"
  ];

  const RESPUESTAS = {
    precio: [
      "💰 ¡Mucho menos de lo que imaginás! Viajar al paraíso te cuesta apenas 1.45 USD por día por persona. Es un plan diseñado para que, con el esfuerzo de un pequeño ahorro cotidiano (menos de lo que sale un café), asegures 7 noches frente al mar con excursiones de lujo incluidas. ¿Empezamos a verlo?",
      "🦋 Mirá: el plan para dos cuesta USD 870 en total, o sea USD 435 por persona. Dividido en 7 noches da USD 62 por noche, pero si repartís en 30 días, son menos de USD 1.50 por día por persona. Eso es menos que un café con factura. Además pagás en cuotas. ¿Te parece accesible?",
      "La cuenta es simple: 1.45 USD por día por persona. Eso es menos de lo que gastás en una gaseosa. Por ese importe, te llevás 7 noches frente al mar, traslados privados, tours en Río y paseo de barco. ¿Vamos a verlo juntos?"
    ],
    incluye: [
      "🏨 ¡Exacto! Para tu estadía allá está todo cubierto: hotel seleccionado, traslados privados, tour por Río (Cristo y Pan de Azúcar) y paseo en barco en Arraial con almuerzo. Solo tenés que ocuparte de tus comidas extras y tus gustitos.",
      "El paquete incluye alojamiento, traslados, excursiones premium (Río, Arraial, Buggy) y una app exclusiva para ver cuotas y vouchers. ¿Querés que te detalle una excursión en particular?",
      "📦 Incluye: 7 noches frente al mar, traslados privados, día en Río (Cristo + Pan de Azúcar), paseo de barco en Arraial con almuerzo, excursión en Buggy y asesoría personalizada. ¿Alguna de estas actividades te llama más la atención?"
    ],
    cuotas: [
      "¡Es nuestra especialidad! Podés pagar en cuotas fijas de 43.50 USD al mes por persona (para 2 personas, 10 cuotas de USD 87 total). Pensalo así: es menos de lo que gastás en una sola noche de boliche o en un par de pizzas. Acá esa plata te compra una semana en las mejores playas de Brasil.",
      "💸 Totalmente accesible: cuotas desde USD 43.50 por persona por mes. Elegís el plazo que más te acomode (6, 10, 12 o 18 meses). Lo mejor: empezás a pagar hoy y decidís la fecha después. ¿Te gustaría que calculemos juntos el plan ideal?",
      "Las cuotas son fijas y sin interés. Por ejemplo, para dos personas el total es USD 870; si elegís 10 cuotas pagás USD 87 al mes (USD 43.50 cada uno). Eso es menos que una salida nocturna. ¿Te parece razonable?"
    ],
    sin_mora: [
      "Acá respirás profundo y relajás, porque en Luazul no existe la mora ni los intereses. Si un mes se te complica, no pagás nada extra. Tu plan simplemente se pausa y lo retomamos cuando puedas, sin penalizaciones. ¡Queremos que ahorres con alegría, no con estrés!",
      "✅ ¡Cero estrés! Si un mes no podés pagar, no hay recargo. Solo se pausa el voucher hasta que regularices. No te castigamos por tener un imprevisto. ¿Tranquilo, no?",
      "Sin mora: una ventaja única. Podés retrasar una cuota sin que te apliquen intereses. Tu única responsabilidad es seguir soñando con la playa. ¿Vamos a empezar?"
    ],
    vuelo_libre: [
      "¡Al contrario! Que no incluya vuelos es tu pase a la libertad. Al no estar atado a un vuelo grupal caro de agencia, podés:\n• Usar tus millas acumuladas.\n• Cazar ofertas de último momento en aerolíneas low-cost.\n• Elegir salir desde el aeropuerto que te quede más cerca (Comodoro, Neuquén, Buenos Aires) sin pagar de más.\nNosotros nos ocupamos de todo lo difícil en tierra; vos elegís cómo y cuándo volar.",
      "✈️ Tu vuelo, tu autonomía. Nosotros no queremos encajarte un aéreo caro y con horarios rígidos. Vos buscás la mejor oferta, y nosotros te esperamos en el aeropuerto con traslado privado. ¿Te parece justo?",
      "Es una ventaja, no una desventaja. Tenés libertad total para elegir aerolínea, horarios, ciudad de salida y hasta extender tus días. Mientras tanto, nosotros te cuidamos en tierra. ¿Vamos viendo?"
    ],
    fechas: [
      "¡Para nada! Esa es la magia de la Planificación Inteligente. Primero empezás a pagar tu nido en Brasil para congelar el precio y, una vez que terminás de abonar tu plan, recién ahí elegís cuándo querés viajar. Así no tenés que pelear por las vacaciones en el trabajo hoy mismo.",
      "📅 No tenés que elegir fecha ahora. Empezás a pagar cuotas y cuando hayas completado el 80% del plan, coordinamos la fecha que mejor te quede. Flexible y sin presiones. ¿Te parece bien?",
      "Lo lindo es que vos decidís cuándo ir. Pagás tus cuotas tranquilo y cuando estés cerca de terminarlas, elegimos la fecha juntos. Así viajás cuando realmente puedas."
    ],
    grupos: [
      "¡Claro! Cuantos más son, más divertido y accesible es el plan. Tenemos opciones para parejas (USD 87 total por mes), grupos de 4 (USD 145/mes) o grupos de 6 (USD 174/mes). Por persona, el costo baja muchísimo. ¿Cuántos son ustedes?",
      "👥 Viajar en grupo es lo mejor. Cuantas más personas, menos paga cada uno. Por ejemplo, si son 6 personas, la cuota total es USD 174/mes, o sea USD 29 por persona por mes. ¡Eso es menos que un combo de hamburguesa! ¿Me decís cuántos van?"
    ],
    app: [
      "Vas a tener acceso a nuestra App exclusiva para viajeros. Desde ahí vas a ver cada cuota que pagás, tu contrato firmado y tus vouchers. Es transparencia total en la palma de tu mano.",
      "📱 Todo está en tu celular. La app de Luazul muestra tus cuotas, el contrato, el voucher y hasta te avisa cuándo estás cerca del 80% para elegir fecha. ¿Te gusta la idea?"
    ],
    pasaporte: [
      "¡Para nada! Como vamos a Brasil, con tu DNI argentino vigente ya estás del otro lado. Es tan fácil como viajar a la provincia de al lado, pero con palmeras y agua transparente. Sin trámites caros ni esperas en el consulado. ¡Tu única preocupación es que no se te venza el documento!",
      "🛂 Solo necesitás DNI argentino en buen estado. Sin visa, sin pasaporte. Brasil nos recibe con los brazos abiertos. ¿Viste qué sencillo?"
    ],
    comida: [
      "¡Al contrario, es donde más ahorrás! Tenés el desayuno buffet incluido para arrancar el día como un rey. Para el resto, Brasil tiene las famosas 'lanchonetes' y comida al peso donde comés increíble por muy pocos reales. Al no incluir cenas fijas de hotel (que suelen ser caras y aburridas), tenés la libertad de elegir dónde y cuánto gastar cada día. ¡Comer en la playa es un placer muy accesible!",
      "🍔 El desayuno está incluido. Las comidas del día las resolvés como quieras. Hay opciones para todos los presupuestos, desde un sándwich en la playa hasta un buffet libre. ¿Preferís comer económico o darte algún gusto?"
    ],
    clima: [
      "La Costa do Sol es mágica porque tiene buen clima casi todo el año. Pero lo mejor de nuestro sistema es que no tenés que decidirlo hoy. Empezás a pagar ahora, congelás el precio, y cuando termines tu plan, elegís el mes que más te guste. ¡Nosotros te asesoramos para que encuentres el sol perfecto!",
      "📅 ¿Invierno o verano? Vos elegís después. Como empezás a pagar ahora, podés fijar la fecha cuando hayas pagado la mayor parte. Así viajás con el clima que más te guste."
    ],
    tipo_cambio: [
      "¡Es súper simple! Usamos nuestro sistema de Exchange Inteligente. Pagás en moneda local (ARS) con una de las mejores tasas del mercado, sin vueltas ni trámites raros. Es como ir comprando 'pedacitos de playa' todos los meses con lo que te sobra del sueldo.",
      "💵 Pagás en pesos argentinos al tipo de cambio del día, sin recargos escondidos. El monto en dólares se fija al momento de la compra del paquete, así que no te afecta la devaluación. ¿Tranquilidad garantizada?"
    ],
    idioma: [
      "¡Cero drama! El 'portuñol' es el idioma oficial de la buena onda. Además, en Luazul te damos soporte constante y tenemos herramientas para que la comunicación sea lo último de lo que te preocupes. ¡Vas a volver hablando brasilero de tanto disfrutar!",
      "🗣️ No te preocupes. Con español y buena voluntad te entendés perfecto. Y si necesitás, tenés a nosotros para ayudarte. No hace falta saber portugués para caipirinha y playa."
    ],
    contacto: [
      "🦋 ¡Genial! ¿Viste que para que una mariposa vuele no necesita permiso de nadie? Vos tampoco. Con 1.45 USD por día, te estás comprando el derecho a despertarte frente al mar. Es menos de lo que sale un paquete de galletitas premium. Dejame tu nombre y teléfono y le pido a Alejandro (dueño) que te escriba por WhatsApp para armarte un plan que ni vas a sentir en el bolsillo.",
      "Perfecto. Dejame tus datos y enseguida Alejandro te contacta para diseñarte el viaje a tu medida. Si querés, también podés escribirle vos al +5492974726449, ¡pero pasame tu número así le aviso que te dé prioridad! 😉"
    ],
    despedida_contacto: [
      "✅ ¡Listo! Ya le avisé a Alejandro. En breve te contactará por WhatsApp para que empieces a pagar poquito por día y asegures tu lugar en el paraíso. 🦋✨",
      "Perfecto, ya está. En los próximos minutos recibirás un mensaje. Preparate para empezar a ahorrar menos de un café por día para tu viaje soñado."
    ],
    default: [
      "🦋 Gracias por tu consulta. Para darte un número exacto, ¿cuántas personas viajarían? Así te puedo decir cuánto pagarías por día (menos de un café, te lo aseguro).",
      "¡Que buena pregunta! Para orientarte mejor, contame cuántos son y si tenés alguna fecha aproximada en mente. Así ajusto el plan perfecto para vos.",
      "Me encantaría ayudarte. Si me decís cuántas personas y cuántas noches (mínimo 7), te doy el precio por día, que es más barato que un café en cualquier Starbucks. 🦋"
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
    } else if (t.includes('precio') || t.includes('costo') || t.includes('dolar') || t.includes('dólar') || t.includes('pagar') || t.includes('cuanto') || t.includes('cuánto')) {
      respuestaKey = 'precio';
      contexto.interes_precio = true;
      contexto.ya_pregunto_precio = true;
    } else if (t.includes('incluye') || t.includes('incluido') || t.includes('que viene') || t.includes('que tiene') || t.includes('paquete')) {
      respuestaKey = 'incluye';
      contexto.ya_pregunto_incluye = true;
    } else if (t.includes('vuelo') || t.includes('aereo') || t.includes('aéreo') || t.includes('avion') || t.includes('avión') || t.includes('aerolinea') || t.includes('aerolínea')) {
      respuestaKey = 'vuelo_libre';
    } else if (t.includes('cuota') || t.includes('facilidad') || t.includes('plazo')) {
      respuestaKey = 'cuotas';
    } else if (t.includes('mora') || t.includes('recargo') || t.includes('atraso') || t.includes('no puedo pagar') || t.includes('me atraso')) {
      respuestaKey = 'sin_mora';
    } else if (t.includes('fecha') || t.includes('cuando') || t.includes('cuándo') || t.includes('temporada') || t.includes('epoca') || t.includes('diciembre') || t.includes('enero') || t.includes('verano')) {
      respuestaKey = 'fechas';
    } else if (t.includes('grupo') || t.includes('amigos') || t.includes('varios')) {
      respuestaKey = 'grupos';
    } else if (t.includes('app') || t.includes('aplicación') || t.includes('celular')) {
      respuestaKey = 'app';
    } else if (t.includes('pasaporte') || t.includes('visa') || t.includes('documento') || t.includes('dni')) {
      respuestaKey = 'pasaporte';
    } else if (t.includes('comida') || t.includes('comer') || t.includes('desayuno') || t.includes('gastos')) {
      respuestaKey = 'comida';
    } else if (t.includes('clima') || t.includes('época') || t.includes('cuándo ir') || t.includes('temperatura')) {
      respuestaKey = 'clima';
    } else if (t.includes('dólar') || t.includes('tipo de cambio') || t.includes('pesos') || t.includes('exchange')) {
      respuestaKey = 'tipo_cambio';
    } else if (t.includes('idioma') || t.includes('portugués') || t.includes('hablar')) {
      respuestaKey = 'idioma';
    } else if (t.includes('contactar') || t.includes('asesor') || t.includes('llamar') || t.includes('whatsapp') || t.includes('telefono') || t.includes('teléfono') || t.includes('datos')) {
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
      '<p style="font-size:0.85rem;margin-bottom:16px;">Compartí tus datos y Alejandro te contactará por WhatsApp para armar tu viaje a medida.</p>' +
      '<div style="background:rgba(126,184,255,0.08);border-radius:12px;padding:12px;margin-bottom:16px;font-size:0.75rem;border-left:3px solid #7eb8ff;">' +
        '<strong>📋 Resumen de la conversación:</strong>' +
        '<div style="max-height:120px;overflow-y:auto;margin-top:6px;white-space:pre-wrap;">' + resumen.replace(/\n/g, '<br>') + '</div>' +
      '</div>' +
      '<input type="text" id="mp-contact-name" placeholder="Tu nombre completo" style="width:100%;padding:12px;margin-bottom:12px;border-radius:12px;border:none;background:#0f2a50;color:white;font-size:0.9rem;box-sizing:border-box;font-family:Montserrat,sans-serif;">' +
      '<input type="tel" id="mp-contact-phone" placeholder="Tu número de WhatsApp (ej: 5491123456789)" style="width:100%;padding:12px;margin-bottom:20px;border-radius:12px;border:none;background:#0f2a50;color:white;font-size:0.9rem;box-sizing:border-box;font-family:Montserrat,sans-serif;">' +
      '<div style="display:flex;gap:10px;">' +
        '<button id="mp-contact-send" style="flex:1;background:linear-gradient(135deg,#1a5bb5,#0B3D91);border:none;border-radius:40px;padding:12px;color:white;font-weight:bold;cursor:pointer;font-family:Montserrat,sans-serif;">📲 Enviar a WhatsApp</button>' +
        '<button id="mp-contact-cancel" style="flex:1;background:transparent;border:1px solid #7eb8ff;border-radius:40px;padding:12px;color:#7eb8ff;cursor:pointer;font-family:Montserrat,sans-serif;">Cancelar</button>' +
      '</div>';

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modalContent.querySelector('#mp-contact-send').onclick = function() {
      var name = document.getElementById('mp-contact-name').value.trim();
      var phone = document.getElementById('mp-contact-phone').value.trim();
      if (!name || !phone) { alert('Por favor completá nombre y teléfono.'); return; }
      phone = phone.replace(/\D/g, '');
      if (phone.indexOf('549') !== 0) phone = '549' + phone;
      var msg =
        '🦋 *NUEVO LEAD DESDE MARIPOSA*\n\n' +
        '👤 *Nombre:* ' + name + '\n' +
        '📞 *Teléfono:* ' + phone + '\n\n' +
        '📋 *Conversación reciente:*\n' + resumen + '\n\n' +
        '🔔 *Acción:* Contactar al cliente para armar presupuesto.';
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
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
