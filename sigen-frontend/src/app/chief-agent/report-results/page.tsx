import WeeklyReportResults from '@/app_features/week-report/report-results/report-results';
import { Suspense } from 'react';

function LoadingIndicator() {
  return <div>Carregando relatório...</div>;
}

export default function WeeklyReportResultsPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <WeeklyReportResults />
    </Suspense>
  );
}