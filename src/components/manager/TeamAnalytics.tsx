
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeamAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 py-8 text-center">
          Team analytics dashboard is coming soon.
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamAnalytics;
