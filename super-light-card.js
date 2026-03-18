import {
  LitElement,
  html,
  css
} from "https://unpkg.com";

// --- EDITOR KLASSEN (Den visuelle menu) ---
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
          label="Navn på kortet"
          .value="${this._config.name || ''}"
          @value-changed="${e => this.configChanged({...this._config, name: e.detail.value})}"
        ></paper-input>
        <paper-input
          label="Ikon (f.eks. mdi:lightbulb)"
          .value="${this._config.icon || 'mdi:teddy-bear'}"
          @value-changed="${e => this.configChanged({...this._config, icon: e.detail.value})}"
        ></paper-input>
      </div>
    `;
  }
}
customElements.define("super-light-card-editor", SuperLightCardEditor);

// --- SELVE KORT KLASSEN ---
class SuperLightCard extends LitElement {
  static getConfigElement() { return document.createElement("super-light-card-editor"); }
  static getStubConfig() { return { name: "Nyt Lys", icon: "mdi:teddy-bear", main_entity: "", toggle_entity: "" }; }

  static get properties() {
    return { hass: {}, config: {} };
  }
  setConfig(config) { this.config = config; }

  render() {
    if (!this.hass || !this.config) return html``;
    const stateObj = this.hass.states[this.config.main_entity];
    const toggleObj = this.hass.states[this.config.toggle_entity];
    const isOn = stateObj ? stateObj.state === 'on' : false;
    const isToggleOn = toggleObj ? toggleObj.state === 'on' : false;

    return html`
      <ha-card class="${isOn ? 'on' : 'off'}">
        <div class="main-zone" @click="${this._toggleMain}">
          <ha-icon class="main-icon" icon="${this.config.icon || 'mdi:teddy-bear'}"></ha-icon>
          <div class="info">
            <div class="name">${this.config.name || (stateObj ? stateObj.attributes.friendly_name : 'Super Light')}</div>
            <div class="status">${stateObj ? stateObj.state.toUpperCase() : 'OFF'}</div>
          </div>
        </div>
        <div class="toggle-zone" @click="${this._toggleSecondary}">
          <ha-icon icon="${isToggleOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'}"></ha-icon>
        </div>
      </ha-card>
    `;
  }

  _toggleMain() { this.hass.callService("light", "toggle", { entity_id: this.config.main_entity }); }
  _toggleSecondary(e) { 
    e.stopPropagation();
    const domain = this.config.toggle_entity.split('.')[0];
    this.hass.callService(domain, "toggle", { entity_id: this.config.toggle_entity }); 
  }

  static get styles() {
    return css`
      ha-card {
        background: var(--card-background-color, #2c2c2c);
        border-radius: 20px;
        padding: 20px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 120px;
        display: flex;
        align-items: flex-end;
      }
      ha-card.on {
        background: var(--paper-item-icon-active-color, #fdd835);
        color: #000;
      }
      .main-icon {
        position: absolute;
        top: 15px;
        left: 20px;
        --mdc-icon-size: 45px;
      }
      .info { margin-left: 5px; }
      .name { font-weight: bold; font-size: 1.1em; }
      .status { opacity: 0.7; font-size: 0.9em; text-transform: uppercase; }
      .toggle-zone {
        position: absolute;
        top: 15px;
        right: 15px;
        --mdc-icon-size: 35px;
      }
    `;
  }
}
customElements.define("super-light-card", SuperLightCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "super-light-card",
  name: "Super Light Card",
  description: "Et lækkert, tilpasseligt lyskort med indbygget toggle.",
  preview: true
});
