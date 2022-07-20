const TOKEN = "figd_YOURPERSONAL-ACCESSTOKEN";
const FILE_ID = "FILE_ID_FROM_URL";

figma.ui.onmessage = (message) => loadComponent(message);

figma.on("drop", ({ x, y, items }) => {
  if (items[0]) {
    console.log(x, y);
    loadComponent(items[0], x, y);
  }
});

async function loadComponent({ type, data }, x, y) {
  try {
    if (type === "error") {
      throw { message: data };
    } else if (type === "component") {
      const node = await figma.importComponentByKeyAsync(data);
      const cloned = node.createInstance();
      cloned.x = x !== undefined ? x : figma.viewport.center.x;
      cloned.y = y !== undefined ? y : figma.viewport.center.y;
    }
  } catch (e) {
    figma.notify(e.message, { error: true });
    figma.closePlugin();
  }
}

figma.showUI(__html__, { height: 300, visible: true });
figma.ui.postMessage({ fileId: FILE_ID, token: TOKEN });
