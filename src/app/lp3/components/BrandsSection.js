export const BrandsSection = () => {
  const brands = [
    { name: "Asian Paints", logo: "/images/brands/asian-paints.png" },
    { name: "Godrej", logo: "/images/brands/godrej.png" },
    { name: "Bosch", logo: "/images/brands/bosch.png" },
    { name: "Siemens", logo: "/images/brands/siemens.png" },
    { name: "Saint-Gobain", logo: "/images/brands/saint-gobain.png" },
    { name: "Greenply", logo: "/images/brands/greenply.png" },
    { name: "Jaquar", logo: "/images/brands/jaquar.png" },
  ];

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <p className="text-center text-muted-foreground mb-8">Trusted by Leading Brands</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="grayscale-[0.3] md:grayscale opacity-90 md:opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              style={{
                animation: `brandPulse 7s ease-in-out infinite`,
                animationDelay: `${index * 1}s`
              }}
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-8 md:h-10 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes brandPulse {
          0%, 100% { 
            filter: grayscale(0.3);
            opacity: 0.9;
          }
          14.28%, 85.72% { 
            filter: grayscale(0.3);
            opacity: 0.9;
          }
          50% { 
            filter: grayscale(0);
            opacity: 1;
          }
        }
        @media (min-width: 768px) {
          @keyframes brandPulse {
            0%, 100% { 
              filter: grayscale(1);
              opacity: 0.7;
            }
            14.28%, 85.72% { 
              filter: grayscale(1);
              opacity: 0.7;
            }
            50% { 
              filter: grayscale(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </section>
  );
};