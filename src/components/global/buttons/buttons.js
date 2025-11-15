
import Link from 'next/link';

export function ButtonCustom({ 
    children, 
    onClick, 
    variant = 1, 
    href,
    target,
    rel,
    ...props 
}) {
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

    const baseClasses = `
        flex items-center justify-center 
        px-8 py-3 
        rounded-2xl 
        font-normal text-base
        transition-colors duration-200
        ${getVariantStyles()}
    `;

    // Función para detectar si es un link externo
    const isExternalLink = (url) => {
        return url?.startsWith('http') || url?.startsWith('//') || target === '_blank';
    };

    // Si se proporciona un href, renderizar como enlace
    if (href) {
        // Si es link externo, usar <a> tag
        if (isExternalLink(href)) {
            return (
                <a 
                    href={href}
                    target={target || "_blank"}
                    rel={rel || "noopener noreferrer"}
                    className={baseClasses}
                    {...props}
                >
                    {children}
                </a>
            );
        }

        // Si es link interno, usar Link de Next.js
        return (
            <Link 
                href={href}
                className={baseClasses}
                target={target}
                rel={rel}
                {...props}
            >
                {children}
            </Link>
        );
    }

    // Si no hay href, renderizar como button normal
    return (
        <button 
            className={baseClasses}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}