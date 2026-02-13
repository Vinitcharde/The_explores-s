
# 🏥 Smart Triage & Dynamic Queue Optimization System

> A real-time intelligent patient prioritization system designed for high-load Emergency and OPD departments.

---

## 🚨 Problem Statement

Emergency and OPD departments often struggle with overcrowding, delayed care, and inefficient queue management.  
Most hospitals rely on manual triage decisions or first-come-first-served systems, which can delay treatment for critical patients.

This project introduces a **real-time dynamic triage and queue optimization system** that prioritizes patients based on:

- Severity Level
- Waiting Time
- Risk Factors
- Staff Availability

---

## 🎯 Objective

To reduce waiting time for critical patients and improve hospital workflow efficiency using smart queue reordering.

---

## 🧠 Key Features

- 🔁 Dynamic Triage Priority Engine
- 👨‍⚕️ Real-Time Staff & Room Availability Monitoring
- 📊 Live Dashboard for Queue Visualization
- 🚑 Smart Patient Routing Suggestions
- 🛠 Manual Override for Medical Staff
- 📈 Audit & Analytics for Future Optimization

---

## 🏗 System Architecture

Patient → Triage Entry → Priority Engine → Queue Manager → Doctor Allocation → Dashboard Update

---

## 🛠 Tech Stack

### Backend
- Python
- FastAPI / Flask
- SQLite
- SQLAlchemy (Optional ORM)

### Frontend
- HTML
- CSS
- JavaScript

### Tools & DevOps
- Git & GitHub
- REST APIs (JSON)
- VPS / Cloud Deployment

---

## 📂 Project Structure

```
patient-triage-optimizer/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── models/
│   ├── services/
│   ├── routes/
│   └── utils/
│
├── static/
├── templates/
├── data/
├── tests/
├── requirements.txt
├── README.md
└── run.py
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/patient-triage-optimizer.git
cd patient-triage-optimizer
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate:

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run Application

```bash
python run.py
```

Server will run at:
```
http://127.0.0.1:8000
```

---

## 🧮 Sample Priority Formula

```
Priority Score =
(Severity × 0.5) +
(Waiting Time × 0.3) +
(Risk Factor × 0.2)
```

The system continuously recalculates priority as new patients arrive or staff availability changes.

---

## 📊 Expected Impact

### Tangible Benefits
- Faster care for critical patients
- Reduced waiting time
- Optimized staff utilization
- Fewer patient walk-outs

### Intangible Benefits
- Increased patient trust
- Reduced staff burnout
- Data-driven hospital planning

---

## 🔮 Future Improvements

- Machine Learning based severity prediction
- Integration with hospital EMR systems
- Predictive rush-hour staffing recommendations
- Mobile notification system

---

## 👨‍💻 Team

**Team Name:** The EXPLORE’S  
**Team Leader:** Shreyash Nannaware  
📞 Contact: 8767304109  

---

## 📜 License

This project is developed for hackathon/demo purposes.

---

> 🚀 Building smarter healthcare systems with technology.
