// components/MobileContainer.tsx
// Container qui centre le contenu sur desktop avec fond plein écran

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = "" }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className={`w-full max-w-[393px] ${className}`}>
        {children}
      </div>
    </div>
  );
}