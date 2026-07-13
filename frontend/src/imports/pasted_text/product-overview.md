You are a Senior Product Designer, Senior UI/UX Designer, and Principal Next.js Architect.

Your task is to design and build a **production-quality frontend** for an AI-powered SaaS web application called:

# ⚡ Smart Electricity Intelligence Platform

The application helps users monitor electricity consumption, predict next month's usage, estimate electricity bills, calculate carbon footprint, and visualize long-term consumption trends.

The entire frontend must be built **STRICTLY using Next.js (App Router) with TypeScript**.

---

# 🚨 IMPORTANT REQUIREMENTS

This project is ONLY for frontend development.

Backend already exists and is deployed.

Your responsibility is to create a clean, scalable, beautiful frontend that communicates with the deployed FastAPI backend through REST APIs.

Do NOT redesign the folder structure.

Do NOT introduce unnecessary architecture.

Follow the folder structure below strictly.

If extra files are required, create them ONLY where appropriate without changing the overall structure.

---

# 🎯 DESIGN GOAL

The interface should look like a real SaaS product instead of an AI-generated dashboard.

The design should feel:

• Premium
• Professional
• Minimal
• Modern
• Clean
• Elegant
• Trustworthy
• Data-focused

The UI must be visually impressive while remaining highly usable.

Avoid generic dashboard layouts that look auto-generated.

Think like an experienced product designer.

---

# 🎨 DESIGN INSPIRATION

Use the design quality of products like:

• Vercel Dashboard
• Stripe Dashboard
• Linear
• Notion
• Supabase
• GitHub
• Plausible Analytics
• Arc Browser

The interface should immediately communicate quality and professionalism.

---

# 🎨 DESIGN SYSTEM

Create a complete, consistent design language.

Choose colors intentionally.

Avoid random colors.

Suggested palette:

Background
- #F8FAFC

Cards
- White

Primary Color
Choose ONE:
- Emerald
OR
- Blue
OR
- Teal

Use this color consistently throughout the application.

Secondary

- Slate Gray
- Zinc
- Neutral

Success
- Green

Warning
- Amber

Error
- Red

Borders
- Soft Gray

Use subtle elevation.

Use soft shadows.

Rounded corners:
12–16px

Large spacing.

Readable typography.

Consistent iconography using Lucide React.

Do NOT use flashy gradients everywhere.

Avoid glassmorphism.

Avoid neon colors.

Avoid unnecessary visual noise.

---

# ✨ USER EXPERIENCE

Prioritize UX over decoration.

The application should feel effortless to use.

Include:

• Smooth hover states

• Button feedback

• Loading skeletons

• Empty states

• Success states

• Error states

• Disabled button states

• Smooth page transitions

• Nice input focus effects

Animations should be subtle.

No GSAP.

No crazy landing-page animations.

No over-the-top motion.

Professional SaaS only.

---

# 📱 RESPONSIVENESS

The application must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Use responsive grids.

Responsive charts.

Responsive cards.

Responsive forms.

---

# ♿ ACCESSIBILITY

Use:

Semantic HTML

Keyboard navigation

ARIA labels

Visible focus states

Proper color contrast

Accessible forms

---

# 📄 PRODUCT REQUIREMENTS

## Product Overview

The platform enables users to:

• Store monthly electricity consumption

• Predict next month's electricity usage

• Estimate electricity bill using Maharashtra tariff slabs

• Calculate carbon footprint

• Generate AI-based electricity insights

• Analyze yearly and seasonal consumption trends

---

# 👤 TARGET USER

A household electricity consumer who wants to:

• Monitor usage

• Reduce bills

• Track historical consumption

• Understand environmental impact

---

# BUSINESS RULES

✔ Minimum 12 months of history required before prediction

✔ One record per month

✔ Duplicate month blocked

✔ Duplicate email blocked

✔ Consumption history cannot be edited

✔ Past records remain immutable

---

# APPLICATION FLOW

## 🏠 Landing Page

Purpose:

Allow users to either create a new profile or continue using an existing one.

Include:

Hero section

Short product introduction

Feature highlights

Two large CTA cards:

➜ Create New User

➜ Select Existing User

Simple illustrations or icons are encouraged.

---

## 👤 Create User Page

Fields:

Name

Email

Validation:

Required fields

Unique email

