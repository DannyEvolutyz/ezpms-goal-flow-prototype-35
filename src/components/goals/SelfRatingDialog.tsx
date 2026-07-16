
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Goal } from '@/types';
import { useGoals } from '@/contexts/goal';
import { toast } from '@/hooks/use-toast';

interface SelfRatingDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelfRatingDialog: React.FC<SelfRatingDialogProps> = ({ goal, open, onOpenChange }) => {
  const { updateGoal } = useGoals();
  const [rating, setRating] = useState<number>(goal.selfRating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState<string>(goal.selfRatingComment || '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (rating < 1) return;
    setSaving(true);
    try {
      await updateGoal({
        ...goal,
        selfRating: rating,
        selfRatingComment: comment,
        selfRatedAt: new Date().toISOString(),
      });
      toast({ title: 'Self-rating submitted', description: `You rated "${goal.title}" ${rating}/5.` });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not save rating', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Self-Rate: {goal.title}</DialogTitle>
          <DialogDescription>Rate your performance on this goal. Your manager will rate after you submit.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star className={`h-7 w-7 ${n <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
              </button>
            ))}
            {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating} / 5</span>}
          </div>
          <Textarea
            placeholder="Optional comment about your self-assessment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={rating < 1 || saving}>{saving ? 'Saving…' : 'Submit self-rating'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelfRatingDialog;
