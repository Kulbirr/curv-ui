import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import {
  discoverTokens,
  QuoteBadge,
  StockCurveHeader,
  TokenAvatar,
} from "@/components/stockcurve-app";

type PairFilter = "All" | "SOL" | "USDC" | "Stocks";
type ActivityFilter = "All" | "New" | "Graduating Soon";
type SortOrder = "Hot" | "New" | "Graduating Soon";

const activity = [
  { side: "BUY", amount: "2.4 SOL", ticker: "$AAPLX" },
  { side: "SELL", amount: "0.8 SOL", ticker: "$SPNK" },
  { side: "BUY", amount: "5.1 SOL", ticker: "$TSLAX" },
  { side: "BUY", amount: "1.2 SOL", ticker: "$NVDAX" },
  { side: "SELL", amount: "3.6 SOL", ticker: "$DOGEC" },
  { side: "BUY", amount: "0.6 SOL", ticker: "$GNS" },
  { side: "SELL", amount: "1.9 SOL", ticker: "$MOONX" },
];

export function meta() {
  return [
    { title: "curv — Discover" },
    {
      name: "description",
      content: "Discover and trade creator-designed bonding curves on Solana.",
    },
  ];
}

export default function DiscoverRoute() {
  const [pair, setPair] = useState<PairFilter>("All");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("All");
  const [sort, setSort] = useState<SortOrder>("Hot");
  const [showAll, setShowAll] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search") ?? "";
  const tokens = useMemo(() => {
    const visible = discoverTokens.filter((token) => {
      const pairMatch =
        pair === "All" ||
        (pair === "Stocks" ? token.pair.endsWith("x") : token.pair === pair);
      const activityMatch =
        activityFilter === "All" ||
        (activityFilter === "New"
          ? token.isNew
          : token.progress >= 80 && !token.graduated);
      const queryMatch = `${token.symbol} ${token.name} ${token.pair}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return pairMatch && activityMatch && queryMatch;
    });
    if (sort === "Hot") return visible;
    if (sort === "Graduating Soon")
      return visible.sort((a, b) => b.progress - a.progress);
    return visible.sort(
      (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
    );
  }, [activityFilter, pair, query, sort]);
  const displayed =
    showAll || query || pair !== "All" || activityFilter !== "All"
      ? tokens
      : tokens.slice(0, 8);

  return (
    <div className="sc-app-shell">
      <StockCurveHeader active="Discover" />
      <main className="sc-discover-page">
        <section className="sc-discover-hero">
          <div className="sc-discover-intro">
            <span className="sc-mainnet-label">
              <i /> MARKET PREVIEW · SOLANA MAINNET
            </span>
            <h1>
              Launch a token on a curve <em>you design</em>
            </h1>
            <p>
              Bonding curve launches for memecoins and tokenized stock-style
              assets. No presale, no team allocation — fair curves that graduate
              to DEX liquidity.
            </p>
            <div className="sc-discover-ctas">
              <Link to="/launch" className="sc-button sc-button-primary">
                <span aria-hidden="true">↗</span> Launch token
              </Link>
              <Link to="/presets" className="sc-button sc-button-secondary">
                View presets
              </Link>
            </div>
          </div>
          <div className="sc-platform-stats">
            <div>
              <span>Tokens launched</span>
              <strong>12,482</strong>
            </div>
            <div>
              <span>Volume (24h)</span>
              <strong className="sc-stat-green">$84.2M</strong>
            </div>
            <div>
              <span>Graduated to DEX</span>
              <strong>341</strong>
            </div>
            <div>
              <span>Active traders</span>
              <strong>28.6K</strong>
            </div>
          </div>
        </section>

        <section className="sc-tape" aria-label="Recent trade activity">
          <div className="sc-tape-track">
            {[...activity, ...activity].map((trade, index) => (
              <span
                key={`${trade.ticker}-${index}`}
                className={trade.side === "BUY" ? "positive" : "negative"}
              >
                {trade.side === "BUY" ? "↑" : "↓"} {trade.side} {trade.amount} →{" "}
                {trade.ticker}
                <i>·</i>
              </span>
            ))}
          </div>
        </section>

        <section className="sc-discover-market" aria-label="Discover tokens">
          <div className="sc-discover-filterbar">
            <div className="sc-filter-group" aria-label="Quote pair filters">
              {(["All", "SOL", "USDC", "Stocks"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={pair === option}
                  className={pair === option ? "selected" : ""}
                  onClick={() => setPair(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div
              className="sc-filter-group sc-activity-filters"
              aria-label="Activity filters"
            >
              {(["New", "Graduating Soon"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={activityFilter === option}
                  className={activityFilter === option ? "selected" : ""}
                  onClick={() =>
                    setActivityFilter(
                      activityFilter === option ? "All" : option,
                    )
                  }
                >
                  {option}
                </button>
              ))}
            </div>
            <label className="sc-hot-sort">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOrder)}
              >
                <option>Hot</option>
                <option>New</option>
                <option>Graduating Soon</option>
              </select>
            </label>
          </div>

          {displayed.length ? (
            <div className="sc-token-grid">
              {displayed.map((token) => (
                <Link
                  key={`${token.name}-${token.symbol}`}
                  className="sc-token-card"
                  to={`/pool/${token.symbol.toLowerCase()}`}
                >
                  <div className="sc-token-card-top">
                    <TokenAvatar token={token} />
                    <div className="sc-token-identity">
                      <strong>{token.name}</strong>
                      <span>${token.symbol}</span>
                    </div>
                    <QuoteBadge pair={token.pair} />
                  </div>
                  <div className="sc-token-price-row">
                    <strong className="sc-number">{token.price}</strong>
                    <span
                      className={token.change >= 0 ? "positive" : "negative"}
                    >
                      {token.change > 0 ? "+" : "−"}
                      {Math.abs(token.change).toFixed(2)}%
                    </span>
                  </div>
                  <div className="sc-discover-progress-head">
                    <span>
                      {token.graduated ? "Graduated" : "Curve progress"}
                    </span>
                    <span className="sc-number">{token.progress}%</span>
                  </div>
                  <div
                    className={`sc-progress ${token.graduated ? "graduated" : ""}`}
                  >
                    <span style={{ width: `${token.progress}%` }} />
                  </div>
                  <div className="sc-token-card-foot">
                    <span>
                      MC <b>{token.cap}</b>
                    </span>
                    <span>
                      VOL <b>{token.volume}</b>
                    </span>
                    <span className="sc-open-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="sc-empty-market">
              <span>No tokens match those filters.</span>
              <button
                type="button"
                onClick={() => {
                  setPair("All");
                  setActivityFilter("All");
                  setSearchParams({});
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          {tokens.length > 8 &&
            !showAll &&
            !query &&
            pair === "All" &&
            activityFilter === "All" && (
              <button
                type="button"
                className="sc-load-more"
                onClick={() => setShowAll(true)}
              >
                Load more tokens
              </button>
            )}
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
