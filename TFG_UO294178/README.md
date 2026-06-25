# Sistema Web para la Evaluación Preoperatoria y Soporte Predictivo

## Descripción

Este proyecto corresponde al **Trabajo Fin de Grado** titulado **"Sistema Web para la Evaluación Preoperatoria y Soporte Predictivo"**.

La aplicación ha sido desarrollada para apoyar el proceso de evaluación preoperatoria realizado por el **Servicio de Anestesiología del Hospital Álvaro Cunqueiro de Vigo**. El sistema permite registrar la información clínica del paciente, calcular automáticamente distintas escalas médicas, generar informes clínicos en formato PDF e incorporar un módulo de soporte a la decisión capaz de estimar el riesgo cardiovascular del paciente.

La solución se ha desarrollado siguiendo una arquitectura **cliente-servidor** y se encuentra completamente contenerizada mediante **Docker**.

---

## Tecnologías utilizadas

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- Node.js
- Express

### Base de datos
- PostgreSQL

### Inteligencia Artificial
- Python
- Scikit-learn
- Regresión Logística

### Despliegue
- Docker
- Docker Compose

---

## Requisitos previos

Para ejecutar la aplicación únicamente es necesario disponer de:

- Docker Desktop
- Docker Compose

> **No es necesario instalar Node.js, Angular, PostgreSQL ni Python en el equipo anfitrión.**

---

## Despliegue

Situarse en la raíz del proyecto:

```bash
cd TFGUO294178
```

Construir las imágenes e iniciar todos los servicios:

```bash
docker compose up --build
```

La primera ejecución puede tardar algunos minutos mientras Docker descarga las imágenes necesarias.

Una vez iniciado el sistema estarán disponibles los siguientes servicios:

| Servicio | Dirección |
|----------|-----------|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

---

## Configuración inicial

La base de datos se inicializa automáticamente durante el despliegue mediante Docker. Para facilitar las pruebas del sistema, se crea un usuario administrador por defecto con las siguientes credenciales:

| Rol | Correo | Contraseña |
|-----|---------|------------|
| Administrador | `admin@sergas.es` | `admin1234` |

Una vez iniciada la sesión, el administrador podrá:

- Autorizar nuevos usuarios.
- Gestionar los usuarios registrados.
- Dar de baja usuarios existentes.

Los nuevos usuarios autorizados deberán acceder a la opción **Activar mi cuenta** desde la pantalla de inicio para establecer su contraseña antes de poder iniciar sesión.

> **Nota:** Estas credenciales se incluyen únicamente para facilitar la evaluación del proyecto y deberán modificarse o eliminarse en un entorno de producción.

---

## Detener la aplicación

```bash
docker compose down
```

Para eliminar también los volúmenes persistentes:

```bash
docker compose down -v
```

---

## Funcionalidades principales

- Autenticación de usuarios.
- Gestión de usuarios por parte del administrador.
- Creación de evaluaciones preoperatorias.
- Guardado y recuperación de borradores.
- Cálculo automático de escalas clínicas.
- Generación de informes PDF.
- Consulta del historial de informes.
- Predicción automática del riesgo cardiovascular.
- Despliegue completo mediante Docker.

---

## Modelo predictivo

El módulo de soporte a la decisión ha sido desarrollado mediante **Python** utilizando una **Regresión Logística** entrenada sobre el conjunto de datos público **NHANES**.

Los coeficientes obtenidos durante el entrenamiento se integran posteriormente en la aplicación web para realizar las predicciones de riesgo cardiovascular durante la evaluación preoperatoria.

---

## Autor

**Teresa Domínguez**

Trabajo Fin de Grado

Grado en Ingeniería Informática del Software

Universidad de Oviedo
