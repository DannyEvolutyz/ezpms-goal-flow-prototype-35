
import { useGoals } from '@/contexts/GoalContext';
import { GoalBank } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoalBankComponentProps {
  onSelectTemplate: (template: Pick<GoalBank, "title" | "description" | "category">) => void;
}

// This component shows a sortable/selectable view of all GoalBank templates.
// It can be used by non-admins to copy into their new goal form.
// Admins use the CRUD panel elsewhere.
const GoalBankComponent = ({ onSelectTemplate }: GoalBankComponentProps) => {
  const { goalBank } = useGoals();

  if (!goalBank.length) {
    return (
      <div className="text-gray-500 italic mb-4">
        No goal templates are available yet. Please check back later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-600">Goal Bank</h2>
      <p className="text-gray-600 mb-4">Browse and pick inspiration from available goal templates. You can edit the details after selecting.</p>
      
      <div className="grid grid-cols-1 gap-4">
        {goalBank.map((template) => (
          <Card key={template.id} className="hover:border-blue-300 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">{template.title}</CardTitle>
              <CardDescription>
                <span className="font-light">Category:</span> {template.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              {template.milestones && template.milestones.length > 0 && (
                <ul className="list-disc ml-6 mb-3">
                  {template.milestones.map((m, i) => (
                    <li key={m.id || i} className="text-gray-500 text-xs">{m.title}</li>
                  ))}
                </ul>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelectTemplate({
                  title: template.title,
                  description: template.description,
                  category: template.category
                })}
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

