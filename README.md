# devops-microservice

## Descripción

Se crea un microservicio REST desarrollado en Node.js y Express como base de despliegue para el primer parcial del optativo Ingenieria en DevOps. Se implemento una estrategia de ramificacion estructurada utilizando GitFlow, verificaciones automatizadas mediante pruebas unitarias con Jest y Supertest, mas un pipeline de integracion continua (CI) configurado en Github Actions.

## 1. Estrategia de ramificación

Para la gestion del codigo fuente en entornos cloud se evaluaron los diferentes estrategias de control de versiones como las siguientes: 
* **Trunk-Based Development:**Todos los desarrolladores integran sus cambios de codigo en una rama central, conocida como main, de forma frecuente (al menos una vez al dia).
* **GitHub Flow:**Flujo de trabajo ligero y basado en ramas cortas que facilitan los despliegues continuos (ramas cortas + Pull Requests + integración hacia la rama principal) .
* **GitFlow**Modelo clasico, estructurado (mas formal con main, develop, feature, hotfix, etc) y mas complejo, diseñado para proyectos que manejan ciclos de lanzamientos tradicionales y no tanto de un despliegue continuo .

### Uso de GitFlow en este proyecto:
Elegi utilizar **GitFlow** porque me permitio separar el desarrollo de las versiones estables del proyecto. En mi proyecto utilice las ramas develop (integracion de cambios nuevos antes de integrarlos a la rama main), main (codigo estable/listo para producción), features (me permitio el desarrollo de funcionalidades de forma independiente). 
Ademas, la utilizacion de *hotfix* me permitieron abordar los errores criticos de forma controlada, evitando afectar los cambios que se encontraban en desarrollo. Esto permitio mantener la estructura de trabajo organizada y facilito la trazabilidad de los cambios mediante los Pull Requests.
Asimismo utilizar Gitflow me permitio simular un equipo de trabajo aunque realice la evaluacion individualmente, ya que cada funcionalidad se manejo mediante ramas y PR, reproduciendo un flujo colaborativo.

## 2. Trazabilidad del flujo colaborativo
Se imito el ciclo de vida colaborativo registrando cada etapa a traves de los Pull Requests y comandos de Git (como se describio anteriormente):

