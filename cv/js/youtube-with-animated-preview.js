/**
 * @author upisfree / https://upisfr.ee/
 */

const YOUTUBE_BUTTON_SVG = '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M 45,24 27,14 27,34" fill="#fff"></path></svg>';

function htmlToElement(html) {
  html = html.trim();

  const template = document.createElement('template');
  template.innerHTML = html;

  return template.content.firstChild;
}

class YouTubeWithAnimatedPreview extends HTMLElement {
  constructor() {
    super();

    this.width = (this.getAttribute('width') !== undefined) ? this.getAttribute('width') : 480;
    this.height = (this.getAttribute('height') !== undefined) ? this.getAttribute('height') : 270;

    if (!this.getAttribute('video') || !this.getAttribute('preview')) {
      console.error('YouTubeWithAnimatedPreview: you need to specify video id and path to preview file');
    }

    this.divId = `youtube-${ this.getAttribute('video') }`;

    if (window.onYouTubeIframeAPIReady === undefined) {
      window.YouTubeWithAnimatedPreviewList = [];

      window.onYouTubeIframeAPIReady = function() {
        window.YouTubeWithAnimatedPreviewList.forEach(el => el.onIframeAPIReadyLoaded());
      }
    }

    window.YouTubeWithAnimatedPreviewList.push(this);
  }

  connectedCallback() {
    this.render();
  }

  onIframeAPIReadyLoaded() {
    this.player = new YT.Player(this.divId, {
      width: this.getAttribute('width'),
      height: this.getAttribute('height'),
      videoId: this.getAttribute('video'),
      events: {
        onReady: this.onPlayerLoaded.bind(this)
      }
    });
  }

  onPlayerLoaded() {
    this.preview.classList.add('loaded');
    this.playButton.classList.add('loaded');
  }

  onPreviewVideoFirstFrameLoaded() {
    this.previewVideo.classList.add('loaded');
  }

  onPreviewClick() {
    this.preview.classList.add('hidden');

    if (this.player) {
      this.player.playVideo();
    }
  }

  render() {
    this.root = document.createElement('div');

    this.root.appendChild(this.getStyleTag());
    this.root.className = this.divId + ' root';
    this.appendChild(this.root);

    const iframeDiv = document.createElement('div');
    iframeDiv.id = this.divId;
    this.root.appendChild(iframeDiv);

    this.preview = document.createElement('div');
    this.preview.className = 'preview';
    this.preview.addEventListener('click', this.onPreviewClick.bind(this));
    this.root.appendChild(this.preview);

    this.playButton = htmlToElement(YOUTUBE_BUTTON_SVG);
    this.preview.appendChild(this.playButton);

    this.previewVideo = document.createElement('video');
    this.previewVideo.autoplay = true;
    this.previewVideo.muted = true;
    this.previewVideo.loop = true;
    this.previewVideo.preload = true;
    this.previewVideo.controls = false;
    this.previewVideo.src = this.getAttribute('preview');
    this.previewVideo.addEventListener('loadeddata', this.onPreviewVideoFirstFrameLoaded.bind(this));
    this.preview.appendChild(this.previewVideo);
  }

  getStyleTag() {
    const tag = document.createElement('style');

    tag.innerHTML = `
.${ this.divId }.root {
  position: relative;
  width: ${ this.getAttribute('width') }px;
  height: ${ this.getAttribute('height') }px;
  margin: 8px 0;
}

.${ this.divId } .preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
}

.${ this.divId } .preview.loaded {
  cursor: pointer;
}

.${ this.divId } .preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity .5s ease-out;
}

.${ this.divId } .preview video.loaded {
  opacity: 1;
}

.${ this.divId } .preview.hidden {
  display: none;
}

.${ this.divId } .preview svg {
  position: absolute;
  width: 68px;
  height: 48px;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity .25s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.${ this.divId } .preview svg.loaded {
  opacity: 1;
}

.${ this.divId } .ytp-large-play-button-bg {
  transition: fill .1s cubic-bezier(0.4, 0.0, 1, 1), fill-opacity .1s cubic-bezier(0.4, 0.0, 1, 1);
  fill: #fff;
  fill-opacity: 1;
}

.${ this.divId }.root:hover .ytp-large-play-button-bg {
  transition: fill .1s cubic-bezier(0.0,0.0,0.2,1), fill-opacity .1s cubic-bezier(0.0,0.0,0.2,1);
  fill: #f00;
}
    `;

    return tag;
  }
}

customElements.define('youtube-with-animated-preview', YouTubeWithAnimatedPreview);

export default YouTubeWithAnimatedPreview;