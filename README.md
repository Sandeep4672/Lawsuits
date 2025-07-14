# LawSuits 🧑‍⚖️📄

**LawSuits** is a full-stack legal-tech web application built using the **MERN** stack and **Socket.IO**, designed to simplify and secure communication between lawyers and clients. It provides real-time chat, case request management, document sharing, and intelligent document summarization—built with scalability, security, and usability in mind.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login/signup
  - Role-based access (Lawyer / Client)

- 💬 **Real-time Chat**
  - Lawyer–Client chat using Socket.IO
  - Timed message deletion
  - Persistent chat history
  - Encrypted media uploads and inline previews

- 📁 **Case Management**
  - Clients can submit case requests
  - Lawyers can accept/reject with chat thread auto-creation on acceptance
  - Separate dashboards for Clients and Lawyers

- 📄 **Document Handling**
  - Upload and preview legal documents
  - Auto-summarization and legal term tagging
  - Keyword-based search across case files

- 🌐 **Scalable RESTful API**
  - Modular Express controllers
  - Clean HTTP methods & status handling
  - Connection request flow with lawyer approval/rejection
  - Fully documented and extendable

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, Socket.IO-Client, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Security**: JWT, Bcrypt, Helmet, CORS
- **Cloud**: Cloudinary (file uploads), Vercel (frontend hosting)
- **Utilities**: Multer, Lodash, Morgan

---


