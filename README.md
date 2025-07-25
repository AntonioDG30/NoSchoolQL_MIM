# NoSchoolQL\_MIR

NoSchoolQL\_MIR is a project developed as the final exercise for the Database Systems II course at the University of Salerno, Master's degree in Cybersecurity. The project was born from the need to concretely experiment with the BASE properties (Basically Available, Soft state, Eventual consistency) and the CAP theorem through the implementation of an electronic school register based on NoSQL technologies.

The system integrates a Python ETL pipeline for generating realistic synthetic data from the MIR (Ministry of Education) datasets and a full-stack JavaScript application that offers complete electronic register management features with separate dashboards for students and teachers.

🎯 **Project Goals**

* **Document Modeling**: Organize MongoDB collections semantically, avoiding the complex joins typical of relational databases
* **Data Pipeline**: Process real MIR datasets with Python scripts for cleaning, normalization, and simulation with realistic socio-demographic factors
* **Full-Stack Architecture**: Integrate a RESTful backend in Node.js/Express with a single-page React frontend
* **NoSQL Experimentation**: Understand consistency and scalability challenges in real scenarios

📋 **Table of Contents**

* Features
* Project Structure
* Technologies Used
* System Requirements
* Installation
* Configuration
* Usage
* API Documentation
* Testing
* Architecture
* Contributions
* License

✨ **Features**

📊 **Python ETL Pipeline**

* Data Cleaning: Normalization and filtering of secondary school data
* Statistics Calculation: Demographic analysis by gender and citizenship
* Synthetic Data Generation: Creation of classes, students, teachers, and grades with:

  * Socio-demographic factors based on INVALSI 2024 data
  * Realistic ESCS (Economic, Social and Cultural Status) calculation
  * Grade distribution influenced by geographic area, school type, and citizenship
* Analysis and Validation: Ensuring the coherence of the generative model

🎓 **Student Area**

* Personal dashboard displaying key KPIs
* Interactive charts for grade trends and subject averages
* Detailed subject view with timeline and statistics
* Data export in CSV format

👨‍🏫 **Teacher Area**

* Class management with student view and advanced filters
* Single or bulk grade entry for the entire class
* Inline grade editing/deletion
* PDF report generation for individual students
* Temporal filters by period and subject

📈 **Statistics System**

* Public dashboard with school system KPIs
* Hierarchical geographic filters (area, region, province, municipality)
* Comparative analysis by study program
* Outlier identification for classes above/below average
* Responsive charts with Chart.js

🔐 **Security**

* Stateless JWT authentication
* Differentiated roles (student/teacher)
* CORS configured for the frontend origin
* Input validation on all endpoints

📁 **Project Structure**

```
NoSchoolQL_MIR/
├── Backend/
│   ├── controllers/         # Business logic for each endpoint
│   ├── db/                  # MongoDB configuration
│   ├── middleware/          # Auth, CORS, error handling
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   └── server.js            # Server entry point
│
├── DatasetLab_python/
│   └── scripts/
│       ├── pulizia_mir.py           # Cleaning original datasets
│       ├── calcolo_statistiche.py   # Calculating averages and percentages
│       ├── genera_dati_simulati.py  # Generating synthetic data
│       ├── analisi_dataset.py       # Validating results
│       └── main.py                  # Pipeline orchestrator
│
│── file/
│       ├── dataset_originali/       # Original MIR CSVs
│       ├── dataset_puliti/          # Normalized data
│       └── dataset_definitivi/      # Collections ready for MongoDB
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base components (Button, Card, etc.)
│   │   │   └── routing/     # ProtectedRoute
│   │   ├── context/         # AppContext for global state
│   │   ├── layout/          # Layout components
│   │   ├── pages/           # Main pages
│   │   ├── theme/           # Global theme and styles
│   │   └── views/           # Student/Teacher specific views
│   └── index.html
│
└── README.md
```

🛠 **Technologies Used**

**Backend**

* Node.js (v18+) - JavaScript runtime
* Express.js - Web framework
* MongoDB - NoSQL document database
* JWT - Stateless authentication
* Dotenv - Environment variable management

**Frontend**

* React 18 - UI framework
* Vite - Build tool and dev server
* React Router DOM - SPA routing
* Chart.js - Interactive charts
* jsPDF - PDF report generation
* Lucide React - Modern icons

**ETL Pipeline**

* Python 3.10+ - Scripting language
* Pandas - Tabular data manipulation
* NumPy - Numerical operations
* Faker - Realistic data generation

💻 **System Requirements**

* Node.js >= 18.0.0
* Python >= 3.10
* MongoDB >= 6.0
* npm or yarn
* Git

🚀 **Installation**

1. Clone the repository

```bash
git clone https://github.com/yourusername/NoSchoolQL_MIR.git
cd NoSchoolQL_MIR
```

