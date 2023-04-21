import React from "react";
import { MainArea } from "../components/MainArea";
import { MetaHeader } from "y/components/MetaHeader";
import { Layout } from "y/layouts/Layout";

const HomePage: React.FC = () => {
  return (
    <div>
      <MetaHeader />
      <Layout>
        <MainArea />
      </Layout>
    </div>
  );
};

export default HomePage;
