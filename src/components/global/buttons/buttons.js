export function ButtonCustom({ children, onClick, variant = 1 }) {
    const getVariantStyles = () => {
        switch (variant) {
            case 1:
                // Primary - Purple filled
                return "bg-amethyst-500 text-white hover:bg-amethyst-600";
            case 2:
                // Secondary - White with purple border
                return "bg-white text-amethyst-950 font-medium border-2 border-amethyst-500 hover:bg-amethyst-50";
            case 3:
                // Tertiary - Green filled
                return "bg-fern-600 text-white hover:bg-fern-700";
            case 4:
                // Ghost - Transparent with green text
                return "bg-transparent text-fern-600 hover:bg-fern-50";
            default:
                return "bg-amethyst-500 text-white hover:bg-amethyst-600";
        }
    };

    return (
        <button 
            className={`
                flex items-center justify-center 
                px-8 py-3 
                rounded-2xl 
                font-normal text-base
                transition-colors duration-200
                ${getVariantStyles()}
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
