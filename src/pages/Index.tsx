import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import InputField from "@/components/Calculator/InputField";
import ResultCard from "@/components/Calculator/ResultCard";

const Index = () => {
  const { toast } = useToast();
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [customerValue, setCustomerValue] = useState<number | null>(null);
  const [currentResponseRate, setCurrentResponseRate] = useState<number | null>(null);
  const [currentClosingRate, setCurrentClosingRate] = useState<number | null>(null);
  const [aiResponseRate, setAiResponseRate] = useState<number | null>(null);
  const [averageTimeToFirstTouch, setAverageTimeToFirstTouch] = useState<number | null>(null);
  const [expectedDecayRate, setExpectedDecayRate] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const validateAndCalculate = () => {
    // Reset results
    setShowResults(false);

    // Validate all inputs are present
    const missingFields = [];
    if (totalLeads === null) missingFields.push("Total Leads per Month");
    if (customerValue === null) missingFields.push("Average Customer Value");
    if (currentResponseRate === null) missingFields.push("Current Lead Response Rate");
    if (currentClosingRate === null) missingFields.push("Current Closing Rate");
    if (aiResponseRate === null) missingFields.push("AI's Response Rate");
    if (averageTimeToFirstTouch === null) missingFields.push("Average Time to First Touch");
    if (expectedDecayRate === null) missingFields.push("Expected Decay Rate");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Calculate results
    const responseRateImprovement = aiResponseRate! - currentResponseRate!;
    const conversionRateImprovement = responseRateImprovement * 0.1;
    const newClosingRate = Math.min(currentClosingRate! + conversionRateImprovement, 100);
    const adjustedConversionRate = Math.max(
      currentClosingRate! - (averageTimeToFirstTouch! * expectedDecayRate!),
      0
    );

    console.log("Calculating results:", {
      totalLeads,
      customerValue,
      currentResponseRate,
      currentClosingRate,
      aiResponseRate,
      newClosingRate,
      averageTimeToFirstTouch,
      expectedDecayRate,
      adjustedConversionRate,
    });

    // Show results with animation
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
            />
            <InputField
              label="Average Customer Value ($)"
              value={customerValue === null ? "" : customerValue}
              onChange={setCustomerValue}
              min={0}
            />
            <InputField
              label="Current Lead Response Rate (%)"
              value={currentResponseRate === null ? "" : currentResponseRate}
              onChange={setCurrentResponseRate}
              isPercentage={true}
            />
            <InputField
              label="Current Closing Rate (%)"
              value={currentClosingRate === null ? "" : currentClosingRate}
              onChange={setCurrentClosingRate}
              isPercentage={true}
            />
            <InputField
              label="AI's Response Rate (%)"
              value={aiResponseRate === null ? "" : aiResponseRate}
              onChange={setAiResponseRate}
              isPercentage={true}
            />
            <InputField
              label="Average Time to First Touch (minutes)"
              value={averageTimeToFirstTouch === null ? "" : averageTimeToFirstTouch}
              onChange={setAverageTimeToFirstTouch}
              min={0}
            />
            <InputField
              label="Expected Decay in Conversion Rate per Minute (%)"
              value={expectedDecayRate === null ? "" : expectedDecayRate}
              onChange={setExpectedDecayRate}
              isPercentage={true}
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
              <div className="space-y-4">
                <ResultCard
                  title="New Closing Rate"
                  value={`${Math.min(
                    currentClosingRate! + (aiResponseRate! - currentResponseRate!) * 0.1,
                    100
                  ).toFixed(1)}%`}
                />
                <ResultCard
                  title="Adjusted Conversion Rate (Time-Based)"
                  value={`${Math.max(
                    currentClosingRate! - (averageTimeToFirstTouch! * expectedDecayRate!),
                    0
                  ).toFixed(1)}%`}
                />
                <ResultCard
                  title="Additional Revenue"
                  value={`$${Math.abs(
                    totalLeads! *
                    (Math.min(
                      currentClosingRate! + (aiResponseRate! - currentResponseRate!) * 0.1,
                      100
                    ) /
                      100) *
                    customerValue! -
                    totalLeads! * (currentClosingRate! / 100) * customerValue!
                  ).toLocaleString()}`}
                />
                <ResultCard
                  title="Revenue at Risk (Time-Based)"
                  value={`$${Math.abs(
                    totalLeads! *
                    (currentClosingRate! / 100 -
                      Math.max(
                        currentClosingRate! - (averageTimeToFirstTouch! * expectedDecayRate!),
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