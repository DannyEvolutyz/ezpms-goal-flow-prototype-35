
import { useGoals } from '@/contexts/GoalContext';
import { GoalBank } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoalBankComponentProps {
  onSelectTemplate: (template: GoalBank) => void;
}

const GoalBankComponent = ({ onSelectTemplate }: GoalBankComponentProps) => {
  const { goalBank } = useGoals();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-600">Goal Templates</h2>
      <p className="text-gray-600 mb-4">Select a template below to get started quickly</p>
      
      <div className="grid grid-cols-1 gap-4">
        {goalBank.map((template) => (
          <Card key={template.id} className="hover:border-blue-300 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">{template.title}</CardTitle>
              <CardDescription>Category: {template.category}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelectTemplate(template)}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalBankComponent;
