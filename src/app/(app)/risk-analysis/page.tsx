"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeProjectRisks,
  type AnalyzeProjectRisksOutput,
} from "@/ai/flows/risk-analyzer";
import { Wand2 } from "lucide-react";

export default function RiskAnalysisPage() {
  const [communications, setCommunications] = useState("");
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeProjectRisksOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!communications.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please paste project communications to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeProjectRisks({
        projectCommunications: communications,
      });
      setAnalysisResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description:
          "An error occurred while analyzing the risks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeVariant = (
    level: "LOW" | "MEDIUM" | "HIGH"
  ): "default" | "destructive" | "secondary" => {
    switch (level) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Risk Analysis</h1>
        <p className="text-muted-foreground">
          Analyze project communications to identify potential risks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Communications</CardTitle>
          <CardDescription>
            Paste emails, chat logs, and meeting notes below to get an AI-powered risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your project communications here..."
            className="min-h-[200px]"
            value={communications}
            onChange={(e) => setCommunications(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleAnalyze} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze Risks"}
          </Button>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Analysis Results
              <Badge variant={getBadgeVariant(analysisResult.overallProjectRisk)}>
                Overall Risk: {analysisResult.overallProjectRisk}
              </Badge>
            </CardTitle>
            <CardDescription>
              The following potential risks have been identified from the provided text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Likelihood</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Mitigation Strategy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisResult.riskAssessment.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.risk}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.severity)}>
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.likelihood)}>
                        {item.likelihood}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.impact}</TableCell>
                    <TableCell>{item.mitigationStrategy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
)
