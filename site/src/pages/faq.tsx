import React from "react";
import { Layout } from "y/layouts/Layout";

const faq: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-slate-300">
          Frequently Asked Questions
        </h1>
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              Will there be support for other currencies?
            </h2>
            <p className="leading-7 text-neutral-50">
              I&apos;m working on adding support for other currencies. This is a
              bit difficult since it goes beyond just converting the market
              prices to the desired currency. Case keys cost strangely different
              amounts in different countries, varying based on both government
              regulations and conversion rates.
            </p>
            <br />
            <p className="italic leading-7 text-green-500">
              TL;DR: I&apos;m working on it, might just convert USD to the
              desired currency for now.
            </p>
          </div>
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
              Select (click on the case image) cases from the main page and
              enter the amount of each case you want to unbox. The total cost
              will be displayed along with a breakdown of other costs.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-400">
              Are the case prices accurate?
            </h2>
            <p className="leading-7 text-neutral-50">
              Yes. Case prices are fetched directly from the Steam marketplace
              and are updated every 15 minutes (to ward off their unclear rate
              limits).
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
              How do <span className="text-green-500">donations </span>
              work?
            </h2>
            <p className="leading-7 text-neutral-50">
              If you feel this tool saved you some time you can donate skins via
              the &quot;Donate&quot; button. All skins are appreciated, but
              certainly not necessary.
            </p>
            <br />
            <p className="leading-7 text-green-500">
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
