// app/kuki-fc/[branch]/loading.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BranchLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Skeleton hero – exactly mirrors the real hero background */}
        <div className="relative bg-[#0f172a] py-20 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-transparent" />
          <div className="container relative z-10 w-full">
            {/* Back link */}
            <div className="skeleton h-4 w-24 mb-6" />
            {/* Logo + title area */}
            <div className="flex items-center gap-5 mb-4">
              <div className="skeleton w-16 h-16 rounded-full" />
              <div>
                <div className="skeleton h-4 w-20 mb-2" />
                <div className="skeleton h-8 w-64" />
              </div>
            </div>
            {/* Description */}
            <div className="skeleton h-6 w-3/4 mb-6" />
            {/* Meta info */}
            <div className="flex gap-5">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Skeleton nav bar */}
        <div className="bg-white border-b border-[#e5e0d8] sticky top-0 z-40">
          <div className="container flex gap-0">
            {['Overview', 'Squad', 'Fixtures', 'Photos'].map(label => (
              <div key={label} className="px-5 py-3.5">
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton content area – matches grid layout of real page */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Squad section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="skeleton h-8 w-32" />
                  <div className="skeleton h-4 w-24" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-[#e5e0d8] rounded-sm p-4 text-center">
                      <div className="skeleton w-14 h-14 rounded-md mx-auto mb-3" />
                      <div className="skeleton h-4 w-12 mx-auto mb-1" />
                      <div className="skeleton h-4 w-24 mx-auto mb-1" />
                      <div className="skeleton h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent results (if needed) */}
              <div>
                <div className="skeleton h-8 w-40 mb-6" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white border border-[#e5e0d8] rounded-sm p-4 flex justify-between">
                      <div className="space-y-2">
                        <div className="skeleton h-3 w-40" />
                        <div className="skeleton h-5 w-64" />
                      </div>
                      <div className="skeleton h-6 w-16 rounded-sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar – upcoming fixtures */}
            <div>
              <div className="skeleton h-8 w-28 mb-6" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-[#e5e0d8] rounded-sm p-4 mb-3">
                  <div className="skeleton h-4 w-20 mb-2" />
                  <div className="skeleton h-4 w-32 mb-2" />
                  <div className="skeleton h-3 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
