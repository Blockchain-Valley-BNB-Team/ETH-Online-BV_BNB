import { Footer } from "@/components/Footer";
import { ActivityChart } from "@/components/activity-chart";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Research Ecosystem Dashboard</h1>
            <p className="text-muted-foreground text-lg">Real-time insights into the decentralized science network</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Registered Research</CardTitle>
                <FileText className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-accent">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">DAO Activities</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-accent">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Datasets</CardTitle>
                <Database className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5,892</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-accent">+23.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Contributors</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,456</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-accent">+15.7%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Network Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Research submissions and DAO activities over time</p>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Research</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "CRISPR Gene Editing Analysis",
                      dao: "GenomeDAO",
                      time: "2 hours ago",
                    },
                    {
                      title: "Cancer Biomarker Discovery",
                      dao: "OncologyDAO",
                      time: "5 hours ago",
                    },
                    {
                      title: "Protein Folding Simulation",
                      dao: "ProteinDAO",
                      time: "8 hours ago",
                    },
                    {
                      title: "Neural Network Drug Design",
                      dao: "PharmaDAO",
                      time: "12 hours ago",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.dao} • {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top DAOs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "GenomeDAO", research: 234, members: 1247 },
                    { name: "OncologyDAO", research: 189, members: 892 },
                    { name: "ProteinDAO", research: 156, members: 743 },
                    { name: "PharmaDAO", research: 142, members: 651 },
                  ].map((dao, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{dao.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{dao.members} members</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent">{dao.research}</p>
                        <p className="text-xs text-muted-foreground">research</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
