import React from "react";
import { Layout } from "y/layouts/Layout";

const faq: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-neutral-200">
          Frequently Asked Questions
        </h1>
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              How does the cost calculator work?
            </h2>
            <p className="leading-7 text-slate-400">
              Total Cost ={" "}
              <span className="text-green-500">
                (case price + key price) • case quantity
              </span>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              How do I use the cost calculator?
            </h2>
            <p className="leading-7 text-slate-400">
              Select cases from the main page and enter the amount of each case
              you want to unbox. The total cost will be calculated and
              displayed.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              Where are the prices sourced from?
            </h2>
            <p className="leading-7 text-slate-400">
              They&apos;re fetched directly from the Steam marketplace and are
              updated every 15 minutes or so
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              How often are currency exchange rates updated?
            </h2>
            <p className="leading-7 text-slate-400">Every 24 hours.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              Do you guarantee any profit from unboxing?
            </h2>
            <p className="leading-7 text-slate-400">
              No, unboxing is a game of chance with a risk of loss. This tool
              estimates unboxing costs, not financial outcomes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-200">
              How do <span className="text-green-500">donations </span>
              work?
            </h2>
            <p className="leading-7 text-slate-400">
              If you feel this tool saved you some time you can donate skins via
              the &quot;Donate&quot; button. All skins are appreciated, but
              certainly not necessary.
            </p>
            <br />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default faq;
