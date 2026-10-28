import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SourceGallery, SourcesSection } from '../src/SourceGallery';

describe('User-provided source images', () => {
  it('shows nine unique images with source captions', () => {
    render(<SourcesSection/>);
    expect(screen.getAllByRole('button', { name: /^Phóng to:/ })).toHaveLength(9);
    expect(screen.getAllByText('Ảnh do người học cung cấp')).toHaveLength(9);
    expect(screen.getByRole('button', { name: 'Phóng to: Dây truyền động trong xưởng máy' })).toBeTruthy();
    for (const image of screen.getAllByRole('img')) {
      expect(image.getAttribute('alt')).toBeTruthy();
      expect(image.getAttribute('loading')).toBe('lazy');
      expect(image.getAttribute('srcset')).toContain('-small.jpg 480w');
    }
  });

  it('opens a full view, navigates with buttons and keyboard, and closes', () => {
    render(<SourceGallery images={['factory-workshop', 'shipping-clyde']}/>);
    const opener = screen.getByRole('button', { name: 'Phóng to: Bên trong một xưởng sản xuất' });
    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Xem ảnh tư liệu' });
    expect(within(dialog).getByRole('img').getAttribute('src')).toContain('factory-workshop.jpg');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ảnh tư liệu tiếp theo' }));
    expect(within(dialog).getByRole('img').getAttribute('src')).toContain('shipping-clyde.jpg');
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
    expect(within(dialog).getByRole('img').getAttribute('src')).toContain('factory-workshop.jpg');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Đóng ảnh tư liệu' }));
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(opener);
    fireEvent.click(opener);
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(dialog.hasAttribute('open')).toBe(false);
  });
});
