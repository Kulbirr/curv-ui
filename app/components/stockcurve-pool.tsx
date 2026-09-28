import { useMemo, useState } from "react";
import { Link } from "react-router";

import {
  CurveMark,
  marketTokens,
  QuoteBadge,
  StockCurveHeader,
  TokenAvatar,
} from "@/components/stockcurve-app";

type Timeframe = "1H" | "24H" | "7D" | "30D" | "ALL";
type TradeSide = "Buy" | "Sell";
type TradeTab = "Trades" | "Holders" | "Info";

const timeframes: Timeframe[] = ["1H", "24H", "7D", "30D", "ALL"];
const chartPaths: Record<Timeframe, string> = {
  "1H": "M 14 277 L 76 264 L 131 269 L 191 239 L 253 246 L 314 208 L 373 220 L 433 183 L 494 190 L 551 148 L 611 155 L 669 112 L 728 122 L 786 75",
  "24H":
    "M 14 288 L 69 278 L 124 284 L 183 254 L 238 261 L 295 222 L 352 232 L 408 198 L 467 204 L 523 163 L 579 174 L 637 126 L 693 137 L 742 92 L 786 73",
  "7D": "M 14 284 L 68 279 L 123 251 L 179 258 L 234 231 L 290 238 L 346 207 L 402 216 L 458 170 L 514 183 L 570 145 L 626 155 L 681 114 L 737 122 L 786 68",
  "30D":
    "M 14 291 L 70 273 L 125 281 L 180 246 L 235 256 L 291 222 L 348 229 L 404 192 L 459 206 L 515 159 L 571 171 L 626 134 L 682 139 L 738 102 L 786 55",
  ALL: "M 14 294 L 69 286 L 123 274 L 180 280 L 235 247 L 291 252 L 347 223 L 403 230 L 459 189 L 515 196 L 571 151 L 627 163 L 682 120 L 737 132 L 786 63",
};

const trades = [
  {
    side: "BUY",
    amount: "2.4 SOL",
    tokens: "5,120",
    price: "$0.00482",
    wallet: "7xKp · 4mQz",
    time: "12s ago",
  },
  {
    side: "SELL",
    amount: "0.8 SOL",
    tokens: "1,680",
    price: "$0.00478",
    wallet: "9tRw · 2xVn",
    time: "48s ago",
  },
  {
    side: "BUY",
    amount: "5.1 SOL",
    tokens: "10,940",
    price: "$0.00466",
    wallet: "3vBc · 8kLp",
    time: "2m ago",
  },
  {
    side: "BUY",
    amount: "1.2 SOL",
    tokens: "2,610",
    price: "$0.00460",
    wallet: "5hNq · 1dTs",
    time: "4m ago",
  },
  {
    side: "SELL",
    amount: "3.6 SOL",
    tokens: "7,940",
    price: "$0.00454",
    wallet: "2mZx · 6qWe",
    time: "7m ago",
  },
  {
    side: "BUY",
    amount: "0.6 SOL",
    tokens: "1,340",
    price: "$0.00448",
    wallet: "8jUy · 3fBn",
    time: "11m ago",
  },
];

const holders = [
  { wallet: "7xKp · 4mQz", amount: "1,240,000", share: "8.42%" },
  { wallet: "9tRw · 2xVn", amount: "840,200", share: "5.71%" },
  { wallet: "3vBc · 8kLp", amount: "612,400", share: "4.16%" },
  { wallet: "5hNq · 1dTs", amount: "481,900", share: "3.27%" },
];

