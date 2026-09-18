const PageHero = ({
  title,
  subtitle,
  badge,
  tone = 'blue',
  backgroundImage,
  breadcrumbs = []
}) => {
  const toneBorderMap = {
    blue: 'border-primary-200',
    green: 'border-emerald-200',
    slate: 'border-slate-200',
    violet: 'border-indigo-200',
    orange: 'border-amber-200'
  }

  const toneBadgeMap = {
    blue: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-200 dark:border-primary-700',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-600',
    violet: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700',
    orange: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700'
  }

  const toneBorder = toneBorderMap[tone] || toneBorderMap.blue
  const toneBadge = toneBadgeMap[tone] || toneBadgeMap.blue
  void breadcrumbs

  return (
    <section className={`relative overflow-hidden border-b ${toneBorder} bg-white py-14 md:py-16 dark:border-slate-700 dark:bg-slate-950`}>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white/95 dark:from-slate-900/85 dark:to-slate-950/95" />
      <div className="section-wrap relative text-center">
        {badge && (
          <div className={`mb-4 inline-flex rounded-full border px-4 py-1.5 text-sm font-medium ${toneBadge}`}>
            {badge}
          </div>
        )}
        <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-bold text-slate-900 md:text-5xl dark:text-slate-100">{title}</h1>
        {subtitle && <p className="mx-auto max-w-3xl text-lg text-slate-600 md:text-xl dark:text-slate-300">{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHero
