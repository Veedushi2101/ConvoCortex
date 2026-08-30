interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="relative min-h-svh w-full flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-[#07020d]">
      {/* 1. Primary Deep Radial Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#1e0a3c_0%,_#110424_50%,_#07020d_100%)] pointer-events-none" />

      {/* 2. Soft Ambient Sunset-Orange Flare (Top Right) */}
      <div className="absolute -top-[15%] -right-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#f97316]/20 via-[#d946ef]/15 to-transparent blur-[140px] pointer-events-none" />

      {/* 3. Deep Violet & Purple Glow (Bottom Left) */}
      <div className="absolute -bottom-[15%] -left-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#7c3aed]/25 via-[#4c1d95]/20 to-transparent blur-[140px] pointer-events-none" />

      {/* 4. Center Spotlight Behind Form Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_#9333ea_0%,_transparent_70%)] opacity-[0.12] blur-[80px] pointer-events-none" />

      {/* 5. Subtle High-Tech Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(224, 170, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(224, 170, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* 6. Children Container */}
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
        {children}
      </div>
    </div>
  );
};

export default Layout;