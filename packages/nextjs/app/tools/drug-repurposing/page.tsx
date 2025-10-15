"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { DrugNetworkGraph } from "@/components/drug-network-graph";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Database } from "lucide-react";

const compoundsData = [
  { id: "DB00316", name: "Acetaminophen", target: "COX-2", affinity: 8.2, status: "Approved" },
  { id: "DB00945", name: "Aspirin", target: "COX-1", affinity: 7.8, status: "Approved" },
  { id: "DB01050", name: "Ibuprofen", target: "COX-2", affinity: 8.5, status: "Approved" },
  { id: "DB00586", name: "Diclofenac", target: "COX-2", affinity: 9.1, status: "Approved" },
  { id: "DB00788", name: "Naproxen", target: "COX-2", affinity: 8.7, status: "Approved" },
  { id: "DB00482", name: "Celecoxib", target: "COX-2", affinity: 9.3, status: "Approved" },
];

export default function DrugRepurposingPage() {
  const [selectedCompounds, setSelectedCompounds] = useState<string[]>([]);

  const toggleCompound = (id: string) => {
    setSelectedCompounds(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Drug Repurposing Tool</h1>
            <p className="text-muted-foreground text-lg">
              Compare molecular datasets and discover new therapeutic applications
            </p>
          </div>

          {/* Split Screen Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Data Table */}
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Compound Database</CardTitle>
                <p className="text-sm text-muted-foreground">Select compounds to analyze relationships</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compoundsData.map(compound => (
                    <div
                      key={compound.id}
                      onClick={() => toggleCompound(compound.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCompounds.includes(compound.id)
                          ? "border-accent bg-accent/10"
                          : "border-white/10 hover:border-white/20 bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedCompounds.includes(compound.id) ? "bg-accent" : "bg-muted-foreground"
                            }`}
                          />
                          <span className="font-medium text-sm">{compound.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {compound.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground ml-4">
                        <div>
                          <span className="block">ID</span>
                          <span className="text-foreground font-mono">{compound.id}</span>
                        </div>
                        <div>
                          <span className="block">Target</span>
                          <span className="text-foreground">{compound.target}</span>
                        </div>
                        <div>
                          <span className="block">Affinity</span>
                          <span className="text-accent font-semibold">{compound.affinity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: Graph Visualization */}
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Relationship Network</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedCompounds.length > 0
                    ? `Showing relationships for ${selectedCompounds.length} compound${selectedCompounds.length > 1 ? "s" : ""}`
                    : "Select compounds to visualize relationships"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  {selectedCompounds.length > 0 ? (
                    <DrugNetworkGraph selectedIds={selectedCompounds} />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Select compounds from the table to view their relationships</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          {selectedCompounds.length > 0 && (
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Shared Targets</p>
                    <p className="text-2xl font-bold text-accent">3</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Similarity Score</p>
                    <p className="text-2xl font-bold text-accent">87.3%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Repurposing Potential</p>
                    <p className="text-2xl font-bold text-accent">High</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Database className="w-4 h-4" />
                    Save to IPFS
                  </Button>
                  <Button className="gap-2 bg-accent text-background hover:bg-accent/90">
                    <Award className="w-4 h-4" />
                    Mint Research NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
