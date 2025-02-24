const StarRating = ({ score }) => {
    return (
      <div className="flex gap-1 mt-2">
        {[...Array(5)].map((_, i) => {
          const fillPercentage = Math.min(100, Math.max(0, (score - i) * 100)); // Fill percentage (0-100%)
  
          return (
            <svg key={i} viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
              {/* Background empty star */}
              <path
                fill="currentColor"
                d="M12 2l2.9 6.9L22 9.2l-5 5 1.4 7.8L12 18l-6.4 4L7 14l-5-5 7.1-1L12 2z"
              />
              {/* Foreground fill star (clipped to a percentage) */}
              <rect
                x="0"
                y="0"
                width={`${fillPercentage}%`}
                height="100%"
                fill="orange"
                clipPath="url(#starMask)"
              />
              {/* Clip path to ensure proper star shape filling */}
              <defs>
                <clipPath id="starMask">
                  <path d="M12 2l2.9 6.9L22 9.2l-5 5 1.4 7.8L12 18l-6.4 4L7 14l-5-5 7.1-1L12 2z" />
                </clipPath>
              </defs>
            </svg>
          );
        })}
      </div>
    );
  };
  
  export default StarRating;
  