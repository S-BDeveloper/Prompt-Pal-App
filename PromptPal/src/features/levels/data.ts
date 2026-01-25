import { Level } from '../game/store';

export const LEVELS: Level[] = [
  {
    id: 'level_01',
    moduleId: 'mod_1',
    type: 'image',
    title: 'Surreal Landscapes',
    difficulty: 'beginner',
    targetImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    hiddenPromptKeywords: ['floating islands', 'nebula', 'waterfall', 'crystals'],
    style: 'Surrealism',
    passingScore: 75,
    unlocked: true,
  },
  {
    id: 'level_02',
    moduleId: 'mod_2',
    type: 'code',
    title: 'Sort Dictionary List',
    moduleTitle: 'Python: Module 4',
    difficulty: 'intermediate',
    requirementBrief: 'Create a prompt that instructs the AI to write a function sort_by_age(data). The function should take a list of dictionaries and return it sorted by the \'age\' key in descending order.',
    requirementImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    language: 'PYTHON 3.10',
    passingScore: 80,
    unlocked: true,
    testCases: [
      { id: '1', name: 'test_sorting_basic', passed: true },
      { id: '2', name: 'test_empty_list', passed: true },
      { id: '3', name: 'test_reverse_order', passed: true },
    ]
  },
  {
    id: 'level_03',
    moduleId: 'mod_3',
    type: 'copywriting',
    title: 'Copywriting Challenge',
    moduleTitle: 'MODULE 3: ENGAGEMENT',
    difficulty: 'advanced',
    briefTitle: 'The Marketing Brief',
    briefProduct: 'Neo-Coffee Social',
    briefTarget: 'Gen Z Urbanites',
    briefTone: 'Bold & Energetic',
    briefGoal: 'Drive subscriptions for sustainable, biodegradable coffee pods. Focus on the intersection of convenience and eco-consciousness.',
    targetImageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop',
    passingScore: 85,
    unlocked: true,
    metrics: [
      { label: 'TONE', value: 85 },
      { label: 'PERSUASION', value: 72 },
      { label: 'CLARITY', value: 90 },
    ]
  }
];

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find(level => level.id === id);
}

export function getLevelsByModuleId(moduleId: string): Level[] {
  return LEVELS.filter(level => level.moduleId === moduleId);
}

export function getNextLevel(currentId: string): Level | undefined {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex === LEVELS.length - 1) {
    return undefined;
  }
  return LEVELS[currentIndex + 1];
}

export function getUnlockedLevels(): Level[] {
  return LEVELS.filter(level => level.unlocked);
}
