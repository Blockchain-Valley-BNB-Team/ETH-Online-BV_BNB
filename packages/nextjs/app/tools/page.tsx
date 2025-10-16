import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Dna, Pill } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      id: "gene-analysis",
      title: "Gene Analysis Tool",
      description: "AI-powered genomic data analysis and visualization for precision medicine research",
      icon: Dna,
      href: "/tools/gene-analysis",
      features: [
        "Upload FASTA, FASTQ, VCF, CSV formats",
        "AI-powered variant detection",
        "Pathogenicity classification",
        "Comprehensive genomic reports",
      ],
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      id: "drug-repurposing",
      title: "Drug Repurposing Tool",
      description: "Compare molecular datasets and discover new therapeutic applications for existing drugs",
      icon: Pill,
      href: "/tools/drug-repurposing",
      features: [
        "Compound database exploration",
        "Target-drug relationship mapping",
        "Similarity score calculation",
        "Network visualization",
      ],
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400",
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

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-6">
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
                          Launch Tool
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

          {/* Info Section */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>About Our Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our research tools are designed to accelerate scientific discovery by combining cutting-edge AI
                algorithms with decentralized data infrastructure. All analysis results can be minted as Research NFTs
                and stored permanently on IPFS.
              </p>
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">100%</p>
                  <p className="text-xs text-muted-foreground">Transparent & Open</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">AI</p>
                  <p className="text-xs text-muted-foreground">Powered Analysis</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-1">IPFS</p>
                  <p className="text-xs text-muted-foreground">Permanent Storage</p>
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
