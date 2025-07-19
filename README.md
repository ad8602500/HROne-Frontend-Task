# React + Vite

# JSON Schema Builder – HROne Frontend Task

This is a dynamic JSON Schema Builder built using **React**, **Vite**, and **React Hook Form**, created as part of the HROne Frontend Intern hiring task.

## 🔗 Live Demo

👉 [View Live Application](https://hrone-frontend-task.onrender.com)

## 📌 Features

- Add new fields dynamically with support for:
  - `String`
  - `Number`
  - `Nested` (recursive)
- Edit field names/types
- Delete fields
- Add nested fields under a field of type `Nested`
- Real-time JSON preview of the schema

## 🛠 Tech Stack

- **ReactJS** with **Vite**
- **React Hook Form**
- **Ant Design**  
- **UUID** for unique keys
- **CSS Modules 

## 🗂 Folder Structure

src/
│
├── components/
│ └── SchemaField.jsx # Recursive field rendering logic
│
├── App.jsx # Main application logic
├── main.jsx # Entry point
└── vite.config.js # Vite config (with allowedHosts)


## 🧩 JSON Schema Format

The JSON output reflects the structure of the created schema in this format:

```json
[
  {
    "key": "name",
    "type": "String"
  },
  {
    "key": "address",
    "type": "Nested",
    "children": [
      {
        "key": "city",
        "type": "String"
      }
    ]
  }
]
🚀 Getting Started Locally
bash
Copy
Edit
# Clone the repo
git clone https://github.com/ad8602500/hrone-frontend-task.git

# Navigate into project folder
cd hrone-frontend-task

# Install dependencies
npm install

# Start development server
npm run dev
⚙️ Deployment
The project is deployed on Render.com with vite.config.js configured as:

js
Copy
Edit
server: {
  host: '0.0.0.0',
  allowedHosts: ['hrone-frontend-task.onrender.com']
}

