# Contributing to EduTrack ERP 🎓

Thank you for your interest in contributing to **EduTrack ERP**! We welcome bug fixes, architecture improvements, UI enhancements, and new feature modules.

---

## 🛠️ Development Setup

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/<your-username>/StudentManagement.git
   cd StudentManagement
   ```

2. **Branching Strategy**:
   Create a dedicated topic branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Install Dependencies**:
   ```bash
   # Server (Node.js + WebSockets)
   cd server && npm install

   # Frontend (React 18/19 + Vite)
   cd ../frontend && npm install
   ```

4. **Database Initialization**:
   - Create a MySQL 8.0 database named `student_management`.
   - Run `database/student_management.sql` to apply the latest relational schema and seed records.
   - Configure credentials in `server/.env` based on `server/.env.example`.

---

## 🎨 Code Style & Design Guidelines

- **UI & Aesthetics**: Maintain Apple-grade frosted glassmorphism (`backdrop-filter: blur(20px)`), curated HSL palettes (Indigo, Emerald, Sapphire), and micro-animations with Framer Motion.
- **Print Formats**: All institutional print formats (dossiers, hall tickets, rosters) must adhere to strict A4 layout rules (`@page { size: A4 portrait }` and `page-break-inside: avoid`).
- **REST & Real-time**: When adding new mutation endpoints, broadcast corresponding events over WebSocket (`wss`) to keep all connected clients synchronized without polling.

---

## 🚀 Submitting a Pull Request

1. Commit your changes with concise, conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
2. Push to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request against the `main` branch of [shrikrishna-lab/StudentManagement](https://github.com/shrikrishna-lab/StudentManagement).
4. Provide a clear summary of your changes, screenshots for visual updates, and test verification details.

---

## 📄 License
By contributing to EduTrack ERP, you agree that your contributions will be licensed under the [MIT License](LICENSE).
