import ServerHeroStatus from "../components/overview/ServerHeroStatus";
import OnlinePlayers from "../components/overview/OnlinePlayers";
import ServerInfoCard from "../components/overview/ServerInfoCard";
import ServerResources from "../components/overview/ServerResources";
import RecentActivity from "../components/overview/RecentActivity";

export default function OverviewPage() {
  return (
    <section className="space-y-6">
      <h1 className="sr-only">Overview</h1>
      <ServerHeroStatus />
      <div className="grid gap-6 lg:grid-cols-2">
        <OnlinePlayers />
        <div className="space-y-6">
          <ServerInfoCard />
          <ServerResources />
        </div>
      </div>
      <RecentActivity />
    </section>
  );
}