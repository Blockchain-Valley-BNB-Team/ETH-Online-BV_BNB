"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, Users } from "lucide-react";

const researchProjects = [
  {
    id: 1,
    title: "CRISPR-Cas9 Gene Editing Efficiency Analysis",
    dao: "GenomeDAO",
    description: "Comprehensive study on improving CRISPR targeting accuracy across different cell types",
    timeline: "Q1 2025 - Q3 2025",
    members: 1247,
    status: "Active",
    ipfsHash: "QmX7Kd9fJ2pL8nR3vT5wY1zB4cE6gH9iJ0kL2mN4oP5qR7s",
    category: "Genomics",
  },
  {
    id: 2,
    title: "Novel Cancer Biomarker Discovery",
    dao: "OncologyDAO",
    description: "Machine learning approach to identify early-stage cancer biomarkers in liquid biopsies",
    timeline: "Q2 2025 - Q4 2025",
    members: 892,
    status: "Active",
    ipfsHash: "QmY8Le0eK3qM9oS4xU6zA2cD5fG7hI0jK1lM3nO5pQ6rS8t",
    category: "Oncology",
  },
  {
    id: 3,
    title: "Protein Folding Prediction Using AI",
    dao: "ProteinDAO",
    description: "Advanced neural network models for predicting 3D protein structures from amino acid sequences",
    timeline: "Q3 2024 - Q1 2025",
    members: 743,
    status: "Completed",
    ipfsHash: "QmZ9Mf1fL4rN0pT5yV7aB3dE6gH8iJ1kL2mN4oP6qR7sT9u",
    category: "Structural Biology",
  },
  {
    id: 4,
    title: "Drug Repurposing for Rare Diseases",
    dao: "PharmaDAO",
    description: "Systematic screening of FDA-approved drugs for potential treatment of orphan diseases",
    timeline: "Q4 2024 - Q2 2025",
    members: 651,
    status: "Active",
    ipfsHash: "QmA0Ng2gM5sO1qU6yW8bC4eF7hI9jK2lM3nO5pQ7rS8tU0v",
    category: "Pharmacology",
  },
  {
    id: 5,
    title: "Microbiome Impact on Mental Health",
    dao: "NeuroDAO",
    description: "Investigating gut-brain axis connections and their role in depression and anxiety disorders",
    timeline: "Q1 2025 - Q3 2025",
    members: 534,
    status: "Active",
    ipfsHash: "QmB1Oh3hN6tP2rV7zX9cD5fG8iJ0kL3mN4oP6qR8sT9uV1w",
    category: "Neuroscience",
  },
  {
    id: 6,
    title: "Stem Cell Differentiation Protocols",
    dao: "RegenDAO",
    description: "Optimizing protocols for directed differentiation of iPSCs into specific cell lineages",
    timeline: "Q2 2024 - Q4 2024",
    members: 478,
    status: "Completed",
    ipfsHash: "QmC2Pi4iO7uQ3sW8aY0dE6gH9jK1lM4nO5pQ7rS9tU0vW2x",
    category: "Regenerative Medicine",
  },
  {
    id: 7,
    title: "Epigenetic Modifications in Aging",
    dao: "LongevityDAO",
    description: "Mapping DNA methylation patterns associated with cellular aging and senescence",
    timeline: "Q3 2025 - Q1 2026",
    members: 623,
    status: "Active",
    ipfsHash: "QmD3Qj5jP8vR4tW9bZ1eF7hI0kL4mN5oP7qR9sT0uV2wX3y",
    category: "Genomics",
  },
  {
    id: 8,
    title: "Immunotherapy Response Prediction",
    dao: "OncologyDAO",
    description: "Developing predictive models for patient response to checkpoint inhibitor therapies",
    timeline: "Q1 2025 - Q2 2025",
    members: 789,
    status: "Active",
    ipfsHash: "QmE4Rk6kQ9wS5uX0cA2fG8iJ1lM5nO6pQ8rS0tU1vW3xY4z",
    category: "Oncology",
  },
  {
    id: 9,
    title: "Synthetic Biology Circuit Design",
    dao: "BioEngDAO",
    description: "Engineering genetic circuits for biosensing and therapeutic applications",
    timeline: "Q2 2025 - Q4 2025",
    members: 412,
    status: "Active",
    ipfsHash: "QmF5Sl7lR0xT6vY1dB3gH9jK2mN6oP7qR9sT1uV2wX4yZ5a",
    category: "Synthetic Biology",
  },
];

export default function ResearchPoolPage() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredProjects =
    selectedFilter === "All" ? researchProjects : researchProjects.filter(p => p.category === selectedFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Research Pool</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Explore cutting-edge scientific research from decentralized autonomous organizations worldwide
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {["All", "Genomics", "Oncology", "Neuroscience", "Pharmacology", "Synthetic Biology"].map(filter => (
              <Button
                key={filter}
                variant={filter === selectedFilter ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedFilter(filter);
                  setVisibleCount(6);
                }}
                className={
                  filter === selectedFilter
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-transparent hover:bg-accent/10"
                }
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Research Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map(project => (
              <Card
                key={project.id}
                className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={
                        project.status === "Active"
                          ? "border-accent text-accent"
                          : "border-muted-foreground text-muted-foreground"
                      }
                    >
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-muted/50">
                      {project.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="font-medium text-foreground">{project.dao}</span>
                      <span>•</span>
                      <span>{project.members.toLocaleString()} members</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-muted-foreground mb-2">IPFS Hash</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded block truncate">
                      {project.ipfsHash}
                    </code>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 bg-transparent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href={`/research/${project.id}`}>
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                View More Research
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
