'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ReactionBar() {
    const [reactions, setReactions] = useState({
        helpful: 0,
        love: 0,
        ohNo: 0,
        thanks: 0
    });

    const [userReactions, setUserReactions] = useState({
        helpful: false,
        love: false,
        ohNo: false,
        thanks: false
    });

    const toggleReaction = (type) => {
        setUserReactions(prev => ({
            ...prev,
            [type]: !prev[type]
        }));

        setReactions(prev => ({
            ...prev,
            [type]: userReactions[type] ? prev[type] - 1 : prev[type] + 1
        }));
    };

    const reactionTypes = [
        {
            id: 'helpful',
            src: '/assets/icons-svg/react/Helpful.svg',
            alt: 'Helpful'
        },
        {
            id: 'love',
            src: '/assets/icons-svg/react/love.svg',
            alt: 'Love'
        },
        {
            id: 'ohNo',
            src: '/assets/icons-svg/react/oh_no.svg',
            alt: 'Oh No'
        },
        {
            id: 'thanks',
            src: '/assets/icons-svg/react/thanks.svg',
            alt: 'Thanks'
        }
    ];

    return (
        <div className="w-full justify-between flex items-center gap-4 px-4">
            {reactionTypes.map((reaction) => (
                <button
                    key={reaction.id}
                    onClick={() => toggleReaction(reaction.id)}
                    className={`flex items-center gap-1 p-1.5 rounded-lg transition-all ${userReactions[reaction.id]
                            ? 'bg-amethyst-50 hover:bg-amethyst-100'
                            : 'hover:bg-gray-100'
                        }`}
                    aria-label={`React with ${reaction.alt}`}
                >
                    <div className="w-6 h-6 relative">
                        <Image
                            src={reaction.src}
                            alt={reaction.alt}
                            fill
                            className={`object-contain ${userReactions[reaction.id]
                                    ? 'filter-amethyst'
                                    : ''
                                }`}
                        />
                    </div>
                    {reactions[reaction.id] > 0 && (
                        <span className={`text-sm font-medium ${userReactions[reaction.id]
                                ? 'text-amethyst-600'
                                : 'text-gray-600'
                            }`}>{reactions[reaction.id]}</span>
                    )}
                </button>
            ))}
        </div>
    );
}