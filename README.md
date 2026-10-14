# Demo BHD

Prueba técnica de frontend: aplicación bancaria de demostración construida con **Ionic 9**, **Angular 22** y **Capacitor 8**, a partir de un diseño en Adobe XD.

## Qué hace

- Onboarding de tres pantallas en el primer arranque.
- Inicio de sesión con opción de recordar el usuario.
- "Mis productos": cuentas y tarjetas de crédito del usuario, cargadas de forma progresiva.
- Detalle de producto, con paso de datos entre pantallas.
- Navegación por pestañas y menú lateral, con versión pública y privada.
- Cierre de sesión.

Los cuatro servicios del enunciado (`/sign_in`, `/user`, `/accounts`, `/credit_cards`) están simulados dentro de la propia app.

## Requisitos

- Node.js 22.22, 24.15 o superior (desarrollado con 24.21).
- npm 11.
- Para Android: Android Studio con el SDK (API 36) y un JDK 21.

## Puesta en marcha

```bash
npm install
```

```bash
npm start
```

La app queda en `http://localhost:4200`. Conviene verla con las herramientas de desarrollo en modo móvil a **375 × 812**, el tamaño del diseño.

Credenciales del servicio simulado:

| Campo | Valor |
|---|---|
| Documento de identidad | `00100010321` |
| Contraseña | `1111` |

Cada petición simulada tarda 1, 2 o 3 segundos al azar, para que se aprecien el indicador de carga y la carga progresiva.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build de producción en `www/` |
| `npm run test:ci` | Pruebas unitarias, una sola ejecución |
| `npm run test:coverage` | Pruebas con informe de cobertura |
| `npm test` | Pruebas en modo observación |
| `npm run lint` | ESLint |
| `npm run android:sync` | Build web y copia al proyecto Android |

## Estructura

```
src/app/
  core/        Sin interfaz: modelos, servicios, estado, interceptores, guards, datos simulados
  shared/      Componentes de interfaz reutilizables, animaciones y configuración de presentación
  layout/      Menú lateral
  features/    Una carpeta por pantalla: onboarding, auth/login, tabs, products, product-detail, placeholder
src/theme/     Tokens de diseño (SCSS) y variables de Ionic
android/       Proyecto nativo generado por Capacitor
```

## Decisiones principales

| Tema | Decisión |
|---|---|
| Componentes | Standalone, detección de cambios `OnPush`, estado con signals |
| Formularios | Signal Forms |
| API simulada | Interceptor HTTP activado por `environment.useMocks`. Los servicios usan `HttpClient` contra las rutas reales; pasar a un backend real es cambiar esa opción y `apiUrl` |
| Autenticación | Un interceptor añade el token `Bearer`; otro cierra la sesión ante un 401 |
| Sesión | El token vive solo en memoria. Capacitor Preferences se usa únicamente para datos no sensibles (usuario recordado, onboarding visto) |
| Modelo de productos | Clase abstracta `Product` con `Account` y `CreditCard`; una fábrica crea el modelo según el tipo que envía la API |
| Carga de productos | Cada tipo se pide en paralelo y se pinta al llegar. El orden en pantalla es fijo y no depende de qué servicio responde antes |
| Paso de datos | La URL lleva el tipo y los últimos cuatro dígitos; el producto se obtiene de un store en memoria |
| Estilos | Tokens SCSS como única fuente de valores; medidas en px para igualar el diseño; modo `md` de Ionic en todas las plataformas |
| Transiciones | Las del prototipo: deslizamiento horizontal de 0.3 s entre páginas y fundido entre pestañas |

## Pruebas

165 pruebas unitarias con Vitest.

| Métrica | Cobertura |
|---|---|
| Sentencias | 98.9 % |
| Ramas | 98.2 % |
| Funciones | 96.4 % |
| Líneas | 99.6 % |

## Android

```bash
npm run android:sync
```

```bash
npx cap open android
```

El primer comando genera la web y la copia al proyecto nativo; el segundo lo abre en Android Studio. El proyecto necesita un JDK 21 como *Gradle JDK*.

## Limitaciones conocidas

- **Fuente en Android.** El diseño usa Trebuchet MS, que no viene en Android ni se puede redistribuir. Ahí se usa Roboto, la fuente del sistema, por lo que los anchos de texto difieren del diseño.
- **Ejecución en Android sin verificar.** El APK compila, pero no se ha probado en un emulador ni en un dispositivo.
- **Identificador de producto.** La API del enunciado no entrega un id; el detalle identifica el producto por tipo y últimos cuatro dígitos.
- **Sin backend real.** `useMocks` está activo también en el build de producción.
- **Refresh token.** Se recibe pero no se usa: el enunciado no define un servicio para renovarlo.
- **Icono y pantalla de arranque.** Son los que trae Capacitor por defecto.
