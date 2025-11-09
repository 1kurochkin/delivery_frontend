# Express Delivery Service in New York

A modern web application for on-demand delivery services in New York City, connecting customers who need packages delivered with couriers who can fulfill those deliveries.

🔗 **Live Demo:** [https://1kurochkin.github.io/delivery_frontend](https://1kurochkin.github.io/delivery_frontend)

## 🧪 Test Account

Use the following credentials to test the application:

- **Phone Number:** `19168918139`
- **Verification Code:** `123456`

You can register as either:
- **Customer** - To create and manage delivery orders
- **Courier** - To accept and fulfill delivery orders

## 👥 User Roles

### Customer Role
1. Create delivery orders by specifying pickup and delivery locations
2. Set package details (type, weight, price)
3. Choose delivery method and payment type
4. Track order status in real-time
5. View order history
6. Update profile information

### Courier Role
1. Browse available delivery orders
2. View order details including route and payment
3. Accept orders to fulfill
4. Mark orders as completed
5. Manage wallet and view earnings
6. Top up balance via BTC Pay
7. View transaction history

## 📋 Table of Contents

- [Overview](#overview)
- [Main Features](#main-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Test Account](#test-account)
- [User Roles](#user-roles)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)

## 🎯 Overview

delivery_frontend is a Progressive Web App (PWA) that facilitates express delivery services across New York City's five boroughs (Manhattan, Brooklyn, Queens, Bronx, and Staten Island). The platform supports two types of users: customers who need deliveries and couriers who fulfill them.

## ✨ Main Features

### For Customers
- **Quick Order Creation**: Enter pickup and delivery addresses with Google Places autocomplete
- **Flexible Scheduling**: Choose specific dates and time windows for pickup and delivery
- **Multiple Delivery Methods**: Walking, car, or truck delivery options
- **Real-time Price Calculation**: Automatic pricing based on distance and delivery type
- **Order Management**: Track orders through various statuses (Available, Active, Completed, Canceled)
- **Multiple Payment Options**:
    - Sender pays by cash
    - Recipient pays by cash
    - Payment via bank apps
- **Order History**: View all past and current orders
- **Profile Management**: Update personal information and preferences

### For Couriers
- **Order Marketplace**: Browse available delivery orders
- **Wallet System**: Track earnings and balance
- **BTC Pay Integration**: Top up balance securely
- **Order Acceptance**: Accept orders that fit your schedule and route
- **Route Planning**: Direct Google Maps integration for navigation
- **Transaction History**: View payment history and invoices
- **Earnings Tracking**: Monitor active balance and held funds

### General Features
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **PWA Support**: Install as a native app on iOS and Android
- **Phone Authentication**: Secure SMS-based verification
- **Real-time Updates**: Live order status tracking
- **Customer Support**: Built-in contact form
- **FAQ Pages**: Separate guides for customers and couriers
- **Privacy & Terms**: Complete legal documentation

## 🛠 Technology Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Router 6** - Navigation
- **Ant Design 4** - UI component library
- **Google Maps API** - Location services and autocomplete
- **Moment.js** - Date/time handling
- **Service Workers** - PWA functionality

### Build Tools
- **Create React App** - Project scaffolding
- **LESS** - CSS preprocessing
- **Workbox** - Service worker generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/1kurochkin/delivery_frontend.git

# Navigate to project directory
cd delivery_frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build
```

## 📜 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject

# Run linting
npm run lint

# Generate theme from LESS
npm run generate:theme
```

## 📁 Project Structure

```
src/
├── assets/          # Images, fonts, SVGs
├── components/      # Reusable UI components
├── configs/         # App configuration and constants
├── hooks/           # Custom React hooks
├── routes/          # Route definitions
├── screens/         # Page components
├── store/           # Redux store configuration
│   └── reducers/    # Redux slices and API endpoints
├── styles/          # Global styles (LESS)
└── App.tsx          # Root component
```

## 🔑 Key Dependencies

- `@reduxjs/toolkit` - State management
- `antd` - UI components
- `react-router-dom` - Routing
- `use-places-autocomplete` - Google Places integration
- `moment` - Date manipulation
- `js-cookie` - Cookie management
- `workbox-*` - PWA capabilities

## 🌍 Supported Areas

The service currently operates in:
- Manhattan
- Brooklyn
- Queens
- Bronx
- Staten Island

## 📱 PWA Features

- **Installable**: Add to home screen on iOS and Android
- **Offline Support**: Service worker caching
- **Push Notifications**: Real-time order updates
- **App-like Experience**: Full-screen mode on mobile

## 🆘 Support

For questions or issues, contact: **contact@ikurochkin.com**

## 📝 License

This project is private and proprietary.

---
