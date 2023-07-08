import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import styles from './bds-audio-player.scss?inline';
import { Forward10, Pause, PlayArrow, Replay10 } from './icons';

function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
  const secondsString =
    remainingSeconds < 10
      ? '0' + remainingSeconds
      : remainingSeconds.toString();
  return minutesString + ':' + secondsString;
}

@customElement('bds-audio-player')
class AudioPlayer extends LitElement {
  static styles = unsafeCSS(styles);

  @property()
  src?: string;

  @property()
  title: string;

  @property()
  subtitle: string;

  @property()
  status?: 'playing' | 'paused' = 'paused';

  @query('audio')
  private audioElement: HTMLAudioElement;

  @state()
  hasPlayed = false;

  #internals: ElementInternals;

  connectedCallback() {
    super.connectedCallback();
    this.#internals = this.attachInternals();
    this.#internals.role = 'region';
    this.#internals.ariaLabel = `Audio player: ${this.title}`;
  }

  /** Play or pause the audio. */
  toggle() {
    if (this.status === 'paused') {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  onPlay() {
    this.status = 'playing';
    this.hasPlayed = true;
  }

  onPause() {
    this.status = 'paused';
  }

  onEnded() {
    this.status = 'paused';
  }

  /** Advance the timeline by a specified number of seconds. */
  seek(seconds: number) {
    let position = this.audioElement.currentTime + seconds;
    if (position < 0) {
      position = 0;
    } else if (position > this.duration) {
      position = this.duration;
    }
    this.audioElement.currentTime = position;
    this.audioElement.play();
  }

  get duration() {
    return this.audioElement?.duration;
  }

  override render() {
    return html`
      <div class="container">
        <div class="actions">
          <div class="actions__control">
            <button class="button"
              @click=${() => this.toggle()}
              aria-label=${this.status === 'paused' ? 'Play' : 'Pause'}
            >
              ${this.status === 'paused' ? PlayArrow : Pause}
            </button>
            <div
              class="actions__control__duration"
              aria-label=${ifDefined(
                this.duration ? `Duration: ${this.duration}` : undefined
              )}
              aria-hidden=${ifDefined(this.duration ? undefined : true)}
            >
              ${this.duration ? formatSeconds(this.duration) : html`&nbsp;`}
            </div>
          </div>
          <div class="actions__description">
            ${
              this.title
                ? html`<div class="actions__description__title">
                  ${this.title}
                </div>`
                : nothing
            }
            ${
              this.subtitle
                ? html`<div class="actions__description__subtitle">
                  ${this.subtitle}
                </div>`
                : nothing
            }
          </div>
        </div>
        <div
          class=${classMap({
            timeline: true,
            'timeline:visible': this.hasPlayed,
          })}
        >
          <div class="timeline__button">
            <button
              class="button button--subtle button--small"
              aria-label="Go back 10 seconds"
              @click=${() => this.seek(-10)}
            >
              ${Replay10}
            </button>
          </div>
          <div class="timeline__button">
            <button
              class="button button--subtle button--small"
              aria-label="Go forward 10 seconds"
              @click=${() => this.seek(10)}
            >
              ${Forward10}
            </button>
          </div>
          <div class="timeline__audio">
            <audio
              title=${this.title}
              src="${this.src}"
              controls
              @loadedmetadata=${() => this.requestUpdate()}
              @play=${this.onPlay}
              @pause=${this.onPause}
              @ended=${this.onEnded}
            ></audio>
          </div>
        </div>
      </div>
    `;
  }
}

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'bds-audio-player': preact.JSX.HTMLAttributes;
    }
  }
}