Valid email format

On success:

POST /users

Store returned user_id

Redirect to:

/add-consumption

---

## 👥 Select Existing User

Fetch:

GET /users

Display users inside:

Searchable dropdown

OR

Modern searchable command palette

Selecting a user redirects to Dashboard.

---

## ⚡ Add Consumption Page

Purpose:

Collect exactly 12 months of historical electricity usage.

Interface:

Dynamic monthly form

12 entries

Month Picker

Electricity Usage (kWh)

Validation:

No duplicate month

No future month

Usage > 0

Display progress indicator.

Example:

8 / 12 months completed

Submit:

POST /users-with-history

On success:

Redirect to Dashboard.

---

# 📊 Dashboard

The dashboard should feel like a professional analytics platform.

Sections:

---

## Forecast Panel

Display:

Predicted kWh

Estimated Bill

Carbon Emission

Trees Equivalent

Vehicle Equivalent

Each metric should be inside premium statistic cards.

Include icons.

---

## Consumption History

Beautiful responsive Chart.js line chart.

Show:

Historical Consumption

Prediction Point

Proper legends

Tooltips

Gridlines

---

## AI Insights

Display insights as elegant cards.

Examples:

💡 Winter consumption has historically been higher.

💡 You are likely entering the next tariff slab.

💡 Shifting appliance usage can reduce your monthly bill.

---

## Seasonal Summary

Cards showing:

Highest Consumption Month

Lowest Consumption Month

Average Monthly Usage

Yearly Average

Prediction Confidence

---

# API ENDPOINTS

POST /users

GET /users

POST /users-with-history

POST /consumption

GET /dashboard/{user_id}

POST /predict-next-month

All API calls must be centralized.

Never hardcode URLs.

---

# 📁 STRICT FOLDER STRUCTURE

Follow this structure EXACTLY.

Do NOT rename folders.

Do NOT move files.

If additional utilities or components are needed, add them without breaking this hierarchy.

```text
frontend/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── create-user/
│   │   └── page.tsx
│   │
│   ├── select-user/
│   │   └── page.tsx
│   │
│   ├── add-consumption/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   └── components/
│       ├── UserForm.tsx
│       ├── ConsumptionForm.tsx
│       ├── ForecastCard.tsx
│       ├── InsightCard.tsx
│       ├── HistoryChart.tsx
│       ├── Navbar.tsx
│       └── (additional reusable components if required)
│
├── lib/
│   ├── api.ts
│   ├── constants.ts
│   └── (additional helper files if required)
│
├── styles/
│   └── globals.css
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

# API LAYER

Use:

lib/api.ts

All API functions must be reusable.

Use Axios or Fetch.

Read backend URL from:

NEXT_PUBLIC_API_URL

Never hardcode backend URLs.

---

# COMPONENT DESIGN

Keep components reusable.

Examples:

UserForm

ConsumptionForm

ForecastCard

InsightCard

HistoryChart

Navbar

MetricCard

SectionHeader

LoadingSkeleton

EmptyState

ErrorCard

Button

Input

Dropdown

Dialog

Everything should be modular.

---

# TECH STACK

Next.js 15 (App Router)

TypeScript

Tailwind CSS

Chart.js

Lucide React

React Hook Form

Zod

Axios (or Fetch)

---

# CODE QUALITY

Follow production-grade engineering practices.

Requirements:

• Reusable components

• Clean architecture

• Strong TypeScript typing

• Separation of concerns

• Reusable API layer

• Easy FastAPI integration

• No duplicated code

• Beginner-friendly structure

• Scalable codebase

---

# NON-GOALS

Do NOT add:

❌ Authentication

❌ Login

❌ Signup passwords

❌ Redux

❌ Global state libraries

❌ Complex routing guards

❌ Database code

❌ Backend implementation

❌ LLM integration

This is Version 1 of the product.

---

# FINAL EXPECTATION

The final UI should look like a polished commercial SaaS analytics platform that could realistically be shipped by a startup.

Every spacing, font size, border radius, card, button, icon, and color should feel intentional.

Avoid generic AI-generated layouts.

Focus on premium visual hierarchy, excellent UX, reusable components, scalability, and seamless integration with the existing FastAPI backend.

Generate the project page-by-page and component-by-component with production-ready Next.js code following the exact folder structure above.