// Two-language (EN/ES) client-side toggle. No build step, no page reload —
// swaps innerHTML/alt/title on every [data-i18n] element from the
// dictionary below and remembers the choice in localStorage.
(function () {
  "use strict";

  var STORAGE_KEY = "tcv-lang";

  var DICT = {
    en: {
      "meta.title": "Technology Consultants — We earn our advice by shipping",
      "meta.description": "A consulting practice run by builders. We design, build, and operate React web apps and AI agents for startups, SMBs, and mid-market teams.",

      "nav.services": "Services",
      "nav.work": "Work",
      "nav.how": "How we work",
      "nav.about": "About",
      "nav.cta": "Book a call",

      "hero.meta1": "Web Applications &amp; AI Agents",
      "hero.meta2": "Booking projects · Q3 2026",
      "hero.h1": "We design, build, and run software people rely on.",
      "hero.lede": "This is <strong>Appt&nbsp;Helper</strong> &mdash; one of four production products we&rsquo;ve built and operate ourselves. It watches Global&nbsp;Entry &amp; SENTRI appointment slots 24/7 and texts travelers the instant one opens. We bring the same senior team to client work &mdash; web apps and AI agents alike.",
      "hero.cta.primary": "Book a 30-min strategy call",
      "hero.cta.secondary": "See what we&rsquo;ve built",
      "hero.stat1.n": "In production.",
      "hero.stat1.l": "Real users today on Appt Helper and Open Cita.",
      "hero.stat2.n": "Senior team.",
      "hero.stat2.l": "The people who pitch your project ship&nbsp;it.",
      "hero.stat3.n": "Code first.",
      "hero.stat3.l": "No decks before working software.",
      "hero.stat4.n": "One team.",
      "hero.stat4.l": "Web apps and AI agents &mdash; same engineers, same stack.",
      "hero.visual.alt": "Appt Helper live dashboard: a real-time feed of Global Entry and SENTRI appointment slots being claimed at enrollment centers across the US",
      "hero.visual.caption": "Appt Helper &mdash; a live product, not a mockup",

      "trust.eyebrow": "Built by us — in production today",
      "trust.small": "Products we&rsquo;ve developed &mdash; Appt&nbsp;Helper, Open&nbsp;Cita, Border&nbsp;Bills, and Baja&nbsp;Care. The same team builds for our clients.",
      "trust.appt.tag": "Global Entry &amp; SENTRI appointment alerts, 24/7",
      "trust.appt.status": "Live · appthelper.com",
      "trust.opencita.tag": "The same alerts, built for Spanish-speaking travelers",
      "trust.opencita.status": "Live · opencita.com",
      "trust.border.tag": "Pay Mexican utility bills from the US — in seconds.",
      "trust.baja.tag": "Medical tourism, made navigable.",
      "trust.dev.status": "In development",

      "services.eyebrow": "What we do",
      "services.h2": "One team.<br />One <em>stack</em>.",
      "services.lede": "Web development and AI agents are the same discipline now. We run both with the same senior engineers who ship our own products &mdash; not advisors with a slide deck.",
      "services.web.h3": "React &amp; Full-Stack Web Development",
      "services.web.sub": "From MVP to scale.",
      "services.web.body": "We build modern web products end-to-end &mdash; React on the front end, TypeScript and Node on the back end, Postgres, and the infrastructure to run them. You get senior engineers who&rsquo;ve shipped to real users, not a junior team learning on your dime.",
      "services.web.li1": "Product architecture &amp; technical strategy",
      "services.web.li2": "Full-stack design and build",
      "services.web.li3": "API design, integrations, data modeling",
      "services.web.li4": "Performance, security, observability",
      "services.web.li5": "Mobile-responsive on every breakpoint",
      "services.web.li6": "Handoff with docs &mdash; or we operate it",
      "services.ai.h3": "AI Agent Consulting",
      "services.ai.sub": "Strategy, build, and adoption &mdash; without the hype.",
      "services.ai.body": "Most &ldquo;AI strategies&rdquo; stall because nobody on the team has shipped an agent. We assess where AI actually moves the needle, design and build the agents that do the work, and roll them out so your team uses them on Monday morning.",
      "services.ai.li1": "AI readiness audits &amp; roadmaps",
      "services.ai.li2": "Custom agent design &amp; implementation",
      "services.ai.li3": "Claude, OpenAI, open-source models",
      "services.ai.li4": "Skills, plugins, MCP servers",
      "services.ai.li5": "Team enablement &amp; training",
      "services.ai.li6": "Ongoing operations and tuning",

      "work.eyebrow": "Selected work",
      "work.h2": "Products we&rsquo;ve built.<br />Lessons we bring to <em>yours</em>.",
      "work.lede": "Two are live today; two are in development. Same team, same stack, either way.",
      "work.appt.alt": "Appt Helper live dashboard showing Global Entry and SENTRI appointment slots being claimed in real time",
      "work.appt.title": "Global Entry &amp; SENTRI slots vanish in minutes. We built the alert that catches them.",
      "work.appt.desc": "A consumer monitoring service that watches all 184 U.S. Trusted Traveler enrollment centers 24/7 and texts travelers the instant a cancellation opens &mdash; turning a 4-to-11-month wait into days.",
      "work.visit": "Visit",
      "work.opencita.alt": "Open Cita live dashboard, the Spanish-language version of Appt Helper, showing appointment slots being claimed",
      "work.opencita.title": "The same alert engine, rebuilt in Spanish for the travelers it was missing.",
      "work.opencita.desc": "Open Cita is Appt Helper&rsquo;s Spanish-language mirror &mdash; the same 24/7 monitoring and instant SMS alerts, fully localized for Spanish-speaking travelers pursuing Global Entry, SENTRI, and NEXUS.",
      "work.border.alt": "Border Bills landing page: pay Mexico utility bills instantly, stop driving to Tijuana",
      "work.border.title": "Pay Mexican utility bills from the US &mdash; without the drive.",
      "work.border.desc": "A consumer payment app for US-based families paying CFE (electricity), Telmex / Izzi (internet), water, and predial &mdash; in seconds, instead of driving across the border or wiring cash.",
      "work.casestudy": "Case study",
      "work.baja.title": "Medical tourism, made navigable.",
      "work.baja.desc": "A patient-side discovery and intake platform connecting US patients with vetted Baja California providers &mdash; turning Facebook groups and word-of-mouth into a guided, transparent experience.",
      "work.baja.watch": "Watch this space",
      "work.comingsoon": "Screenshot coming soon",

      "how.eyebrow": "How we work",
      "how.h2": "We meet you <em>where</em> you are.",
      "how.lede": "Every engagement is structured around your reality &mdash; not a template. Pick what fits, or we&rsquo;ll help you choose.",
      "how.bestfor.label": "Best for",
      "how.length.label": "Typical length",
      "how.1.title": "Fixed-scope project",
      "how.1.body": "For a defined deliverable with a clear edge &mdash; an MVP, a redesign, an AI integration. We scope tightly, ship on a date, and hand off cleanly.",
      "how.1.bestfor": "validated ideas · planned launches",
      "how.1.length": "4 – 16 weeks",
      "how.2.title": "Monthly retainer",
      "how.2.body": "For teams that need senior engineering or AI ops capacity on an ongoing basis. Predictable cost, flexible scope, no hiring overhead.",
      "how.2.bestfor": "scaling startups · fractional CTO",
      "how.2.length": "3+ months, month-to-month",
      "how.3.title": "Strategy sprint",
      "how.3.body": "A one- to two-week deep dive: AI readiness audit, architecture review, or agent design sprint. You leave with a roadmap your team can execute &mdash; with or without us.",
      "how.3.bestfor": "&ldquo;we know we need this&hellip;&rdquo;",
      "how.3.length": "1 – 2 weeks, fixed price",
      "how.4.title": "Partnership / equity",
      "how.4.body": "For founders who want a long-term technical partner. We invest engineering time in exchange for equity or revenue share, with structure that protects both sides.",
      "how.4.bestfor": "early-stage with a credible market",
      "how.4.length": "12+ months",

      "about.eyebrow": "About",
      "about.h2": "A small team of builders, led by an engineer who&rsquo;s been on <em>both</em> sides of the table.",
      "about.lede": "We started by shipping our own products so we&rsquo;d know what we were talking about when we started shipping yours.",
      "about.p1": "Technology Consultants was founded by <strong>Roberto Guido</strong> &mdash; an electrical engineer (UC&nbsp;San&nbsp;Diego) with an MBA from NYU&nbsp;Stern who&rsquo;s spent his career bridging the gap between what&rsquo;s technically possible and what actually moves a business. He leads a focused team of senior engineers and designers who&rsquo;ve shipped products together for years.",
      "about.p2": "That bridge runs in both directions: he&rsquo;s done hardware and software design work on the voice AI system at Encounter&nbsp;AI, a drive-thru and kiosk ordering platform backed by investors including Morgan Stanley Inclusive Ventures Lab, and is a 2024 resident of Colorwave&rsquo;s Technical Residency in AI or Cybersecurity (TRAC) program &mdash; a competitive fellowship, accepting roughly 10% of applicants, that places emerging technologists into real artificial-intelligence and cybersecurity work.",
      "about.p3": "We started by building our own products &mdash; Appt&nbsp;Helper, Open&nbsp;Cita, Border&nbsp;Bills, and Baja&nbsp;Care &mdash; because we wanted to prove the architecture, the team, and the operating model worked before selling any of it to clients.",
      "about.p4": "That portfolio is now the foundation of our consulting practice. Every recommendation we make has been tested against real users and real edge cases &mdash; not just slide decks.",
      "about.card.role": "Founder · EE, UC San Diego · MBA, NYU Stern",
      "about.card.practice.label": "Practice",
      "about.card.practice.value": "Web &amp; AI agents",
      "about.card.residency.label": "Residency",
      "about.card.residency.value": "AI TRAC, 2024",
      "about.card.based.label": "Based",
      "about.card.languages.label": "Languages",
      "about.card.languages.value": "English · Spanish",
      "about.card.opento.label": "Open to",
      "about.card.opento.value": "SMB · startup · mid-market",

      "contact.eyebrow": "Next step",
      "contact.h2": "Tell us what you&rsquo;re trying to build.",
      "contact.lede": "A 30-minute call costs nothing and usually leaves you with at least one concrete idea &mdash; whether or not we end up working together.",
      "contact.cta": "Email us to book a call",
      "contact.meta": "contact@technologyconsultants.ventures · Typical reply within 24 hrs · M – F",
      "contact.mailtoSubject": "Strategy%20call",

      "footer.tagline": "A consulting practice run by builders. We design, build, and operate React web apps and AI agents.",
      "footer.services.h5": "Services",
      "footer.services.web": "Web development",
      "footer.services.ai": "AI agent consulting",
      "footer.services.engagement": "Engagement models",
      "footer.work.h5": "Our work",
      "footer.company.h5": "Company",
      "footer.company.about": "About",
      "footer.company.contact": "Contact",
      "footer.company.email": "Email us",
      "footer.copyright": "&copy; 2026 Technology Consultants. All rights reserved.",
      "footer.version": "v2026.05 · made by builders",
    },

    es: {
      "meta.title": "Technology Consultants — Ganamos nuestra credibilidad construyendo",
      "meta.description": "Una consultoría dirigida por quienes construyen software real. Diseñamos, construimos y operamos aplicaciones web en React y agentes de IA para startups, pequeñas empresas y empresas medianas.",

      "nav.services": "Servicios",
      "nav.work": "Trabajo",
      "nav.how": "Cómo trabajamos",
      "nav.about": "Nosotros",
      "nav.cta": "Contáctanos",

      "hero.meta1": "Aplicaciones Web y Agentes de IA",
      "hero.meta2": "Agendando proyectos · T3 2026",
      "hero.h1": "Diseñamos, construimos y operamos software en el que la gente confía.",
      "hero.lede": "Este es <strong>Appt&nbsp;Helper</strong> &mdash; uno de los cuatro productos en producción que hemos construido y operamos nosotros mismos. Vigila las citas de Global&nbsp;Entry y SENTRI las 24 horas y avisa por mensaje de texto en el instante en que se libera un espacio. Aportamos el mismo equipo senior al trabajo con clientes &mdash; tanto en aplicaciones web como en agentes de IA.",
      "hero.cta.primary": "Reserva una llamada de estrategia de 30 minutos",
      "hero.cta.secondary": "Mira lo que hemos construido",
      "hero.stat1.n": "En producción.",
      "hero.stat1.l": "Usuarios reales hoy en Appt Helper y Open Cita.",
      "hero.stat2.n": "Equipo senior.",
      "hero.stat2.l": "Quienes te proponen el proyecto son quienes lo construyen.",
      "hero.stat3.n": "Código primero.",
      "hero.stat3.l": "Sin presentaciones antes de tener software funcionando.",
      "hero.stat4.n": "Un solo equipo.",
      "hero.stat4.l": "Aplicaciones web y agentes de IA &mdash; los mismos ingenieros, el mismo stack.",
      "hero.visual.alt": "Panel en vivo de Appt Helper: un feed en tiempo real de citas de Global Entry y SENTRI siendo tomadas en centros de inscripción en todo EE. UU.",
      "hero.visual.caption": "Appt Helper &mdash; un producto real, no una maqueta",

      "trust.eyebrow": "Construido por nosotros — en producción hoy",
      "trust.small": "Productos que hemos desarrollado &mdash; Appt&nbsp;Helper, Open&nbsp;Cita, Border&nbsp;Bills y Baja&nbsp;Care. El mismo equipo construye para nuestros clientes.",
      "trust.appt.tag": "Alertas de citas de Global Entry y SENTRI, 24/7",
      "trust.appt.status": "En vivo · appthelper.com",
      "trust.opencita.tag": "Las mismas alertas, hechas para viajeros de habla hispana",
      "trust.opencita.status": "En vivo · opencita.com",
      "trust.border.tag": "Paga servicios mexicanos desde EE. UU. — en segundos.",
      "trust.baja.tag": "Turismo médico, hecho navegable.",
      "trust.dev.status": "En desarrollo",

      "services.eyebrow": "Qué hacemos",
      "services.h2": "Un equipo.<br />Un <em>stack</em>.",
      "services.lede": "El desarrollo web y los agentes de IA son hoy la misma disciplina. Llevamos ambos con los mismos ingenieros senior que lanzan nuestros propios productos a producción &mdash; no asesores con una presentación.",
      "services.web.h3": "Desarrollo Web Full-Stack con React",
      "services.web.sub": "Del MVP a la escala.",
      "services.web.body": "Construimos productos web modernos de principio a fin &mdash; React en el frontend, TypeScript y Node en el backend, Postgres, y la infraestructura para operarlos. Trabajas con ingenieros senior que ya han lanzado a usuarios reales, no un equipo junior aprendiendo a tu costa.",
      "services.web.li1": "Arquitectura de producto y estrategia técnica",
      "services.web.li2": "Diseño y construcción full-stack",
      "services.web.li3": "Diseño de APIs, integraciones, modelado de datos",
      "services.web.li4": "Rendimiento, seguridad, observabilidad",
      "services.web.li5": "Responsive en todos los tamaños de pantalla",
      "services.web.li6": "Entrega con documentación &mdash; o lo operamos nosotros",
      "services.ai.h3": "Consultoría en Agentes de IA",
      "services.ai.sub": "Estrategia, construcción y adopción &mdash; sin el ruido.",
      "services.ai.body": "La mayoría de las &ldquo;estrategias de IA&rdquo; se estancan porque nadie en el equipo ha lanzado un agente. Evaluamos dónde la IA realmente mueve la aguja, diseñamos y construimos los agentes que hacen el trabajo, y los implementamos para que tu equipo los use desde el lunes.",
      "services.ai.li1": "Auditorías de preparación en IA y hojas de ruta",
      "services.ai.li2": "Diseño e implementación de agentes a medida",
      "services.ai.li3": "Claude, OpenAI, modelos de código abierto",
      "services.ai.li4": "Skills, plugins, servidores MCP",
      "services.ai.li5": "Capacitación y adopción del equipo",
      "services.ai.li6": "Operación continua y ajuste",

      "work.eyebrow": "Trabajo seleccionado",
      "work.h2": "Productos que hemos construido.<br />Lecciones que traemos al <em>tuyo</em>.",
      "work.lede": "Dos están en vivo hoy; dos están en desarrollo. Mismo equipo, mismo stack, en cualquier caso.",
      "work.appt.alt": "Panel en vivo de Appt Helper mostrando citas de Global Entry y SENTRI siendo tomadas en tiempo real",
      "work.appt.title": "Los espacios de Global Entry y SENTRI desaparecen en minutos. Construimos la alerta que los atrapa.",
      "work.appt.desc": "Un servicio de monitoreo para consumidores que vigila los 184 centros de inscripción Trusted Traveler de EE. UU. las 24 horas y avisa por mensaje de texto en el instante en que se libera una cancelación &mdash; convirtiendo una espera de 4 a 11 meses en días.",
      "work.visit": "Visitar",
      "work.opencita.alt": "Panel en vivo de Open Cita, la versión en español de Appt Helper, mostrando citas siendo tomadas",
      "work.opencita.title": "El mismo motor de alertas, reconstruido en español para los viajeros que faltaban.",
      "work.opencita.desc": "Open Cita es el espejo en español de Appt Helper &mdash; el mismo monitoreo 24/7 y alertas SMS instantáneas, completamente localizado para viajeros de habla hispana que buscan Global Entry, SENTRI y NEXUS.",
      "work.border.alt": "Página de Border Bills: paga servicios de México al instante, deja de manejar a Tijuana",
      "work.border.title": "Paga servicios mexicanos desde EE. UU. — sin cruzar la frontera.",
      "work.border.desc": "Una app de pagos para familias en EE. UU. que pagan CFE (electricidad), Telmex / Izzi (internet), agua y predial &mdash; en segundos, en lugar de cruzar la frontera o enviar efectivo.",
      "work.casestudy": "Caso de estudio",
      "work.baja.title": "Turismo médico, hecho navegable.",
      "work.baja.desc": "Una plataforma de descubrimiento y admisión de pacientes que conecta a pacientes de EE. UU. con proveedores verificados en Baja California &mdash; convirtiendo grupos de Facebook y el boca a boca en una experiencia guiada y transparente.",
      "work.baja.watch": "Mantente al pendiente",
      "work.comingsoon": "Captura de pantalla próximamente",

      "how.eyebrow": "Cómo trabajamos",
      "how.h2": "Te encontramos <em>donde</em> estés.",
      "how.lede": "Cada proyecto se estructura alrededor de tu realidad &mdash; no de una plantilla. Elige lo que encaje, o te ayudamos a decidir.",
      "how.bestfor.label": "Ideal para",
      "how.length.label": "Duración típica",
      "how.1.title": "Proyecto de alcance fijo",
      "how.1.body": "Para un entregable definido y con un límite claro &mdash; un MVP, un rediseño, una integración de IA. Delimitamos el alcance con precisión, entregamos en una fecha y hacemos un traspaso limpio.",
      "how.1.bestfor": "ideas validadas · lanzamientos planeados",
      "how.1.length": "4 – 16 semanas",
      "how.2.title": "Retainer mensual",
      "how.2.body": "Para equipos que necesitan capacidad continua de ingeniería senior u operaciones de IA. Costo predecible, alcance flexible, sin la carga de contratar.",
      "how.2.bestfor": "startups en crecimiento · CTO fraccional",
      "how.2.length": "3+ meses, mes a mes",
      "how.3.title": "Sprint de estrategia",
      "how.3.body": "Una inmersión de una a dos semanas: auditoría de preparación en IA, revisión de arquitectura, o sprint de diseño de agentes. Terminas con una hoja de ruta que tu equipo puede ejecutar &mdash; con o sin nosotros.",
      "how.3.bestfor": "&ldquo;sabemos que necesitamos esto&hellip;&rdquo;",
      "how.3.length": "1 – 2 semanas, precio fijo",
      "how.4.title": "Sociedad / participación accionaria",
      "how.4.body": "Para fundadores que buscan un socio técnico a largo plazo. Invertimos tiempo de ingeniería a cambio de participación accionaria o de ingresos, con una estructura que protege a ambas partes.",
      "how.4.bestfor": "etapa temprana con un mercado creíble",
      "how.4.length": "12+ meses",

      "about.eyebrow": "Nosotros",
      "about.h2": "Un equipo pequeño de personas que construyen, liderado por un ingeniero que ha estado en <em>ambos</em> lados de la mesa.",
      "about.lede": "Empezamos lanzando nuestros propios productos para saber de qué hablábamos cuando empezáramos a lanzar los tuyos.",
      "about.p1": "Technology Consultants fue fundada por <strong>Roberto Guido</strong> &mdash; ingeniero eléctrico (UC San Diego) con un MBA de NYU Stern que ha dedicado su carrera a cerrar la brecha entre lo técnicamente posible y lo que realmente mueve un negocio. Lidera un equipo enfocado de ingenieros y diseñadores senior que han lanzado productos juntos durante años.",
      "about.p2": "Ese puente funciona en ambas direcciones: ha trabajado en el diseño de hardware y software del sistema de IA de voz en Encounter&nbsp;AI, una plataforma de pedidos para drive-thru y kioscos respaldada por inversionistas como Morgan Stanley Inclusive Ventures Lab, y es residente 2024 del programa de Residencia Técnica en IA o Ciberseguridad (TRAC) de Colorwave &mdash; una beca competitiva, que acepta aproximadamente al 10% de los solicitantes, que coloca a tecnólogos emergentes en trabajo real de inteligencia artificial y ciberseguridad.",
      "about.p3": "Empezamos construyendo nuestros propios productos &mdash; Appt&nbsp;Helper, Open&nbsp;Cita, Border&nbsp;Bills y Baja&nbsp;Care &mdash; porque queríamos probar que la arquitectura, el equipo y el modelo de operación funcionaban antes de vendérselo a clientes.",
      "about.p4": "Ese portafolio es ahora la base de nuestra práctica de consultoría. Cada recomendación que hacemos ha sido probada contra usuarios reales y casos límite reales &mdash; no solo presentaciones.",
      "about.card.role": "Fundador · Ing. Eléctrico, UC San Diego · MBA, NYU Stern",
      "about.card.practice.label": "Práctica",
      "about.card.practice.value": "Aplicaciones web y agentes de IA",
      "about.card.residency.label": "Residencia",
      "about.card.residency.value": "AI TRAC, 2024",
      "about.card.based.label": "Ubicación",
      "about.card.languages.label": "Idiomas",
      "about.card.languages.value": "Inglés · Español",
      "about.card.opento.label": "Disponible para",
      "about.card.opento.value": "Pequeñas empresas · startups · empresas medianas",

      "contact.eyebrow": "Siguiente paso",
      "contact.h2": "Cuéntanos qué estás tratando de construir.",
      "contact.lede": "Una llamada de 30 minutos no cuesta nada y normalmente te deja con al menos una idea concreta &mdash; trabajemos juntos o no.",
      "contact.cta": "Escríbenos para agendar una llamada",
      "contact.meta": "contact@technologyconsultants.ventures · Respuesta típica en 24 hrs · L – V",
      "contact.mailtoSubject": "Llamada%20de%20estrategia",

      "footer.tagline": "Una consultoría dirigida por quienes construyen software real. Diseñamos, construimos y operamos aplicaciones web en React y agentes de IA.",
      "footer.services.h5": "Servicios",
      "footer.services.web": "Desarrollo web",
      "footer.services.ai": "Consultoría en agentes de IA",
      "footer.services.engagement": "Modelos de colaboración",
      "footer.work.h5": "Nuestro trabajo",
      "footer.company.h5": "Empresa",
      "footer.company.about": "Nosotros",
      "footer.company.contact": "Contacto",
      "footer.company.email": "Escríbenos",
      "footer.copyright": "&copy; 2026 Technology Consultants. Todos los derechos reservados.",
      "footer.version": "v2026.05 · hecho por quienes construyen",
    },
  };

  var TOGGLE_LABEL = { en: "ES · Español", es: "EN · English" };

  function getInitialLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
    return navigator.language && navigator.language.toLowerCase().indexOf("es") === 0 ? "es" : "en";
  }

  function applyLang(lang) {
    var dict = DICT[lang];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (dict[key] !== undefined) el.setAttribute("alt", dict[key]);
    });

    var descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll("[data-mailto-cta]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var base = href.split("?")[0];
      a.setAttribute("href", base + "?subject=" + dict["contact.mailtoSubject"]);
    });

    var toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) toggle.textContent = TOGGLE_LABEL[lang];
    window.dispatchEvent(new CustomEvent("i18n-update", { detail: { lang: lang } }));
  }

  function init() {
    var lang = getInitialLang();
    applyLang(lang);

    var toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        lang = lang === "en" ? "es" : "en";
        localStorage.setItem(STORAGE_KEY, lang);
        applyLang(lang);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
