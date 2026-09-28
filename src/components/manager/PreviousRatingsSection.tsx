import React from 'react';
import { Star } from 'lucide-react';
import { Goal } from '@/types';
import { useGoals } from '@/contexts/goal';

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : '—');

const PreviousRatingsSection: React.FC<{ goal: Goal }> = ({ goal }) => {
  const { goals, spaces } = useGoals();
  const current = spaces.find(s => s.id === goal.spaceId);
  if (!current || current.spaceKind !== 'cycle' || !goal.sourceGoalId) return null;

  const key = (s: typeof current) =>
    `${s.selfRatingStartDate || s.ratingStartDate || ''}|${s.createdAt}`;
  const earlier = spaces
    .filter(s => s.spaceKind === 'cycle' && s.parentId === current.parentId && s.id !== current.id && key(s) < key(current))
    .sort((a, b) => key(a).localeCompare(key(b)));

  if (earlier.length === 0) return null;

  return (
    <div className="rounded-md border p-3 space-y-3">
      <h4 className="text-sm font-semibold">Previous ratings</h4>
      {earlier.map(s => {
        const g = goals.find(x => x.spaceId === s.id && x.sourceGoalId === goal.sourceGoalId && x.userId === goal.userId);
        return (
          <div key={s.id} className="text-sm border-t pt-2 first:border-t-0 first:pt-0">
            <div className="font-medium">
              {s.name} <span className="text-muted-foreground font-normal">({fmt(s.selfRatingStartDate)} – {fmt(s.managerRatingEndDate)})</span>
            </div>
            <div className="mt-1 flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 text-amber-400 fill-amber-400" />
              <span>Member self-rating: {g?.selfRating ? `${g.selfRating}/5` : 'Not rated yet'}
                {g?.selfRatingComment && <span className="text-muted-foreground"> "{g.selfRatingComment}"</span>}</span>
            </div>
            <div className="mt-1 flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 text-primary fill-primary" />
              <span>Manager rating: {g?.rating ? `${g.rating}/5` : 'Not rated yet'}
                {g?.ratingComment && <span className="text-muted-foreground"> "{g.ratingComment}"</span>}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreviousRatingsSection;
