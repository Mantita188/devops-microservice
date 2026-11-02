# DevOps Microservice

## Descripción

Microservicio REST desarrollado con Node.js y Express para la asignatura de Ingeniería en DevOps.

En esta segunda etapa se incorporaron Docker y Docker Compose para la contenerización y orquestación del servicio, pruebas automatizadas con Jest y Supertest, análisis de seguridad y automatización CI/CD mediante GitHub Actions.

El proyecto también cuenta con una interfaz web sencilla para visualizar el estado del microservicio y consultar sus funcionalidades principales.

El objetivo es automatizar la validación del código, revisar sus dependencias, construir una imagen Docker y comprobar que la aplicación pueda ejecutarse correctamente en un entorno contenerizado.

## 1. Arquitectura y funcionalidades

El proyecto utiliza Node.js y Express para implementar un microservicio que dispone de los siguientes endpoints:

| Endpoint | Método | Descripción |
|---|---|---|
| `/` | GET | Muestra la interfaz web principal. |
| `/api` | GET | Entrega información del estado del servicio. |
| `/health` | GET | Comprueba la salud del microservicio. |
| `/products` | GET | Obtiene la lista de productos. |
| `/products` | POST | Registra un producto y valida los datos recibidos. |

La interfaz web se encuentra en `src/index.html` y permite visualizar el servicio desde el navegador.

## 2. Estrategia de ramificación

Para gestionar el código fuente se evaluaron diferentes estrategias de control de versiones:

- **Trunk-Based Development:** integración frecuente de cambios en una rama principal.
- **GitHub Flow:** flujo basado en ramas cortas y Pull Requests.
- **GitFlow:** modelo que utiliza ramas como `main`, `develop`, `feature` y `hotfix`.

Se utilizó GitFlow porque permitió separar el desarrollo de las versiones estables del proyecto.

Las principales ramas utilizadas fueron:

- `main`: código estable del proyecto.
- `develop`: integración de nuevas funcionalidades.
- `feature/*`: desarrollo de funcionalidades independientes.
- `hotfix/*`: corrección de errores importantes.

La integración se realizó mediante Pull Requests, simulando un entorno de trabajo colaborativo.

## 3. Trazabilidad del desarrollo

Durante el desarrollo se registraron los cambios mediante commits, ramas y Pull Requests.

Entre las principales funcionalidades incorporadas se encuentran:

- `feature/health-endpoint`: implementación del endpoint GET `/health` y sus pruebas.
- `feature/products-endpoint`: implementación de GET y POST `/products`, con validaciones y pruebas.
- `hotfix/health-response`: incorporación del atributo `environment: production` en la respuesta de salud.
- `feature/ep2-docker`: incorporación de Docker, Docker Compose y mejoras al pipeline CI/CD.

También se utilizaron versiones etiquetadas para identificar las entregas del proyecto.

Esta organización permite mantener un historial de cambios y relacionar las modificaciones del código con sus respectivas versiones.

## 4. Automatización CI/CD con GitHub Actions

El proyecto utiliza dos workflows ubicados en `.github/workflows/`.
### 4.1. Pipeline de integración continua y despliegue de prueba

El archivo `ci.yml` configura un pipeline que se ejecuta cuando se realizan cambios mediante `push` en las ramas `main`, `develop` y `feature/**`. También se ejecuta al crear o actualizar Pull Requests dirigidos hacia `main` o `develop`.

El pipeline realiza las siguientes tareas:

1. Obtiene el código del repositorio.
2. Configura Node.js versión 20.
3. Instala las dependencias mediante `npm ci --ignore-scripts`.
4. Ejecuta las pruebas automatizadas mediante `npm test`.
5. Revisa vulnerabilidades con `npm audit --audit-level=high`.
6. Ejecuta el análisis de seguridad con Snyk cuando está configurado el secreto `SNYK_TOKEN`.
7. Construye la imagen mediante `docker compose build`.
8. Inicia el servicio mediante `docker compose up -d`.
9. Comprueba que el endpoint `/health` responda correctamente.
10. Muestra el estado de los contenedores y limpia el entorno de prueba mediante `docker compose down`.

