import { customElement, property } from 'lit/decorators.js';
import { html, LitElement, unsafeCSS } from 'lit';
import styles from './bds-audio-player.scss?inline';

@customElement('my-element')
class MyElement extends LitElement {
  static styles = unsafeCSS(styles);

  @property()
  src?: string;

  render() {
    return html`
      <div class="container">
      <audio src=${this.src} controls></audio>
      </div>
    `;
  }
}

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'my-element': preact.JSX.HTMLAttributes;
    }
  }
}
