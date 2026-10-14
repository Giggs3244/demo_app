import { AnimationBuilder, createAnimation } from '@ionic/angular';

export const PAGE_TRANSITION_DURATION_MS = 300;

interface PageTransitionOptions {
  readonly enteringEl: HTMLElement;
  readonly leavingEl?: HTMLElement;
  readonly direction?: 'forward' | 'back';
}

const INVISIBLE_PAGE_CLASS = 'ion-page-invisible';
const REST_POSITION = 'translateX(0)';

export const slidePageTransition: AnimationBuilder = (_navElement, options: PageTransitionOptions) => {
  const isBack = options.direction === 'back';
  const enterFrom = isBack ? 'translateX(-100%)' : 'translateX(100%)';
  const leaveTo = isBack ? 'translateX(100%)' : 'translateX(-100%)';

  const transition = createAnimation().duration(PAGE_TRANSITION_DURATION_MS).easing('linear');

  transition.addAnimation(
    createAnimation()
      .addElement(options.enteringEl)
      .beforeRemoveClass(INVISIBLE_PAGE_CLASS)
      .fromTo('transform', enterFrom, REST_POSITION)
      .afterClearStyles(['transform']),
  );

  if (options.leavingEl) {
    transition.addAnimation(
      createAnimation()
        .addElement(options.leavingEl)
        .fromTo('transform', REST_POSITION, leaveTo)
        .afterClearStyles(['transform']),
    );
  }

  return transition;
};
