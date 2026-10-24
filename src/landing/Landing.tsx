import {useLayoutEffect} from 'react';
import {initLanding} from './engine';
import {HeartMini, SvgDefs} from './parts';
import {Intro} from './intro';
import {CATS, Category, Hero, IndexMap, Progress, Stage, Toolbar} from './sections';
import './landing.css';

/**
 * 최애가 사는 바탕화면. 마크업은 모두 여기서 한 번 그려지고(상태 없음), 움직임은 engine이 DOM에 입힌다.
 * 그래서 JS가 느리거나 실패해도 모든 글자는 처음부터 DOM에 있다.
 */
export function Landing() {
  useLayoutEffect(() => initLanding(), []);

  return (
    <>
      <a className="sr-skip" id="skipLink" href="#hero">
        본문으로 건너뛰기
      </a>
      <SvgDefs />
      <div id="space" aria-hidden="true">
        <div id="noise" />
        <div id="ghost">최애를 풀어놨습니다</div>
      </div>
      <Toolbar />
      <Progress />
      <Stage />
      <div id="pet" aria-hidden="true">
        <HeartMini />
      </div>
      <div id="veil" aria-hidden="true" />
      <div id="lock" aria-hidden="true" hidden />
      <button id="skip" type="button" hidden>
        건너뛰기 · Esc
      </button>
      <main>
        <button id="cn-skip" type="button" hidden>
          건너뛰기
        </button>
        <Intro />
        <Hero />
        <IndexMap />
        {CATS.map((c, i) => (
          <Category key={c.id} index={i} />
        ))}
      </main>
      <div id="sys" aria-label="시스템 정보" />
    </>
  );
}
