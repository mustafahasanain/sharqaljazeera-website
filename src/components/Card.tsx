interface CardProps {
  image: string;
  title: string;
  colors?: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: "red" | "green" | "orange";
  imageAlt?: string;
}

export default function Card({
  image,
  title,
  colors,
  price,
  originalPrice,
  badge,
  badgeColor = "red",
  imageAlt = "",
}: CardProps) {
  const badgeColorClasses = {
    red: "bg-red",
    green: "bg-green",
    orange: "bg-orange",
  };

  return (
    <div className="group w-full max-w-[280px] flex flex-col gap-3">
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-light-200 rounded-lg overflow-hidden">
        {badge && (
          <div
            className={`absolute top-3 left-3 ${badgeColorClasses[badgeColor]} text-light-100 px-3 py-1 rounded text-[12px] font-medium uppercase tracking-wide`}
          >
            {badge}
          </div>
        )}
        <img
          src={image}
          alt={imageAlt || title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-dark-900 font-normal text-[16px]">{title}</h3>
        {colors && (
          <p className="text-dark-700 text-[14px]">
            {colors} Color{colors !== 1 ? "s" : ""}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-dark-900 font-medium text-[18px]">${price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-dark-500 line-through text-[16px]">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
