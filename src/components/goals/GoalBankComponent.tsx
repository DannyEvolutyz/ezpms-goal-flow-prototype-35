
import { useGoals } from '@/contexts/goal';
import { GoalBank } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GoalBankComponentProps {
  onSelectTemplate: (template: Pick<GoalBank, "title" | "description" | "category">) => void;
  spaceId?: string;
}

const GoalBankComponent = ({ onSelectTemplate, spaceId }: GoalBankComponentProps) => {
  const { goalBank } = useGoals();

  // Filter templates by space if a spaceId is provided
  const filteredTemplates = spaceId
    ? goalBank.filter(t => t.spaceIds?.includes(spaceId))
    : goalBank;

  if (!filteredTemplates.length) {
    return (
      <div className="text-muted-foreground italic mb-4">
        {spaceId
          ? "No goal templates are tagged to this space yet."
          : "No goal templates are available yet. Please check back later."}
      </div>
    );
  }

  const handleTemplateSelect = (template: GoalBank) => {
    onSelectTemplate({
      title: template.title,
      description: template.description,
      category: template.category,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-primary">Goal Bank</h2>
        <p className="text-muted-foreground mb-4">
          {spaceId
            ? "Templates tagged to this space. Click to adopt one as your own goal."
            : "Browse and pick inspiration from available goal templates."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">{template.title}</CardTitle>
              <CardDescription>
                <span className="font-light">Category:</span> {template.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
              {template.milestones && template.milestones.length > 0 && (
                <ul className="list-disc ml-6 mb-3">
                  {template.milestones.map((m, i) => (
                    <li key={m.id || i} className="text-muted-foreground text-xs">{m.title}</li>
                  ))}
                </ul>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleTemplateSelect(template)}
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
