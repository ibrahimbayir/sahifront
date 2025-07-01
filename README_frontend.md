# sahibindenkarsilastir.com - Frontend

This is the frontend interface of the **sahibindenkarsilastir.com** project – a user-friendly platform for browsing and comparing second-hand car listings.

Built with **HTML**, **CSS**, and **JavaScript**, this frontend interacts with the backend REST API to fetch and display car data.

## 🚗 Project Overview

The frontend allows users to:
- Register and log in
- Browse car listings with filters (brand, price, year)
- View detailed information of each car
- Compare selected cars side-by-side
- Add or edit their own car listings (if logged in)
- Responsive design for mobile and desktop use

## 🌐 Technologies Used

- **HTML5** – Structure
- **CSS3** – Styling and layout
- **JavaScript (ES6)** – Logic, DOM manipulation, API calls
- **Fetch API** – For sending HTTP requests to the backend
- **Bootstrap** – (Optional) for responsive design

## 📂 Project Structure

```
public/
├── index.html
├── login.html
├── register.html
├── listings.html
├── compare.html
└── assets/
    └── css/
    └── js/
```

## ⚙️ Setup & Running

1. **Clone the repo**
```bash
git clone https://github.com/<username>/sahibindenkarsilastir-frontend.git
cd sahibindenkarsilastir-frontend
```

2. **Open in browser**
You can directly open `index.html` or run a local HTTP server:
```bash
npx serve .
# or
python3 -m http.server
```

3. **Connect to Backend**
Make sure the backend is running (e.g., `http://localhost:8080`). Update API URLs in JavaScript files if needed.

## 🔗 Example API Call

```javascript
fetch('http://localhost:8080/api/cars')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📱 Responsive Design

Designed to work on:
- Desktop Browsers
- Mobile Devices
- Tablets

---

## 👥 Authors

- İbrahim Bayır  
- Mehmet Çavdar  
- Muhammet İyidil
