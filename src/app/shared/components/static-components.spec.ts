import { TestBed } from '@angular/core/testing';

import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { PlaceholderContentComponent } from './placeholder-content/placeholder-content.component';
import { ProductCardSkeletonComponent } from './product-card-skeleton/product-card-skeleton.component';

describe('Static shared components', () => {
  describe('ProductCardSkeletonComponent', () => {
    it('should announce that products are loading and hide the decorative blocks', async () => {
      const fixture = TestBed.createComponent(ProductCardSkeletonComponent);
      await fixture.whenStable();
      const element: HTMLElement = fixture.nativeElement;

      expect(element.getAttribute('role')).toBe('status');
      expect(element.getAttribute('aria-busy')).toBe('true');
      expect(element.getAttribute('aria-label')).toBe('Cargando productos');
      expect(element.querySelector('.skeleton')?.getAttribute('aria-hidden')).toBe('true');
      expect(element.querySelectorAll('ion-skeleton-text')).toHaveLength(4);
    });
  });

  describe('LoadingOverlayComponent', () => {
    it('should expose a busy alert with the spinner', async () => {
      const fixture = TestBed.createComponent(LoadingOverlayComponent);
      await fixture.whenStable();
      const element: HTMLElement = fixture.nativeElement;

      expect(element.getAttribute('role')).toBe('alert');
      expect(element.getAttribute('aria-busy')).toBe('true');
      expect(element.querySelector('img')?.getAttribute('alt')).toBe('Cargando');
    });
  });

  describe('PlaceholderContentComponent', () => {
    it('should render the title and the description', async () => {
      const fixture = TestBed.createComponent(PlaceholderContentComponent);
      fixture.componentRef.setInput('title', 'Pantalla\nde ofertas');
      fixture.componentRef.setInput('description', 'Contenido de prueba');
      await fixture.whenStable();
      const element: HTMLElement = fixture.nativeElement;

      expect(element.querySelector('h2')?.textContent).toBe('Pantalla\nde ofertas');
      expect(element.querySelector('p')?.textContent).toBe('Contenido de prueba');
    });
  });
});
