import React from "react";
import { Layout } from "y/layouts/Layout";

const faq: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-green-500">
          Frequently Asked Questions
        </h1>
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              How does the cost calculator work?
            </h2>
            <p className="leading-7 text-neutral-50">
              Total Cost ={" "}
              <span className="text-green-500">
                (case price + key price) * quantity
              </span>
            </p>
            <p className="leading-7 text-neutral-50">
              Repeat for each case, add up the total.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              How do I use the cost calculator?
            </h2>
            <p className="leading-7 text-neutral-50">
              Click on cases from the main page, adjust the quantity for each
              case by double clicking (or CTRL+A) & changing the amount.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              How accurate are the case prices?
            </h2>
            <p className="leading-7 text-neutral-50">
              Case prices are fetched directly from the Steam marketplace and
              are updated every 15 minutes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              Do you guarantee any profit from unboxing?
            </h2>
            <p className="leading-7 text-neutral-50">
              No, unboxing is a game of chance with a risk of loss. This tool
              estimates unboxing costs, not financial outcomes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              How do donations work?
            </h2>
            <p className="leading-7 text-neutral-50">
              If you feel this tool saved you some time you can donate skins via
              the "Donate" button. All skins are appreciated, but certainly not
              necessary.
            </p>
            <br />
            <p className="leading-7 text-neutral-50">
              Some will be liquidated to cover server costs, others will be used
              by me in comp games :)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default faq;
