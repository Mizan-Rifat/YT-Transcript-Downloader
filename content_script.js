console.log('transcript downloader');

let initialized = false;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
`;

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
};

const init = () => {
  if (!initialized) {
    const selectors = {
      transcriptSection:
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]',
      headerSection: '#header #header',
      contentSection: '#content #content',
      transcriptEls: 'ytd-transcript-segment-renderer yt-formatted-string',
      title: 'h1.ytd-watch-metadata yt-formatted-string',
      menu: '#menu'
    };

    const transcriptSection = document.querySelector(selectors.transcriptSection);

    if (transcriptSection) {
      const headerSection = transcriptSection.querySelector(selectors.headerSection);
      const contentSection = transcriptSection.querySelector(selectors.contentSection);

      const downloadBtn = document.createElement('button');
      downloadBtn.classList.add('yt-transcript-downloader-btn');
      downloadBtn.innerHTML = icon;
      downloadBtn.onclick = () => {
        const transcriptEls = contentSection?.querySelectorAll(selectors.transcriptEls);

        if (transcriptEls && transcriptEls.length > 0) {
          let transcript = '';
          transcriptEls.forEach(item => {
            transcript += item.innerText + '\n\n';
          });

          console.log({ transcript });

          const videoTitle = document.querySelector(selectors.title)?.innerText || 'video';
          const fileName = `${videoTitle}-transcript.txt`;
          download(fileName, transcript);
        }
      };
      const menu = headerSection.querySelector(selectors.menu);
      headerSection.insertBefore(downloadBtn, menu);
      initialized = true;
    }
  }
};

chrome.runtime.onMessage.addListener(() => {
  init();
});
