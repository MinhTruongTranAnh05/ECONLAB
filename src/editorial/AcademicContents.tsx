import type { Ref } from 'react';
import { BookOpen, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { chapters } from '../data';

const subsections: Record<string, { id: string; label: string }[]> = {
  'chuong-41': [{ id: 'concept-glossary', label: 'Tra cứu khái niệm' }, { id: 'formation-story', label: 'Quá trình hình thành' }],
  'chuong-42': [{ id: 'lenin-explorer', label: 'Bản đồ năm đặc điểm' }, { id: 'nam-dac-diem', label: 'Đọc từng đặc điểm' }],
  'chuong-43': [{ id: 'comparison-study', label: 'Trước đây & ngày nay' }],
};

export function AcademicContents({ active, completed, collapsed, shown, onToggle, readingPercentRef, readingBarRef }: {
  active: string;
  completed: string[];
  collapsed: boolean;
  shown: boolean;
  onToggle: () => void;
  readingPercentRef: Ref<HTMLSpanElement>;
  readingBarRef: Ref<HTMLSpanElement>;
}) {
  return <aside className={`academic-sidebar ${collapsed ? 'collapsed' : ''} ${shown ? 'shown' : ''}`} aria-label="Mục lục học thuật" aria-hidden={!shown} inert={!shown}>
    <button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? 'Mở mục lục' : 'Thu gọn mục lục'} aria-expanded={!collapsed}>{collapsed ? <PanelLeftOpen size={18}/> : <><span>MỤC LỤC CHƯƠNG 04</span><PanelLeftClose size={17}/></>}</button>
    {!collapsed && <>
      <div className="sidebar-rule"/>
      {chapters.map(chapter => <div className={`toc-chapter ${active === chapter.id ? 'is-active' : ''}`} key={chapter.id}>
        <a href={`#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined}><span>{chapter.number}</span><span>{chapter.short}</span>{completed.includes(chapter.id) && <Check size={13}/>}</a>
        {active === chapter.id && <nav className="toc-subsections" aria-label={`Các mục chương ${chapter.number}`}>{subsections[chapter.id].map(section => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}</nav>}
      </div>)}
      <a href="#van-dung" className={active === 'van-dung' ? 'active' : ''}><span>↳</span><span>Vận dụng Việt Nam</span></a>
      <a href="#tu-lieu" className={active === 'tu-lieu' ? 'active' : ''}><span>↳</span><span>Tư liệu hình ảnh</span></a>
      <a href="#on-tap/overview" className="sidebar-revision"><BookOpen size={15}/> Không gian ôn tập</a>
      <div className="toc-reading"><span>TIẾN ĐỘ ĐỌC</span><span ref={readingPercentRef}>0%</span></div>
      <div className="toc-reading-track" aria-hidden="true"><span ref={readingBarRef}/></div>
      <small>{completed.length}/3 phần đã hoàn thành</small><progress aria-label="Tiến độ hoàn thành bài học" value={completed.length} max={3}/>
    </>}
  </aside>;
}
