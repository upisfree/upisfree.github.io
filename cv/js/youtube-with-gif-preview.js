/**
 * @author upisfree / https://upisfr.ee/
 */

const YOUTUBE_BUTTON_SVG = '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>';

function htmlToElement(html) {
  html = html.trim();

  const template = document.createElement('template');
  template.innerHTML = html;

  return template.content.firstChild;
}

class YouTubeWithGifPreview extends HTMLElement {
  constructor() {
    super();

    this.width = (this.getAttribute('width') !== undefined) ? this.getAttribute('width') : 480;
    this.height = (this.getAttribute('height') !== undefined) ? this.getAttribute('height') : 270;

    if (!this.getAttribute('video') || !this.getAttribute('gif')) {
      console.error('YouTubeWithGifPreview: you need to specify video id and path to gif file');
    }

    this.divId = `youtube-${ this.getAttribute('video') }`;
  }

  connectedCallback() {
    this.render();
  }

  onGifClick() {
    this.gif.classList.add('hidden');

    this.player.playVideo();
  }

  render() {
    this.root = document.createElement('div');

    this.root.appendChild(this.getStyleTag());
    this.root.className = this.divId + ' root';
    this.appendChild(this.root);

    const iframeDiv = document.createElement('div');
    iframeDiv.id = this.divId;
    this.root.appendChild(iframeDiv);

    this.player = new YT.Player(this.divId, {
      width: this.getAttribute('width'),
      height: this.getAttribute('height'),
      videoId: this.getAttribute('video')
    });

    this.gif = document.createElement('div');
    this.gif.className = 'gif';
    this.gif.addEventListener('click', this.onGifClick.bind(this));
    this.root.appendChild(this.gif);

    this.playButton = htmlToElement(YOUTUBE_BUTTON_SVG);
    this.gif.appendChild(this.playButton);
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

.${ this.divId } .gif {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url(${ this.getAttribute('gif') });
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  cursor: pointer;
}

.${ this.divId } .gif.hidden {
  display: none;
}

.${ this.divId } .gif svg {
  position: absolute;
  width: 68px;
  height: 48px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity .25s cubic-bezier(0.0,0.0,0.2,1);
}

.${ this.divId } .ytp-large-play-button-bg {
  transition: fill .1s cubic-bezier(0.4,0.0,1,1), fill-opacity .1s cubic-bezier(0.4,0.0,1,1);
  fill: #212121;
  fill-opacity: .8;
}

.${ this.divId }.root:hover .ytp-large-play-button-bg {
  transition: fill .1s cubic-bezier(0.0,0.0,0.2,1), fill-opacity .1s cubic-bezier(0.0,0.0,0.2,1);
  fill: #f00;
  fill-opacity: 1;
}
    `;

    return tag;
  }
}

window.onYouTubeIframeAPIReady = function() {
  customElements.define('youtube-with-gif-preview', YouTubeWithGifPreview);
};

export default YouTubeWithGifPreview;