import { useState } from "react";
import { Link } from "react-router";

import { StockCurveHeader } from "@/components/stockcurve-app";

type PortfolioToken = {
  symbol: string;
  name: string;
  amount: string;
  avg: string;
  current: string;
  value: string;
  pnl: number;
  progress: number;
  tone: string;
  mark: string;
  graduated?: boolean;
};

const holdings: PortfolioToken[] = [
  {
    symbol: "AAPLX",
    name: "AAPLx Curve",
    amount: "1,240",
    avg: "$0.000445",
    current: "$0.000482",
    value: "$597.68",
    pnl: 8.2,
    progress: 64,
    tone: "apple",
    mark: "A",
  },
  {
    symbol: "SPNK",
    name: "SolPunk",
    amount: "8,400",
    avg: "$0.0142",
    current: "$0.0129",
    value: "$108.36",
    pnl: -9.1,
    progress: 38,
    tone: "fable",
    mark: "S",
  },
  {
    symbol: "TSLAX",
    name: "TSLAx Fast",
    amount: "2,100",
    avg: "$0.318",
    current: "$0.482",
    value: "$1,012.20",
    pnl: 51.6,
    progress: 91,
    tone: "tesla",
    mark: "T",
  },
  {
    symbol: "GNS",
    name: "USDC Genesis",
    amount: "540",
    avg: "$6.10",
    current: "$7.04",
    value: "$3,801.60",
    pnl: 15.4,
    progress: 100,
    tone: "nvidia",
    mark: "G",
    graduated: true,
  },
  {
    symbol: "NVDAX",
    name: "NVDAx Prime",
    amount: "760",
    avg: "$0.780",
    current: "$0.620",
    value: "$471.20",
    pnl: -20.5,
    progress: 72,
    tone: "moss",
    mark: "N",
  },
  {
    symbol: "MOONX",
    name: "MoonX",
    amount: "42,000",
    avg: "$0.0000090",
    current: "$0.0000210",
    value: "$8.82",
    pnl: 133,
    progress: 6,
    tone: "lilac",
    mark: "M",
  },
];

const launched = [
  {
    symbol: "AAPLX",
    name: "AAPLx Curve",
    cap: "$482K",
    status: "Live",
    tone: "apple",
    mark: "A",
  },
  {
    symbol: "GNS",
    name: "USDC Genesis",
    cap: "$3.8M",
    status: "Graduated",
    tone: "nvidia",
    mark: "G",
  },
  {
    symbol: "MOONX",
    name: "MoonX",
    cap: "$12K",
    status: "Live",
    tone: "lilac",
    mark: "M",
  },
];

const portfolioPaths: Record<string, string> = {
  "7D": "M0 138 L54 134 L108 140 L162 119 L216 124 L270 101 L324 108 L378 80 L432 87 L486 65 L540 75 L594 49 L648 57 L702 31 L760 23",
  "30D":
    "M0 143 L54 136 L108 144 L162 125 L216 131 L270 105 L324 113 L378 84 L432 91 L486 70 L540 79 L594 52 L648 59 L702 34 L760 18",
  "90D":
    "M0 149 L54 142 L108 131 L162 138 L216 119 L270 125 L324 98 L378 107 L432 81 L486 87 L540 63 L594 73 L648 45 L702 55 L760 16",
  ALL: "M0 150 L54 148 L108 135 L162 140 L216 122 L270 129 L324 103 L378 110 L432 84 L486 91 L540 67 L594 74 L648 49 L702 58 L760 17",
};

export function meta() {
  return [{ title: "Portfolio — curv" }];
}

