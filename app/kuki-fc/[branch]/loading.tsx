// app/kuki-fc/[branch]/loading.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BranchLoading() {
  return (
    <>
      <Header />
      <main>
        {/* Skeleton hero */}
        <div className="bg-[#0f172a] py-20">
          <div className="container">
            <div className="skeleton h-4 w-24 mb-6" />
            <div className="flex items-center gap-5 mb-4">
              <div className="skeleton w-16 h-16 rounded-full" />
              <div>
                <div className="skeleton h-4 w-20 mb-2" />
                <div className="skeleton h-8 w-64" />
              </div>
            </div>
            <div className="skeleton h-6 w-3/4 mb-6" />
            <div className="flex gap-5">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Skeleton nav */}
        <div className="bg-white border-b border-[#e5e0d8]">
          <div className="container flex gap-0">
            {['Overview', 'Squad', 'Fixtures', 'Photos'].map(label => (
              <div key={label} className="px-5 py-3.5">
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
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
            </div>
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
