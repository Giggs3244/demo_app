import { Animation } from '@ionic/angular';

import { PAGE_TRANSITION_DURATION_MS, slidePageTransition } from './slide-page-transition';

describe('slidePageTransition', () => {
  const outlet = document.createElement('div');

  const page = (): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add('ion-page', 'ion-page-invisible');
    return element;
  };

  const frames = (animation: Animation): unknown[] => animation.getKeyframes().map((keyframe) => keyframe['transform']);

  it('should last 300 ms with a linear pace, as in the prototype', () => {
    const transition = slidePageTransition(outlet, { enteringEl: page(), leavingEl: page(), direction: 'forward' });

    expect(PAGE_TRANSITION_DURATION_MS).toBe(300);
    expect(transition.getDuration()).toBe(300);
    expect(transition.getEasing()).toBe('linear');
  });

  it('should bring the new page from the right and push the old one to the left when going forward', () => {
    const transition = slidePageTransition(outlet, { enteringEl: page(), leavingEl: page(), direction: 'forward' });
    const [entering, leaving] = transition.childAnimations;

    expect(frames(entering)).toEqual(['translateX(100%)', 'translateX(0)']);
    expect(frames(leaving)).toEqual(['translateX(0)', 'translateX(-100%)']);
  });

  it('should mirror the movement when going back', () => {
    const transition = slidePageTransition(outlet, { enteringEl: page(), leavingEl: page(), direction: 'back' });
    const [entering, leaving] = transition.childAnimations;

    expect(frames(entering)).toEqual(['translateX(-100%)', 'translateX(0)']);
    expect(frames(leaving)).toEqual(['translateX(0)', 'translateX(100%)']);
  });

  it('should animate only the entering page when there is no previous page', () => {
    const transition = slidePageTransition(outlet, { enteringEl: page() });

    expect(transition.childAnimations).toHaveLength(1);
  });
});
