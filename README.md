# 🏋️‍♂️ Web_deporte: Asesorías Deportivas

Web para realizar asesorías deportivas. Una plataforma interactiva diseñada para ofrecer servicios de entrenamiento personal, dietas a medida y seguimiento constante para deportistas de todos los niveles.

Este proyecto ha sido desarrollado aplicando prácticas modernas de diseño web, integrando experiencias visuales en 3D y garantizando la total adaptabilidad a dispositivos móviles. Proyecto creado como parte de la formación en el grado superior de Desarrollo de Aplicaciones Web (DAW).

## ✨ Características Principales

* **Experiencia 3D Interactiva:** Integración de un modelo 3D (hoodie) y fondos generados por partículas matemáticas que reaccionan al scroll del usuario.
* **Animaciones de Scroll (Reveal):** Uso de ScrollTrigger para crear transiciones suaves y aparición de elementos a medida que el usuario explora la página.
* **Diseño 100% Responsive:** Estructura basada en CSS Flexbox y Media Queries, garantizando una visualización perfecta desde monitores de escritorio hasta dispositivos móviles.
* **Semántica y Accesibilidad:** Código HTML5 validado según los estándares de la W3C, con jerarquía correcta de encabezados y atributos accesibles.
* **Cumplimiento Legal (RGPD/LSSI-CE):** Formularios adaptados para la solicitud del consentimiento de privacidad del usuario y maquetación preparada para Aviso Legal, Política de Privacidad y Cookies.

## 🛠️ Tecnologías Utilizadas

* **Frontend Básico:** HTML5, CSS3 (Flexbox, Variables, Media Queries).
* **Gráficos 3D:** Three.js (Renderizado WebGL, carga de modelos GLTF/GLB).
* **Animaciones:** GSAP y ScrollTrigger.
* **Arquitectura:** Código sin dependencias pesadas de frameworks (Vanilla JS) para maximizar el rendimiento.

## 🚀 Instalación y Despliegue

Al ser un proyecto estático (Frontend), no requiere un entorno de servidor complejo ni base de datos para su visualización básica.

1. Clona el repositorio:
   `git clone https://github.com/tu-usuario/Web_deporte.git`
2. Abre la carpeta del proyecto.
3. Debido a las políticas de seguridad de los navegadores (CORS) al cargar modelos 3D externos (`.glb`), es necesario ejecutar el proyecto a través de un servidor local. Puedes usar extensiones como **Live Server** en Visual Studio Code.
4. Abre `inicio.html` en tu navegador.

## 📂 Estructura del Proyecto

* `/img/` - Recursos gráficos, logos, vídeos e imágenes de la web.
* `/models/` - Archivos de modelos 3D (`hoodie-optimizado.glb`).
* `estilos.css` - Hoja de estilos global y diseño responsive.
* `capucha.css` - Estilos específicos para el canvas 3D y el efecto blackout.
* `scroll3D.js` / `scroll3D-hoodie.js` - Lógica de Three.js y GSAP para las animaciones y el renderizado WebGL.
* `inicio.html`, `productos.html`, `quienes.html`, `trabaja.html` - Vistas principales de la aplicación.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT[cite: 16]. 

---
**Autor:** Rafael Vicario Pérez