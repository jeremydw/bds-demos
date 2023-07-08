import { customElement } from 'lit/decorators.js';
import { html, LitElement, unsafeCSS } from 'lit';
import styles from './my-element.scss?inline';

@customElement('my-element')
class MyElement extends LitElement {
  static styles = unsafeCSS(styles);

  render() {
    return html`
      <div class="container">
          <p>Hello Shadow DOM!</p>
        <slot></slot>
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
