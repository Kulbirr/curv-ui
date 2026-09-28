import { useMemo, useState, type ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router";

import { StockCurveHeader } from "@/components/stockcurve-app";

type TokenType = "Memecoin" | "Tokenized Stock";
type CurvePreset =
  | "Standard Curve"
  | "Fast Graduation"
  | "Slow Burn"
  | "Stock Tracker";

const presetValues: Record<
  CurvePreset,
  { initial: number; steepness: number; target: number; path: string }
> = {
  "Standard Curve": {
    initial: 0.0000042,
    steepness: 1.8,
    target: 69000,
    path: "M8 144 C74 139 121 123 178 104 S296 66 392 15",
  },
  "Fast Graduation": {
    initial: 0.0000068,
    steepness: 3.2,
    target: 42000,
    path: "M8 144 C45 135 88 97 145 70 S294 28 392 12",
  },
  "Slow Burn": {
    initial: 0.0000021,
    steepness: 0.6,
    target: 120000,
    path: "M8 144 C105 139 202 112 392 52",
  },
  "Stock Tracker": {
    initial: 0.0000042,
    steepness: 1.5,
    target: 750000,
    path: "M8 144 C78 139 104 120 147 106 S226 65 267 53 S333 38 392 14",
  },
};

export function meta() {
  return [{ title: "Launch token — curv" }];
}

export default function LaunchRoute() {
  const [searchParams] = useSearchParams();
  const requestedPreset = searchParams.get("preset") as CurvePreset | null;
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [tokenType, setTokenType] = useState<TokenType>("Memecoin");
  const [underlying, setUnderlying] = useState("");
  const [preset, setPreset] = useState<CurvePreset>(
    requestedPreset && requestedPreset in presetValues
      ? requestedPreset
      : "Standard Curve",
  );
  const [customCurve, setCustomCurve] = useState(
    searchParams.get("mode") === "custom",
  );
  const [initialPrice, setInitialPrice] = useState(
    presetValues[
      requestedPreset && requestedPreset in presetValues
        ? requestedPreset
        : "Standard Curve"
    ].initial,
  );
  const [steepness, setSteepness] = useState(
    presetValues[
      requestedPreset && requestedPreset in presetValues
        ? requestedPreset
        : "Standard Curve"
    ].steepness,
  );
  const [target, setTarget] = useState(
    presetValues[
      requestedPreset && requestedPreset in presetValues
        ? requestedPreset
        : "Standard Curve"
    ].target,
  );
  const [image, setImage] = useState("");
  const [notice, setNotice] = useState("");
  const curvePath = useMemo(() => {
    const bend = Math.max(0.55, Math.min(4.8, steepness));
    const controlY = Math.round(128 - bend * 20);
    const endY = Math.max(10, Math.round(62 - bend * 13));
    return customCurve
      ? `M8 144 C96 144 165 ${controlY} 235 ${controlY} S331 ${endY + 10} 392 ${endY}`
      : presetValues[preset].path;
  }, [customCurve, preset, steepness]);

  const changePreset = (value: CurvePreset) => {
    setPreset(value);
    setInitialPrice(presetValues[value].initial);
    setSteepness(presetValues[value].steepness);
    setTarget(presetValues[value].target);
    setCustomCurve(false);
  };
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };
  const handleLaunch = () => {
    if (!name.trim()) return setNotice("Add a token name before launching.");
    if (!/^[A-Z0-9]{2,10}$/.test(ticker))
      return setNotice("Enter a 2–10 character ticker.");
    if (tokenType === "Tokenized Stock" && !underlying)
      return setNotice("Enter the underlying stock ticker.");
    setNotice("Wallet adapter unavailable. No token was launched.");
  };

  return (
    <div className="sc-app-shell">
      <StockCurveHeader active="Launch" />
      <main className="sc-launch-builder">
        <section className="sc-launch-page-heading">
          <h1>
            Launch a New <em>Token</em>
          </h1>
          <p>
            Deploy a fair-launch bonding curve. No presale, no team allocation.
          </p>
        </section>
        <div className="sc-launch-builder-grid">
          <form
            className="sc-launch-builder-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <section className="sc-builder-section">
              <div className="sc-builder-section-head">
                <span className="sc-section-glyph">◈</span>
                <div>
                  <h2>Token Identity</h2>
                  <p>Basic details that define your token</p>
                </div>
              </div>
              <div className="sc-builder-identity-row">
                <label className="sc-builder-image">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImage}
                    aria-label="Upload token image"
                  />
                  {image ? (
                    <img src={image} alt="Token image preview" />
                  ) : (
                    <>
                      <span>▧</span>
                      <small>Upload image</small>
                    </>
                  )}
                </label>
                <label className="sc-builder-field">
                  <span>Token Name</span>
                  <input
                    value={name}
                    maxLength={32}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Apple Curve"
                  />
                </label>
                <label className="sc-builder-field">
                  <span>Ticker / Symbol</span>
                  <div className="sc-builder-input-prefix">
                    <b>$</b>
                    <input
                      value={ticker}
                      maxLength={10}
                      onChange={(event) =>
                        setTicker(
                          event.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, ""),
                        )
                      }
                      placeholder="AAPLX"
                    />
                  </div>
                </label>
              </div>
              <label className="sc-builder-field sc-builder-description">
                <span>Description</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={240}
                  placeholder="Tell traders what this token is about…"
                  rows={3}
                />
              </label>
            </section>

            <section className="sc-builder-section">
              <div className="sc-builder-section-head">
                <span className="sc-section-glyph">◫</span>
                <div>
                  <h2>Token Type</h2>
                  <p>Choose what your curve represents</p>
                </div>
              </div>
              <div className="sc-token-type-options">
                {(["Memecoin", "Tokenized Stock"] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    aria-pressed={tokenType === type}
                    className={tokenType === type ? "selected" : ""}
                    onClick={() => {
                      setTokenType(type);
                      setTicker(type === "Tokenized Stock" ? "AAPLX" : ticker);
                      setUnderlying(type === "Tokenized Stock" ? "AAPL" : "");
                    }}
                  >
                    <span className="sc-type-icon">
                      {type === "Memecoin" ? "◈" : "⌁"}
                    </span>
                    <strong>{type}</strong>
                    <small>
                      {type === "Memecoin"
                        ? "Pure bonding curve token. Fair launch, community driven."
                        : "Curve references a real-world stock's price action."}
                    </small>
                  </button>
                ))}
              </div>
              {tokenType === "Tokenized Stock" && (
                <label className="sc-builder-field sc-underlying-field">
                  <span>Underlying Ticker</span>
                  <input
                    value={underlying}
                    maxLength={6}
                    onChange={(event) =>
                      setUnderlying(
                        event.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                      )
                    }
                    placeholder="E.G. AAPL, TSLA, NVDA"
                  />
                  <small>
                    ⓘ Tracks real-world stock price as a reference curve
                  </small>
                </label>
              )}
            </section>

            <section className="sc-builder-section sc-curve-settings">
              <div className="sc-builder-section-head">
                <span className="sc-section-glyph">⌁</span>
                <div>
                  <h2>Bonding Curve Settings</h2>
                  <p>Define the price trajectory of your curve</p>
                </div>
              </div>
              <div className="sc-curve-mode-switch">
                <button
                  type="button"
                  className={!customCurve ? "selected" : ""}
                  onClick={() => setCustomCurve(false)}
                >
                  Use a Preset
                </button>
                <button
                  type="button"
                  className={customCurve ? "selected" : ""}
                  onClick={() => setCustomCurve(true)}
                >
                  Custom Curve
                </button>
              </div>
              {!customCurve && (
                <label className="sc-builder-field sc-preset-select">
                  <span>Curve Preset</span>
                  <select
                    value={preset}
                    onChange={(event) =>
                      changePreset(event.target.value as CurvePreset)
                    }
                  >
                    {Object.keys(presetValues).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="sc-builder-range">
                <span>
                  Initial Price <b>{initialPrice.toFixed(7)} SOL</b>
                </span>
                <input
                  type="range"
                  min="0.000001"
                  max="0.00001"
                  step="0.0000001"
                  value={initialPrice}
                  onChange={(event) =>
                    setInitialPrice(Number(event.target.value))
                  }
                />
              </label>
              <label className="sc-builder-range">
                <span>
                  Curve Steepness <b>{steepness.toFixed(1)}x</b>
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={steepness}
                  onChange={(event) => setSteepness(Number(event.target.value))}
                />
              </label>
              <label className="sc-builder-range">
                <span>
                  Graduation Market Cap Target <b>${target.toLocaleString()}</b>
                </span>
                <input
                  type="range"
                  min="18000"
                  max="750000"
                  step="1000"
                  value={target}
                  onChange={(event) => setTarget(Number(event.target.value))}
                />
              </label>
            </section>

            <section className="sc-builder-section sc-social-section">
              <div className="sc-builder-section-head">
                <span className="sc-section-glyph">↗</span>
                <div>
                  <h2>
                    Social Links <small>(optional)</small>
                  </h2>
                  <p>Help traders find your community</p>
                </div>
              </div>
              <label>
                <span>◎</span>
                <input placeholder="Website URL" type="url" />
              </label>
              <label>
                <span>𝕏</span>
                <input placeholder="Twitter / X handle" />
              </label>
              <label>
                <span>◉</span>
                <input placeholder="Telegram link" />
              </label>
            </section>

            <div className="sc-launch-submit-bar">
              <div>
                <span>EST. DEPLOY COST</span>
                <strong>0.02 SOL</strong>
              </div>
              <div className="sc-launch-submit-actions">
                <button
                  className="sc-button sc-button-secondary"
                  type="button"
                  onClick={() => setNotice("Draft saved in this preview.")}
                >
                  Save as Draft
                </button>
                <button
                  className="sc-button sc-button-primary"
                  type="button"
                  onClick={handleLaunch}
                >
                  ↗ Launch Token
                </button>
              </div>
              {notice && (
                <span className="sc-launch-notice" role="status">
                  {notice}
                </span>
              )}
            </div>
          </form>

          <aside className="sc-live-preview-column">
            <section className="sc-live-preview">
              <div className="sc-live-preview-head">
                <h2>Live Preview</h2>
                <span>Discover feed</span>
              </div>
              <article className="sc-preview-token-card">
                <div className="sc-preview-token-head">
                  <span className="sc-preview-token-mark">
                    {image ? (
                      <img src={image} alt="" />
                    ) : (
                      ticker.slice(0, 1) || "?"
                    )}
                  </span>
                  <div>
                    <strong>{name || "Apple Curve"}</strong>
                    <span>${ticker || "AAPLX"}</span>
                  </div>
                  <span className="sc-preview-stock-badge">
                    {tokenType === "Tokenized Stock"
                      ? `Stocks · ${underlying || "AAPL"}`
                      : "Memecoin"}
                  </span>
                </div>
                <div className="sc-preview-card-stats">
                  <span>
                    Mcap<strong>$0</strong>
                  </span>
                  <span>
                    24h<strong>—</strong>
                  </span>
                </div>
                <div className="sc-progress">
                  <span style={{ width: "0%" }} />
                </div>
                <div className="sc-preview-not-launched">
                  <i /> Not launched yet
                </div>
              </article>
            </section>
            <section
              className="sc-fees-disclosure"
              aria-labelledby="sc-fees-heading"
            >
              <div className="sc-live-preview-head">
                <h2 id="sc-fees-heading">Fees</h2>
                <span>Preview</span>
              </div>
              <dl className="sc-fee-rows">
                <div>
                  <dt>Pool creation</dt>
                  <dd>
                    <strong>1 SOL</strong>
                    <span>Paid to Meteora protocol. Curv takes no cut.</span>
                  </dd>
                </div>
                <div>
                  <dt>Trading fees</dt>
                  <dd>
                    <strong>Creator-configurable</strong>
                    <span>
                      Sample decaying schedule: 1.0% → 0.2% per trade.
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Creator fee</dt>
                  <dd>
                    <strong>0.3% per trade</strong>
                    <span>Accrues to the creator wallet.</span>
                  </dd>
                </div>
                <div>
                  <dt>Graduation</dt>
                  <dd>
                    <strong>10% migration fee</strong>
                    <span>Creator receives 50% · migrates to DAMM v2.</span>
                  </dd>
                </div>
              </dl>
            </section>
            <section className="sc-builder-chart-card">
              <div className="sc-builder-chart-title">
                <h2>Curve Preview</h2>
                <span>{customCurve ? "Custom" : preset}</span>
              </div>
              <div className="sc-builder-chart-wrap">
                <span>Price</span>
                <svg
                  viewBox="0 0 400 165"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${customCurve ? "Custom" : preset} sample bonding curve`}
                >
                  <line x1="8" y1="145" x2="392" y2="145" />
                  <line x1="8" y1="12" x2="8" y2="145" />
                  <path d={curvePath} />
                </svg>
                <div>
                  <span>0</span>
                  <span>Supply</span>
                </div>
                <div className="sc-builder-chart-labels">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </section>
            <div className="sc-curve-explainer">
              <span>ⓘ</span>
              <p>
                Your curve determines the price trajectory as buyers purchase
                supply. Steeper curves reward early buyers more.
              </p>
            </div>
          </aside>
        </div>
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