export default function PortfolioRoute() {
  const [range, setRange] = useState("30D");
  const path = portfolioPaths[range];
  const area = `${path} L760 166 L0 166 Z`;

  return (
    <div className="sc-app-shell">
      <StockCurveHeader active="Portfolio" />
      <main className="sc-portfolio-page">
        <div className="sc-portfolio-title-row">
          <h1>
            Your <em>Portfolio</em>
          </h1>
          <span className="sc-wallet-address">
            <i /> 7xKp · 4mQz <small>DEMO</small>
          </span>
        </div>
        <section className="sc-portfolio-overview">
          <div>
            <span>Total portfolio value</span>
            <strong>$4,182.60</strong>
          </div>
          <div>
            <span>Total P&amp;L</span>
            <strong className="positive">
              ▲ +$612.30 <small>(17.2%)</small>
            </strong>
          </div>
          <div>
            <span>Tokens launched</span>
            <strong>3</strong>
          </div>
          <div>
            <span>Total invested</span>
            <strong>$3,570.30</strong>
          </div>
        </section>
        <section className="sc-portfolio-chart-card">
          <div className="sc-portfolio-chart-head">
            <h2>Portfolio value</h2>
            <div className="sc-chart-range">
              {Object.keys(portfolioPaths).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={range === item}
                  className={range === item ? "selected" : ""}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="sc-portfolio-chart-wrap">
            <div className="sc-portfolio-axis">
              <span>$4,000</span>
              <span>$3,000</span>
              <span>$2,000</span>
              <span>$1,000</span>
              <span>$0</span>
            </div>
            <svg
              viewBox="0 0 760 166"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Portfolio value history ${range}`}
            >
              <defs>
                <linearGradient
                  id="sc-portfolio-fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#51f58c" stopOpacity=".16" />
                  <stop offset="100%" stopColor="#51f58c" stopOpacity=".015" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((row) => (
                <line key={row} x1="0" x2="760" y1={row * 41} y2={row * 41} />
              ))}
              <path d={area} fill="url(#sc-portfolio-fill)" />
              <path d={path} className="sc-portfolio-line" />
            </svg>
          </div>
        </section>
        <section className="sc-holdings-section">
          <h2>Your holdings</h2>
          <div className="sc-holdings-table-wrap">
            <table className="sc-holdings-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Amount held</th>
                  <th>Avg buy price</th>
                  <th>Current price</th>
                  <th>Value</th>
                  <th>P&amp;L</th>
                  <th>Curve status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => (
                  <tr key={item.symbol}>
                    <td>
                      <span className={`sc-holding-mark ${item.tone}`}>
                        {item.mark}
                      </span>
                      <span className="sc-holding-name">
                        <strong>{item.name}</strong>
                        <small>${item.symbol}</small>
                      </span>
                    </td>
                    <td>
                      {item.amount} {item.symbol}
                    </td>
                    <td>{item.avg}</td>
                    <td>{item.current}</td>
                    <td>{item.value}</td>
                    <td className={item.pnl >= 0 ? "positive" : "negative"}>
                      {item.pnl >= 0 ? "▲" : "▼"} {Math.abs(item.pnl)}%
                    </td>
                    <td>
                      {item.graduated ? (
                        <span className="sc-graduated-pill">✓ Graduated</span>
                      ) : (
                        <span className="sc-holding-progress">
                          <i style={{ width: `${item.progress}%` }} />
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        className="sc-button sc-button-secondary sc-trade-link"
                        to={`/pool/${item.symbol.toLowerCase()}`}
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="sc-launched-section">
          <h2>Tokens you launched</h2>
          <div className="sc-creator-earnings-summary">
            <div className="sc-creator-earnings-summary-head">
              <h3>Creator earnings</h3>
              <span>Across 3 created coins</span>
            </div>
            <div className="sc-creator-earnings-summary-totals">
              <div>
                <span>Base-token totals</span>
                <strong>18,240 AAPLX · 42.6 GNS · 2,400,000 MOONX</strong>
              </div>
              <div>
                <span>Quote-token totals</span>
                <strong>1.284 SOL · 38.6 USDC</strong>
              </div>
            </div>
          </div>
          <div className="sc-launched-grid">
            {launched.map((item) => (
              <article className="sc-launched-card" key={item.symbol}>
                <div className="sc-launched-heading">
                  <span className={`sc-holding-mark ${item.tone}`}>
                    {item.mark}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>${item.symbol}</small>
                  </span>
                  <i className={item.status === "Graduated" ? "graduated" : ""}>
                    {item.status === "Graduated" ? "✓ " : ""}
                    {item.status}
                  </i>
                </div>
                <div className="sc-launched-cap">
                  <span>Mcap</span>
                  <strong>{item.cap}</strong>
                </div>
                <Link
                  className="sc-button sc-button-secondary"
                  to={`/pool/${item.symbol.toLowerCase()}`}
                >
                  Manage
                </Link>
              </article>
            ))}
          </div>
        </section>
        <footer className="sc-page-foot sc-reference-footer">
          <span>
            curv <i>© 2024 All rights reserved</i>
          </span>
          <div className="sc-footer-socials" aria-label="curv social channels">
            <span>Follow curv</span>
            <b>X</b>
            <b>Discord</b>
            <b>Telegram</b>
          </div>
          <span>
            <b>Docs</b>
            <b>Terms</b>
          </span>
        </footer>
      </main>
    </div>
  );
}
