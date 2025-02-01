import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import InputField from "@/components/Calculator/InputField";
import ResultCard from "@/components/Calculator/ResultCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [customerValue, setCustomerValue] = useState<number | null>(null);
  const [currentResponseRate, setCurrentResponseRate] = useState<number | null>(null);
  const [currentClosingRate, setCurrentClosingRate] = useState<number | null>(null);
  const [aiResponseRate, setAiResponseRate] = useState<number | null>(null);
  const [averageTimeToFirstTouch, setAverageTimeToFirstTouch] = useState<number | null>(null);
  const [leadResponseDecay, setLeadResponseDecay] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const validateAndCalculate = () => {
    setShowResults(false);

    const missingFields = [];
    if (totalLeads === null) missingFields.push("Total Leads per Month");
    if (customerValue === null) missingFields.push("Average Customer Value");
    if (currentResponseRate === null) missingFields.push("Current Lead Response Rate");
    if (currentClosingRate === null) missingFields.push("Current Closing Rate");
    if (aiResponseRate === null) missingFields.push("AI's Response Rate");
    if (averageTimeToFirstTouch === null) missingFields.push("Average Time to First Touch");
    if (leadResponseDecay === null) missingFields.push("Lead Response Decay");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Calculate results
    const adjustedConversionRate = Math.max(
      currentClosingRate! - (averageTimeToFirstTouch! * leadResponseDecay!),
      0
    );

    const additionalRevenue = totalLeads! * 
      (adjustedConversionRate - currentClosingRate!) / 100 * 
      customerValue!;

    const revenueAtRisk = totalLeads! * 
      (currentClosingRate! - adjustedConversionRate) / 100 * 
      customerValue!;

    console.log("Calculating results:", {
      totalLeads,
      customerValue,
      currentResponseRate,
      currentClosingRate,
      aiResponseRate,
      averageTimeToFirstTouch,
      leadResponseDecay,
      adjustedConversionRate,
      additionalRevenue,
      revenueAtRisk
    });

    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Speed-to-Lead AI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the potential impact of AI on your lead conversion rates
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Input Your Data
            </h2>
            <InputField
              label="Total Leads per Month"
              value={totalLeads === null ? "" : totalLeads}
              onChange={setTotalLeads}
              min={0}
              placeholder="Enter number of leads received monthly"
            />
            <InputField
              label="Average Customer Value ($)"
              value={customerValue === null ? "" : customerValue}
              onChange={setCustomerValue}
              min={0}
              placeholder="Revenue generated per customer"
            />
            <InputField
              label="Current Lead Response Rate (%)"
              value={currentResponseRate === null ? "" : currentResponseRate}
              onChange={setCurrentResponseRate}
              isPercentage={true}
              placeholder="Percentage of leads currently responded to"
            />
            <InputField
              label="Current Closing Rate (%)"
              value={currentClosingRate === null ? "" : currentClosingRate}
              onChange={setCurrentClosingRate}
              isPercentage={true}
              placeholder="Percentage of leads that convert to customers"
            />
            <InputField
              label="AI's Response Rate (%)"
              value={aiResponseRate === null ? "" : aiResponseRate}
              onChange={setAiResponseRate}
              isPercentage={true}
              placeholder="Projected response rate with AI"
            />
            <InputField
              label="Average Time to First Touch (hours)"
              value={averageTimeToFirstTouch === null ? "" : averageTimeToFirstTouch}
              onChange={setAverageTimeToFirstTouch}
              min={0}
              placeholder="Time taken to initially respond to leads"
            />
            <div className="flex items-center space-x-2">
              <InputField
                label="Lead Response Decay (% per hour)"
                value={leadResponseDecay === null ? "" : leadResponseDecay}
                onChange={setLeadResponseDecay}
                isPercentage={true}
                placeholder="Expected decay in conversion rate per hour"
              />
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="mt-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Lead Response Decay Rates</h4>
                    <p className="text-sm">
                      <strong>Inbound Leads:</strong> Typically 10% per hour of delay in response
                    </p>
                    <p className="text-sm">
                      <strong>Outbound Leads:</strong> Around 5% per hour of delay
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Button 
              onClick={validateAndCalculate}
              className="w-full mt-6"
              size="lg"
            >
              Calculate Impact
            </Button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Results</h2>
              <div className="space-y-4">
                <ResultCard
                  title="Adjusted Conversion Rate"
                  value={`${Math.max(
                    currentClosingRate! - (averageTimeToFirstTouch! * leadResponseDecay!),
                    0
                  ).toFixed(1)}%`}
                />
                <ResultCard
                  title="Additional Revenue from Improved Response"
                  value={`$${Math.abs(
                    totalLeads! *
                    ((Math.max(
                      currentClosingRate! - (averageTimeToFirstTouch! * leadResponseDecay!),
                      0
                    ) -
                      currentClosingRate!) /
                      100) *
                    customerValue!
                  ).toLocaleString()}`}
                />
                <ResultCard
                  title="Revenue at Risk"
                  value={`$${Math.abs(
                    totalLeads! *
                    (currentClosingRate! / 100 -
                      Math.max(
                        currentClosingRate! - (averageTimeToFirstTouch! * leadResponseDecay!),
                        0
                      ) /
                        100) *
                    customerValue!
                  ).toLocaleString()}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;