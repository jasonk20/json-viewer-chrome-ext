chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ theme: "seti" }, function () {
    console.log("Default theme set.");
  });

  chrome.contextMenus.create({
    title: "JSON Viewer",
    id: "json-viewer",
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "json-viewer") {
    jsonViewer();
  }
});

const jsonViewer = () => {
  function checkPage() {
    const nodes = document.querySelector("body").childNodes;
    if (nodes.length === 1 && nodes[0].nodeName === "PRE") {
      return true;
    }
    return false;
  }

  chrome.tabs.executeScript(
    {
      code: "(" + checkPage + ")();",
    },
    (result) => {
      if (result[0]) {
        insertStyles();
        insertJS();
      }
    }
  );
};

const insertJS = () => {
  chrome.tabs.executeScript({
    file: "moo.js",
  });
  chrome.tabs.executeScript({
    file: "parser.js",
  });
};

const insertStyles = () => {
  chrome.tabs.insertCSS({
    file: "parser.css",
  });
};
