import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, FileText, Target, Trophy, Users, Zap } from "lucide-react";

const activityTimeline = [
  {
    date: "2025-01-15",
    type: "research",
    title: "Uploaded CRISPR Analysis Dataset",
    dao: "GenomeDAO",
    reward: "+250 BIOMNI",
  },
  {
    date: "2025-01-10",
    type: "dao",
    title: "Joined OncologyDAO",
    dao: "OncologyDAO",
    reward: "+50 BIOMNI",
  },
  {
    date: "2025-01-05",
    type: "contribution",
    title: "Peer Review Completed",
    dao: "ProteinDAO",
    reward: "+100 BIOMNI",
  },
  {
    date: "2024-12-28",
    type: "research",
    title: "Published Drug Repurposing Study",
    dao: "PharmaDAO",
    reward: "+500 BIOMNI",
  },
  {
    date: "2024-12-20",
    type: "dao",
    title: "Joined GenomeDAO",
    dao: "GenomeDAO",
    reward: "+50 BIOMNI",
  },
  {
    date: "2024-12-15",
    type: "contribution",
    title: "Data Validation Contribution",
    dao: "GenomeDAO",
    reward: "+75 BIOMNI",
  },
  {
    date: "2024-12-10",
    type: "research",
    title: "Submitted Gene Expression Analysis",
    dao: "GenomeDAO",
    reward: "+300 BIOMNI",
  },
  {
    date: "2024-12-01",
    type: "milestone",
    title: "First Research Contribution",
    dao: "GenomeDAO",
    reward: "+100 BIOMNI",
  },
];

const achievements = [
  {
    id: 1,
    title: "First Upload",
    description: "Upload your first research dataset",
    icon: Target,
    unlocked: true,
    unlockedDate: "Dec 1, 2024",
    rarity: "Common",
  },
  {
    id: 2,
    title: "10 Research Papers",
    description: "Contribute 10 research papers to the network",
    icon: FileText,
    unlocked: true,
    unlockedDate: "Jan 10, 2025",
    rarity: "Rare",
  },
  {
    id: 3,
    title: "Peer Reviewer",
    description: "Complete 5 peer reviews",
    icon: Award,
    unlocked: true,
    unlockedDate: "Jan 5, 2025",
    rarity: "Uncommon",
  },
  {
    id: 4,
    title: "Early Adopter",
    description: "Join during the beta phase",
    icon: Zap,
    unlocked: true,
    unlockedDate: "Nov 15, 2024",
    rarity: "Epic",
  },
  {
    id: 5,
    title: "DAO Leader",
    description: "Become a DAO governance member",
    icon: Trophy,
    unlocked: false,
    unlockedDate: null,
    rarity: "Legendary",
  },
  {
    id: 6,
    title: "Community Champion",
    description: "Help 50 researchers in the community",
    icon: Users,
    unlocked: false,
    unlockedDate: null,
    rarity: "Epic",
  },
];

const rarityColors = {
  Common: "border-muted-foreground/30 bg-muted/20",
  Uncommon: "border-green-500/30 bg-green-500/10",
  Rare: "border-blue-500/30 bg-blue-500/10",
  Epic: "border-purple-500/30 bg-purple-500/10",
  Legendary: "border-accent/30 bg-accent/10",
};

export default function ProfilePage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20 border-2 border-accent">
              <AvatarFallback className="bg-accent/20 text-accent text-2xl font-bold">RS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Research Scientist</h1>
              <p className="text-muted-foreground mb-3">0x742d...8f3a</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-accent/20 text-accent border-accent/30">Genomics Specialist</Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30">Early Contributor</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Level 12</Badge>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">DAOs Joined</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">Active in 3 DAOs</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Research Uploaded</CardTitle>
                <FileText className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">8 peer-reviewed</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Rewards</CardTitle>
                <Award className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">1,425</div>
                <p className="text-xs text-muted-foreground mt-1">BIOMNI tokens earned</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
                <Trophy className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {unlockedCount}/{totalCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((unlockedCount / totalCount) * 100)}% complete
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Section */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements & Badges</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unlock achievements by contributing to the network
                  </p>
                </div>
                <Badge variant="outline" className="text-accent border-accent/30">
                  {unlockedCount} / {totalCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map(achievement => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.unlocked
                          ? `${rarityColors[achievement.rarity as keyof typeof rarityColors]} hover:scale-[1.02]`
                          : "border-white/10 bg-muted/10 opacity-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            achievement.unlocked ? "bg-accent/20" : "bg-muted/30"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${achievement.unlocked ? "text-accent" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{achievement.title}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                achievement.rarity === "Legendary"
                                  ? "border-accent text-accent"
                                  : achievement.rarity === "Epic"
                                    ? "border-purple-500 text-purple-400"
                                    : achievement.rarity === "Rare"
                                      ? "border-blue-500 text-blue-400"
                                      : achievement.rarity === "Uncommon"
                                        ? "border-green-500 text-green-400"
                                        : "border-muted-foreground text-muted-foreground"
                              }`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {achievement.description}
                          </p>
                          {achievement.unlocked && achievement.unlockedDate && (
                            <p className="text-xs text-accent font-medium">Unlocked: {achievement.unlockedDate}</p>
                          )}
                          {!achievement.unlocked && <p className="text-xs text-muted-foreground italic">Locked</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">Your contributions and achievements</p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-accent/30" />

                {/* Timeline items */}
                <div className="space-y-6">
                  {activityTimeline.map((activity, i) => (
                    <div key={i} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          {activity.type === "research" && <FileText className="w-3 h-3 text-background" />}
                          {activity.type === "dao" && <Users className="w-3 h-3 text-background" />}
                          {activity.type === "contribution" && <Award className="w-3 h-3 text-background" />}
                          {activity.type === "milestone" && <Award className="w-3 h-3 text-background" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {activity.dao}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(activity.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-accent">{activity.reward}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
