import { usePopularGames } from "../../hooks/useGamesData";

const AuthPageLayout = ({ eyebrow, title, icon: Icon, children }) => {
  const { data: popularGames = [] } = usePopularGames();
  const featuredGame = popularGames?.[0];

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-9.5rem)] overflow-hidden">
      <div className="w-full h-full min-h-[inherit] grid grid-cols-1 lg:grid-cols-[minmax(0,50vw)_minmax(0,50vw)] gap-0 items-stretch">
        <div className="relative bg-void-purple p-5 sm:p-7 md:p-9 lg:p-12 xl:p-14 flex items-center border-t-4 lg:border-t-0 lg:border-r-2 border-jinx-pink overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-8 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_8px)]" />
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_15%_15%,#ff2a6d2e_0%,transparent_48%),radial-gradient(circle_at_82%_84%,#0aff6024_0%,transparent_44%)]" />
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="none"
          >
            <path
              d="M-60,55 Q 180,5 380,75 T 760,50"
              stroke="#ff2a6d"
              strokeWidth="10"
              fill="none"
              opacity="0.18"
              strokeLinecap="round"
            />
            <path
              d="M 40,220 L 60,188 L 82,222"
              stroke="#0aff60"
              strokeWidth="3"
              fill="none"
              opacity="0.22"
            />
          </svg>

          <div className="relative z-10 w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0">
            <div className="mb-6 lg:mb-8">
              <p className="font-roboto uppercase tracking-[0.2em] text-zaun-green text-xs">
                {eyebrow}
              </p>
              <h1 className="font-marker text-3xl sm:text-4xl lg:text-[2.7rem] text-dirty-white mt-2 flex items-center gap-2">
                <Icon className="text-jinx-pink" /> {title}
              </h1>
            </div>

            {children}
          </div>
        </div>

        <aside className="hidden lg:block min-h-full bg-black relative overflow-hidden">
          {featuredGame?.background_image ? (
            <img
              src={featuredGame.background_image}
              alt={featuredGame.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-toxic" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-black/5" />
        </aside>
      </div>
    </section>
  );
};

export default AuthPageLayout;
