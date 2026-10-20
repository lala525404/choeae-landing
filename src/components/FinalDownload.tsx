import {DownloadButtons} from './DownloadButtons';

/** 마지막 다운로드: 가운데 정렬이 허용된 두 곳 중 하나(다른 하나는 푸터). 문구는 landing-copy.md A안. */
export function FinalDownload() {
  return (
    <section id="download" className="scroll-mt-16 py-9 lg:py-[60px]" aria-labelledby="download-title">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <div className="panel flex flex-col items-center gap-6 px-5 py-10 text-center md:py-14">
          <div className="flex flex-col items-center gap-3">
            <h2 id="download-title" className="t-section">
              이제 최애를 풀어놓을 시간이에요
            </h2>
            <p className="text-sub">받아서 실행하면 바로 시작돼요. 앱 안에는 광고가 없어요.</p>
          </div>
          <DownloadButtons align="center" />
        </div>
      </div>
    </section>
  );
}
