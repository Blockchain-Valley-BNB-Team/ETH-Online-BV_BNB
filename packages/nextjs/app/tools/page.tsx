import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, MessageCircle, Shield, Zap } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      id: "gene-analysis",
      title: "AI Gene Analysis Chat",
      description: "Interactive AI-powered genomic analysis through natural language conversation",
      icon: MessageCircle,
      href: "/tools/gene-analysis",
      features: [
        "Natural language gene queries",
        "Real-time AI-powered analysis",
        "Blockchain result storage",
        "Comprehensive research reports",
      ],
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">Research Tools</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced computational tools for bioinformatics research, powered by AI and blockchain technology
            </p>
          </div>

          {/* Main Tool Card - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {tools.map(tool => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={tool.id}
                    className={`border-white/10 bg-gradient-to-br ${tool.color} backdrop-blur-sm hover:border-accent/50 transition-all group`}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg bg-card/50 flex items-center justify-center ${tool.iconColor}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <Link href={tool.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 group-hover:gap-3 transition-all group-hover:text-accent"
                          >
                            Start Chat
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Key Features
                        </p>
                        <ul className="space-y-2">
                          {tool.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Advanced Biomni AI agent provides comprehensive genomic insights through natural conversation
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Blockchain Storage</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  All research results are permanently stored on Base Sepolia blockchain for transparency
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Real-time Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Get instant AI responses with live streaming and immediate blockchain verification
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>About Our AI Chat Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our AI-powered chat tool revolutionizes genomic research by enabling natural language conversations with
                advanced Biomni AI agents. Ask complex questions about genes, diseases, and treatments, and get
                comprehensive analysis results that are automatically stored on the blockchain for transparency and
                reproducibility.
              </p>
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">AI</p>
                  <p className="text-xs text-muted-foreground">Powered Chat</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">Blockchain</p>
                  <p className="text-xs text-muted-foreground">Secure Storage</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">Real-time</p>
                  <p className="text-xs text-muted-foreground">Live Analysis</p>
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
