# NetworkBinaryTrainer

<div align="center">

![Project Logo](generated-icon.png)

A modern web application for network binary training and visualization.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🌟 Features

- Modern, responsive UI built with React and TailwindCSS
- Real-time data visualization using Recharts
- Secure authentication system
- WebSocket support for real-time updates
- Drag and drop functionality
- Dark/Light theme support
- Interactive components using Radix UI
- Form validation with React Hook Form and Zod

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- A PostgreSQL database (for data storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NetworkBinaryTrainer.git
cd NetworkBinaryTrainer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables (create a `.env` file in the root directory):
```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🏗️ Project Structure

```
NetworkBinaryTrainer/
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared types and utilities
├── .config/          # Configuration files
├── public/           # Static assets
└── dist/            # Production build output
```

## 🎨 Technologies

- **Frontend**:
  - React
  - TypeScript
  - TailwindCSS
  - Radix UI Components
  - React Query
  - Framer Motion
  - React Hook Form

- **Backend**:
  - Express.js
  - DrizzleORM
  - PostgreSQL
  - WebSocket
  - Passport.js

- **Development Tools**:
  - Vite
  - ESBuild
  - TypeScript
  - Drizzle Kit

## 🔒 Security

- Session-based authentication
- Password hashing with bcrypt
- CSRF protection
- Secure session storage
- Input validation with Zod

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or feedback, please reach out to [your contact information]

---

<div align="center">
Made with ❤️ using modern web technologies
</div>