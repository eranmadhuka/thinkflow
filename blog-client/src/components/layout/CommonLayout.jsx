import { Outlet } from "react-router-dom";
import Header from "../common/Header";

const CommonLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
};

export default CommonLayout;
