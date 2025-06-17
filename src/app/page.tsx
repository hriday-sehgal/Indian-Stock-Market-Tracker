import StockDashboard from "../components/StockDashboard";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Indian Stock Market Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Real-time tracking of NSE stocks with advanced analytics and custom
            portfolio management
          </p>
        </div>

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
