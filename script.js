<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#2563eb">
    <title>IntegraStep - Calculadora Educativa</title>

    <!-- KaTeX CSS para renderizado matemático -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    
    <!-- Nerdamer (Motor Matemático) -->
    <script src="https://cdn.jsdelivr.net/npm/nerdamer@1.1.13/nerdamer.core.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/nerdamer@1.1.13/Algebra.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/nerdamer@1.1.13/Calculus.js"></script>
    
    <!-- KaTeX JS -->
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>

    <style>
        :root {
            --bg-color: #f8fafc;
            --surface: #ffffff;
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --keyboard-bg: #cbd5e1;
            --key-bg: #ffffff;
            --key-text: #0f172a;
            --success: #10b981;
            --error: #ef4444;
        }

        [data-theme="dark"] {
            --bg-color: #0f172a;
            --surface: #1e293b;
            --primary: #3b82f6;
            --primary-hover: #60a5fa;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: #334155;
            --keyboard-bg: #0f172a;
            --key-bg: #334155;
            --key-text: #f8fafc;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            transition: background-color 0.3s, color 0.3s;
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
        }

        header {
            background-color: var(--surface);
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 10;
        }

        .menu-btn, .theme-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-main);
            cursor: pointer;
        }

        h1 { font-size: 1.25rem; font-weight: 600; color: var(--primary); }

        .app-container {
            display: flex;
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .sidebar {
            position: absolute;
            left: -100%;
            top: 0;
            bottom: 0;
            width: 250px;
            background-color: var(--surface);
            border-right: 1px solid var(--border);
            transition: left 0.3s ease;
            z-index: 20;
            overflow-y: auto;
        }

        .sidebar.open { left: 0; }

        .menu-item {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            transition: background 0.2s;
        }

        .menu-item:hover, .menu-item.active {
            background-color: var(--primary);
            color: white;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            overflow-y: auto;
            width: 100%;
        }

        /* Campos de Entrada Mejorados */
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .native-input {
            width: 100%;
            padding: 1rem;
            font-size: 1.2rem;
            border: 2px solid var(--border);
            border-radius: 8px;
            background-color: var(--surface);
            color: var(--text-main);
            outline: none;
            transition: border-color 0.2s;
            font-family: monospace;
        }

        .native-input:focus {
            border-color: var(--primary);
        }

        .math-display {
            background-color: var(--surface);
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            font-size: 1.5rem;
            min-height: 80px;
            border: 1px dashed var(--border);
            overflow-x: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .controls {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        button.action-btn {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            color: white;
            transition: opacity 0.2s;
        }

        .btn-solve { background-color: var(--primary); }
        .btn-clear { background-color: var(--error); }
        .btn-pdf { background-color: var(--success); }

        .virtual-keyboard {
            background-color: var(--keyboard-bg);
            padding: 0.5rem;
            border-radius: 12px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .key {
            background-color: var(--key-bg);
            color: var(--key-text);
            border: 1px solid var(--border);
            padding: 0.75rem 0;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            user-select: none;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .key:active { transform: scale(0.95); }
        .key.action { background-color: var(--border); }
        .key.del { background-color: #fca5a5; color: #7f1d1d; border-color: #f87171; }

        .results-area {
            background-color: var(--surface);
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1rem;
            display: none;
            border: 1px solid var(--border);
        }

        .step-box {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px dashed var(--border);
        }

        .step-text {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .step-math {
            font-size: 1.2rem;
            overflow-x: auto;
        }

        .overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: none;
            z-index: 15;
        }
        .overlay.show { display: block; }

        @media print {
            .sidebar, .virtual-keyboard, .controls, header, .native-input { display: none !important; }
            .results-area { display: block !important; border: none; }
            body { background: white; color: black; }
        }
    </style>
</head>
<body>

    <header>
        <button class="menu-btn" onclick="toggleMenu()">☰</button>
        <h1 id="module-title">Integral Algebraica</h1>
        <button class="theme-btn" onclick="toggleTheme()">🌓</button>
    </header>

    <div class="app-container">
        <div class="overlay" onclick="toggleMenu()"></div>

        <!-- Menú Lateral -->
        <div class="sidebar" id="sidebar">
            <div class="menu-item" onclick="setModule('definida', 'Integral Definida')">Integral Definida</div>
            <div class="menu-item active" onclick="setModule('algebraica', 'Integral Algebraica')">Integral Algebraica</div>
            <div class="menu-item" onclick="setModule('seno', 'Integral de Seno')">Integral de Seno</div>
            <div class="menu-item" onclick="setModule('coseno', 'Integral de Coseno')">Integral de Coseno</div>
            <div class="menu-item" onclick="setModule('tangente', 'Integral de Tangente')">Integral de Tangente</div>
            <div class="menu-item" onclick="setModule('logaritmo', 'Integral de Logaritmo')">Integral Logarítmica</div>
            <div class="menu-item" onclick="setModule('exponencial', 'Integral Exponencial')">Integral Exponencial</div>
            <div class="menu-item" onclick="setModule('sustitucion', 'Integral por Sustitución')">Por Sustitución</div>
            <div class="menu-item" onclick="setModule('partes', 'Integral por Partes')">Por Partes</div>
            <div class="menu-item" onclick="setModule('fracciones', 'Fracciones Parciales')">Fracciones Parciales</div>
        </div>

        <div class="main-content">
            
            <!-- Zona de Entrada (Teclado Físico + Visualización) -->
            <div class="input-group">
                <input type="text" id="math-input" class="native-input" placeholder="Escribe tu integral (Ej: 2x^2 + sin(x))" autocomplete="off" autocorrect="off" spellcheck="false">
                <div class="math-display" id="math-display">
                    <span id="katex-render"></span>
                </div>
            </div>

            <!-- Botones de Acción -->
            <div class="controls">
                <button class="action-btn btn-clear" onclick="clearInput()">Limpiar</button>
                <button class="action-btn btn-solve" onclick="solve()">Resolver</button>
                <button class="action-btn btn-pdf" onclick="window.print()">Exportar PDF</button>
            </div>

            <!-- Teclado Virtual Complementario -->
            <div class="virtual-keyboard">
                <div class="key action" onclick="insert('sin(')">sin</div>
                <div class="key action" onclick="insert('cos(')">cos</div>
                <div class="key action" onclick="insert('tan(')">tan</div>
                <div class="key action" onclick="insert('log(')">ln</div>
                <div class="key action" onclick="insert('e^')">eˣ</div>
                <div class="key action" onclick="insert('pi')">π</div>
                
                <div class="key" onclick="insert('7')">7</div>
                <div class="key" onclick="insert('8')">8</div>
                <div class="key" onclick="insert('9')">9</div>
                <div class="key action" onclick="insert('(')">(</div>
                <div class="key action" onclick="insert(')')">)</div>
                <div class="key del" onclick="insert('del')">⌫</div>

                <div class="key" onclick="insert('4')">4</div>
                <div class="key" onclick="insert('5')">5</div>
                <div class="key" onclick="insert('6')">6</div>
                <div class="key action" onclick="insert('*')">×</div>
                <div class="key action" onclick="insert('/')">÷</div>
                <div class="key" style="color:var(--primary); font-weight:bold;" onclick="insert('x')">x</div>

                <div class="key" onclick="insert('1')">1</div>
                <div class="key" onclick="insert('2')">2</div>
                <div class="key" onclick="insert('3')">3</div>
                <div class="key action" onclick="insert('+')">+</div>
                <div class="key action" onclick="insert('-')">-</div>
                <div class="key" style="color:var(--primary); font-weight:bold;" onclick="insert('y')">y</div>

                <div class="key" onclick="insert('0')">0</div>
                <div class="key" onclick="insert('.')">.</div>
                <div class="key action" onclick="insert('^')">^</div>
                <div class="key" style="color:var(--primary); font-weight:bold;" onclick="insert('u')">u</div>
                <div class="key" style="color:var(--primary); font-weight:bold;" onclick="insert('v')">v</div>
                <div class="key action" onclick="insert('sqrt(')">√</div>
            </div>

            <!-- Área de Resultados -->
            <div class="results-area" id="results-area">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">Desarrollo de la Integral</h3>
                <div id="steps-container"></div>
            </div>

        </div>
    </div>

    <script>
        let currentModule = "algebraica";
        const inputField = document.getElementById('math-input');

        document.addEventListener('DOMContentLoaded', () => {
            if(localStorage.getItem('theme') === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
            }
            renderMath();

            // Escuchar el teclado físico
            inputField.addEventListener('input', () => {
                renderMath();
            });
        });

        function toggleTheme() {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if(isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        }

        function toggleMenu() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.overlay');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        }

        function setModule(modId, modName) {
            currentModule = modId;
            document.getElementById('module-title').innerText = modName;
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
            event.target.classList.add('active');
            clearInput();
            toggleMenu();
        }

        function insert(val) {
            inputField.focus();
            let start = inputField.selectionStart;
            let end = inputField.selectionEnd;
            let currentVal = inputField.value;

            if (val === 'del') {
                if (start === end && start > 0) {
                    inputField.value = currentVal.substring(0, start - 1) + currentVal.substring(end);
                    inputField.setSelectionRange(start - 1, start - 1);
                } else if (start !== end) {
                    inputField.value = currentVal.substring(0, start) + currentVal.substring(end);
                    inputField.setSelectionRange(start, start);
                }
            } else {
                inputField.value = currentVal.substring(0, start) + val + currentVal.substring(end);
                let newPos = start + val.length;
                inputField.setSelectionRange(newPos, newPos);
            }
            renderMath();
        }

        function clearInput() {
            inputField.value = "";
            document.getElementById('results-area').style.display = 'none';
            renderMath();
            inputField.focus();
        }

        function renderMath() {
            const display = document.getElementById('katex-render');
            let expr = inputField.value;
            let tex = "\\int ";
            
            if (expr.trim() === "") {
                tex += "...";
            } else {
                try {
                    tex += nerdamer.convertToLaTeX(expr);
                } catch (e) {
                    let rawRender = expr
                        .replace(/\*/g, '\\cdot ')
                        .replace(/sin\(/g, '\\sin(')
                        .replace(/cos\(/g, '\\cos(')
                        .replace(/tan\(/g, '\\tan(')
                        .replace(/log\(/g, '\\ln(');
                    tex += rawRender; 
                }
            }
            tex += " \\, dx";

            try {
                katex.render(tex, display, { throwOnError: false, displayMode: true });
            } catch (e) {
                display.innerText = "Calculando sintaxis...";
            }
        }

        function solve() {
            const expr = inputField.value.trim();
            if(!expr) {
                alert("Por favor, ingresa una expresión matemática.");
                inputField.focus();
                return;
            }

            const resultsArea = document.getElementById('results-area');
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = ''; 
            resultsArea.style.display = 'block';

            try {
                generatePedagogicalSteps(expr, stepsContainer);
            } catch (error) {
                stepsContainer.innerHTML = `
                    <div class="step-box">
                        <div class="step-text" style="color: var(--error);">Error en la Expresión</div>
                        <div class="step-text">El motor matemático no pudo procesar esta expresión. Asegúrate de usar notación estándar (ej: usar * para multiplicar variables ambiguas o cerrar bien los paréntesis).</div>
                        <div class="step-text">Detalle: ${error.message}</div>
                    </div>`;
            }
            
            resultsArea.scrollIntoView({ behavior: 'smooth' });
        }

        function addStep(container, text, texMath) {
            const div = document.createElement('div');
            div.className = 'step-box';
            
            const pText = document.createElement('div');
            pText.className = 'step-text';
            pText.innerText = text;
            
            const pMath = document.createElement('div');
            pMath.className = 'step-math';
            katex.render(texMath, pMath, { throwOnError: false, displayMode: true });
            
            div.appendChild(pText);
            div.appendChild(pMath);
            container.appendChild(div);
        }

        function generatePedagogicalSteps(expr, container) {
            let texOriginal;
            try {
                texOriginal = nerdamer.convertToLaTeX(expr);
            } catch(e) {
                texOriginal = expr;
            }
            
            addStep(container, "1. Integral a evaluar:", `\\int ${texOriginal} \\, dx`);

            // Integración simbólica
            let integralResult = nerdamer(`integrate(${expr}, x)`);
            let texResult = nerdamer.convertToLaTeX(integralResult.text());

            // --- CORRECCIÓN AQUÍ: Pasos dinámicos según el módulo en lugar del "Calculando..." estático ---
            if (currentModule === 'algebraica') {
                addStep(container, "2. Aplicamos la regla de la potencia separando términos y sacando las constantes de la integral.", `\\int x^n \\, dx = \\frac{x^{n+1}}{n+1}`);
            } else if (currentModule === 'seno' || currentModule === 'coseno' || currentModule === 'tangente') {
                addStep(container, "2. Aplicamos las propiedades e identidades trigonométricas fundamentales para resolver.", `\\int \\sin(x)dx = -\\cos(x), \\quad \\int \\cos(x)dx = \\sin(x)`);
            } else if (currentModule === 'sustitucion') {
                addStep(container, "2. Detectamos una función compuesta. Se sugiere un cambio de variable 'u'.", `u = f(x) \\quad du = f'(x)dx`);
            } else if (currentModule === 'partes') {
                addStep(container, "2. Aplicamos la integración por partes guiándonos por la regla ILATE.", `\\int u \\, dv = u \\cdot v - \\int v \\, du`);
            } else if (currentModule === 'fracciones') {
                addStep(container, "2. Descomponemos la expresión racional en fracciones parciales más simples.", `\\frac{P(x)}{Q(x)} = \\frac{A}{x-a} + \\frac{B}{x-b}`);
            } else {
                addStep(container, "2. Simplificamos algebraicamente la expresión para aplicar reglas de integración directa.", `\\int f(x) \\, dx`);
            }

            // Paso Final
            addStep(container, "3. Resultado final (Agregando la constante de integración C):", `${texResult} + C`);

            // Verificación Derivando
            let derivada = nerdamer(`diff(${integralResult.text()}, x)`);
            let derivadaSimplificada = nerdamer(derivada.text()).expand();
            
            addStep(container, "VERIFICACIÓN: Derivamos el resultado obtenido para comprobar que obtenemos el integrando original.", `\\frac{d}{dx} \\left[ ${texResult} + C \\right] = ${nerdamer.convertToLaTeX(derivadaSimplificada.text())}`);
        }

        // PWA Offline Support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                const swCode = `
                    self.addEventListener('install', event => self.skipWaiting());
                    self.addEventListener('fetch', event => {
                        event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
                    });
                `;
                const blob = new Blob([swCode], { type: 'application/javascript' });
                const swUrl = URL.createObjectURL(blob);
                navigator.serviceWorker.register(swUrl).catch(() => {});
            });
        }
    </script>
</body>
</html>