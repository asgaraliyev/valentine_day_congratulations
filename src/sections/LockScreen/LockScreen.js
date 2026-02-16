/** @jsx h */
const { h, Component } = require("preact");

const ROMANTIC_QUOTES = [
  "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
  "The best love is the kind that awakens the soul and makes us reach for more.",
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "When I saw you, I fell in love, and you smiled because you knew.",
  "Whatever our souls are made of, yours and mine are the same.",
];

export class LockScreen extends Component {
  state = {
    code: "",
    error: null,
    hint: false,
    quote: ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)],
  };

  handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ code: value, error: null });

    if (value === "Xxxxx") {
      this.handleUnlock();
    }
  };

  handleUnlock = () => {
    const { code } = this.state;
    const { onUnlock } = this.props;

    if (code.toUpperCase() === "XXXXX") {
      onUnlock();
    } else {
      this.setState({
        error: "Ay Xxxxx? Mən sənə ən çox hansı söz ilə xitab edirəm?",
        code: "",
      });
    }
  };

  toggleHint = () => {
    this.setState((prevState) => ({
      hint: !prevState.hint,
    }));
  };

  render() {
    const { error, hint, quote } = this.state;

    return (
      <div class="LockScreen">
        <div class="LockScreen__content">
          <div class="LockScreen__icon">♥</div>
          <h1>Test test test :)</h1>

          <div class="LockScreen__input-container">
            <input
              type="text"
              value={this.state.code}
              onChange={this.handleInputChange}
              placeholder="Şifrəni daxil et"
              maxLength="7"
              autoFocus
            />
            <button onClick={this.handleUnlock}>
              Aç <span>♥</span>
            </button>
          </div>

          {error && <div class="LockScreen__error">{error}</div>}

          <div class="LockScreen__hint-container">
            <button class="LockScreen__hint-button" onClick={this.toggleHint}>
              {hint ? "Kömək göstərmə" : "Kömək göstər"}
            </button>

            {hint && (
              <div class="LockScreen__hint">
                A hint A hint A hint A hint A hint
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = LockScreen;
