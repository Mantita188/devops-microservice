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
## 3. Automatización CI/CD con GitHub Actions**
### Workflow utilizado

El repositorio cuenta con un pipeline de Integración Continua (CI) configurado mediante GitHub Actions. El workflow se encuentra en `.github/workflows/ci.yml`.

### Eventos que activan el pipeline
El pipeline se ejecuta automáticamente en los siguientes casos:

- Cada `push` realizado sobre la rama `develop`.
- Cada Pull Request dirigido hacia la rama `main`.

### Proceso automatizado

El pipeline ejecuta las siguientes etapas:

1. **Checkout del repositorio:** obtiene el código fuente del repositorio.
2. **Configuración de Node.js:** utiliza Node.js versión 20 y habilita la caché de npm.
3. **Instalación de dependencias:** ejecuta `npm ci` utilizando el archivo `package-lock.json`.
4. **Ejecución de pruebas:** ejecuta `npm test` para verificar el funcionamiento del proyecto.

Si todas las etapas finalizan correctamente, GitHub Actions marca la ejecución como exitosa. En caso de que alguna etapa falle, el pipeline informa el error.

## 4. Rol de GitHub Actions en CI/CD**
En esta primera etapa del proyecto, el trabajo se centró exclusivamente en la fase de Integración Continua (CI). GitHub Actions opera como el motor de automatización encargado de validar la integridad del código antes de que cualquier cambio se integre a las ramas troncales.

### Explicación del Rol en el Ciclo Completo CI/CD
Aunque en el encargo actual no se incluye el Despliegue continuo (CD), dentro de la metodologia de DevOps ambas fases se complementan de la siguiente forma:
* **El rol de CI (Implementado):** Se asegura que el codigo desarrollado y integrado por varios desarrolladores este probado, unificado y libre de errores.
* **El rol de CD (Fase posterior):** Toma el codigo ya validado por la etapa CI y automatiza su despliegue en un entorno de pruebas.
* **Interdependencia:** No puede haber un CD confiable sin un pipeline de CI previo, ya que desplegar automaticamente un codigo que no ha sido probado generaria caidas inmediatas y errores en los servicios.

Los beneficios tecnicos obtenidos son la trazabilidad total y la estandarizacion.

## 5. Buenas prácticas del repositorio*
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
```text
devops-microservice/
├── .github/
│   └── workflows/
│       └── ci.yml         
├── src/
│   └── app.js               
├── test/
│   └── app.test.js        
├── .gitignore              
├── package.json           
├── package-lock.json       
└── README.md               
```
## 6. Ejecución Local
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

## 7. Declaración de Uso Ético de Inteligencia Artificial
* **Herramientas utilizadas:** Asistente de IA (Gemini) para la revision de redacción.
* **Áreas de aplicación:** Apoyo en la formulación y redacción de la documentación técnica, estructuración de esquemas de ramificación y diseño inicial del pipeline de GitHub Actions.
* **Validación del equipo:** Todo el código fuente, configuración del pipeline y pruebas unitarias fueron creados, validados y ejecutados manualmente en entorno local y probados dentro de la plataforma GitHub para garantizar el cumplimiento estricto de la rúbrica de evaluación.

## 8. Reflexion individual
Durante el desarrollo de el encargo para el primer parcial, mi principal aporte tecnico se centro en la inicializacion de la arquitectura del microservicio y la puesta en marcha de el pipeline de CI mediante la utilizacion de GitHubs Actions. Trabaje en la configuracion de pruebas unitarias con Jest y Supertest, asegurando que cada componente que fuera incorporar tanto en el endpoint de diagnostico o en el /health como la logica de los productos contara con validaciones automaticas antes de integrarse a la rama develop.
Realizar esta actividad me enseño a dimensionar el valor real de Gitflow en la nube. Anteriormente habia aprendido sobre Github y el uso de repositorios para diferentes actividades, pero ahora al simular el flujo completo con Pull Requests y un hotfix directo a produccion comprendi como esta estrategia de despliegue me ayudo a prevenir que errores de dessarrollo lleguen al usuario final. Asi tambien comprendi que todo lo aprendido con Github Actions, me demostro que automatizar las pruebas no es solo un extra, sino un requisito critico para garantizar la estabilidad del software en cualquier ciclo DevOps, nos ayuda a evitar los errores humanos y a la eliminacion de tareas manuales repetitivas al ejecutar pruebas. 