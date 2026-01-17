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
  }

  connectedCallback() {
    this.render();
  }

  onPreviewVideoFirstFrameLoaded() {
    this.previewVideo.classList.add('loaded');
  }

  render() {
    if (this.isRendered) {
      return;
    }

    this.root = document.createElement('div');

    this.root.appendChild(this.getStyleTag());
    this.root.className = 'root';
    this.appendChild(this.root);

    this.preview = document.createElement('div');
    this.preview.className = 'preview';
    this.root.appendChild(this.preview);

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
.root {
  position: relative;
  width: ${ this.getAttribute('width') }px;
  height: ${ this.getAttribute('height') }px;
  margin: 8px 0;
}

.root.clicked {
  background: #000;
}

.preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity .5s ease-out;
}

.preview video.loaded {
  opacity: 1;
}
    `;

    return tag;
  }
}

customElements.define('video-preview', VideoPreview);

export default VideoPreview;
