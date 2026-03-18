import {
  LitElement,
  html,
  css
} from "https://unpkg.com";

class SuperLightCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }
  setConfig(config) { this._config = config; }
  configChanged(newConfig) {
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
         this.configChanged({...this._config, main_entity: e.detail.value})}"
          allow-custom-entity
        >
         this.configChanged({...this._config, toggle_entity: e.detail.value})}"
          allow-custom-entity
        >
        <paper-input
          label="Navn"
          .value="${this._config.name || ''}"
          @value-changed="${e => this.configChanged({...this._config, name: e.detail.value})}"
        ></paper-input>
        <paper-input
          label="Ikon (mdi:teddy-bear)"
          .value="${this._config.icon || 'mdi:teddy-bear'}"
          @value-changed="${e => this.configChanged({...this._config, icon: e.detail.value})}"
        ></paper-input>
      </div>
    `;
  }
}
customElements.define("super-light-card-editor", SuperLightCardEditor);

class SuperLightCard extends LitElement {
  static getConfigElement() { return document.createElement("super-light-card-editor"); }
  static getStubConfig() { return { name: "Lys", icon: "mdi:teddy-bear", main_entity: "" }; }
  static get properties() { return { hass: {}, config: {} }; }
  setConfig(config) {
    if (!config.main_entity) throw new Error("Vaelg en Main Entity");
    this.config = config;
  }
  render() {
    if (!this.hass || !this.config) return html``;
    const stateObj = this.hass.states[this.config.main_entity];
    const toggleObj = this.hass.states[this.config.toggle_entity] || stateObj;
    const isOn = stateObj ? stateObj.state === 'on' : false;
    const isToggleOn = toggleObj ? toggleObj.state === 'on' : false;
    return html`
      <ha-card class="${isOn ? 'on' : 'off'}" @click="${this._toggleMain}">
        <div class="icon-container">
          <ha-icon icon="${this.config.icon || 'mdi:teddy-bear'}"></ha-icon>
        </div>
        <div class="info">
          <div class="name">${this.config.name || (stateObj ? stateObj.attributes.friendly_name : 'Super Light')}</div>
          <div class="status">${stateObj ? stateObj.state.toUpperCase() : 'OFF'}</div>
        </div>
        <div class="toggle-icon" @click="${this._toggleSecondary}">
          <ha-icon icon="${isToggleOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'}"></ha-icon>
        </div>
      </ha-card>
    `;
  }
  _toggleMain() { this.hass.callService("homeassistant", "toggle", { entity_id: this.config.main_entity }); }
  _toggleSecondary(e) {
    e.stopPropagation();
    this.hass.callService("homeassistant", "toggle", { entity_id: this.config.toggle_entity || this.config.main_entity });
  }
  static get styles() {
    return css`
      ha-card { background: var(--card-background-color, #2c2c2c); border-radius: 20px; padding: 20px; height: 130px; position: relative; cursor: pointer; display: flex; flex-direction: column; justify-content: flex-end; transition: all 0.3s ease; overflow: hidden; }
      ha-card.on { background: var(--paper-item-icon-active-color, #fdd835); color: #000; }
      .icon-container { position: absolute; top: 20px; left: 20px; }
      .icon-container ha-icon { --mdc-icon-size: 45px; }
      .info { line-height: 1.2; }
      .name { font-weight: bold; font-size: 1.2em; }
      .status { font-size: 0.9em; opacity: 0.7; }
      .toggle-icon { position: absolute; top: 20px; right: 20px; }
      .toggle-icon ha-icon { --mdc-icon-size: 35px; }
    `;
  }
}
customElements.define("super-light-card", SuperLightCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "super-light-card", name: "Super Light Card", description: "Flot lyskort", preview: true });
