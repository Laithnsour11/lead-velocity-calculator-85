import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: ReactNode;
}

const ResultCard = ({ title, value, className = "", icon }: ResultCardProps) => {
  return (
    <Card className={`${className} transition-all duration-300 hover:shadow-lg bg-white/90 backdrop-blur-sm border-primary/10`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-700 flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
};

export default ResultCard;