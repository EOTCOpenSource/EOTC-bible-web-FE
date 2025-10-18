# Contributing to EOTC Bible

## 🙏 Welcome

Thank you for your interest in contributing to the **EOTC Bible** project. This initiative aims to deliver the complete 81-book Ethiopian Orthodox Tewahedo Church canon in digital form.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Getting Started](#-getting-started)
- [Additional Resources](#-additional-resources)
- [Development Process](#-development-process)
- [How you can help](#-how-you-can-help)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Code Standards](#-code-style--tools)
- [Reporting Issues](#-reporting-bugs--feature-requests)
- [Community Guidelines](#-community-conduct)
- [Getting Help](#-need-help)

## 📐 Project Overview

**Technical Stack:**

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (client), React Query (server)
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Testing:** Jest, React Testing Library, Cypress
- **Package Manager:** npm

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/EOTC-bible-web-FE.git
   cd EOTC-bible-web-FE
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```

## 📖 Additional Resources

For detailed frontend architecture, authentication flow, and proxy usage, see the [README](./README.md) file.

## 💻 Development Process

1. Make your changes following existing code patterns
2. Add tests for new functionality
3. Make sure the page is localized  with EN, AM, GEEZ, TG and OR if your are deleoping page  or component
4. Verify all tests pass:
   ```bash
   npm test
   ```
5. Make sure to check code formatting before you commit changes
   - #### check the files need formatting 
   ```bash
   npm run format:check
   ```
   - #### format the entire files you checked
   ```bash
   npm run format
   ``` 
6. Commit with descriptive messages:
   ```bash
   git commit -m "feat: add [feature description]"
   ```
7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Open a Pull Request to the main branch

> **Note:** You don't need to open an issue before submitting a PR, but feel free to do so if you want feedback on an idea.

## 🎯 How You Can Help

- **Features:** Search, bookmarks, parallel view
- **Testing:** Unit, integration, E2E tests
- **UI/UX:** Design improvements with Tailwind CSS
- **Bugs:** Fixing issues and optimizing performance
- **Documentation:** Improving docs and content

## 📝 Pull Request Guidelines

- Focus on a single change per PR
- Follow existing code style and structure
- Ensure all tests pass
- Provide clear description of changes and rationale
- Reference related issues (e.g., "Fixes #12")
- Include tests for new functionality

## 🎨 Code Style & Tools

We maintain consistent code quality with:

- TypeScript (strict mode)
- Tailwind CSS for styling
- React Query for server state
- Zod for validation
- ESLint and Prettier

## 🐛 Reporting Bugs & Feature Requests

**Before reporting:**

- Check existing issues to avoid duplicates

**Bug reports should include:**

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or logs (if applicable)

**Feature requests:** Open an issue or discussion to propose new ideas

## 🤝 Community Conduct

As a faith-based open source community, we expect:

- Respect and kindness toward others
- Openness to collaboration and feedback
- Cultural and linguistic sensitivity

**Zero tolerance** for hate speech, harassment, or discrimination.

## ❓ Need Help?

- Open a GitHub Discussion
- Create an Issue
- Reach out to maintainers

Thank you for helping build a trusted digital resource for the Ethiopian Orthodox Tewahedo Church. Your contributions make a difference. 🙏