export function StockCurvePool({ symbol }: { symbol: string }) {
  const token =
    marketTokens.find(
      (item) => item.symbol.toLowerCase() === symbol.toLowerCase(),
    ) ?? marketTokens[0];
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");
  const [side, setSide] = useState<TradeSide>("Buy");
  const [tab, setTab] = useState<TradeTab>("Trades");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1.0");
  const [tradeMessage, setTradeMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const ticker = `$${token.symbol}`;
  const price = Number.parseFloat(token.price.replace("$", ""));
  const progress = token.progress;
  const graduationTarget = "$750,000";
  const mint = `Sample mint for ${token.symbol}`;
  const currentPath = chartPaths[timeframe];
  const areaPath = `${currentPath} L 786 318 L 14 318 Z`;
  const estimatedReceive = useMemo(() => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return "0";
    if (side === "Buy")
      return Math.floor(
        (value * 2_133) / (1 + progress / 500),
      ).toLocaleString();
    return `${((value * price) / 145).toFixed(4)} SOL`;
  }, [amount, price, progress, side]);

  const copyMint = async () => {
    try {
      await navigator.clipboard.writeText(mint);
      setCopyMessage("Sample mint copied");
      window.setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Clipboard unavailable");
      window.setTimeout(() => setCopyMessage(""), 1800);
    }
  };

  const setQuickAmount = (percent: number) => {
    const demoBalance = side === "Buy" ? 2.4 : 1_240;
    setAmount((demoBalance * percent).toFixed(side === "Buy" ? 2 : 0));
    setTradeMessage("");
  };

  return (
    <div className="sc-app-shell">
      <StockCurveHeader active="Discover" />
      <main className="sc-pool-page">
        <div className="sc-pool-breadcrumb">
          <Link to="/">Discover</Link>
          <span>›</span>
          <strong>{token.name}</strong>
          <span className="sc-demo-flag">DEMO DATA</span>
        </div>
        <div className="sc-pool-layout">
          <div className="sc-pool-main-column">
            <section className="sc-pool-token-head">
              <TokenAvatar token={token} />
              <div className="sc-pool-token-identity">
                <div className="sc-pool-title-row">
                  <h1>{token.name}</h1>
                  <QuoteBadge pair={token.pair} />
                  <span className="sc-pool-graduation-badge">
                    {progress}% to graduation
                  </span>
                </div>
                <span className="sc-pool-ticker">{ticker}</span>
                <div className="sc-pool-creator">
                  <span>Creator</span>
                  <code>7xKp · 4mQz</code>
                  <button
                    type="button"
                    onClick={copyMint}
                    aria-label="Copy sample mint address"
                  >
                    {copyMessage || "Copy sample mint"}
                  </button>
                </div>
              </div>
              <span className="sc-copy-feedback" role="status">
                {copyMessage}
              </span>
            </section>

            <section className="sc-pool-stats" aria-label="Token statistics">
              <div>
                <span>Market cap</span>
                <strong>{token.cap}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>{token.price}</strong>
              </div>
              <div>
                <span>Volume 24h</span>
                <strong>{token.volume}</strong>
              </div>
              <div>
                <span>24h change</span>
                <strong className={token.change >= 0 ? "positive" : "negative"}>
                  {token.change > 0 ? "▲" : "▼"}{" "}
                  {Math.abs(token.change).toFixed(1)}%
                </strong>
              </div>
              <div>
                <span>Holders</span>
                <strong>1,842</strong>
              </div>
            </section>

            <section className="sc-pool-chart-card">
              <div className="sc-pool-section-head">
                <h2>Price chart</h2>
                <div className="sc-chart-range" aria-label="Chart timeframe">
                  {timeframes.map((range) => (
                    <button
                      key={range}
                      type="button"
                      aria-pressed={timeframe === range}
                      className={timeframe === range ? "selected" : ""}
                      onClick={() => setTimeframe(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sc-pool-chart-wrap">
                <div className="sc-chart-y-axis">
                  <span>$0.006</span>
                  <span>$0.004</span>
                  <span>$0.002</span>
                  <span>$0</span>
                </div>
                <svg
                  className="sc-pool-price-chart"
                  viewBox="0 0 800 330"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${token.name} sample price chart`}
                >
                  <defs>
                    <linearGradient
                      id="sc-pool-fill"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#32f27b" stopOpacity=".18" />
                      <stop offset="100%" stopColor="#32f27b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((line) => (
                    <line
                      key={line}
                      x1="14"
                      x2="786"
                      y1={35 + line * 86}
                      y2={35 + line * 86}
                      className="sc-pool-grid-line"
                    />
                  ))}
                  <path d={areaPath} fill="url(#sc-pool-fill)" />
                  <path d={currentPath} className="sc-pool-price-line" />
                  <circle
                    cx="786"
                    cy={Number(currentPath.split(" ").slice(-1)[0])}
                    r="4"
                    className="sc-pool-price-point"
                  />
                </svg>
              </div>
              <div className="sc-chart-time-labels">
                <span>09:00</span>
                <span>12:00</span>
                <span>15:00</span>
                <span>18:00</span>
                <span>NOW</span>
              </div>
            </section>

            <section className="sc-pool-graduation-card">
              <div className="sc-pool-section-head">
                <h2>Bonding curve progress</h2>
                <strong className="sc-number sc-green-text">{progress}%</strong>
              </div>
              <div className="sc-progress sc-pool-progress">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="sc-graduation-foot">
                <span>
                  <b>{token.cap}</b> / <b>{graduationTarget}</b> to graduation
                </span>
                <span>Graduates to Meteora DAMM v2</span>
              </div>
            </section>

            <section
              className="sc-creator-earnings-panel"
              aria-labelledby="sc-creator-earnings-title"
            >
              <div className="sc-creator-earnings-head">
                <h2 id="sc-creator-earnings-title">Creator earnings</h2>
                <span>Creator-only</span>
              </div>
              <dl className="sc-creator-earnings-balances">
                <div>
                  <dt>Base token</dt>
                  <dd>18,420 {token.symbol}</dd>
                </div>
                <div>
                  <dt>Quote token</dt>
                  <dd>3.482 {token.pair}</dd>
                </div>
              </dl>
              <div className="sc-creator-earnings-actions">
                <span>Updated 18s ago</span>
                <button
                  className="sc-button sc-button-primary"
                  type="button"
                  onClick={() =>
                    setClaimMessage("Demo only — no tokens were transferred.")
                  }
                >
                  Claim
                </button>
              </div>
              {claimMessage && (
                <p className="sc-creator-claim-message" role="status">
                  {claimMessage}
                </p>
              )}
            </section>

            <section className="sc-pool-activity-card">
              <div
                className="sc-pool-tabs"
                role="tablist"
                aria-label="Pool activity"
              >
                {(["Trades", "Holders", "Info"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={tab === item}
                    className={tab === item ? "selected" : ""}
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {tab === "Trades" && (
                <div className="sc-trade-table-wrap">
                  <table className="sc-trade-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Tokens</th>
                        <th>Price</th>
                        <th>Trader</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade, index) => (
                        <tr key={`${trade.wallet}-${index}`}>
                          <td
                            className={
                              trade.side === "BUY" ? "positive" : "negative"
                            }
                          >
                            {trade.side}
                          </td>
                          <td>{trade.amount}</td>
                          <td>
                            {trade.tokens} {token.symbol}
                          </td>
                          <td>{trade.price}</td>
                          <td>{trade.wallet}</td>
                          <td>{trade.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "Holders" && (
                <div className="sc-trade-table-wrap">
                  <table className="sc-trade-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Wallet</th>
                        <th>Amount held</th>
                        <th>Supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holders.map((holder, index) => (
                        <tr key={holder.wallet}>
                          <td>0{index + 1}</td>
                          <td>{holder.wallet}</td>
                          <td>
                            {holder.amount} {token.symbol}
                          </td>
                          <td>{holder.share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "Info" && (
                <div className="sc-pool-info-list">
                  <div>
                    <span>Curve type</span>
                    <strong>Exponential</strong>
                  </div>
                  <div>
                    <span>Initial price</span>
                    <strong>$0.0000042</strong>
                  </div>
                  <div>
                    <span>Curve steepness</span>
                    <strong>1.8×</strong>
                  </div>
                  <div>
                    <span>Creator fee</span>
                    <strong>0.3%</strong>
                  </div>
                  <div>
                    <span>Graduation target</span>
                    <strong>{graduationTarget}</strong>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="sc-pool-trade-column">
            <section className="sc-trade-panel">
              <div
                className="sc-trade-side-tabs"
                role="tablist"
                aria-label="Trade direction"
              >
                {(["Buy", "Sell"] as const).map((item) => (
                  <button
                    key={item}
                    role="tab"
                    aria-selected={side === item}
                    type="button"
                    className={side === item ? "selected" : ""}
                    onClick={() => {
                      setSide(item);
                      setAmount("");
                      setTradeMessage("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="sc-trade-input-heading">
                <label htmlFor="pool-amount">Amount</label>
                <span>{side === "Buy" ? "SOL" : token.symbol}</span>
              </div>
              <div className="sc-trade-amount">
                <input
                  id="pool-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value.replace(/[^0-9.]/g, ""));
                    setTradeMessage("");
                  }}
                  placeholder="0.00"
                  aria-label={`Amount in ${side === "Buy" ? "SOL" : token.symbol}`}
                />
                <span>{side === "Buy" ? "SOL" : token.symbol}</span>
              </div>
              <div className="sc-quick-amounts">
                {[0.25, 0.5, 0.75, 1].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => setQuickAmount(percent)}
                  >
                    {percent === 1 ? "MAX" : `${percent * 100}%`}
                  </button>
                ))}
              </div>
              <div className="sc-receive-row">
                <span>You receive</span>
                <strong>
                  {side === "Buy"
                    ? `~${estimatedReceive} ${token.symbol}`
                    : `~${estimatedReceive}`}
                </strong>
              </div>
              <div className="sc-trade-settings">
                <label htmlFor="pool-slippage">Slippage</label>
                <select
                  id="pool-slippage"
                  value={slippage}
                  onChange={(event) => setSlippage(event.target.value)}
                >
                  <option value="0.5">0.5%</option>
                  <option value="1.0">1.0%</option>
                  <option value="2.0">2.0%</option>
                </select>
                <span>Trade fee 1%</span>
              </div>
              {tradeMessage && (
                <p className="sc-trade-message" role="status">
                  {tradeMessage}
                </p>
              )}
              <button
                className={`sc-button sc-trade-submit ${side === "Sell" ? "sell" : ""}`}
                type="button"
                onClick={() =>
                  setTradeMessage(
                    "Wallet adapter unavailable. No trade was placed.",
                  )
                }
              >
                {side} {ticker}
              </button>
            </section>
            <section className="sc-position-card">
              <div className="sc-trade-card-label">Your position</div>
              <div className="sc-position-primary">
                <strong>1,240 {ticker}</strong>
                <b className="positive">+8.2%</b>
              </div>
              <div className="sc-position-value">$312.40 value</div>
            </section>
            <section className="sc-pool-info-card">
              <div className="sc-trade-card-label">Curve info</div>
              <div>
                <span>Current price</span>
                <strong>{token.price}</strong>
              </div>
              <div>
                <span>Initial price</span>
                <strong>$0.0000042</strong>
              </div>
              <div>
                <span>Curve steepness</span>
                <strong>1.8×</strong>
              </div>
              <div>
                <span>Graduation target</span>
                <strong>{graduationTarget}</strong>
              </div>
            </section>
            <div className="sc-pool-demo-note">
              <CurveMark /> Sample values only · no trades execute
            </div>
          </aside>
        </div>
        <footer className="sc-page-foot">
          <span>curv protocol</span>
          <div className="sc-footer-socials" aria-label="curv social channels">
            <span>Follow curv</span>
            <b>X</b>
            <b>Discord</b>
            <b>Telegram</b>
          </div>
          <span>
            POWERED BY METEORA DBC <i>·</i> SOLANA
          </span>
        </footer>
      </main>
    </div>
  );
}
