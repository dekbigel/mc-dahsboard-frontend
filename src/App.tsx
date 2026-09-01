import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ActivityPage from "./pages/ActivityPage";
import OverviewPage from "./pages/OverviewPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import PlayersPage from "./pages/PlayersPage";
import StatisticsPage from "./pages/StatisticsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:id" element={<PlayerProfilePage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="*" element={<OverviewPage />} />
      </Route>
    </Routes>
  );
}