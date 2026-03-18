import {
  LitElement,
  html,
  css
} from "https://unpkg.com";

class SuperLightCard extends LitElement {
  static get properties() {
    return { hass: {}, config: {} };
  }
  setConfig(config) {
    this.config = config;
  }
  render() {
    return html`
      <ha-card style="padding: 20px; background: orange; color: white;">
        <h2>Super Light Card virker!</h2>
        <p>Entity: ${this.config.entity}</p>
      </ha-card>
    `;
  }
}
customElements.define("super-light-card", SuperLightCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "super-light-card",
  name: "Super Light Card",
  description: "Test kort",
  preview: true
});
