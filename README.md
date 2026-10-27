devops-microservice

Descripción

Se crea un microservicio REST desarrollado en Node.js y Express para el optativo Ingeniería en DevOps. En esta segunda etapa se incorporó la contenerización mediante Docker, la orquestación con Docker Compose, las verificaciones automatizadas mediante pruebas unitarias con Jest y Supertest, y un pipeline de integración continua y despliegue en un entorno de prueba (CI/CD) configurado en GitHub Actions.

El objetivo es automatizar la validación del microservicio, revisar las dependencias y comprobar que la aplicación pueda construirse y ejecutarse correctamente en un entorno contenerizado.

1. Estrategia de ramificación

Para la gestión del código fuente en entornos cloud se evaluaron diferentes estrategias de control de versiones, como las siguientes:

Trunk-Based Development: todos los desarrolladores integran sus cambios de código en una rama central, conocida como main, de forma frecuente.

GitHub Flow: flujo de trabajo ligero basado en ramas cortas que facilitan la integración de cambios mediante Pull Requests hacia la rama principal.

GitFlow: modelo clásico y estructurado, con ramas como main, develop, feature y hotfix, diseñado para organizar el desarrollo y las versiones del proyecto.

Uso de GitFlow en este proyecto

Elegí utilizar GitFlow porque me permitió separar el desarrollo de las versiones estables del proyecto. En mi proyecto utilicé las ramas develop (integración de cambios nuevos antes de incorporarlos a main), main (código estable) y feature/* (desarrollo de funcionalidades de forma independiente).

Además, la utilización de hotfix me permitió abordar errores críticos de forma controlada, evitando afectar los cambios que se encontraban en desarrollo. Esto permitió mantener la estructura de trabajo organizada y facilitó la trazabilidad de los cambios mediante los Pull Requests.

Asimismo, utilizar GitFlow me permitió simular un equipo de trabajo, ya que cada funcionalidad se manejó mediante ramas y Pull Requests, reproduciendo un flujo colaborativo.

2. Trazabilidad del flujo colaborativo

Se imitó el ciclo de vida colaborativo registrando cada etapa a través de los Pull Requests y comandos de Git.

Ramas y funcionalidades integradas

Rama develop: rama destinada a integrar los cambios de las funcionalidades antes de su incorporación a main.

Feature 1 (feature/health-endpoint): se implementó el endpoint GET /health para el monitoreo del estado del servicio, acompañado de sus correspondientes pruebas unitarias (PR #1 hacia develop).

Feature 2 (feature/products-endpoint): se utilizó para incorporar operaciones CRUD en memoria para la entidad productos, incluyendo GET /products y POST /products, junto con la validación de datos y pruebas (PR #2 hacia develop).

Release v1.0.0: se utilizó para integrar el código consolidado de develop hacia main (PR #3 hacia main).

Hotfix (hotfix/health-response): corrección del endpoint de salud que incluyó el atributo environment: 'production' en la respuesta de monitoreo (PR #4 hacia main).

Feature de Docker y CI/CD (feature/ep2-docker): se incorporó la contenerización del microservicio, Docker Compose, el análisis de seguridad y las mejoras al pipeline de GitHub Actions (PR #5).

Comandos Git utilizados

# Para clonar y sincronizar el repositorio
git clone <url-repositorio>
git pull origin <rama>

# Para la gestión de ramas
git checkout -b <nueva-rama>
git switch <rama-existente>
git branch -a

# Para el registro y publicación de los cambios
git status
git add .
git commit -m "<tipo>(<alcance>): <descripcion>"
git push -u origin <rama>

# Para la fusión y actualización
git merge <rama-origen>

3. Automatización CI/CD con GitHub Actions

El workflow del proyecto se encuentra en .github/workflows/ci.yml. En esta segunda etapa lo modifiqué para incorporar más pasos al proceso de validación y despliegue del microservicio.

Eventos que activan el pipeline

El pipeline se ejecuta cuando se realizan cambios mediante push en las ramas main, develop y feature/**. También se ejecuta al crear o actualizar Pull Requests dirigidos hacia main o develop.

Proceso automatizado

El workflow realiza las siguientes tareas:

Obtiene el código del repositorio mediante actions/checkout.

Configura Node.js versión 20.

Instala las dependencias mediante npm ci.

Ejecuta las pruebas unitarias con npm test.

Revisa las vulnerabilidades de las dependencias mediante npm audit --audit-level=high.

Ejecuta el análisis de seguridad con Snyk si se encuentra configurado el secreto SNYK_TOKEN.

Construye la imagen Docker mediante docker compose build.

Inicia el servicio utilizando docker compose up -d.

Comprueba que el endpoint /health responda correctamente.

Muestra el estado de los contenedores y los registros en caso de ser necesario.

Limpia el entorno de pruebas mediante docker compose down.

Si las pruebas unitarias fallan, el paso devuelve un error y el pipeline no continúa normalmente hacia las siguientes etapas. Lo mismo ocurre si falla la auditoría configurada, el análisis de Snyk cuando está habilitado o la comprobación de salud del microservicio.

3.1. Revisión de dependencias y seguridad

Para revisar las dependencias del proyecto utilicé npm audit, que permite identificar vulnerabilidades conocidas en los paquetes instalados. En una de las ejecuciones locales obtuve el resultado found 0 vulnerabilities.

También agregué el archivo .github/dependabot.yml, que configura revisiones semanales para las dependencias de npm y las acciones de GitHub. Esto permite mantener un seguimiento de las actualizaciones disponibles y recibir propuestas de actualización cuando corresponda.

Además, incorporé Snyk al pipeline para realizar un análisis de seguridad de las dependencias. Para esto configuré el secreto SNYK_TOKEN en GitHub Actions, de manera que el token no quede escrito directamente en el código del repositorio.

En una de las ejecuciones, Snyk analizó 66 dependencias y mostró el resultado no vulnerable paths found, sin encontrar rutas vulnerables conocidas en ese análisis.

El comando utilizado incluye el parámetro --severity-threshold=high, por lo que el paso falla si Snyk detecta vulnerabilidades que alcanzan ese nivel de severidad. Si el secreto SNYK_TOKEN no está configurado, el workflow muestra una advertencia y omite el análisis de Snyk.

Es importante distinguir entre los resultados de npm audit, Snyk y las alertas de Dependabot, ya que cada herramienta tiene un funcionamiento diferente. Estos resultados corresponden a las ejecuciones realizadas y no garantizan la ausencia absoluta de vulnerabilidades.

4. Rol de GitHub Actions en CI/CD

GitHub Actions permite automatizar las tareas de integración continua y comprobar que el microservicio funcione correctamente antes de finalizar el proceso.

En esta segunda etapa amplié el pipeline para que, además de ejecutar las pruebas unitarias y revisar las dependencias, construya la imagen Docker y levante el servicio mediante Docker Compose en un entorno de prueba.

Integración continua (CI)

La integración continua permite validar los cambios del código mediante pruebas unitarias y revisiones de seguridad. Esto ayuda a detectar errores antes de continuar con el proceso.

Despliegue automatizado en entorno de prueba (CD)

El despliegue automatizado de esta implementación construye la imagen Docker, inicia el contenedor mediante Docker Compose y verifica que el endpoint /health responda correctamente.

Validación del despliegue

El pipeline comprueba que el servicio pueda ejecutarse y responder correctamente. Si las pruebas, los análisis de seguridad configurados o la verificación del servicio fallan, el flujo puede detenerse y registrar el error en GitHub Actions.

Este proceso permite reducir tareas manuales, mejorar la trazabilidad y comprobar que los cambios puedan ejecutarse en un entorno contenerizado. El despliegue implementado corresponde a un entorno de prueba y no a un despliegue productivo en la nube.

5. Buenas prácticas del repositorio

Naming de ramas

main

develop

feature/health-endpoint

feature/products-endpoint

hotfix/health-response

feature/ep2-docker

Convención de commits

Se utilizó el siguiente formato estándar:

<tipo>(<alcance>): <descripcion>

feat: nueva funcionalidad para el usuario o API.

fix: corrección de un defecto o error.

chore: mantenimiento, dependencias o configuración.

test: adición o modificación de pruebas unitarias.

docs: modificación o creación de documentación.

Ejemplos:

feat(health): agregar endpoint /health y tests unitarios

fix: parche critico en endpoint /health

docs: actualizar documentación de Docker y CI/CD

Control de versiones

El control de versiones del proyecto se realizó utilizando Git como sistema de control de versiones y GitHub como repositorio remoto.

Cada cambio realizado durante la evaluación fue registrado mediante commits, permitiendo mantener un historial de modificaciones y conocer qué cambios fueron incorporados en las etapas del desarrollo.

GitFlow me permitió mantener separados los cambios de desarrollo de la versión estable. Las nuevas funcionalidades se desarrollaron mediante ramas feature/*, mientras que los errores críticos se abordaron mediante ramas hotfix/*.

La integración de los cambios se realizó mediante Pull Requests, permitiendo revisar y validar las modificaciones antes de incorporarlas a develop o main, según correspondiera.

Estrategia de revisión

Se simuló el flujo colaborativo mediante Pull Requests y validaciones automatizadas.

Feature
   ↓
Pull Request
   ↓
GitHub Actions
   ↓
Revisión y validación
   ↓
Merge
   ↓
develop

Posteriormente, los cambios consolidados se integran a la rama principal mediante el flujo correspondiente:

develop
   ↓
Pull Request
   ↓
GitHub Actions
   ↓
Validación
   ↓
main

Estructura de directorios

devops-microservice/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── dependabot.yml
├── src/
│   └── app.js
├── test/
│   └── app.test.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md

6. Contenerización con Docker

En esta etapa trabajé en la contenerización del microservicio para poder ejecutarlo mediante Docker. Para esto creé un Dockerfile, donde se indican los pasos necesarios para construir la imagen de la aplicación.

El Dockerfile utiliza Node.js 20 sobre Alpine Linux como imagen base, establece el directorio de trabajo, copia los archivos necesarios e instala las dependencias de producción mediante npm ci --omit=dev.

Además, la aplicación se ejecuta utilizando el usuario node, evitando ejecutarla como administrador dentro del contenedor. Finalmente, se define el puerto 3000 y el comando que inicia el servicio.

También utilicé Docker Compose para facilitar el inicio y la administración del contenedor. En el archivo compose.yaml se configura el servicio, el puerto 3000 y un healthcheck para comprobar si la aplicación se encuentra funcionando correctamente.

Para probarlo utilicé los siguientes comandos:

# Construir la imagen
docker compose build

# Iniciar el servicio
docker compose up -d

# Revisar el estado del contenedor
docker compose ps

# Revisar los registros del servicio
docker compose logs api

# Detener y limpiar el entorno
docker compose down

Para revisar el estado del servicio se puede consultar el endpoint /health desde el navegador, utilizando:

http://localhost:3000/health

También es posible realizar la comprobación desde PowerShell:

Invoke-RestMethod http://localhost:3000/health

En las pruebas locales realizadas, el servicio respondió con el estado UP y el entorno production.

Además, agregué el archivo .dockerignore para excluir archivos que no son necesarios al construir la imagen, evitando copiar contenido innecesario al contexto de construcción.

7. Ejecución local

Requisitos

Node.js 20.

npm.

Git.

Docker y Docker Compose para ejecutar la versión contenerizada.

Pasos para ejecutar el proyecto

1. Clonar el repositorio

git clone https://github.com/Mantita188/devops-microservice.git
cd devops-microservice

2. Instalar las dependencias

npm install

3. Ejecutar las pruebas unitarias

npm test

4. Iniciar el servicio directamente con Node.js

npm start

5. Construir y ejecutar el servicio con Docker Compose

docker compose build
docker compose up -d

6. Comprobar el estado del servicio

docker compose ps

También se puede consultar el endpoint:

http://localhost:3000/health

7. Detener el entorno contenerizado

docker compose down

8. Declaración de uso ético de inteligencia artificial

Herramientas utilizadas: Gemini y ChatGPT como herramientas de apoyo.

Áreas de aplicación: apoyo en la revisión de redacción, la comprensión de conceptos técnicos y la orientación para configurar y documentar el pipeline de GitHub Actions y Docker.

Validación: los cambios se revisaron y probaron en el entorno local y en GitHub Actions. La documentación final debe reflejar las configuraciones implementadas y los resultados obtenidos durante las pruebas.

9. Reflexión individual

Esta sección debe ser revisada y redactada con mi propia experiencia de aprendizaje.

Durante el desarrollo de este encargo, mi principal aporte técnico se centró en las tareas que realicé para implementar y mejorar el microservicio, sus pruebas automatizadas y el pipeline de GitHub Actions.

Trabajar con esta evaluación me permitió profundizar en el uso de GitFlow, la contenerización mediante Docker, la ejecución del servicio con Docker Compose y la incorporación de controles de seguridad en el pipeline.

También comprendí la importancia de automatizar las pruebas y verificar que el servicio responda correctamente antes de finalizar el proceso. Estas tareas permiten detectar errores de forma temprana, reducir la ejecución manual de pasos repetitivos y mejorar la trazabilidad de los cambios.
