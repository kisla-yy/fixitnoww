# FixItNoww 🛠️

A Progressive Web App (PWA) for reporting and resolving civic issues like potholes, streetlight failures, and garbage collection.

## 🚀 Tech Stack
- React.js
- PWA (Service Worker + Manifest)
- Node.js / Express (Backend) *(if applicable)*
- MongoDB / Firebase *(if applicable)*

## 📂 Project Setup
1. Clone the repository
   ```bash
   git clone https://github.com/kisla-yy/fixitnoww.git
   cd fixitnoww







📌 Branch Strategy

main → Always stable & production-ready.

develop → Integration branch where all features are merged.

feature/* → Each new feature or bugfix should be developed here.

🔹 Setup Instructions for Teammates
1. Clone the Repo
git clone https://github.com/kisla-yy/fixitnoww.git
cd fixitnoww

2. Fetch All Branches
git fetch origin

3. Checkout develop
git checkout develop


👉 If develop is not available locally:

git checkout -b develop origin/develop

4. Keep develop Updated

Before starting any new work:

git checkout develop
git pull origin develop

🔹 Creating a New Feature

Always branch out from develop:

git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name


Work on your feature, commit changes.

Push your branch:

git push origin feature/your-feature-name


Create a Pull Request into develop.

🔹 Rules

❌ Do not commit directly to main.

✅ Always pull before starting new work.

✅ Use meaningful branch names: feature/xyz, bugfix/xyz, etc.