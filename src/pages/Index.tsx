import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import InputField from "@/components/Calculator/InputField";
import ResultCard from "@/components/Calculator/ResultCard";
import { Calculator, DollarSign, Clock, Users, Target, TrendingUp } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [customerValue, setCustomerValue] = useState<number | null>(null);
  const [currentResponseRate, setCurrentResponseRate] = useState<number | null>(null);
  const [currentClosingRate, setCurrentClosingRate] = useState<number | null>(null);
  const [aiResponseRate, setAiResponseRate] = useState<number | null>(null);
  const [averageTimeToFirstTouch, setAverageTimeToFirstTouch] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    decayRate: number;
    potentialConversionsLost: number;
    improvedConversionRate: number;
    additionalRevenue: number;
  } | null>(null);

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
    const decayRate = (100 - currentResponseRate!) / averageTimeToFirstTouch!;
    
    // Calculate improved conversion rate with AI
    const improvedConversionRate = currentClosingRate! + (currentResponseRate! * aiResponseRate! / 100);
    
    // Calculate additional revenue from AI
    const additionalRevenue = totalLeads! * ((improvedConversionRate - currentClosingRate!) / 100) * customerValue!;
    
    // Calculate potential closed leads lost (new formula)
    const potentialConversionsLost = Math.abs(additionalRevenue / customerValue!);

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

    setCalculatedResults({
      decayRate,
      potentialConversionsLost,
      improvedConversionRate,
      additionalRevenue
    });
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            <span className="inline-block mr-3">
              <Calculator className="w-10 h-10 text-primary inline-block" />
            </span>
            Speed-to-Lead AI Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate the potential impact of AI on your lead conversion rates
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-primary" />
              Input Your Data
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Total Leads per Month"
                value={totalLeads === null ? "" : totalLeads}
                onChange={setTotalLeads}
                min={0}
                placeholder="Enter number of leads received monthly"
                icon={<Users className="w-4 h-4 text-gray-500" />}
              />
              <InputField
                label="Average Customer Value ($)"
                value={customerValue === null ? "" : customerValue}
                onChange={setCustomerValue}
                min={0}
                placeholder="Revenue generated per customer"
                icon={<DollarSign className="w-4 h-4 text-gray-500" />}
              />
              <InputField
                label="Current Lead Response Rate (%)"
                value={currentResponseRate === null ? "" : currentResponseRate}
                onChange={setCurrentResponseRate}
                isPercentage={true}
                placeholder="Percentage of leads currently responded to"
                icon={<TrendingUp className="w-4 h-4 text-gray-500" />}
              />
              <InputField
                label="Current Closing Rate (%)"
                value={currentClosingRate === null ? "" : currentClosingRate}
                onChange={setCurrentClosingRate}
                isPercentage={true}
                placeholder="Percentage of leads that convert to customers"
                icon={<Target className="w-4 h-4 text-gray-500" />}
              />
              <InputField
                label="AI's Response Rate (%)"
                value={aiResponseRate === null ? "" : aiResponseRate}
                onChange={setAiResponseRate}
                isPercentage={true}
                placeholder="Projected response rate with AI"
                icon={<Calculator className="w-4 h-4 text-gray-500" />}
              />
              <InputField
                label="Average Time to First Touch (hours)"
                value={averageTimeToFirstTouch === null ? "" : averageTimeToFirstTouch}
                onChange={setAverageTimeToFirstTouch}
                min={0}
                placeholder="Time taken to initially respond to leads"
                icon={<Clock className="w-4 h-4 text-gray-500" />}
              />
            </div>
            <Button 
              onClick={validateAndCalculate}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              size="lg"
            >
              Calculate Impact
            </Button>
          </div>

          {/* Results Section */}
          {showResults && calculatedResults && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg space-y-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-primary" />
                Results
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <ResultCard
                  title="Current Lead Response Decay Rate"
                  value={`${calculatedResults.decayRate.toFixed(1)}% per hour`}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <ResultCard
                  title="Potential Closes Lost"
                  value={Math.round(calculatedResults.potentialConversionsLost).toString()}
                  icon={<Users className="w-5 h-5" />}
                />
                <ResultCard
                  title="Improved Conversion Rate with AI"
                  value={`${calculatedResults.improvedConversionRate.toFixed(1)}%`}
                  icon={<Target className="w-5 h-5" />}
                />
                <ResultCard
                  title="Additional Revenue from AI"
                  value={`$${Math.abs(calculatedResults.additionalRevenue).toLocaleString()}`}
                  icon={<DollarSign className="w-5 h-5" />}
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