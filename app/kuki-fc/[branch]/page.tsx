{/* Hero */}
<div className="relative bg-[#0f172a] py-20">
  {branch.coverImage && (
    <>
      {/* Image opacity increased to 40% for better visibility */}
      <Image src={branch.coverImage} alt={branch.name} fill className="object-cover opacity-40" />
      {/* Lighter gradient: more transparent in the middle, allowing the image to be seen */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-transparent" />
    </>
  )}
  <div className="container relative z-10">
    <Link href="/kuki-fc" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-mono mb-6 transition-colors">
      <ArrowLeft size={12} /> Kuki FC
    </Link>
    <div className="flex items-center gap-5 mb-4">
      {branch.logo ? (
        <Image src={branch.logo} alt={branch.name} width={72} height={72} className="rounded-full" />
      ) : (
        <div className="w-16 h-16 bg-[#d97706] rounded-full flex items-center justify-center">
          <span className="text-white font-display font-black text-xl">KFC</span>
        </div>
      )}
      <div>
        <p className="text-[#d97706] font-mono text-xs uppercase tracking-widest mb-1">
          {branch.city}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white">
          {branch.name}
        </h1>
      </div>
    </div>
    {branch.description && (
      <p className="text-slate-300 max-w-2xl leading-relaxed mb-6">{branch.description}</p>
    )}
    <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-mono">
      {branch.stadium && <span className="flex items-center gap-1"><MapPin size={11} /> {branch.stadium}</span>}
      {branch.manager && <span className="flex items-center gap-1"><Users size={11} /> Manager: {branch.manager}</span>}
      {branch.founded && <span>Founded {branch.founded}</span>}
    </div>
  </div>
</div>
