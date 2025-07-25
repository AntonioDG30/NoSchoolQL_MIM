# NoSchoolQL\_MIR

NoSchoolQL\_MIR is a project developed as the final exercise for the Database Systems II course at the University of Salerno, Master's degree in Cybersecurity. It was created to gain hands-on experience with the BASE properties (Basically Available, Soft state, Eventual consistency) and the CAP theorem by implementing an electronic school register based on NoSQL technologies.

The system integrates a Python ETL pipeline for generating realistic synthetic data from the MIR (Ministry of Education) datasets and a full-stack JavaScript application offering complete electronic register management features with separate dashboards for students and teachers.

🎯 **Project Goals**

* **Document Modeling**: Organize MongoDB collections semantically, avoiding the complex joins typical of relational databases
* **Data Pipeline**: Process real MIR datasets with Python scripts for cleaning, normalization, and simulation with realistic socio-demographic factors
* **Full-Stack Architecture**: Integrate a RESTful backend in Node.js/Express with a single-page React frontend
* **NoSQL Experimentation**: Understand consistency and scalability challenges in real scenarios

## 📋 Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Technologies Used](#technologies-used)
* [System Requirements](#system-requirements)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [API Authentication Flow](#api-authentication-flow)
* [API Documentation](#api-documentation)
* [Testing](#testing)
* [Architecture](#architecture)
* [Contributions](#contributions)
* [License](#license)

---

## ✨ Features

### 📊 Python ETL Pipeline

* **Data Cleaning**: Normalization and filtering of secondary school data
* **Statistics Calculation**: Demographic analysis by gender and citizenship
* **Synthetic Data Generation**: Creation of classes, students, teachers, and grades with:

  * Socio-demographic factors based on INVALSI 2024 data
  * Realistic ESCS (Economic, Social and Cultural Status) calculation
  * Grade distribution influenced by geographic area, school type, and citizenship
* **Analysis and Validation**: Ensuring the coherence of the generative model

### 🎓 Student Area

* Personal dashboard displaying key KPIs
* Interactive charts for grade trends and subject averages
* Detailed subject view with timeline and statistics
* Data export in CSV format

### 👨‍🏫 Teacher Area

* Class management with student view and advanced filters
* Single or bulk grade entry for the entire class
* Inline grade editing/deletion
* PDF report generation for individual students
* Temporal filters by period and subject

### 📈 Statistics System

* Public dashboard with school system KPIs
* Hierarchical geographic filters (area, region, province, municipality)
* Comparative analysis by study program
* Outlier identification for classes above/below average
* Responsive charts with Recharts

### 🔐 Security

* Stateless JWT authentication
* Differentiated roles (student/teacher)
* CORS configured for the frontend origin
* Input validation on all endpoints

---

## 📁 Project Structure

```plaintext
NoSchoolQL_MIR/
├── Backend/
│   ├── controllers/         # Business logic per endpoint
│   ├── db/                  # MongoDB configuration
│   ├── middleware/          # Auth, CORS, error handling
│   ├── routes/              # API route definitions
│   └── server.js            # Server entry point
│
├── DatasetLab_python/
│   ├── pulizia_mir.py           # Cleaning original datasets
│   ├── calcolo_statistiche.py   # Calculating averages and percentages
│   ├── genera_dati_simulati.py  # Generating synthetic data
│   ├── analisi_dataset.py       # Validating results
│   └── main.py                  # Pipeline orchestrator
│
├── file/
│   ├── dataset_originali/       # Original MIR CSVs
│   ├── dataset_puliti/          # Normalized data
│   └── dataset_definitivi/      # Collections ready for MongoDB
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AppContext for global state
│   │   ├── layout/          # Layout components
│   │   ├── pages/           # Main pages
│   │   └── views/           # Student/Teacher specific views
│   └── index.html
│
├── loadCSV.js              # Script for importing CSVs into MongoDB
└── README.md
```

---

## 🛠 Technologies Used

**Backend**

* Node.js (v18+)
* Express.js
* MongoDB
* JWT
* dotenv

**Frontend**

* React 18
* Vite
* React Router DOM
* Recharts
* Lucide React

**ETL Pipeline**

* Python 3.10+
* Pandas
* NumPy
* Faker

---

## 💻 System Requirements

* Node.js ≥ 18.0.0
* Python ≥ 3.10
* MongoDB ≥ 6.0
* npm or yarn
* Git

---

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/NoSchoolQL_MIR.git
cd NoSchoolQL_MIR
```

2. **Configure the Python Pipeline**

```bash
cd DatasetLab_python
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Generate the datasets**

```bash
python main.py
```

4. **Import the CSVs into MongoDB**

```bash
node loadCSV.js
```

5. **Configure the Backend**

```bash
cd Backend
npm install
```

6. **Configure the Frontend**

```bash
cd ../Frontend
npm install
```

---

## ⚙️ Configuration

**Backend (`.env`)**
Create a `.env` file in the `Backend/` directory:

```ini
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=NoSchoolQL
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

**Frontend**
By default the frontend queries `http://localhost:3000`. To change, update the API base URL in your components.

---

## ⚙️ Usage

1. **Start MongoDB**

```bash
mongod
```

2. **Start the Backend**

```bash
cd Backend
npm run dev    # Development with nodemon
# or
npm start      # Production
```

3. **Start the Frontend**

```bash
cd Frontend
npm run dev
```

4. **Access the application**

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:3000`

5. **Example credentials**
   **Students:**

```
STU000001
STU000002
```

**Teachers:**

```
DOC00001
DOC00002
```

---

## 📖 API Authentication Flow

1. **Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "type": "STUDENTE",
  "id": "STU000001"
}
```

2. **Receive token**

```json
{ "token": "<JWT>" }
```

3. **Protected requests**

```
Authorization: Bearer <JWT>
```

---

## 📖 API Documentation

### Home

```http
GET /api/home/stats  # General system statistics
```

### Student Register

```http
GET    /api/registro/studente/info
GET    /api/registro/studente/voti
GET    /api/registro/studente/voti-materia/:materia
GET    /api/registro/studente/media-generale
GET    /api/registro/studente/media-per-materia
GET    /api/registro/studente/distribuzione-voti
```

### Teacher Register

```http
GET    /api/registro/docente/info
GET    /api/registro/docente/classi
GET    /api/registro/docente/materie
POST   /api/registro/docente/voto
PUT    /api/registro/docente/voto
DELETE /api/registro/docente/voto
POST   /api/registro/docente/classe/voti
```

### Statistics

```http
GET /api/statistiche/generali
GET /api/statistiche/confronti/area-geografica
GET /api/statistiche/confronti/regione
GET /api/statistiche/confronti/indirizzo
GET /api/statistiche/analisi/outlier
GET /api/statistiche/filtri/opzioni
```

All statistics endpoints support geographic and temporal query parameters.

---

## 🧪 Testing

**ETL Pipeline Smoke Test**

```bash
cd DatasetLab_python
python analisi_dataset.py
```

**API Testing with curl**

```bash
curl http://localhost:3000/api/home/stats
curl -H "Authorization: Bearer <JWT>" http://localhost:3000/api/registro/studente/voti
curl -H "Authorization: Bearer <JWT>" http://localhost:3000/api/registro/docente/classi
```

---

## 🏗 Architecture

**Patterns**

* **Backend**: Routes → Controllers → Data Access (MongoDB)
* **Frontend**: Component-based with Context API
* **Pipeline**: Modular ETL with clear script responsibilities

**Data Flow**

1. Python Pipeline → CSV
2. `loadCSV.js` → MongoDB
3. Express Controllers → JSON
4. React Components ← API

---

## 🤝 Contributions

Contributions are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m "Add AmazingFeature"`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please follow existing naming conventions and add documentation for new features.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
