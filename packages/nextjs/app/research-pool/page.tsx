"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, FileText, Users } from "lucide-react";

const researchProjects = [
  {
    id: 1,
    title: "AI-Powered Blood Glucose Prediction Model",
    dao: "DiabetesTechDAO",
    description:
      "Machine learning model to predict blood glucose levels using continuous glucose monitoring data and lifestyle factors",
    timeline: "Q1 2026 - Q3 2026",
    members: 0,
    status: "Active",
    ipfsHash: "QmX7Kd9fJ2pL8nR3vT5wY1zB4cE6gH9iJ0kL2mN4oP5qR7s",
    category: "Type 1 Diabetes",
  },
  {
    id: 2,
    title: "Personalized Nutrition for Diabetic Patients",
    dao: "NutriDAO",
    description:
      "Blockchain-based personalized meal planning system for diabetes management using genetic and metabolic data",
    timeline: "Q2 2026 - Q4 2026",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmY8Le0eK3qM9oS4xU6zA2cD5fG7hI0jK1lM3nO5pQ6rS8t",
    category: "Treatment",
  },
  {
    id: 3,
    title: "Insulin Resistance Biomarker Discovery",
    dao: "BiomarkerDAO",
    description: "Advanced proteomics approach to identify early biomarkers for insulin resistance and type 2 diabetes",
    timeline: "Q3 2024 - Q1 2025",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmZ9Mf1fL4rN0pT5yV7aB3dE6gH8iJ1kL2mN4oP6qR7sT9u",
    category: "Type 2 Diabetes",
  },
  {
    id: 4,
    title: "Gestational Diabetes Prevention Protocol",
    dao: "MaternalHealthDAO",
    description:
      "Comprehensive lifestyle intervention program to prevent gestational diabetes in high-risk pregnancies",
    timeline: "Q4 2025 - Q2 2026",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmA0Ng2gM5sO1qU6yW8bC4eF7hI9jK2lM3nO5pQ7rS8tU0v",
    category: "Gestational Diabetes",
  },
  {
    id: 5,
    title: "Diabetic Retinopathy Early Detection AI",
    dao: "EyeHealthDAO",
    description:
      "Deep learning model for early detection of diabetic retinopathy using fundus photography and OCT scans",
    timeline: "Q1 2026 - Q4 2026",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmB1Oh3hN6tP2rV7zX9cD5fG8iJ0kL3mN4oP6qR8sT9uV1w",
    category: "Complications",
  },
  {
    id: 6,
    title: "Beta Cell Regeneration Therapy",
    dao: "RegenDAO",
    description: "Stem cell-based therapy to regenerate pancreatic beta cells for type 1 diabetes treatment",
    timeline: "Q2 2024 - Q4 2024",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmC2Pi4iO7uQ3sW8aY0dE6gH9jK1lM4nO5pQ7rS9tU0vW2x",
    category: "Type 1 Diabetes",
  },
  {
    id: 7,
    title: "Diabetes Prevention Through Community Health",
    dao: "CommunityDAO",
    description: "Community-based intervention program focusing on lifestyle modification and diabetes prevention",
    timeline: "Q3 2025 - Q1 2026",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmD3Qj5jP8vR4tW9bZ1eF7hI0kL4mN5oP7qR9sT0uV2wX3y",
    category: "Prevention",
  },
  {
    id: 8,
    title: "Smart Insulin Pump Optimization",
    dao: "DeviceDAO",
    description: "AI-driven insulin pump algorithm for optimal glucose control in type 1 diabetes patients",
    timeline: "Q2 2025 - Q4 2025",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmE4Rk6kQ9wS5uX0cA2fG8iJ1lM5nO6pQ8rS0tU1vW3xY4z",
    category: "Treatment",
  },
  {
    id: 9,
    title: "Diabetic Nephropathy Drug Discovery",
    dao: "KidneyDAO",
    description: "Novel therapeutic targets for diabetic kidney disease using multi-omics data analysis",
    timeline: "Q4 2025 - Q2 2026",
    members: 0,
    status: "Upcoming",
    ipfsHash: "QmF5Sl7lR0xT6vY1dB3gH9jK2mN6oP7qR9sT1uV2wX4yZ5a",
    category: "Complications",
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
              Discover and collaborate on cutting-edge diabetes research from decentralized autonomous organizations
              worldwide
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "All",
              "Type 1 Diabetes",
              "Type 2 Diabetes",
              "Gestational Diabetes",
              "Complications",
              "Prevention",
              "Treatment",
            ].map(filter => (
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
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                    : "bg-transparent hover:bg-accent/20 border-accent/30 hover:border-accent hover:text-accent transition-all duration-300"
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
                className="group border-white/10 bg-card/50 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-card/80 h-full flex flex-col"
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
                  <CardTitle className="text-lg leading-tight group-hover:text-purple-300 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {project.description}
                  </p>

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

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 bg-transparent hover:bg-purple-500 hover:text-white border-purple-400/30 hover:border-purple-400 transition-all duration-300"
                    >
                      <Link href={`https://ipfs.io/ipfs/${project.ipfsHash}`} target="_blank">
                        <FileText className="w-4 h-4" />
                        View Research Data
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 bg-transparent hover:bg-purple-600 hover:text-white border-purple-500/30 hover:border-purple-500 transition-all duration-300"
                    >
                      <Link href={`/research/${project.id}`}>
                        View Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
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
