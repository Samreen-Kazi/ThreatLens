import {
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import BulkUpload from "./pages/BulkUpload";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/bulk"
          element={<BulkUpload />}
        />

        <Route
          path="*"
          element={
            <main className="min-h-screen px-4 py-20 text-center">
              <h1 className="text-4xl font-semibold text-white">
                Page not found
              </h1>

              <p className="mt-4 text-slate-400">
                The requested page does not exist.
              </p>
            </main>
          }
        />
      </Routes>
    </>
  );
}


export default App;