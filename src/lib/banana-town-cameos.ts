export interface BananaCameo {
  id: string;
  name: string;
  description: string;
  duration: number;
  animation: 'zipline' | 'walk' | 'bike' | 'float' | 'dance' | 'investigate' | 'bench' | 'chef';
}

export const BANANA_CAMEOS: BananaCameo[] = [
  {
    id: 'zipline-worker',
    name: 'Worker Banana',
    description: 'Hardworking banana in overalls zips across on a zipline',
    duration: 3000,
    animation: 'zipline',
  },
  {
    id: 'lawyer-banana',
    name: 'Attorney Banana',
    description: 'Professional banana in a suit walks in, adjusts glasses, tips hat',
    duration: 3500,
    animation: 'walk',
  },
  {
    id: 'kid-banana',
    name: 'Kid Banana',
    description: 'Young banana learning to ride a bicycle, slightly wobbly',
    duration: 4000,
    animation: 'bike',
  },
  {
    id: 'reader-banana',
    name: 'Newspaper Banana',
    description: 'Relaxed banana in comfy chair, reading newspaper, floats by',
    duration: 3500,
    animation: 'float',
  },
  {
    id: 'bunch-dancers',
    name: 'Banana Bunch Band',
    description: 'Synchronized banana bunch does a quick dance routine',
    duration: 3000,
    animation: 'dance',
  },
  {
    id: 'detective-banana',
    name: 'Detective Banana',
    description: 'Banana detective with magnifying glass inspects and nods',
    duration: 3500,
    animation: 'investigate',
  },
  {
    id: 'elderly-banana',
    name: 'Grandpa Banana',
    description: 'Wise old banana on park bench feeding bird-bananas',
    duration: 4000,
    animation: 'bench',
  },
  {
    id: 'chef-banana',
    name: 'Chef Banana',
    description: 'Culinary banana flipping pancake-bananas with expertise',
    duration: 3200,
    animation: 'chef',
  },
];

export function getRandomBananaCameo(): BananaCameo {
  return BANANA_CAMEOS[Math.floor(Math.random() * BANANA_CAMEOS.length)];
}

export const shouldReduceMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