### Ramas y Funcionalidades Integradas
* **Rama `develop`:** Rama destinada a integrar los cambios de las funcionalidades antes de su incorporación a main.
* **Feature 1 (`feature/health-endpoint`):** Se implemento el endpoint `GET /health` para el monitoreo y observabilidad del estado y el uptime del servicio, acompañando de su correspondiente test unitarios (PR #1 hacia `develop`).
* **Feature 2 (`feature/products-endpoint`):** Utilizada para la incorporacion de operaciones CRUD en memoria para la entidad productos (`GET /products` y `POST /products`) en conjunto con la validacion de payloads y test (PR #2 hacia `develop`).
* **Release v1.0.0:** Se utilizo como la union del codigo consolidado de `develop` hacia `main` (PR #3 hacia `main`).
* **Hotfix (`hotfix/health-response`):** Corrección inminente en produccion sobre `main` que incluyo el atributo `environment: 'production'` en la respuesta de monitoreo (PR #4 hacia `main`).

### Comandos Git utilizados
```bash
# Para clonar y sincronizar el repositorio
git clone <url-repositorio>
git pull origin <rama>

# Para la gestión de ramas
git checkout -b <nueva-rama>
git switch <rama-existente>
git branch -a

#Para el registro y publicación de los cambios
git status
git add .
git commit -m "<tipo>(<alcance>): <descripcion>"
git push -u origin <rama>

# Para la fusión y la actualización
git merge <rama-origen>
```
## 3. Automatización CI/CD con GitHub Actions

El workflow del proyecto se encuentra en .github/workflows/ci.yml. En esta segunda etapa lo modifiqué para incorporar más pasos al proceso de validación y despliegue del microservicio.

### Eventos que activan el pipeline

El pipeline se ejecuta cuando se realizan cambios mediante push en las ramas main, develop y feature/**. También se ejecuta al crear o actualizar Pull Requests dirigidos hacia main o develop.

### Proceso automatizado

El workflow realiza las siguientes tareas:

Obtiene el código del repositorio y configura Node.js versión 20.

Instala las dependencias mediante npm ci.

Ejecuta las pruebas unitarias con npm test.

Revisa las vulnerabilidades de las dependencias mediante npm audit.

Ejecuta el análisis de Snyk si se encuentra configurado el secreto necesario.

Construye la imagen Docker del microservicio.

Inicia el servicio utilizando Docker Compose.

Comprueba que el endpoint /health responda correctamente.

Muestra los registros del contenedor y limpia el entorno de pruebas.

### 3.1. Revisión de dependencias y seguridad

Para revisar las dependencias del proyecto utilicé npm audit, que permite identificar vulnerabilidades conocidas en los paquetes instalados. En la última ejecución local obtuve el resultado found 0 vulnerabilities.

También agregué el archivo .github/dependabot.yml, que configura revisiones semanales para las dependencias de npm y las acciones de GitHub.

El workflow incluye un paso para Snyk, pero para ejecutar ese análisis es necesario configurar el secreto SNYK_TOKEN en GitHub. Por lo tanto, la revisión con Snyk debe considerarse pendiente hasta comprobar que se haya ejecutado correctamente.

Es importante distinguir el resultado de la auditoría local de las alertas que GitHub pueda mostrar en el repositorio.

## 4. Rol de GitHub Actions en CI/CD

GitHub Actions permite automatizar las tareas de integración continua y comprobar que el microservicio funcione correctamente antes de finalizar el proceso.

En esta segunda etapa amplié el pipeline para que, además de ejecutar las pruebas unitarias y revisar las dependencias, construya la imagen Docker y levante el servicio mediante Docker Compose en un entorno de prueba.

Integración continua (CI): valida el código mediante pruebas unitarias y revisiones de seguridad.

Despliegue automatizado en entorno de prueba (CD): construye la imagen, inicia el contenedor y verifica que el endpoint /health responda correctamente.

Validación del despliegue: si las pruebas, la auditoría o la comprobación del servicio fallan, el pipeline puede detenerse y registrar el error.

Este proceso permite reducir tareas manuales y comprobar que los cambios puedan ejecutarse en un entorno contenerizado.

### Explicación del Rol en el Ciclo Completo CI/CD
Aunque en el encargo actual no se incluye el Despliegue continuo (CD), dentro de la metodologia de DevOps ambas fases se complementan de la siguiente forma:
* **El rol de CI (Implementado):** Se asegura que el codigo desarrollado y integrado por varios desarrolladores este probado, unificado y libre de errores.
* **El rol de CD (Fase posterior):** Toma el codigo ya validado por la etapa CI y automatiza su despliegue en un entorno de pruebas.
* **Interdependencia:** No puede haber un CD confiable sin un pipeline de CI previo, ya que desplegar automaticamente un codigo que no ha sido probado generaria caidas inmediatas y errores en los servicios.

Los beneficios tecnicos obtenidos son la trazabilidad total y la estandarizacion.

## 5. Buenas prácticas del repositorio
###  Naming de ramas:
main
develop
feature/health-endpoint
feature/products-endpoint
hotfix/health-response

###  Convención de commits
Formato estándar: `<tipo>(<alcance>): <descripcion>
* `feat`: Nueva funcionalidad para el usuario/API.
* `fix`: Corrección de un defecto o bug.
* `chore`: Mantenimiento, dependencias o configuración sin alterar código fuente.
* `test`: Adición o modificación de pruebas unitarias.
* `docs`: Modificación o creación de documentación.
Ejemplos:
* `feat(health): agregar endpoint /health y tests unitarios #1`
* `fix: parche critico en endpoint /health #4`

### Control de versiones
El control de versiones del proyecto se realizó utilizando Git como sistema de control de versiones y GitHub como repositorio remoto. 
Cada cambio que se realizo en la entrega fue registrado mediante commits, permitiendo mantener un historial de modificaciones y conocer que cambios fueron incorporados en las etapas del desarrollo.
GitFlow me permitio mantener separados los cambios de desarrollo de la version estable. las nuevas funciones se desarrollaron mediante las ramas `feature/*`, mientras que los errores mediante la rama `hotfix/*`.
La integración de los cambios se realizó mediante Pull Requests, permitiendo revisar y validar los cambios antes de incorporarlos a `develop` o `main`, según correspondiera.
### Estrategia de revisión
Se simulo el flujo colaborativo mediante Pull Requests y validaciones automatizadas.
Feature
   ↓
Pull Request
   ↓
GitHub Actions
   ↓
Revisión/validación
   ↓
Merge
   ↓
develop
### Y:
develop
   ↓
Pull Request
   ↓
Validación
   ↓
main

### Estructura de Directorios
```devops-microservice/
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
             
```
## 6. Contenerización con Docker

En esta etapa trabajé en la contenerización del microservicio para poder ejecutarlo mediante Docker. Para esto creé un Dockerfile, donde se indican los pasos necesarios para construir la imagen de la aplicación.

También utilicé Docker Compose para facilitar el inicio y la administración del contenedor. Se configuró el puerto 3000 para acceder al servicio y un healthcheck para comprobar si la aplicación se encuentra funcionando correctamente.

Para probarlo utilicé los siguientes comandos:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Para revisar el estado del servicio se puede consultar el endpoint `/health` desde el navegador, utilizando `http://localhost:3000/health`.

Además, agregué el archivo `.dockerignore` para excluir archivos que no son necesarios al construir la imagen.


## 7. Ejecución Local
1. **Instalar dependencias:**
```bash
   npm install
```
2. **Ejecutar pruebas unitarias:**
```bash
   npm test
```
3. **Iniciar el servicio:**
```bash
   npm start
 ``` 
 4. **Requisitos:**
 ```bash
 Node.js
npm
Git
``` 

#### 8. Declaración de Uso Ético de Inteligencia Artificial

- **Herramientas utilizadas:** Gemini y ChatGPT como herramientas de apoyo.
- **Áreas de aplicación:** apoyo en la revisión de redacción, la comprensión de conceptos técnicos y la orientación para configurar y documentar el pipeline de GitHub Actions y Docker.
- **Validación:** los cambios se revisaron y probaron en el entorno local y en GitHub Actions. La documentación final debe reflejar las configuraciones implementadas y los resultados obtenidos durante las pruebas.

## 9. Reflexion individual
Durante el desarrollo de el encargo para el primer parcial, mi principal aporte tecnico se centro en la inicializacion de la arquitectura del microservicio y la puesta en marcha de el pipeline de CI mediante la utilizacion de GitHubs Actions. Trabaje en la configuracion de pruebas unitarias con Jest y Supertest, asegurando que cada componente que fuera incorporar tanto en el endpoint de diagnostico o en el /health como la logica de los productos contara con validaciones automaticas antes de integrarse a la rama develop.
Realizar esta actividad me enseño a dimensionar el valor real de Gitflow en la nube. Anteriormente habia aprendido sobre Github y el uso de repositorios para diferentes actividades, pero ahora al simular el flujo completo con Pull Requests y un hotfix directo a produccion comprendi como esta estrategia de despliegue me ayudo a prevenir que errores de dessarrollo lleguen al usuario final. Asi tambien comprendi que todo lo aprendido con Github Actions, me demostro que automatizar las pruebas no es solo un extra, sino un requisito critico para garantizar la estabilidad del software en cualquier ciclo DevOps, nos ayuda a evitar los errores humanos y a la eliminacion de tareas manuales repetitivas al ejecutar pruebas. 