Si las pruebas, las verificaciones configuradas o la comprobación de salud fallan, el pipeline registra el error y la ejecución no finaliza correctamente.

### 4.2. Publicación de versiones e imágenes Docker

El archivo `release.yml` automatiza la publicación de versiones cuando se genera una etiqueta Git cuyo nombre comienza con `v`.

Este workflow realiza las siguientes tareas:

1. Obtiene el código del repositorio.
2. Configura Docker Buildx.
3. Inicia sesión en GitHub Container Registry (GHCR).
4. Prepara las etiquetas de la imagen Docker.
5. Construye y publica la imagen.
6. Crea una GitHub Release con notas de publicación.

La imagen se publica en:

`ghcr.io/mantita188/devops-microservice`

Se utilizan etiquetas asociadas a la versión y la etiqueta `latest`.

Las acciones externas utilizadas en este workflow están fijadas mediante identificadores SHA para mantener un mayor control sobre las versiones ejecutadas.

### 4.3. Diferencia entre ambos workflows

El workflow `ci.yml` comprueba que los cambios puedan probarse, construirse y ejecutarse correctamente en un entorno de prueba.

Por otro lado, `release.yml` permite publicar una versión identificada y distribuir su imagen Docker mediante GHCR.

De esta manera se mantiene la trazabilidad entre el código fuente, las versiones publicadas y las imágenes generadas.

## 5. Seguridad y revisión de dependencias

Se incorporaron distintas herramientas para revisar la seguridad del proyecto.

### npm audit

Permite identificar vulnerabilidades conocidas en las dependencias de Node.js.

Se utiliza el comando:

`npm audit --audit-level=high`

El pipeline falla cuando se detectan vulnerabilidades que alcanzan el nivel de severidad configurado.

### Snyk

Se incorporó Snyk al pipeline para realizar análisis de seguridad de las dependencias.

Se utiliza el secreto `SNYK_TOKEN` de GitHub Actions, evitando almacenar el token directamente en el repositorio.

El análisis se ejecuta con el parámetro `--severity-threshold=high`. Si el secreto no está configurado, el pipeline muestra una advertencia y omite este paso.

En una ejecución documentada anteriormente, Snyk analizó 66 dependencias y no encontró rutas vulnerables conocidas.

### Dependabot

El archivo `.github/dependabot.yml` configura revisiones semanales para:

- Dependencias de npm.
- Acciones de GitHub Actions.

Esto permite recibir propuestas de actualización cuando existen nuevas versiones disponibles.

### SonarQube Cloud

El repositorio está vinculado a SonarQube Cloud para analizar la calidad y seguridad del código fuente.

El análisis permite identificar problemas de seguridad, mantenibilidad y confiabilidad.

En el último análisis revisado, el Quality Gate obtuvo el resultado **Passed**.

Los resultados de estas herramientas corresponden a sus respectivas ejecuciones y no garantizan la ausencia absoluta de vulnerabilidades.

## 6. Contenerización con Docker

Para contenerizar el microservicio se incorporó un archivo `Dockerfile`.

La imagen utiliza Node.js 20 sobre Alpine Linux como base y configura el entorno de producción.

Entre sus características se encuentran:

- Instalación de dependencias de producción mediante `npm ci --omit=dev`.
- Limpieza de la caché de npm.
- Copia de los archivos necesarios de la aplicación.
- Ejecución mediante el usuario no privilegiado `node`.
- Exposición del puerto 3000.

También se creó `.dockerignore` para excluir archivos innecesarios durante la construcción de la imagen.

### Docker Compose

El archivo `compose.yaml` permite administrar la ejecución del microservicio.

