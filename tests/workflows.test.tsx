import { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Revision from '../src/Revision';
import App from '../src/App';
import { freshProgress, readProgress, useProgress, type Progress } from '../src/store';
import { questions } from '../src/data';
import { Reveal } from '../src/motion';
function Harness({ tab, initial }: { tab: string; initial?: Progress }) {
  const saved = useProgress();
  const [progress, setProgress] = useState(initial || freshProgress());
  return <><Revision tab={tab} progress={initial ? progress : saved.progress} update={initial ? setProgress : saved.update}/><div data-testid="state">{JSON.stringify(initial ? progress : saved.progress)}</div></>;
}
function state(): Progress { return JSON.parse(screen.getByTestId('state').textContent || '{}'); }
describe('Revision workflows', () => {
  it('flips cards, saves remembered status, and filters by topic', () => {
    render(<Harness tab="flashcards"/>);
    const card = screen.getByRole('button', { name: 'Lật để xem giải thích' });
    fireEvent.click(card);
    expect(screen.getByRole('button', { name: 'Lật về thuật ngữ' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Tôi đã nhớ' }));
    expect(state().remembered).toEqual(['f0']);
    expect(readProgress().remembered).toEqual(['f0']);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4.2' } });
    expect(screen.getByText('1 / 5')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Thẻ tiếp theo' }));
    expect(screen.getByText('2 / 5')).toBeTruthy();
  });
  it('shows an empty state after all cards in a filter are remembered', () => {
    const p = freshProgress(); p.remembered = ['f0', 'f1', 'f2', 'f3'];
    render(<Harness tab="flashcards" initial={p}/>);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4.1' } });
    fireEvent.click(screen.getByLabelText('Chỉ thẻ chưa nhớ'));
    expect(screen.getByText('Bạn đã nhớ hết bộ thẻ này.')).toBeTruthy();
  });
  it('records one quiz answer, explains it, and supports incorrect-answer review', () => {
    render(<Harness tab="quiz"/>);
    fireEvent.click(screen.getByRole('button', { name: /Phân tán sản xuất/ }));
    expect(state().answers.q1).toBe(0);
    expect(screen.getByRole('status').textContent).toContain('Cùng xem lại');
    expect(screen.getByRole('button', { name: /Tích tụ và tập trung sản xuất ở trình độ cao/ }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByLabelText('Xem lại câu sai'));
    expect(screen.getByText('CÂU 1 / 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Làm lại câu này' }));
    expect(state().answers.q1).toBeUndefined();
    fireEvent.click(screen.getByRole('button', { name: 'Luyện tất cả câu hỏi' }));
    fireEvent.click(screen.getByRole('button', { name: /Tích tụ và tập trung sản xuất ở trình độ cao/ }));
    expect(state().answers.q1).toBe(1);
    expect(screen.getByRole('status').textContent).toContain('Chính xác.');
    expect(screen.getByRole('link', { name: /Đọc bài 4.1/ }).getAttribute('href')).toBe('#chuong-41');
  });
  it('persists an essay draft and self-assessment after remounting', () => {
    const first = render(<Harness tab="essay"/>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Tích tụ và tập trung là cơ sở hình thành độc quyền.' } });
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    first.unmount(); render(<Harness tab="essay"/>);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toContain('Tích tụ và tập trung');
    expect((screen.getAllByRole('checkbox')[0] as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Xem gợi ý đáp án' }));
    expect(screen.getByText('BẢN THAM KHẢO · CHỜ ĐỐI CHIẾU')).toBeTruthy();
  });
  it('moves from preparation to answering and stops at the deadline', () => {
    vi.useFakeTimers(); render(<Harness tab="oral"/>);
    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu chuẩn bị/ }));
    expect(screen.getByRole('status').textContent).toBe('Thời gian chuẩn bị');
    act(() => { vi.advanceTimersByTime(60000); });
    expect(screen.getByRole('status').textContent).toBe('Hãy trình bày câu trả lời');
    expect(screen.getByRole('timer').textContent).toBe('03:00');
    act(() => { vi.advanceTimersByTime(180000); });
    expect(screen.getByRole('status').textContent).toBe('Đã hết thời gian trả lời');
  });
  it('submits a configurable exam and stores its score once', () => {
    render(<Harness tab="exam"/>);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu thi thử/ }));
    const prompt = screen.getByRole('heading', { level: 2 }).textContent;
    const q = questions.find(item => item.prompt === prompt)!;
    const options = document.querySelector('.options')!;
    fireEvent.click(within(options as HTMLElement).getAllByRole('button')[q.answer]);
    fireEvent.click(screen.getByRole('button', { name: 'Nộp bài ngay' }));
    expect(screen.getByRole('alert').textContent).toContain('2 câu chưa trả lời');
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận nộp bài' }));
    expect(state().exams).toHaveLength(1);
    expect(state().exams[0]).toMatchObject({ score: 1, total: 3 });
    expect(screen.getByText('Đối chiếu từng câu trả lời')).toBeTruthy();
    expect(document.querySelectorAll('.answer-review')).toHaveLength(3);
  });
  it('automatically submits an exam when the timer expires', () => {
    vi.useFakeTimers(); render(<Harness tab="exam"/>);
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu thi thử/ }));
    act(() => { vi.advanceTimersByTime(60000); });
    expect(state().exams).toHaveLength(1);
    expect(state().exams[0].score).toBe(0);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(state().exams).toHaveLength(1);
  });
  it('resets saved data only after the explicit reset control', () => {
    localStorage.setItem('econlab-progress-v1', JSON.stringify({ ...freshProgress(), essay: 'Bản nháp', remembered: ['f0'] }));
    render(<Harness tab="overview"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại tiến độ' }));
    expect(state().essay).toBe('Bản nháp');
    fireEvent.click(screen.getByRole('button', { name: 'Giữ lại' }));
    expect(state().essay).toBe('Bản nháp');
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại tiến độ' }));
    fireEvent.click(screen.getByRole('button', { name: 'Xóa dữ liệu' }));
    expect(state()).toEqual(freshProgress());
  });
});
describe('Learning and recovery', () => {
  it('recovers safely from malformed stored data', () => {
    localStorage.setItem('econlab-progress-v1', '{broken'); expect(readProgress()).toEqual(freshProgress());
    localStorage.setItem('econlab-progress-v1', JSON.stringify({ completed: 'bad', essay: 5, answers: { q1: 99 }, exams: [null] }));
    expect(readProgress().completed).toEqual([]); expect(readProgress().answers).toEqual({}); expect(readProgress().exams).toEqual([]);
  });
  it('changes diagram stages, marks completion, and finds unaccented terms', () => {
    window.history.replaceState(null, '', '/#trang-chu'); render(<App/>);
    const stage = screen.getByRole('button', { name: /02.*Tích tụ & tập trung sản xuất/ });
    fireEvent.click(stage); expect(stage.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('.concept-explanation h3')?.textContent).toContain('Tích tụ');
    fireEvent.click(screen.getAllByRole('button', { name: 'Đánh dấu đã hoàn thành' })[0]);
    expect(readProgress().completed).toContain('chuong-41');
    fireEvent.click(screen.getByRole('button', { name: 'Tìm kiếm kiến thức' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Tìm kiếm kiến thức' }), { target: { value: 'tu ban tai chinh' } });
    expect(document.querySelector('.search-results')?.textContent).toContain('Tư bản tài chính');
    fireEvent.click(screen.getByRole('button', { name: 'Đóng tìm kiếm' }));
  });
  it('supports deep links between revision, lessons and the opening contents', async () => {
    window.history.replaceState(null, '', '/#on-tap/essay'); render(<App/>);
    expect(screen.getByRole('textbox', { name: /Bài viết của bạn/ })).toBeTruthy();
    act(() => { window.history.pushState(null, '', '/#chuong-42'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByRole('heading', { name: 'Năm đặc điểm, một hệ thống' })).toBeTruthy();
    act(() => { window.history.pushState(null, '', '/#lo-trinh'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 35)); });
    const calls = vi.mocked(Element.prototype.scrollIntoView).mock.contexts;
    expect(calls[calls.length - 1]).toBe(document.getElementById('lo-trinh'));
    for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))) {
      const id = link.hash.slice(1);
      expect(id.startsWith('on-tap') || Boolean(document.getElementById(id))).toBe(true);
    }
  });
  it('keeps reveal content visible when reduced motion is requested', () => {
    vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList);
    render(<Reveal><p>Tri thức luôn đọc được</p></Reveal>);
    expect(screen.getByText('Tri thức luôn đọc được').parentElement?.classList.contains('will-reveal')).toBe(false);
  });
});
