import {Monitor, Moon, Sun} from 'lucide-react';
import {THEME_LABEL, useTheme} from '../hooks/useTheme';

const ICONS = {light: Sun, dark: Moon, system: Monitor};

/** 라이트 → 다크 → 시스템 순환. 버튼 선택이 시스템 설정보다 우선한다. */
export function ThemeToggle() {
  const {pref, next, cycle} = useTheme();
  const Icon = ICONS[pref];
  const label = `화면 테마: ${THEME_LABEL[pref]}. 누르면 ${THEME_LABEL[next]}${next === 'system' ? '으로' : '로'} 바뀌어요`;

  return (
    <button type="button" className="icon-btn" onClick={cycle} aria-label={label} title={label}>
      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
