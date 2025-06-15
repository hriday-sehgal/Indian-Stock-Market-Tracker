# Stock Tracker Dashboard

A modern, real-time stock tracking dashboard built with Next.js and TypeScript that monitors Indian equity markets. This application provides a clean, professional interface for tracking stock prices and market movements.

## Features

- Real-time stock price tracking for Indian equity markets
- Comprehensive stock data including:
  - Company names and ticker symbols
  - Sector-wise categorization
  - Real-time price movements and trends
- Smart Auto-Update System:
  - Toggle auto-update on/off with visual indicators
  - Flexible update intervals:
    - Quick presets (30s, 1m, 2m, 5m, 10m)
    - Custom interval option (minimum 3 seconds)
    - Precise time display with 2 decimal places
  - Manual refresh option available
  - **Note**: For real-time stock tracking, keep auto-update enabled
- Responsive UI built with Tailwind CSS
- Clean and intuitive user interface
- Support for multiple stock data sources

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons & React Icons
- **Data Fetching**: Axios
- **Stock Data**: Yahoo Finance API - Yahoo finance2 npm package

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Stock_Tracker_Hriday
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Tips

### Real-time Stock Updates

- Enable auto-update for continuous stock price monitoring
- The dashboard will automatically fetch new data at your specified interval
- Visual indicators show when updates are in progress
- Manual refresh available for immediate data updates

### Auto-Update Controls

- Toggle button shows current status (green for ON, red for OFF)
- Flexible update intervals:
  - Quick presets: 30 seconds, 1 minute, 2 minutes, 5 minutes, 10 minutes
  - Custom interval: Set any duration from 3 seconds up
  - Time display shows precise intervals (e.g., "1.03 minutes")

## Copyright Disclaimer

Copyright © 2025 Hriday Sehgal. All rights reserved.

This project and its source code are the proprietary intellectual property of Hriday Sehgal. Unauthorized copying, modification, distribution, or reproduction in any form without explicit permission is strictly prohibited.

## Contact

For inquiries or collaborations, reach out via:

- **Email**: hriday.career@gmail.com
