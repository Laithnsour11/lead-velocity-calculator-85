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

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Calculate current lead response decay rate
    // Formula: Decay Rate = (100 - Current Lead Response Rate) / Average Time to First Touch
    const decayRate = (100 - currentResponseRate!) / averageTimeToFirstTouch!;
    
    // Calculate potential conversions lost
    // Formula: Total Leads * Decay Rate * Average Time to First Touch
    const potentialConversionsLost = totalLeads! * (decayRate / 100) * averageTimeToFirstTouch!;
    
    // Calculate improved conversion rate with AI
    // Formula: Current Closing Rate + (Current Lead Response Rate * AI's Response Rate)
    const improvedConversionRate = currentClosingRate! + (currentResponseRate! * aiResponseRate! / 100);
    
    // Calculate additional revenue from AI
    // Formula: Total Leads * (Improved Conversion Rate - Current Closing Rate) * Average Customer Value
    const additionalRevenue = totalLeads! * ((improvedConversionRate - currentClosingRate!) / 100) * customerValue!;

    console.log("Calculating results:", {
      totalLeads,
      customerValue,
      currentResponseRate,
      currentClosingRate,
      aiResponseRate,
      averageTimeToFirstTouch,
      decayRate,
      potentialConversionsLost,
      improvedConversionRate,
      additionalRevenue
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
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard
                  title="Current Lead Response Decay Rate"
                  value={`${((100 - currentResponseRate!) / averageTimeToFirstTouch!).toFixed(1)}% per hour`}
                />
                <ResultCard
                  title="Potential Conversions Lost"
                  value={Math.round(totalLeads! * ((100 - currentResponseRate!) / 100) * averageTimeToFirstTouch!).toString()}
                />
                <ResultCard
                  title="Improved Conversion Rate with AI"
                  value={`${(currentClosingRate! + (currentResponseRate! * aiResponseRate! / 100)).toFixed(1)}%`}
                />
                <ResultCard
                  title="Additional Revenue from AI"
                  value={`$${Math.abs(
                    totalLeads! * 
                    ((currentClosingRate! + (currentResponseRate! * aiResponseRate! / 100) - currentClosingRate!) / 100) * 
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