Configura el puerto 3000, las variables de entorno, la política de reinicio y un healthcheck que consulta el endpoint `/health`.

Comandos utilizados:

```bash
# Construir la imagen
docker compose build

# Iniciar el servicio
docker compose up -d

# Revisar el estado del contenedor
docker compose ps

# Revisar los registros
docker compose logs api

# Detener y limpiar el entorno
docker compose down
```

Para comprobar el estado del servicio se puede acceder a:

`http://localhost:3000/health`

También se puede consultar desde PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Durante las pruebas locales el contenedor alcanzó el estado `healthy`.

## 7. Pruebas automatizadas

Se utiliza Jest junto con Supertest para verificar el funcionamiento de los endpoints del microservicio.

Las pruebas comprueban:

- Respuesta correcta de la página principal.
- Respuesta del endpoint `/api`.
- Obtención de productos.
- Registro de productos.
- Validación de solicitudes incompletas.

Para ejecutarlas localmente:

```bash
npm test
```

En la última ejecución local documentada se obtuvieron **5 pruebas aprobadas de 5**.

## 8. Ejecución local

### Requisitos

- Node.js 20.
- npm.
- Git.
- Docker y Docker Compose.

### Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Mantita188/devops-microservice.git
cd devops-microservice
```

Instalar dependencias:

```bash
npm install
```

Ejecutar pruebas:

```bash
npm test
```

Iniciar directamente con Node.js:

```bash
npm start
```

Ejecutar mediante Docker Compose:

```bash
docker compose build
docker compose up -d
```

La aplicación estará disponible en:

`http://localhost:3000`

Para detener el entorno:

```bash
docker compose down
```

## 9. Estructura del repositorio

```text
devops-microservice/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   └── dependabot.yml
├── src/
│   ├── app.js
│   ├── index.html
│   └── server.js
├── test/
│   └── app.test.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md
```

## 10. Uso ético de inteligencia artificial

Herramientas utilizadas: ChatGPT y Gemini.

Se utilizaron como apoyo para comprender conceptos técnicos, resolver dudas durante la implementación, revisar configuraciones y orientar la documentación del proyecto.

Los cambios fueron revisados y probados en el entorno local y mediante GitHub Actions. La responsabilidad sobre las decisiones, implementación y validación del proyecto corresponde a su autora.

## 11. Reflexión individual

Durante el desarrollo de esta evaluación me sentí desafiada, pero también disfruté bastante el proceso de aprendizaje. Algunas herramientas eran nuevas para mí y tuve que dedicar tiempo a entender cómo funcionaban y cómo se relacionaban entre sí. Especialmente con Docker y Docker Compose, pude comprender mejor cómo funcionan los contenedores y qué ventajas tienen al momento de ejecutar una aplicación.

Uno de los aspectos que más me interesó fue trabajar con GitHub Actions y configurar el pipeline para automatizar las pruebas, las revisiones de seguridad y la ejecución del microservicio. Al principio no tenía completamente claro cómo se conectaban todos estos procesos, pero a medida que fui avanzando logré entender mejor su funcionamiento.

También hubo momentos en los que aparecieron errores y tuve que revisar las configuraciones para encontrar soluciones. Esto me permitió aprender de una manera más práctica, porque no solamente se trataba de conseguir que el proyecto funcionara, sino también de entender qué estaba haciendo y por qué era necesario.

De lo que más orgullosa me siento es de haber conseguido que el pipeline funcionara correctamente, ya que fue una de las partes que más trabajo me tomó. Ver que las pruebas se ejecutaban correctamente y que el proceso terminaba sin errores fue muy satisfactorio.

En general, esta evaluación me permitió acercarme más al trabajo con herramientas DevOps y comprender mejor cómo se pueden integrar distintas tecnologías para automatizar procesos. Sé que todavía tengo mucho por aprender, pero considero que terminé con más conocimientos y confianza para enfrentar nuevos desafíos en esta área.
