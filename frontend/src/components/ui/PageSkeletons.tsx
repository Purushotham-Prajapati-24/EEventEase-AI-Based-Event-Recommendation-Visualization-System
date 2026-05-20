import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DiscoverySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden flex flex-col h-full">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-6 flex flex-col flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <Skeleton className="h-64 md:h-96 w-full rounded-xl" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4 flex items-center gap-4">
             <Skeleton className="h-16 w-16 rounded-full" />
             <div className="space-y-2 flex-1">
               <Skeleton className="h-5 w-1/2" />
               <Skeleton className="h-4 w-1/3" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border bg-card overflow-hidden">
      <div className="w-1/3 border-r flex flex-col hidden md:flex">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex-1 overflow-hidden p-2 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1 overflow-hidden">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                 <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                 <Skeleton className={`h-16 rounded-2xl ${i % 2 === 0 ? 'w-48 rounded-tr-sm' : 'w-64 rounded-tl-sm'}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
           <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Cover Image & Profile Header */}
      <div className="relative">
        <Skeleton className="w-full h-48 md:h-64 rounded-xl" />
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
          <div className="mb-4 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 hidden md:block">
           <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border p-4 rounded-xl">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            <div className="border p-4 rounded-xl">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-4 border-b pb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="border p-4 rounded-xl flex gap-4">
                 <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                 <div className="space-y-2 flex-1 py-1">
                   <Skeleton className="h-5 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                   <Skeleton className="h-4 w-1/4 mt-auto" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizerDashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Skeleton className="h-12 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-14 w-48 rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <Skeleton className="w-full h-14 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow-lg p-6">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-lg p-6">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2rem] border bg-card text-card-foreground shadow-lg flex flex-col md:flex-row p-6 gap-6">
               <Skeleton className="h-40 w-full md:w-64 rounded-2xl" />
               <div className="flex-1 space-y-4">
                 <Skeleton className="h-8 w-3/4" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-5/6" />
                 </div>
                 <div className="flex gap-4 pt-4">
                   <Skeleton className="h-10 w-32 rounded-lg" />
                   <Skeleton className="h-10 w-32 rounded-lg" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

