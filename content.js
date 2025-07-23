const colors = {
  primary: "#000000",
  hover: "#ff0000",
};

const blockBtnStyles = `
  .custom-block-btn {
    background: ${colors.primary};
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 10px;
    transition: background 0.2s;
    padding: 0;
    box-sizing: border-box;
  }
  .custom-block-btn svg {
    display: block;
    margin: 0;
    padding: 0;
  }
  .custom-block-btn:hover {
    background: ${colors.hover};
  }
`;

function insertButton(container) {
  if (container.querySelector(".one-click-block-btn")) return;
  const menuBtn = container.querySelector(
    'button[aria-haspopup="menu"][data-testid="caret"]'
  );
  if (menuBtn) {
    if (!document.getElementById("custom-block-btn-style")) {
      const style = document.createElement("style");
      style.id = "custom-block-btn-style";
      style.textContent = blockBtnStyles;
      document.head.appendChild(style);
    }
    const btn = document.createElement("button");

    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
    btn.className = "one-click-block-btn custom-block-btn";

    btn.addEventListener("click", () => handleBlock(container));

    menuBtn.parentNode.insertBefore(btn, menuBtn);
  }
}

let lastMenuBtn = null;

function handleBlock(container) {
  let menuBtn = container.querySelector(
    'button[aria-haspopup="menu"][data-testid="caret"]'
  );
  if (menuBtn) {
    lastMenuBtn = menuBtn;
    menuBtn.click();
    setTimeout(() => {
      const menuItems = document.querySelectorAll('div[role="menuitem"]');
      for (const item of menuItems) {
        const txt = item.textContent.trim().toLowerCase();
        if (txt.includes("block") || txt.includes("bloquear")) {
          item.click();
          break;
        }
      }
    }, 100);
  } else {
    console.log("No se encontró el botón de menú para bloquear.");
  }
}

const dialogObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (
        node.nodeType === 1 &&
        node.querySelector &&
        node.querySelector('[data-testid="confirmationSheetDialog"]')
      ) {
        console.log("Dialogo de confirmación cerrado");

        if (lastMenuBtn) lastMenuBtn.click();
      }
    });
  });
});
dialogObserver.observe(document.body, { childList: true, subtree: true });

// Iniciar observer básico
const observer = new MutationObserver((muts) => {
  muts.forEach((m) => m.addedNodes.forEach((n) => insertButton(n)));
});
observer.observe(document.body, { subtree: true, childList: true });
