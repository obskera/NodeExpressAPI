const toast = {
    init() {
      this.hideTimeout = null;
  
      this.el = document.createElement("div");
      this.el.className = "toast";
      document.body.appendChild(this.el);
    },
  
    show(message, state, length) {
      clearTimeout(this.hideTimeout);
      let timeoutLength = 3000
      if (length) { timeoutLength = length}

      this.el.textContent = message;
      this.el.className = "toast toast--visible";
  
      if (state) {
        this.el.classList.add(`toast--${state}`);
      }


  
      this.hideTimeout = setTimeout(() => {
        this.el.classList.remove("toast--visible");
      }, timeoutLength);
    }
  };
  
  document.addEventListener("DOMContentLoaded", () => toast.init());
  