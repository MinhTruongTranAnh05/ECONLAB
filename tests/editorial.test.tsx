import { createRef } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormationStory } from '../src/editorial/FormationStory';
import { CharacteristicsExplorer } from '../src/editorial/CharacteristicsExplorer';
import { ConceptGlossary } from '../src/editorial/ConceptGlossary';
import { AcademicContents } from '../src/editorial/AcademicContents';
import { ExamInsights } from '../src/editorial/ExamInsights';
import { AnimatedHeading, Reveal } from '../src/motion';
import { ChapterCover } from '../src/editorial/ChapterCover';
import { characteristics, questions, stages } from '../src/data';

const originalObserver = globalThis.IntersectionObserver;
afterEach(() => { vi.stubGlobal('IntersectionObserver', originalObserver); });

describe('Editorial learning interactions', () => {
  it('retains every formation explanation and allows explicit stage selection', () => {
    render(<FormationStory/>);
    for (const stage of stages) expect(screen.getByText(stage.text)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Xem giai đoạn 4' }));
    expect(screen.getByRole('button', { name: /04.*Tổ chức độc quyền/ }).getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('.concept-explanation h3')?.textContent).toBe(stages[3].title);
    expect(vi.mocked(Element.prototype.scrollIntoView).mock.contexts).not.toContain(document.querySelector('[data-step="3"]'));
  });

  it('scrolls only the reading pane and keeps the selected diagram during smooth scrolling', () => {
    render(<FormationStory/>);
    const pane = screen.getByRole('region', { name: 'Các giai đoạn hình thành độc quyền' });
    const step = document.querySelector('[data-step="3"]')!;
    vi.spyOn(pane, 'getBoundingClientRect').mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(step, 'getBoundingClientRect').mockReturnValue({ top: 500 } as DOMRect);
    const scrollPage = vi.mocked(window.scrollTo).mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Xem giai đoạn 4' }));
    expect(pane.scrollTo).toHaveBeenLastCalledWith({ top: 400, behavior: 'smooth' });
    fireEvent.scroll(pane);
    expect(document.querySelector('.concept-explanation h3')?.textContent).toBe(stages[3].title);
    expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(scrollPage);
  });

  it('updates the diagram when the reader manually scrolls the left pane', () => {
    render(<FormationStory/>);
    const pane = screen.getByRole('region', { name: 'Các giai đoạn hình thành độc quyền' });
    Object.defineProperty(pane, 'clientHeight', { value: 600 });
    vi.spyOn(pane, 'getBoundingClientRect').mockReturnValue({ top: 100 } as DOMRect);
    document.querySelectorAll('.formation-step').forEach((step, index) => {
      vi.spyOn(step, 'getBoundingClientRect').mockReturnValue({ top: index * 200 - 300, bottom: index < 2 ? 200 : 400 } as DOMRect);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Xem giai đoạn 4' }));
    fireEvent.wheel(pane);
    fireEvent.scroll(pane);
    expect(document.querySelector('.concept-explanation h3')?.textContent).toBe(stages[2].title);
    expect(screen.getByRole('button', { name: 'Xem giai đoạn 3' }).getAttribute('aria-pressed')).toBe('true');
    Object.defineProperty(pane, 'scrollHeight', { value: 900 });
    pane.scrollTop = 300;
    fireEvent.scroll(pane);
    expect(document.querySelector('.concept-explanation h3')?.textContent).toBe(stages[3].title);
  });

  it('does not scroll the page or the pane when selecting a mobile stage', () => {
    render(<FormationStory/>);
    const pane = document.querySelector('.formation-steps')!;
    const paneScrolls = vi.mocked(pane.scrollTo).mock.calls.length;
    const pageScrolls = vi.mocked(window.scrollTo).mock.calls.length;
    vi.mocked(window.matchMedia).mockImplementationOnce(() => ({ matches: true } as MediaQueryList));
    fireEvent.click(screen.getByRole('button', { name: /02.*Tích tụ/ }));
    expect(vi.mocked(pane.scrollTo).mock.calls).toHaveLength(paneScrolls);
    expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(pageScrolls);
    expect(document.querySelector('.concept-explanation h3')?.textContent).toBe(stages[1].title);
  });

  it('lets readers select each characteristic and use arrow keys and Home/End', () => {
    render(<CharacteristicsExplorer/>);
    const map = screen.getByRole('region', { name: 'Bản đồ năm đặc điểm kinh tế' });
    const second = within(map).getByRole('button', { name: `Đặc điểm 2: ${characteristics[1].title}` });
    fireEvent.click(second);
    expect(second.getAttribute('aria-pressed')).toBe('true');
    expect(within(map).getByText(characteristics[1].text)).toBeTruthy();
    fireEvent.keyDown(second, { key: 'ArrowRight' });
    const third = within(map).getByRole('button', { name: `Đặc điểm 3: ${characteristics[2].title}` });
    expect(third.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: 'End' });
    expect(within(map).getByText(characteristics[4].takeaway)).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(within(map).getByText(characteristics[0].text)).toBeTruthy();
    expect(document.querySelectorAll('.knowledge-path.is-active')).toHaveLength(1);
  });

  it('opens sourced definitions, closes on Escape and returns focus', () => {
    render(<ConceptGlossary/>);
    const trigger = screen.getByRole('button', { name: 'Tư bản tài chính' });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Tư bản tài chính' });
    expect(dialog.textContent).toContain(characteristics[1].text);
    expect(within(dialog).getByRole('link', { name: 'Đọc bài 4.2' }).getAttribute('href')).toBe('#chuong-42');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('expands only the active chapter subcontents and preserves completion controls', () => {
    const toggle = vi.fn();
    const { rerender } = render(<AcademicContents active="chuong-42" completed={['chuong-41']} collapsed={false} shown onToggle={toggle} readingPercentRef={createRef()} readingBarRef={createRef()}/>);
    expect(screen.getByRole('navigation', { name: 'Các mục chương 4.2' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Các mục chương 4.1' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Bản đồ năm đặc điểm' }).getAttribute('href')).toBe('#lenin-explorer');
    expect((screen.getByRole('progressbar') as HTMLProgressElement).value).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Thu gọn mục lục' }));
    expect(toggle).toHaveBeenCalledOnce();
    rerender(<AcademicContents active="chuong-42" completed={[]} collapsed shown onToggle={toggle} readingPercentRef={createRef()} readingBarRef={createRef()}/>);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByRole('button', { name: 'Mở mục lục' })).toBeTruthy();
  });

  it('shows topic-specific results and recommends only lessons that need review', () => {
    render(<ExamInsights questions={[questions[0], questions[4], questions[5]]} answers={{ q1: questions[0].answer, q5: 0 }}/>);
    expect(screen.getByRole('img', { name: '33% chính xác' })).toBeTruthy();
    expect((screen.getByRole('progressbar', { name: 'Kết quả chương 4.1' }) as HTMLProgressElement).value).toBe(1);
    expect(screen.getByRole('link', { name: 'Ôn lại chương 4.2' }).getAttribute('href')).toBe('#chuong-42');
    expect(screen.queryByRole('link', { name: 'Ôn lại chương 4.1' })).toBeNull();
    expect(screen.getByText('Không có câu thuộc chủ đề này trong đề')).toBeTruthy();
  });

  it('replays accessible heading reveals when scrolling away and back in either direction', () => {
    const instances: { callback: IntersectionObserverCallback; unobserve: ReturnType<typeof vi.fn> }[] = [];
    class Observer {
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) { instances.push({ callback, unobserve: this.unobserve }); }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    render(<Reveal variant="heading"><AnimatedHeading>Năm đặc điểm, một hệ thống</AnimatedHeading></Reveal>);
    const heading = screen.getByRole('heading', { name: 'Năm đặc điểm, một hệ thống' });
    const parent = heading.parentElement!;
    expect(parent.classList.contains('will-reveal')).toBe(true);
    act(() => instances[0].callback([{ target: parent, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(parent.classList.contains('revealed')).toBe(true);
    act(() => instances[0].callback([{ target: parent, isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(parent.classList.contains('revealed')).toBe(false);
    act(() => instances[0].callback([{ target: parent, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(parent.classList.contains('revealed')).toBe(true);
    expect(instances[0].unobserve).not.toHaveBeenCalled();
  });

  it('rearms the cover animation after the cover leaves the viewport', () => {
    let onVisibility: IntersectionObserverCallback | undefined;
    class Observer {
      constructor(callback: IntersectionObserverCallback) { onVisibility = callback; }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    render(<ChapterCover imageRef={createRef()}/>);
    const cover = document.getElementById('trang-chu')!;
    act(() => onVisibility!([{ target: cover, isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(cover.classList.contains('cover-offscreen')).toBe(true);
    act(() => onVisibility!([{ target: cover, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(cover.classList.contains('cover-offscreen')).toBe(false);
  });
});
