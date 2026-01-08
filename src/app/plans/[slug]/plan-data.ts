export const plansData: Record<string, {
    id: string
    title: string
    subtitle: string
    categories: string[]
    description: string
    image: string
    duration: string
    views: string
    likes: string
    participants: { id: number; name: string; avatar: string }[]
  }> = {
    'becoming-resilient': {
      id: '3',
      title: 'Becoming Resilient',
      subtitle: 'A study plan for spiritual strength',
      categories: ['Day of plan', 'Gratitude', 'Wisdom'],
      description: 'The "Becoming Resilient" study plan is designed to empower you to confront challenges with unwavering faith. Each session is thoughtfully crafted and includes insightful questions, practical applications, and heartfelt prayers aimed at fortifying your spiritual foundation.',
      image: '/plans/plan3.png',
      duration: '90 Days',
      views: '18.2k',
      likes: '5.6k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
        { id: 3, name: 'User 3', avatar: '' },
      ]
    },
    'psalms-30-days': {
      id: '1',
      title: 'Psalms in 30 days',
      subtitle: 'A meditation journey through Psalms',
      categories: ['Meditation', 'Prayer', 'Worship'],
      description: 'Join our 30-day Psalms meditation journey. Reflect on hope, faith, and the timeless wisdom found in the book of Psalms. Each day brings you closer to understanding God\'s eternal love.',
      image: '/plans/plan1.png',
      duration: '30 Days',
      views: '24.5k',
      likes: '8.3k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
      ]
    },
    'body-of-christ': {
      id: '2',
      title: 'The Body of Christ',
      subtitle: 'Understanding the community of believers',
      categories: ['Community', 'Fellowship', 'Unity'],
      description: 'A deep dive into what it means to be part of the community of believers. Explore the metaphor of the body of Christ and discover your unique role in God\'s family.',
      image: '/plans/plan2.png',
      duration: '21 Days',
      views: '15.8k',
      likes: '4.2k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
        { id: 3, name: 'User 3', avatar: '' },
        { id: 4, name: 'User 4', avatar: '' },
      ]
    },
    'good-shepherd': {
      id: '4',
      title: 'The Good Shepherd',
      subtitle: 'Finding guidance in Psalm 23',
      categories: ['Guidance', 'Protection', 'Trust'],
      description: 'Reflect on the guidance and protection found in the 23rd Psalm. Learn to trust in the Lord as your shepherd who leads you through life\'s valleys.',
      image: '/plans/plan4.png',
      duration: '14 Days',
      views: '19.1k',
      likes: '6.7k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
      ]
    },
    'moving-forward': {
      id: '5',
      title: 'Moving Forward in Faith',
      subtitle: 'Steps into the unknown with God',
      categories: ['Faith', 'Trust', 'Journey'],
      description: 'A series on trusting God\'s plan and taking steps into the unknown. Learn to walk by faith, not by sight, as you move forward in your spiritual journey.',
      image: '/plans/plan5.png',
      duration: '45 Days',
      views: '12.4k',
      likes: '3.9k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
        { id: 3, name: 'User 3', avatar: '' },
      ]
    },
    'believers-journey': {
      id: '6',
      title: "The Believer's Journey",
      subtitle: 'A path of spiritual growth',
      categories: ['Growth', 'Discipleship', 'Faith'],
      description: 'A 30-day meditation on the path of spiritual growth and discipleship. Discover what it means to follow Christ daily and grow in your faith.',
      image: '/plans/plan6.png',
      duration: '30 Days',
      views: '21.3k',
      likes: '7.1k',
      participants: [
        { id: 1, name: 'User 1', avatar: '' },
        { id: 2, name: 'User 2', avatar: '' },
      ]
    },
  }
  