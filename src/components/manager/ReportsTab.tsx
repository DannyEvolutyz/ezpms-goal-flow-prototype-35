
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReportsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 py-8 text-center">
          Reports dashboard is coming soon.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;
