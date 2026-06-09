# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-dual-ai.spec.ts >> Test dual AI model buttons in PASO 7
- Location: e2e\test-dual-ai.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.isEnabled: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("📋 Preview")')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e7]: D
          - heading "Dashmin" [level=1] [ref=e8]
        - generic [ref=e9]:
          - button [ref=e10] [cursor=pointer]:
            - img [ref=e11]
          - button [ref=e15] [cursor=pointer]:
            - img [ref=e16]
          - button "A Admin" [ref=e20] [cursor=pointer]:
            - generic [ref=e22]: A
            - generic [ref=e23]: Admin
    - complementary [ref=e24]:
      - navigation [ref=e25]:
        - generic [ref=e26]:
          - paragraph [ref=e27]: MENÚ PRINCIPAL
          - generic [ref=e28]:
            - link "Dashboard" [ref=e29] [cursor=pointer]:
              - /url: /dashboard
              - img [ref=e30]
              - generic [ref=e35]: Dashboard
            - link "E-commerce" [ref=e36] [cursor=pointer]:
              - /url: /ecommerce
              - img [ref=e37]
              - generic [ref=e41]: E-commerce
        - generic [ref=e42]:
          - paragraph [ref=e43]: APLICACIONES
          - generic [ref=e44]:
            - link "Correo" [ref=e45] [cursor=pointer]:
              - /url: /apps/mail
              - img [ref=e46]
              - generic [ref=e49]: Correo
            - link "Chat" [ref=e50] [cursor=pointer]:
              - /url: /apps/chat
              - img [ref=e51]
              - generic [ref=e53]: Chat
            - link "Calendario" [ref=e54] [cursor=pointer]:
              - /url: /apps/calendar
              - img [ref=e55]
              - generic [ref=e57]: Calendario
            - link "Facturas" [ref=e58] [cursor=pointer]:
              - /url: /apps/invoices
              - img [ref=e59]
              - generic [ref=e62]: Facturas
        - generic [ref=e63]:
          - paragraph [ref=e64]: GESTIÓN
          - generic [ref=e65]:
            - link "Clientes" [ref=e66] [cursor=pointer]:
              - /url: /clients
              - img [ref=e67]
              - generic [ref=e72]: Clientes
            - link "Generador" [ref=e73] [cursor=pointer]:
              - /url: /generators
              - img [ref=e74]
              - generic [ref=e76]: Generador
            - link "Analítica" [ref=e77] [cursor=pointer]:
              - /url: /analytics
              - img [ref=e78]
              - generic [ref=e80]: Analítica
        - generic [ref=e81]:
          - paragraph [ref=e82]: HERRAMIENTAS
          - generic [ref=e83]:
            - link "Contenidos" [ref=e84] [cursor=pointer]:
              - /url: /contenidos
              - img [ref=e85]
              - generic [ref=e90]: Contenidos
            - link "Integraciones" [ref=e91] [cursor=pointer]:
              - /url: /integraciones
              - img [ref=e92]
              - generic [ref=e94]: Integraciones
        - generic [ref=e95]:
          - paragraph [ref=e96]: SISTEMA
          - generic [ref=e97]:
            - link "Configuración" [ref=e98] [cursor=pointer]:
              - /url: /settings
              - img [ref=e99]
              - generic [ref=e102]: Configuración
            - link "Ayuda" [ref=e103] [cursor=pointer]:
              - /url: /help
              - img [ref=e104]
              - generic [ref=e107]: Ayuda
    - main [ref=e108]:
      - generic [ref=e109]:
        - generic [ref=e111]:
          - generic [ref=e112]:
            - generic [ref=e113]:
              - generic [ref=e114]:
                - img [ref=e116]
                - generic [ref=e121]:
                  - heading "Seleccionar Cliente" [level=3] [ref=e122]
                  - paragraph [ref=e123]: Datos e información del cliente
              - generic [ref=e124]:
                - combobox [ref=e125] [cursor=pointer]:
                  - option "-- Selecciona cliente --"
                  - option "Tech Innovations Inc" [selected]
                  - option "Marketing Pro Agency"
                  - option "E-Commerce Masters"
                  - option "Health & Wellness Co"
                - img
              - button [ref=e126] [cursor=pointer]:
                - img [ref=e127]
            - generic [ref=e130]:
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - paragraph [ref=e133]:
                    - img [ref=e134]
                    - text: Tipo de Negocio
                  - paragraph [ref=e138]: No especificado
                - generic [ref=e139]:
                  - paragraph [ref=e140]:
                    - img [ref=e141]
                    - text: Sitio Web
                  - paragraph [ref=e144]: No configurado
                - generic [ref=e145]:
                  - paragraph [ref=e146]:
                    - img [ref=e147]
                    - text: Tono Defecto
                  - paragraph [ref=e149]: professional
                - generic [ref=e150]:
                  - paragraph [ref=e151]:
                    - img [ref=e152]
                    - text: Idioma
                  - paragraph [ref=e156]: Español
              - generic [ref=e157]:
                - paragraph [ref=e158]:
                  - img [ref=e159]
                  - text: Canales Activos
                - generic [ref=e165]:
                  - generic [ref=e166]: 📝 Blog
                  - generic [ref=e167]: 📧 Email
                  - generic [ref=e168]: 💼 LinkedIn
          - generic [ref=e169]:
            - generic [ref=e170]:
              - 'button "Plan Generator Inteligente Cliente: Tech Innovations Inc" [ref=e171] [cursor=pointer]':
                - generic [ref=e172]:
                  - img [ref=e173]
                  - generic [ref=e175]:
                    - heading "Plan Generator Inteligente" [level=3] [ref=e176]
                    - paragraph [ref=e177]: "Cliente: Tech Innovations Inc"
                - img [ref=e178]
              - generic [ref=e180]:
                - generic [ref=e181]:
                  - generic [ref=e182]:
                    - generic [ref=e183]: "1"
                    - generic [ref=e184]: 🗝️ Investigación Semántica
                  - generic [ref=e185]:
                    - 'button "🏗️ Nivel 1: Keywords de Entidad y Core" [ref=e187] [cursor=pointer]':
                      - generic [ref=e188]:
                        - generic [ref=e189]: 🏗️
                        - generic [ref=e190]: "Nivel 1: Keywords de Entidad y Core"
                      - img [ref=e191]
                    - 'button "🗺️ Nivel 2: Keywords de Segmentación" [ref=e194] [cursor=pointer]':
                      - generic [ref=e195]:
                        - generic [ref=e196]: 🗺️
                        - generic [ref=e197]: "Nivel 2: Keywords de Segmentación"
                      - img [ref=e198]
                    - 'button "🎓 Nivel 3: Keywords Informacionales y Editoriales" [ref=e201] [cursor=pointer]':
                      - generic [ref=e202]:
                        - generic [ref=e203]: 🎓
                        - generic [ref=e204]: "Nivel 3: Keywords Informacionales y Editoriales"
                      - img [ref=e205]
                    - 'button "⚖️ Nivel 4: Keywords de Investigación Comercial" [ref=e208] [cursor=pointer]':
                      - generic [ref=e209]:
                        - generic [ref=e210]: ⚖️
                        - generic [ref=e211]: "Nivel 4: Keywords de Investigación Comercial"
                      - img [ref=e212]
                    - 'button "🚫 Nivel 6: Exclusiones y Restricciones" [ref=e215] [cursor=pointer]':
                      - generic [ref=e216]:
                        - generic [ref=e217]: 🚫
                        - generic [ref=e218]: "Nivel 6: Exclusiones y Restricciones"
                      - img [ref=e219]
                - generic [ref=e221]:
                  - generic [ref=e222]:
                    - generic [ref=e223]: "2"
                    - generic [ref=e224]: Refina
                  - generic [ref=e225]:
                    - paragraph [ref=e226]: Agregado en esta sesión
                    - generic [ref=e228]:
                      - generic [ref=e229]: AI
                      - button "✕" [ref=e230] [cursor=pointer]
                  - generic [ref=e231]:
                    - generic [ref=e232]: ➕ Agregar Keyword Personalizado
                    - textbox "Escribe una keyword personalizada..." [ref=e233]
                    - button "Agregar" [ref=e234] [cursor=pointer]
            - generic [ref=e235]:
              - button "2 Estrategia, Tono y Enfoque (Personalidad)" [ref=e236] [cursor=pointer]:
                - generic [ref=e237]:
                  - generic [ref=e238]: "2"
                  - heading "Estrategia, Tono y Enfoque (Personalidad)" [level=3] [ref=e239]
                - img [ref=e240]
              - generic [ref=e242]:
                - generic [ref=e243]:
                  - generic [ref=e244]:
                    - text: 👥 Público Objetivo
                    - generic [ref=e245]: "*"
                  - generic [ref=e246]:
                    - button "CTO/VP Technology Responsable de decisiones tecnológicas estratégicas y evaluación de soluciones empresariales" [ref=e247] [cursor=pointer]:
                      - generic [ref=e250]:
                        - paragraph [ref=e251]: CTO/VP Technology
                        - paragraph [ref=e252]: Responsable de decisiones tecnológicas estratégicas y evaluación de soluciones empresariales
                    - button "DevOps Engineer Busca herramientas de automatización, infraestructura y mejora continua de procesos" [ref=e253] [cursor=pointer]:
                      - generic [ref=e256]:
                        - paragraph [ref=e257]: DevOps Engineer
                        - paragraph [ref=e258]: Busca herramientas de automatización, infraestructura y mejora continua de procesos
                    - button "Product Manager Enfocado en features, roadmap y cómo las soluciones impactan el producto" [ref=e259] [cursor=pointer]:
                      - generic [ref=e262]:
                        - paragraph [ref=e263]: Product Manager
                        - paragraph [ref=e264]: Enfocado en features, roadmap y cómo las soluciones impactan el producto
                    - button "IT Director Gestor de presupuestos, compliance y alineación con objetivos corporativos" [ref=e265] [cursor=pointer]:
                      - generic [ref=e268]:
                        - paragraph [ref=e269]: IT Director
                        - paragraph [ref=e270]: Gestor de presupuestos, compliance y alineación con objetivos corporativos
                - generic [ref=e271]:
                  - generic [ref=e272]:
                    - text: 📍 Intención de Contenidos
                    - generic [ref=e273]: "*"
                  - generic [ref=e274]:
                    - button "Educativo Informativo" [ref=e275] [cursor=pointer]:
                      - generic [ref=e278]:
                        - paragraph [ref=e279]: Educativo
                        - paragraph [ref=e280]: Informativo
                    - button "Transaccional Venta" [ref=e281] [cursor=pointer]:
                      - generic [ref=e284]:
                        - paragraph [ref=e285]: Transaccional
                        - paragraph [ref=e286]: Venta
                    - button "Prueba Social Caso de Éxito" [ref=e287] [cursor=pointer]:
                      - generic [ref=e290]:
                        - paragraph [ref=e291]: Prueba Social
                        - paragraph [ref=e292]: Caso de Éxito
                    - button "Liderazgo Opinión" [ref=e293] [cursor=pointer]:
                      - generic [ref=e296]:
                        - paragraph [ref=e297]: Liderazgo
                        - paragraph [ref=e298]: Opinión
                - generic [ref=e299]:
                  - generic [ref=e300]:
                    - text: 🎤 Tono de Contenido
                    - generic [ref=e301]: "*"
                  - generic [ref=e302]:
                    - generic [ref=e303]:
                      - button "🏢 Professional Corporativo, formal, autoridad institucional" [ref=e304] [cursor=pointer]:
                        - generic [ref=e307]:
                          - paragraph [ref=e308]: 🏢 Professional
                          - paragraph [ref=e309]: Corporativo, formal, autoridad institucional
                      - button "🤝 Friendly Blog, newsletters, redes sociales" [active] [ref=e310] [cursor=pointer]:
                        - generic [ref=e313]:
                          - paragraph [ref=e314]: 🤝 Friendly
                          - paragraph [ref=e315]: Blog, newsletters, redes sociales
                      - button "🛠️ Technical Fichas técnicas, manuales, FAQs" [ref=e316] [cursor=pointer]:
                        - generic [ref=e319]:
                          - paragraph [ref=e320]: 🛠️ Technical
                          - paragraph [ref=e321]: Fichas técnicas, manuales, FAQs
                      - button "🎛️ Custom / Hybrid Tonos personalizados cruzados" [ref=e322] [cursor=pointer]:
                        - generic [ref=e325]:
                          - paragraph [ref=e326]: 🎛️ Custom / Hybrid
                          - paragraph [ref=e327]: Tonos personalizados cruzados
                    - generic [ref=e328]:
                      - button "🤝 Casual & Approachable Tono conversacional, accesible y cercano 💬 Tono amigable 💬 conversacional 💬 accesible" [ref=e329] [cursor=pointer]:
                        - generic [ref=e332]:
                          - paragraph [ref=e333]: 🤝 Casual & Approachable
                          - paragraph [ref=e334]: Tono conversacional, accesible y cercano
                          - generic [ref=e335]:
                            - generic [ref=e336]: 💬 Tono amigable
                            - generic [ref=e337]: 💬 conversacional
                            - generic [ref=e338]: 💬 accesible
                      - button "✨ Inspirational & Motivating Energizante, positivo, empoderante 💬 Tono inspirador 💬 motivador 💬 positivo" [ref=e339] [cursor=pointer]:
                        - generic [ref=e342]:
                          - paragraph [ref=e343]: ✨ Inspirational & Motivating
                          - paragraph [ref=e344]: Energizante, positivo, empoderante
                          - generic [ref=e345]:
                            - generic [ref=e346]: 💬 Tono inspirador
                            - generic [ref=e347]: 💬 motivador
                            - generic [ref=e348]: 💬 positivo
                      - button "📚 Educational & Helpful Educativo pero accesible, guía paso a paso 💬 Tono educativo 💬 ayuda 💬 guía práctica" [ref=e349] [cursor=pointer]:
                        - generic [ref=e352]:
                          - paragraph [ref=e353]: 📚 Educational & Helpful
                          - paragraph [ref=e354]: Educativo pero accesible, guía paso a paso
                          - generic [ref=e355]:
                            - generic [ref=e356]: 💬 Tono educativo
                            - generic [ref=e357]: 💬 ayuda
                            - generic [ref=e358]: 💬 guía práctica
        - generic [ref=e359]:
          - 'button "6 ⚠️ Completa: Público Objetivo (PASO 2)" [disabled] [ref=e360]':
            - generic [ref=e361]: "6"
            - text: "⚠️ Completa: Público Objetivo (PASO 2)"
          - paragraph [ref=e362]: "Faltan: Público Objetivo (PASO 2), Intención de Contenido (PASO 2), Tono (PASO 2), H1 Título (PASO 4), Al menos un Formato (PASO 5)"
  - button "Open Next.js Dev Tools" [ref=e368] [cursor=pointer]:
    - img [ref=e369]
  - alert [ref=e372]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Test dual AI model buttons in PASO 7', async ({ page }) => {
  4  |   // Navigate to generators page
  5  |   await page.goto('http://localhost:3003/generators');
  6  |   await page.waitForLoadState('networkidle');
  7  | 
  8  |   // Wait for page to be ready
  9  |   await page.waitForSelector('text=Plan Generator Inteligente', { timeout: 5000 });
  10 | 
  11 |   // Select first client (if available)
  12 |   const clientButtons = await page.locator('button:has-text("Seleccionar cliente")').first();
  13 |   if (await clientButtons.isVisible()) {
  14 |     await clientButtons.click();
  15 |     const firstClient = await page.locator('button:has-text(/Esgarden|XANELUM|[A-Z]/)').first();
  16 |     if (await firstClient.isVisible()) {
  17 |       await firstClient.click();
  18 |       await page.waitForTimeout(500);
  19 |     }
  20 |   }
  21 | 
  22 |   // Fill required PASO 2 fields
  23 |   // Público Objetivo
  24 |   const audienceInput = await page.locator('input[placeholder*="Público"]').first();
  25 |   if (await audienceInput.isVisible()) {
  26 |     await audienceInput.fill('Propietarios de negocios');
  27 |     await page.waitForTimeout(300);
  28 |   }
  29 | 
  30 |   // Select Content Intent
  31 |   try {
  32 |     const intentBtn = page.locator('button:has-text("Educacional")').first();
  33 |     await intentBtn.click({ timeout: 2000 });
  34 |     await page.waitForTimeout(300);
  35 |   } catch (e) {
  36 |     console.log('Intent button not found, continuing...');
  37 |   }
  38 | 
  39 |   // Select Tone
  40 |   try {
  41 |     const toneBtn = page.locator('button:has-text("Profesional")').first();
  42 |     await toneBtn.click({ timeout: 2000 });
  43 |     await page.waitForTimeout(300);
  44 |   } catch (e) {
  45 |     console.log('Tone button not found, continuing...');
  46 |   }
  47 | 
  48 |   // Fill H1 Title (PASO 4)
  49 |   const h1Input = await page.locator('input[placeholder*="H1"]').first();
  50 |   if (await h1Input.isVisible()) {
  51 |     await h1Input.fill('Guía Completa de Marketing');
  52 |     await page.waitForTimeout(300);
  53 |   }
  54 | 
  55 |   // Select at least one format (PASO 5)
  56 |   try {
  57 |     const formatBtn = page.locator('button:has-text("Blog")').first();
  58 |     await formatBtn.click({ timeout: 2000 });
  59 |     await page.waitForTimeout(300);
  60 |   } catch (e) {
  61 |     console.log('Format button not found, continuing...');
  62 |   }
  63 | 
  64 |   // Click Preview button
  65 |   const previewBtn = await page.locator('button:has-text("📋 Preview")');
