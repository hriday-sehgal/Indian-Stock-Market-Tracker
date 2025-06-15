import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

// Common Indian stocks with their sectors
const STOCK_SECTORS: { [key: string]: string } = {
  "RELIANCE.NS": "Energy",
  "TCS.NS": "Technology",
  "HDFCBANK.NS": "Financial Services",
  "INFY.NS": "Technology",
  "ICICIBANK.NS": "Financial Services",
  "HINDUNILVR.NS": "Consumer Goods",
  "SBIN.NS": "Financial Services",
  "BHARTIARTL.NS": "Telecommunications",
  "KOTAKBANK.NS": "Financial Services",
  "BAJFINANCE.NS": "Financial Services",
  "ASIANPAINT.NS": "Consumer Goods",
  "AXISBANK.NS": "Financial Services",
  "MARUTI.NS": "Automotive",
  "LT.NS": "Construction",
  "TITAN.NS": "Consumer Goods",
  "SUNPHARMA.NS": "Healthcare",
  "NESTLEIND.NS": "Consumer Goods",
  "ONGC.NS": "Energy",
  "POWERGRID.NS": "Utilities",
  "NTPC.NS": "Utilities",
};

const DEFAULT_STOCKS = Object.keys(STOCK_SECTORS);

// Rate limiting setup
const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const requestCounts = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Get existing requests for this IP
  const requests = requestCounts.get(ip) || [];

  // Remove old requests outside the window
  const recentRequests = requests.filter((time) => time > windowStart);

  // Check if rate limit is exceeded
  if (recentRequests.length >= RATE_LIMIT) {
    return true;
  }

  // Add new request
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return false;
}

export async function GET(request: Request) {
  try {
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const customSymbols = searchParams.get("customSymbols")?.split(",") || [];
    const limit = parseInt(searchParams.get("limit") || "20");

    // Combine default and custom symbols, removing duplicates
    const allSymbols = Array.from(
      new Set([...DEFAULT_STOCKS, ...customSymbols])
    );

    const quotes = await yahooFinance.quote(allSymbols, {
      fields: [
        "symbol",
        "shortName",
        "regularMarketPrice",
        "regularMarketChange",
        "regularMarketChangePercent",
        "regularMarketVolume",
        "marketCap",
        "regularMarketPreviousClose",
        "regularMarketDayHigh",
        "regularMarketDayLow",
      ],
    });

    const stocks = quotes.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.shortName,
      sector: STOCK_SECTORS[quote.symbol] || "Other",
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      previousClose: quote.regularMarketPreviousClose,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
    }));

    return NextResponse.json(stocks, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
