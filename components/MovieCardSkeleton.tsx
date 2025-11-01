import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col flex-1">
        <Skeleton className="aspect-[2/3] w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
