import { useMemo, useState } from "react";
import { Link } from "react-router";

import { StockCurveHeader } from "@/components/stockcurve-app";

type PresetCategory =
  | "Popular"
  | "Fast Graduation"
  | "Slow Burn"
  | "Balanced"
  | "Stocks-Optimized";
type Preset = {
  name: string;
  category: PresetCategory;
  initial: string;
  steepness: string;
  target: string;
  used: string;
  curve: string;
  badge?: string;
};

const presets: Preset[] = [
  {
    name: "Standard Curve",
    category: "Popular",
    initial: "0.0000042 SOL",
    steepness: "1.8x",
    target: "$69,000",
    used: "4,821",
    curve: "M4 66 C35 64 44 56 69 50 S119 34 156 8",
    badge: "Most Popular",
  },
  {
    name: "Fast Graduation",
    category: "Fast Graduation",
    initial: "0.0000068 SOL",
    steepness: "3.2x",
    target: "$42,000",
    used: "2,140",
    curve: "M4 66 C17 59 28 42 52 30 S106 13 156 7",
    badge: "Popular",
  },
  {
    name: "Slow Burn",
    category: "Slow Burn",
    initial: "0.0000021 SOL",
    steepness: "0.6x",
    target: "$120,000",
    used: "986",
    curve: "M4 65 L156 29",
  },
  {
    name: "Whale Deterrent",
    category: "Balanced",
    initial: "0.0000050 SOL",
    steepness: "2.4x (stepped)",
    target: "$95,000",
    used: "612",
    curve: "M4 65 L43 65 L43 48 L84 48 L84 31 L121 31 L121 13 L156 13",
  },
  {
    name: "Degen Special",
    category: "Fast Graduation",
    initial: "0.0000012 SOL",
    steepness: "4.8x",
    target: "$30,000",
    used: "3,305",
    curve: "M4 66 C39 66 52 64 68 39 S105 9 156 8",
    badge: "High Risk",
  },
  {
    name: "Stock Tracker",
    category: "Stocks-Optimized",
    initial: "0.0000042 SOL",
    steepness: "1.5x (ref-adj.)",
    target: "$750,000",
    used: "1,204",
    curve: "M4 64 C34 64 36 53 54 52 S65 37 86 35 S107 30 116 21 S141 18 156 9",
    badge: "Recommended for Stocks",
  },
  {
    name: "Micro Cap Sprint",
    category: "Fast Graduation",
    initial: "0.0000030 SOL",
    steepness: "3.9x",
    target: "$18,000",
    used: "448",
    curve: "M4 65 C31 61 48 50 70 35 S112 13 156 8",
    badge: "New",
  },
  {
    name: "Community Fair Launch",
    category: "Balanced",
    initial: "0.0000038 SOL",
    steepness: "2.1x (S-curve)",
    target: "$60,000",
    used: "2,877",
    curve: "M4 65 C45 64 61 59 80 48 S92 21 156 9",
  },
];

const categories: Array<"All" | PresetCategory> = [
  "All",
  "Popular",
  "Fast Graduation",
  "Slow Burn",
  "Balanced",
  "Stocks-Optimized",
];

export function meta() {
  return [{ title: "Curve Presets — curv" }];
}

export default function PresetsRoute() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const visiblePresets = useMemo(
    () =>
      category === "All"
        ? presets
        : category === "Popular"
          ? presets.filter(
              (preset) =>
                preset.name === "Standard Curve" || preset.badge === "Popular",
            )
          : presets.filter((preset) => preset.category === category),
    [category],
  );

  return (
    <div className="sc-app-shell">
      <StockCurveHeader active="Presets" />
      <main className="sc-presets-page">
        <section className="sc-presets-heading">
          <div>
            <h1>
              Curve <em>Presets</em>
            </h1>
            <p>
              Ready-made bonding curves that set price trajectory and graduation
              speed.
            </p>
          </div>
          <Link
            className="sc-button sc-button-secondary sc-create-preset"
            to="/launch?mode=custom"
          >
            <span>＋</span> Create custom preset
          </Link>
        </section>
        <div
          className="sc-preset-filterbar"
          role="group"
          aria-label="Filter curve presets"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <section className="sc-presets-grid" aria-label="Curve preset list">
          {visiblePresets.map((preset) => (
            <article
              className={`sc-preset-card ${preset.name === "Standard Curve" ? "featured" : ""}`}
              key={preset.name}
            >
              {preset.badge && (
                <span
                  className={`sc-preset-badge ${preset.badge === "High Risk" ? "risk" : preset.badge === "Recommended for Stocks" ? "recommended" : ""}`}
                >
                  {preset.badge}
                </span>
              )}
              <h2>{preset.name}</h2>
              <div className="sc-preset-chart">
                <svg
                  viewBox="0 0 160 78"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${preset.name} supply price curve`}
                >
                  <line x1="4" y1="67" x2="156" y2="67" />
                  <line x1="4" y1="8" x2="4" y2="67" />
                  <path d={preset.curve} />
                </svg>
                <div>
                  <span>Supply</span>
                  <span>Price</span>
                </div>
              </div>
              <dl className="sc-preset-parameters">
                <div>
                  <dt>Initial price</dt>
                  <dd>{preset.initial}</dd>
                </div>
                <div>
                  <dt>Steepness</dt>
                  <dd>{preset.steepness}</dd>
                </div>
                <div>
                  <dt>Grad. target</dt>
                  <dd>{preset.target}</dd>
                </div>
              </dl>
              <div className="sc-preset-used">Used by {preset.used} tokens</div>
              <Link
                className={`sc-button ${preset.name === "Standard Curve" ? "sc-button-primary" : "sc-button-secondary"}`}
                to={`/launch?preset=${encodeURIComponent(preset.name)}`}
              >
                Use this preset
              </Link>
            </article>
          ))}
        </section>
        <section className="sc-preset-compare">
          <h2>Compare presets</h2>
          <div className="sc-preset-table-wrap">
            <table className="sc-preset-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Standard Curve</th>
                  <th>Fast Graduation</th>
                  <th>Slow Burn</th>
                  <th>Stock Tracker</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Initial price</th>
                  <td>0.0000042 SOL</td>
                  <td>0.0000068 SOL</td>
                  <td>0.0000021 SOL</td>
                  <td>0.0000042 SOL</td>
                </tr>
                <tr>
                  <th>Steepness</th>
                  <td>1.8x</td>
                  <td>3.2x</td>
                  <td>0.6x</td>
                  <td>1.5x (ref-adj.)</td>
                </tr>
                <tr>
                  <th>Graduation target</th>
                  <td>$69,000</td>
                  <td>$42,000</td>
                  <td>$120,000</td>
                  <td>$750,000</td>
                </tr>
                <tr>
                  <th>Typical duration</th>
                  <td>~2–4 days</td>
                  <td>~4–10 hrs</td>
                  <td>~2–3 weeks</td>
                  <td>~1–2 weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer className="sc-page-foot sc-reference-footer">
          <span>
            curv <i>© 2024 All rights reserved</i>
          </span>
          <span>
            <b>Docs</b>
            <b>Terms</b>
          </span>
        </footer>
      </main>
    </div>
  );
}
