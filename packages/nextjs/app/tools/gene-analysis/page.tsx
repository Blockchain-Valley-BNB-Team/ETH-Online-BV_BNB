"use client";

import type React from "react";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { DnaVisualization } from "@/components/dna-visualization";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Loader2, Upload } from "lucide-react";

export default function GeneAnalysisPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStep(2);
      setIsProcessing(true);
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">Gene Analysis Tool</h1>
            <p className="text-muted-foreground text-lg">AI-powered genomic data analysis and visualization</p>
          </div>

          {/* Process Steps */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? "bg-accent text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                Upload Data
              </span>
            </div>

            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-accent" : "bg-muted"}`} />

            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? "bg-accent text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                AI Processing
              </span>
            </div>

            <div className={`w-12 h-0.5 ${step >= 3 ? "bg-accent" : "bg-muted"}`} />

            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 3 ? "bg-accent text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className={`text-sm font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                View Result
              </span>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-white/10 bg-card">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center hover:border-accent/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload Gene Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">Supports FASTA, FASTQ, VCF, and CSV formats</p>
                    <label htmlFor="file-upload">
                      <Button className="bg-[oklch(0.65_0.18_60)] text-background hover:bg-[oklch(0.6_0.18_60)]">
                        Select File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".fasta,.fastq,.vcf,.csv"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <DnaVisualization />
                    <div className="mt-8 text-center">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-8 h-8 mx-auto mb-4 text-accent animate-spin" />
                          <h3 className="text-lg font-semibold mb-2">Processing {fileName}</h3>
                          <p className="text-sm text-muted-foreground">
                            AI is analyzing your genomic data... This may take a few moments.
                          </p>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-8 h-8 mx-auto mb-4 text-accent" />
                          <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
                          <p className="text-sm text-muted-foreground">Your results are ready to view</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-accent/20 bg-accent/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Genes Analyzed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">23,847</div>
                      </CardContent>
                    </Card>

                    <Card className="border-accent/20 bg-accent/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Variants Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">1,342</div>
                      </CardContent>
                    </Card>

                    <Card className="border-accent/20 bg-accent/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Confidence Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">98.7%</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-white/10">
                    <CardHeader>
                      <CardTitle>Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            gene: "BRCA1",
                            variant: "c.5266dupC",
                            significance: "Pathogenic",
                            color: "text-red-400",
                          },
                          {
                            gene: "TP53",
                            variant: "c.215C>G",
                            significance: "Likely Pathogenic",
                            color: "text-orange-400",
                          },
                          {
                            gene: "APOE",
                            variant: "ε3/ε4",
                            significance: "Risk Factor",
                            color: "text-yellow-400",
                          },
                          {
                            gene: "MTHFR",
                            variant: "c.677C>T",
                            significance: "Benign",
                            color: "text-accent",
                          },
                        ].map((finding, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-accent" />
                              <div>
                                <p className="font-medium text-sm">
                                  {finding.gene} - {finding.variant}
                                </p>
                                <p className={`text-xs ${finding.color} font-medium mt-0.5`}>{finding.significance}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        setFileName("");
                      }}
                    >
                      Analyze New Sample
                    </Button>
                    <Button className="bg-accent text-background hover:bg-accent/90">Download Report</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
