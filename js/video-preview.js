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

class VideoPreview extends HTMLElement {
  constructor() {
    super();

    this.isRendered = false;

    this.width = (this.getAttribute('width') !== undefined) ? this.getAttribute('width') : 480;
    this.height = (this.getAttribute('height') !== undefined) ? this.getAttribute('height') : 270;

    if (!this.getAttribute('preview')) {
      console.error('VideoPreview: you need to specify at least path to preview file.');
    }

    if (this.getAttribute('importance')) {
      this.importance = this.getAttribute('importance');
    }

    if (window.onYouTubeIframeAPIReady === undefined) {
      window.VideoPreviewList = [];

      window.onYouTubeIframeAPIReady = function() {
        window.VideoPreviewList.forEach(el => el.onIframeAPIReadyLoaded());
      }
    }

    window.VideoPreviewList.push(this);

    if (this.getAttribute('youtube')) {
      this.divId = `youtube-${ this.getAttribute('youtube') }`;
    } else {
      this.divId = `youtube-${ window.VideoPreviewList.length }`;
    }
  }

  connectedCallback() {
    this.render();
  }

  onIframeAPIReadyLoaded() {
    if (!this.getAttribute('youtube')) {
      return;
    }

    this.preview.classList.add('loaded');
    this.playButton.classList.add('loaded');
  }

  onPreviewVideoFirstFrameLoaded() {
    this.previewVideo.classList.add('loaded');
  }

  onPreviewClick() {
    if (!this.getAttribute('youtube') || !this.preview.classList.contains('loaded')) {
      return;
    }

    this.root.classList.add('clicked');
    this.preview.classList.add('hidden');

    this.player = new YT.Player(this.divId, {
      width: this.getAttribute('width'),
      height: this.getAttribute('height'),
      videoId: this.getAttribute('youtube'),
      playerVars: {
        'autoplay': 1,
        'color': 'white',
        'controls': 0,
        'disablekb': 1,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'playsinline': 1,
        'rel': 0
      },
      events: {
        onReady: () => {
          this.player.playVideo();
        }
      }
    });

    // hiding "YouTube video player" title on hover and right after click
    this.player.getIframe().removeAttribute('title');
  }

  render() {
    if (this.isRendered) {
      return;
    }

    this.root = document.createElement('div');

    this.root.appendChild(this.getStyleTag());
    this.root.className = this.divId + ' root';
    this.appendChild(this.root);

    const iframeDiv = document.createElement('div');
    iframeDiv.id = this.divId;
    this.root.appendChild(iframeDiv);

    this.preview = document.createElement('div');
    this.preview.className = 'preview';
    this.preview.addEventListener('pointerup', this.onPreviewClick.bind(this));
    this.root.appendChild(this.preview);

    this.playButton = htmlToElement(YOUTUBE_BUTTON_SVG);
    this.preview.appendChild(this.playButton);

    this.previewVideo = document.createElement('video');
    this.previewVideo.autoplay = true;
    this.previewVideo.muted = true;
    this.previewVideo.loop = true;
    this.previewVideo.preload = true;
    this.previewVideo.controls = false;
    this.previewVideo.setAttribute('playsinline', '');
    this.previewVideo.src = this.getAttribute('preview');
    this.previewVideo.addEventListener('loadeddata', this.onPreviewVideoFirstFrameLoaded.bind(this));

    if (this.importance) {
      this.previewVideo.setAttribute('importance', this.importance);
    }

    this.preview.appendChild(this.previewVideo);

    this.isRendered = true;
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

.${ this.divId }.root.clicked {
  background: #000;
}

.${ this.divId } .preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
  transition: opacity .75s ease-in-out;
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

customElements.define('video-preview', VideoPreview);

export default VideoPreview;
