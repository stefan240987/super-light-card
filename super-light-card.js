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
      <ha-card style="padding: 20px; background: #ff9800; color: white;">
        <div style="font-size: 20px; font-weight: bold;">Super Light Card virker!</div>
        <p>Entity: ${this.config.main_entity}</p>
      </ha-card>
    `;
  }
}
customElements.define("super-light-card", SuperLightCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "super-light-card",
  name: "Super Light Card",
  description: "Test af Super Light Card",
  preview: true
});
