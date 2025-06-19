# 📚 Student Management Dashboard

A responsive single-page React app for managing student profiles and their enrolled courses. Built as part of a technical assignment to demonstrate frontend skills, React fundamentals, and core JavaScript concepts.

---

## 🚀 Features

* Add, edit, and view student records
* Fields: name, email, course selection, profile image URL
* Form validation (required fields, email format)
* Live search and real-time filtering
* Responsive UI using Tailwind CSS
* Mock API integration with async/await
* Global state management using React Context

---

## 🛠️ Technologies Used

* React (with Hooks: `useState`, `useEffect`, `useContext`, `useMemo`)
* Tailwind CSS
* Lucide React icons
* JavaScript (ES6+)
* Mock API (via [mockapi.io](https://mockapi.io))

---

## 🧠 Key Concepts Demonstrated

### ✅ React Hooks

* `useState` to manage local state
* `useEffect` for data fetching and lifecycle logic
* `useContext` to share global state
* `useMemo` for performance optimization during search

### ✅ Async/Await & Event Loop

* Real API fetch with fallback to mock data
* Simulated latency using `setTimeout`
* Demonstrates non-blocking async behavior

### ✅ Controlled Components & Validation

* Form inputs tied to state
* Live validation for name, email, and course
* Inline error messages with user-friendly feedback

### ✅ Clean, Responsive UI

* Built with semantic HTML and Tailwind
* Mobile-first design
* Uses icons and accessibility-friendly components

---

## 📦 Installation

```bash
# Clone the repo
https://github.com/your-username/student-dashboard
```
# Navigate into the project
cd student-dashboard

# Install dependencies
npm install

# Start the app
npm start
```
```
> 💡 Ensure Node.js and npm are installed on your machine.

---

## 🔗 Mock API (Courses)

Courses are fetched from:

```
```
https://mockapi.io/projects/your-mockapi-id/courses
```
```

Or fallback to mock data if the request fails.

---

## 👩‍🏫 Mentoring Notes

This project was created with mentoring in mind. Key parts of the code include:

* Clear comments explaining React hooks and lifecycle
* Simulated async operations to show how the JS event loop works
* Realistic component decomposition for teaching modularity

---

## 📤 Deliverables

* Source code (this repo)
* Optional: Demo video or live deployment (e.g. Vercel, Netlify)

---

## 📧 Contact

Built by \[Pavan Kumar K S] for the Confedo AI technical assignment.

This project serves as a well-rounded example for mentoring junior developers. It emphasizes **best practices** in modern React development, while reinforcing **core JavaScript fundamentals** in a real-world context.
