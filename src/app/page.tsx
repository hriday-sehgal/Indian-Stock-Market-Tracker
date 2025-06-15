import StockDashboard from "../components/StockDashboard";
import { ClockIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Indian Stock Market Tracker - Real-time NSE Stock Dashboard",
  description:
    "Track real-time Indian stock market data with advanced filtering, custom stock tracking, and professional analytics. Monitor NSE stocks with live updates, market timings, and detailed market insights. Get instant access to stock prices, volume, market cap, and more.",
  keywords:
    "Indian stock market, NSE stocks, real-time stock tracking, stock dashboard, market analytics, stock portfolio, live stock prices, Indian market timings, NSE trading hours, stock market tracker, Indian equities, market insights",
  openGraph: {
    title: "Indian Stock Market Tracker - Real-time NSE Stock Dashboard",
    description:
      "Track real-time Indian stock market data with advanced filtering and professional analytics",
    type: "website",
    locale: "en_IN",
    siteName: "Stock Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Stock Market Tracker - Real-time NSE Stock Dashboard",
    description:
      "Track real-time Indian stock market data with advanced filtering and professional analytics",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function MarketTimings() {
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const isMarketOpen =
    (!isWeekend && now.getHours() >= 9 && now.getHours() < 15) ||
    (now.getHours() === 15 && now.getMinutes() <= 30);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Market Status</h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isMarketOpen
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isMarketOpen ? "Market Open" : "Market Closed"}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Regular Trading Hours
          </h3>
          <p className="mt-1 text-sm text-gray-900">9:15 AM - 3:30 PM (IST)</p>
          <p className="text-sm text-gray-500">Monday to Friday</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Pre-Market Session
          </h3>
          <p className="mt-1 text-sm text-gray-900">9:00 AM - 9:15 AM (IST)</p>
          <p className="text-sm text-gray-500">Monday to Friday</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Indian Stock Market Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Real-time tracking of NSE stocks with advanced analytics, market
            timings, and custom portfolio management
          </p>
        </div>

        <MarketTimings />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <StockDashboard />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Data provided by Yahoo Finance. Updates every minute.</p>
          <p className="mt-1">
            © {new Date().getFullYear()} Stock Tracker. All rights reserved.
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-xs">
              Disclaimer: This is not financial advice. Please do your own
              research before making investment decisions.
            </p>
            <p className="text-xs">
              Market data may be delayed by up to 15 minutes.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