> 66 |   if (await previewBtn.isEnabled()) {
     |                        ^ Error: locator.isEnabled: Test timeout of 30000ms exceeded.
  67 |     await previewBtn.click();
  68 |     await page.waitForTimeout(1000);
  69 | 
  70 |     // Wait for preview modal
  71 |     await page.waitForSelector('text=Preview - Prompt a IA', { timeout: 5000 });
  72 | 
  73 |     // Check for dual AI buttons
  74 |     const claudeBtn = await page.locator('button:has-text("✨ Claude AI")');
  75 |     const geminiBtn = await page.locator('button:has-text("✨ Gemini AI")');
  76 | 
  77 |     console.log('✅ Preview modal opened');
  78 |     console.log(`Claude AI button visible: ${await claudeBtn.isVisible()}`);
  79 |     console.log(`Gemini AI button visible: ${await geminiBtn.isVisible()}`);
  80 | 
  81 |     // Take screenshot
  82 |     await page.screenshot({ path: 'test-screenshot-dual-ai.png' });
  83 |     console.log('📸 Screenshot saved: test-screenshot-dual-ai.png');
  84 | 
  85 |     // Verify both buttons exist
  86 |     expect(claudeBtn).toBeVisible();
  87 |     expect(geminiBtn).toBeVisible();
  88 | 
  89 |     console.log('✅ Both AI model buttons are present and visible!');
  90 |   } else {
  91 |     console.log('⚠️ Preview button not enabled - checking missing fields');
  92 |   }
  93 | });
  94 | 
```