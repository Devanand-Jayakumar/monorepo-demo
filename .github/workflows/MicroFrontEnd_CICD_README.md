
# CI/CD Workflows for Login, Signup, and UserProfile Micro Frontends

This repository contains GitHub Actions workflows for automating the CI/CD process of three React-based micro frontends managed in a monorepo using NX and Yarn.

## 📁 Workflows
- `.github/workflows/login-cicd.yml`
- `.github/workflows/signup-cicd.yml`
- `.github/workflows/userprofile-cicd.yml`

## 🚀 Purpose
Each workflow automates:
- Linting and unit testing with coverage enforcement
- SonarQube static analysis
- Cypress E2E testing with Allure reporting
- Deployment to Cloudflare Pages
- Email notifications for success/failure

## ⚙️ Triggers
- `push` to `main` branch
- `pull_request` affecting the respective app folders
- `workflow_dispatch` with manual inputs for environment and application

## 🧪 CI/CD Steps
1. **Install dependencies** using Yarn
2. **Lint** the application
3. **Run unit tests** with coverage > 95%
4. **SonarQube analysis**
5. **Build** the application
6. **Run Cypress E2E tests**
7. **Generate and deploy Allure reports**
8. **Deploy to Cloudflare Pages**
9. **Send email notifications**

## 🔐 Required Secrets
Set these secrets under GitHub → Settings → Secrets and variables → Actions:

### Common Secrets
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SMTP_SERVER`
- `SMTP_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_TO`
- `SONAR_TOKEN`
- `SONAR_HOST_URL`

### Environment-Specific Secrets
- `CLOUDFLARE_PROJECT_NAME_LOGIN_DEV`, `STAGING`, `PROD`
- `CLOUDFLARE_PROJECT_NAME_SIGNUP_DEV`, `STAGING`, `PROD`
- `CLOUDFLARE_PROJECT_NAME_USERPROFILE_DEV`, `STAGING`, `PROD`

## 🔐 Environment Protection Rules
Configure environments in GitHub:
- `DEV`: automatic deployment
- `STAGING` and `PRODUCTION`: require manual approval

## 📬 Email Notifications
- Success and failure notifications are sent using SMTP
- Customize recipients via `EMAIL_TO` secret

## 📊 Allure Reports
- Generated from Cypress E2E results
- Deployed to GitHub Pages with timestamped folders
- `reports.json` index is maintained for navigation

## 📦 Node.js Versions
Workflows run on a matrix of:
- `16.x`, `18.x`, `20.x`

## 🧩 Monorepo Structure
```
apps/
  login/
  signup/
  userprofile/
  login-e2e/
  signup-e2e/
  userprofile-e2e/
```

## 📝 Manual Trigger Example
You can manually trigger a workflow with:
- `environment`: DEV, STAGING, or PRODUCTION
- `application`: Login, Signup, or UserProfile

---
For questions or contributions, please contact the DevOps team.
