"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { DnaVisualization } from "@/components/dna-visualization";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileCheck, Loader2, Upload, X } from "lucide-react";

export default function GeneAnalysisPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [".fasta", ".fastq", ".vcf", ".csv"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!supportedFormats.includes(extension)) {
      return `Unsupported file format. Please upload: ${supportedFormats.join(", ")}`;
    }

    if (file.size > maxFileSize) {
      return `File size too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`;
    }

    return null;
  };

  const handleFileUpload = (file: File) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setStep(2);
    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          setStep(3);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setStep(1);
    setFileName("");
    setFileSize(0);
    setUploadProgress(0);
    setError("");
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                      isDragOver
                        ? "border-accent bg-accent/10"
                        : error
                          ? "border-red-500 bg-red-500/10"
                          : "border-muted hover:border-accent/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload
                      className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? "text-accent" : "text-muted-foreground"}`}
                    />
                    <h3 className="text-lg font-semibold mb-2">Upload Gene Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supports FASTA, FASTQ, VCF, and CSV formats (Max 100MB)
                    </p>

                    {error && (
                      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-500">{error}</span>
                      </div>
                    )}

                    <Button
                      onClick={handleSelectFile}
                      className="bg-[oklch(0.65_0.18_60)] text-background hover:bg-[oklch(0.6_0.18_60)]"
                    >
                      Select File
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".fasta,.fastq,.vcf,.csv"
                      onChange={handleFileInputChange}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <DnaVisualization />
                    <div className="mt-8 text-center max-w-md">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-8 h-8 mx-auto mb-4 text-accent animate-spin" />
                          <h3 className="text-lg font-semibold mb-2">Processing {fileName}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            AI is analyzing your genomic data... This may take a few moments.
                          </p>

                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>

                          {/* File Info */}
                          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground">File: {fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
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
                    <Button variant="outline" onClick={resetUpload} className="gap-2">
                      <X className="w-4 h-4" />
                      Analyze New Sample
                    </Button>
                    <Button className="bg-accent text-background hover:bg-accent/90 gap-2">
                      <FileCheck className="w-4 h-4" />
                      Download Report
                    </Button>
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
