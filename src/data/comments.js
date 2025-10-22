const commentsData = [
  {
    id: 1,
    therapistId: 101,
    userId: 201,
    userName: "María García",
    userAvatar: "https://i.pravatar.cc/150?u=208",
    isAnonymous: false,
    rating: 5,
    content: "Excellent therapist who helped me tremendously with my anxiety issues that had been affecting my daily life for years. Their evidence-based techniques are incredibly effective, and they create such a welcoming, judgment-free environment that made it easy for me to open up about my struggles. I've seen significant improvement in just a few months of therapy.",
    date: "2024-01-15T10:30:00Z",
    reactions: {
      useful: 12,
      loved: 8,
      thankful: 15,
      ohNo: 0
    },
    userReaction: null
  },
  {
    id: 2,
    therapistId: 101,
    userId: 202,
    userName: "Anonymous User",
    userAvatar: "https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff",
    isAnonymous: true,
    rating: 4,
    content: "Very professional and empathetic therapist who made me feel truly heard and understood from our very first session. They have a remarkable ability to create a safe space where I can explore difficult emotions without judgment. Their insights have been invaluable in helping me understand patterns in my behavior that I wasn't even aware of.",
    date: "2024-01-10T15:45:00Z",
    reactions: {
      useful: 7,
      loved: 5,
      thankful: 9,
      ohNo: 1
    },
    userReaction: "thankful"
  },
  {
    id: 3,
    therapistId: 102,
    userId: 203,
    userName: "Carlos Rodríguez",
    userAvatar: "https://i.pravatar.cc/150?u=202",
    isAnonymous: false,
    rating: 5,
    content: "Amazing experience that truly changed my life. The doctor helped me navigate and overcome an incredibly difficult phase after my divorce, providing me with tools and perspectives that I still use daily. Their compassionate approach combined with practical strategies made all the difference. I cannot recommend them highly enough to anyone going through similar challenges.",
    date: "2024-01-08T09:00:00Z",
    reactions: {
      useful: 20,
      loved: 18,
      thankful: 25,
      ohNo: 0
    },
    userReaction: "loved"
  },
  {
    id: 4,
    therapistId: 102,
    userId: 204,
    userName: "Ana Martínez",
    userAvatar: "https://i.pravatar.cc/150?u=204",
    isAnonymous: false,
    rating: 3,
    content: "Good attention and care from the therapist, though I sometimes wished our sessions could be longer to dive deeper into certain topics. Despite the time constraints, I must say their therapeutic approach is quite effective, and they always manage to address the most pressing issues. The homework assignments between sessions have been particularly helpful in maintaining progress.",
    date: "2024-01-05T14:20:00Z",
    reactions: {
      useful: 5,
      loved: 2,
      thankful: 3,
      ohNo: 4
    },
    userReaction: null
  },
  {
    id: 5,
    therapistId: 103,
    userId: 205,
    userName: "Anonymous User",
    userAvatar: "https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff",
    isAnonymous: true,
    rating: 5,
    content: "Life changing experience that I wish I had found sooner. After years of struggling with severe depression and trying different therapists without success, I finally found someone who truly understands my condition and knows how to help. Their combination of cognitive behavioral therapy and mindfulness techniques has given me hope and real tools to manage my symptoms. For the first time in years, I feel like myself again.",
    date: "2023-12-28T11:15:00Z",
    reactions: {
      useful: 30,
      loved: 45,
      thankful: 50,
      ohNo: 0
    },
    userReaction: "thankful"
  },
  {
    id: 6,
    therapistId: 103,
    userId: 206,
    userName: "Laura Sánchez",
    userAvatar: "https://i.pravatar.cc/150?u=212",
    isAnonymous: false,
    rating: 4,
    content: "Very good therapist with an excellent track record, although their popularity means it can sometimes be challenging to get an appointment on short notice. However, the quality of care absolutely makes it worth the wait. They remember details from previous sessions and really invest in understanding your unique situation, which creates a continuity of care that I haven't experienced elsewhere.",
    date: "2023-12-20T16:30:00Z",
    reactions: {
      useful: 8,
      loved: 6,
      thankful: 10,
      ohNo: 2
    },
    userReaction: "useful"
  },
  {
    id: 7,
    therapistId: 101,
    userId: 207,
    userName: "David Thompson",
    userAvatar: "https://i.pravatar.cc/150?u=207",
    isAnonymous: false,
    rating: 5,
    content: "Incredible professional who specializes in cognitive behavioral therapy and truly knows how to apply it effectively. Their structured CBT approach has been instrumental in helping me not just manage but significantly reduce my panic attacks. They taught me practical techniques that I can use anywhere, anytime, and I'm so grateful for the confidence this has given me to live my life without constant fear.",
    date: "2023-12-15T13:00:00Z",
    reactions: {
      useful: 15,
      loved: 12,
      thankful: 20,
      ohNo: 0
    },
    userReaction: "thankful"
  },
  {
    id: 8,
    therapistId: 104,
    userId: 208,
    userName: "Anonymous User",
    userAvatar: "https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff",
    isAnonymous: true,
    rating: 2,
    content: "Unfortunately, I didn't feel comfortable with the therapeutic approach used in our sessions. While I can see how their direct, confrontational style might work well for some people, it felt too aggressive for my current emotional state. Perhaps it's just a matter of finding the right fit, but I decided to look for someone whose approach aligns better with what I need at this point in my healing journey.",
    date: "2023-12-10T10:45:00Z",
    reactions: {
      useful: 3,
      loved: 1,
      thankful: 0,
      ohNo: 8
    },
    userReaction: "ohNo"
  },
  {
    id: 9,
    therapistId: 104,
    userId: 209,
    userName: "Sarah Johnson",
    userAvatar: "https://i.pravatar.cc/150?u=209",
    isAnonymous: false,
    rating: 4,
    content: "Great listener who demonstrates incredible patience, especially when I struggle to articulate my feelings. They've been instrumental in helping me work through complex relationship issues with my family and partner, providing practical strategies that actually work in real-life situations. What I appreciate most is how they help me see situations from multiple perspectives without making me feel judged for my own feelings.",
    date: "2023-12-05T17:20:00Z",
    reactions: {
      useful: 11,
      loved: 7,
      thankful: 13,
      ohNo: 1
    },
    userReaction: "useful"
  },
  {
    id: 10,
    therapistId: 105,
    userId: 210,
    userName: "Michael Chen",
    userAvatar: "https://i.pravatar.cc/150?u=210",
    isAnonymous: false,
    rating: 5,
    content: "The best decision I've ever made for my mental health was starting therapy with this incredible professional. From day one, they created such a safe, nurturing space that allowed me to finally open up about traumas I'd been carrying for decades. Their gentle yet effective approach has helped me process these experiences in a way that feels healing rather than retraumatizing. I'm becoming the person I always wanted to be.",
    date: "2023-11-30T14:00:00Z",
    reactions: {
      useful: 22,
      loved: 28,
      thankful: 35,
      ohNo: 0
    },
    userReaction: "loved"
  },
  {
    id: 11,
    therapistId: 105,
    userId: 211,
    userName: "Anonymous User",
    userAvatar: "https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff",
    isAnonymous: true,
    rating: 4,
    content: "This therapist has helped me understand my trauma responses in ways I never thought possible, explaining the science behind why my body and mind react the way they do. While I'm still actively working through my healing journey and know there's more work ahead, I finally feel hopeful about my future. They've given me a roadmap for recovery that feels achievable and sustainable, which is something I've never had before.",
    date: "2023-11-25T11:30:00Z",
    reactions: {
      useful: 18,
      loved: 15,
      thankful: 22,
      ohNo: 0
    },
    userReaction: null
  }
];

export default commentsData;