document.getElementById("saveSession").addEventListener("click", () => {
  const name = document.getElementById("sessionName").value;
  chrome.tabs.query({}, (tabs) => {
    const urls = tabs.map(tab => tab.url);
    chrome.storage.local.set({ [name]: urls }, () => {
      alert(`Session "${name}" saved!`);
      loadSessions();
    });
  });
});

function loadSessions() {
  chrome.storage.local.get(null, (sessions) => {
    const container = document.getElementById("sessionsList");
    container.innerHTML = "";

    for (let name in sessions) {
      const div = document.createElement("div");

      const sessionName = document.createElement("p");
      sessionName.textContent = name;

      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "Restore";
      restoreBtn.addEventListener("click", () => restore(name));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteSession(name));

      div.appendChild(sessionName);
      div.appendChild(restoreBtn);
      div.appendChild(deleteBtn);
      container.appendChild(div);
    }
  });
}


window.restore = (name) => {
  chrome.storage.local.get(name, (data) => {
    data[name].forEach(url => {
      chrome.tabs.create({ url });
    });
  });
};

window.deleteSession = (name) => {
  chrome.storage.local.remove(name, loadSessions);
};

loadSessions();