2. Configure the Python Pipeline

```bash
cd DatasetLab_python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Generate the datasets

```bash
python scripts/main.py
```

4. Import data into MongoDB

```bash
# Start MongoDB
gmongod

# In another terminal, import the CSVs
mongoimport --db noscuolql_mir --collection classi --type csv --headerline --file file/dataset_definitivi/classi.csv
mongoimport --db noscuolql_mir --collection studenti --type csv --headerline --file file/dataset_definitivi/studenti.csv
mongoimport --db noscuolql_mir --collection docenti --type csv --headerline --file file/dataset_definitivi/docenti.csv
mongoimport --db noscuolql_mir --collection voti --type csv --headerline --file file/dataset_definitivi/voti.csv
```

5. Configure the Backend

```bash
cd ../Backend
npm install
```

6. Configure the Frontend

```bash
cd ../Frontend
npm install
```

⚙️ **Configuration**

**Backend (.env)**

Create a `.env` file in the `Backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=noscuolql_mir
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

**Frontend**

The frontend is preconfigured to connect to `http://localhost:3000`. To change the backend URL, update the API calls in the components.

📖 **Usage**

1. Start MongoDB

```bash
mongod
```

2. Start the Backend

```bash
cd Backend
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

3. Start the Frontend

```bash
cd Frontend
npm run dev
```

4. Access the application

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:3000`

5. Example credentials

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

📚 **API Documentation**

**Authentication**

All authenticated requests must include the header:

```
Authorization: TYPE:ID
```

Where `TYPE` is `STUDENTE` or `DOCENTE`.

**Main Endpoints**

### Home

```
GET /api/home/stats  # General system statistics
```

### Student Register

```
GET /api/registro/studente/info             # Authenticated student info
GET /api/registro/studente/voti             # All student grades
GET /api/registro/studente/voti-materia/:materia  # Grades by subject
GET /api/registro/studente/media-generale   # Overall average
GET /api/registro/studente/media-per-materia  # Averages by subject
GET /api/registro/studente/distribuzione-voti  # Grade distribution
```

### Teacher Register

```
GET    /api/registro/docente/info           # Authenticated teacher info
GET    /api/registro/docente/classi         # Classes assigned to teacher
GET    /api/registro/docente/materie        # Subjects taught
POST   /api/registro/docente/voto           # Insert a single grade
PUT    /api/registro/docente/voto           # Update existing grade
DELETE /api/registro/docente/voto           # Delete grade
POST   /api/registro/docente/classe/voti    # Bulk insert grades
```

### Statistics

```
GET /api/statistiche/generali                     # General KPIs
GET /api/statistiche/confronti/area-geografica    # Comparison by area
GET /api/statistiche/confronti/regione            # Comparison by region
GET /api/statistiche/confronti/indirizzo          # Comparison by study program
GET /api/statistiche/analisi/outlier              # Outlier classes
GET /api/statistiche/filtri/opzioni               # Filter options
```

All statistics endpoints support query parameters for geographic and temporal filters.

🧪 **Testing**

**Manual testing of the ETL Pipeline**

```bash
cd DatasetLab_python
python scripts/analisi_dataset.py
```

Ensure that the averages by citizenship, ESCS, and geographic area align with the configured parameters.

**API testing with curl**

```bash
# Test home endpoint
curl http://localhost:3000/api/home/stats

# Test student login
curl -H "Authorization: STUDENTE:STU000001" http://localhost:3000/api/registro/studente/voti

# Test teacher login
curl -H "Authorization: DOCENTE:DOC00001" http://localhost:3000/api/registro/docente/classi
```

🏗 **Architecture**

**Architectural Patterns**

* **Backend**: Layered architecture (Routes → Controllers → Services → Database)
* **Frontend**: Component-based with Context API for global state
* **Database**: Schema-less with consistent naming conventions
* **Pipeline**: Modular ETL with separated responsibilities

**Data Flow**

1. Generation: Python Pipeline → CSV files
2. Import: CSV → MongoDB collections
3. API: MongoDB → Express controllers → JSON responses
4. UI: React components → API calls → State updates → Re-render

**Security**

* Stateless JWT authentication
* Input validation on all endpoints
* MongoDB query sanitization
* CORS configured for specific frontend origin

🤝 **Contributions**

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Guidelines**

* Follow existing naming conventions
* Add documentation for new features
* Include tests for significant changes
* Maintain compatibility with supported versions

📄 **License**

This project is distributed under the MIT license. See the `LICENSE` file for details.

👥 **Authors**

* Antonio Di Giorgio - Complete development - GitHub

🙏 **Acknowledgments**

* University of Salerno - Department of Computer Science
* MIR datasets for source data
* Open source community for the used libraries
