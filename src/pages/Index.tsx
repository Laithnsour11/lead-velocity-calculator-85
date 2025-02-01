import { useState } from "react";
import InputField from "@/components/Calculator/InputField";
import ResultCard from "@/components/Calculator/ResultCard";
import ResultsChart from "@/components/Calculator/ResultsChart";

const Index = () => {
  const [totalLeads, setTotalLeads] = useState<number>(100);
  const [customerValue, setCustomerValue] = useState<number>(1000);
  const [currentResponseRate, setCurrentResponseRate] = useState<number>(50);
  const [currentClosingRate, setCurrentClosingRate] = useState<number>(20);
  const [aiResponseRate, setAiResponseRate] = useState<number>(90);

  // Calculate improved conversion rate
  const improvedConversionRate = Math.min(
    currentClosingRate + (aiResponseRate - currentResponseRate) * 0.1,
    100
  );

  // Calculate revenues
  const currentRevenue = totalLeads * (currentClosingRate / 100) * customerValue;
  const improvedRevenue = totalLeads * (improvedConversionRate / 100) * customerValue;
  const revenueAtRisk = improvedRevenue - currentRevenue;

  console.log("Calculating results:", {
    totalLeads,
    customerValue,
    currentResponseRate,
    currentClosingRate,
    aiResponseRate,
    improvedConversionRate,
    currentRevenue,
    improvedRevenue,
    revenueAtRisk,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Speed-to-Lead AI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the potential impact of AI on your lead conversion rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Input Your Data
            </h2>
            <InputField
              label="Total Leads per Month"
              value={totalLeads}
              onChange={setTotalLeads}
              min={0}
              max={100000}
            />
            <InputField
              label="Average Customer Value ($)"
              value={customerValue}
              onChange={setCustomerValue}
              min={0}
            />
            <InputField
              label="Current Lead Response Rate (%)"
              value={currentResponseRate}
              onChange={setCurrentResponseRate}
              min={0}
              max={100}
            />
            <InputField
              label="Current Closing Rate (%)"
              value={currentClosingRate}
              onChange={setCurrentClosingRate}
              min={0}
              max={100}
            />
            <InputField
              label="AI's Response Rate (%)"
              value={aiResponseRate}
              onChange={setAiResponseRate}
              min={0}
              max={100}
            />
          </div>

          {/* Results Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Results</h2>
            <div className="grid grid-cols-1 gap-4">
              <ResultCard
                title="Improved Conversion Rate"
                value={`${improvedConversionRate.toFixed(1)}%`}
              />
              <ResultCard
                title="Additional Revenue"
                value={`$${(improvedRevenue - currentRevenue).toLocaleString()}`}
              />
              <ResultCard
                title="Revenue at Risk"
                value={`$${revenueAtRisk.toLocaleString()}`}
              />
            </div>
            <ResultsChart
              currentRevenue={currentRevenue}
              improvedRevenue={improvedRevenue}
              revenueAtRisk={revenueAtRisk}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;