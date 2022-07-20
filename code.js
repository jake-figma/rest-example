const TOKEN = "figd_YOURPERSONAL-ACCESSTOKEN";
const FILE_ID = "FILE_ID_FROM_URL";

figma.ui.onmessage = (message) => loadComponent(message);

figma.on("drop", ({ x, y, items }) => {
  if (items[0]) {
    loadComponent(items[0], x, y);
  }
});

async function loadComponent({ type, data }, x, y) {
  try {
    if (type === "error") {
      throw { message: data };
    } else if (type === "component") {
      const component = await figma.importComponentByKeyAsync(data);
      const instance = component.createInstance();
      instance.x = x !== undefined ? x : figma.viewport.center.x;
      instance.y = y !== undefined ? y : figma.viewport.center.y;
      console.log(instance.componentProperties);
      console.log(component.parent.componentPropertyDefinitions);
      // how to get default properties
      // const defaultProperties = {};
      // for (let key in component.parent.componentPropertyDefinitions) {
      //   defaultProperties[key] =
      //     component.parent.componentPropertyDefinitions[key].defaultValue;
      // }
      // instance.setProperties(defaultProperties);
    }
  } catch (e) {
    figma.notify("Error", { error: true });
    console.error(e.message, { error: true });
    figma.closePlugin();
  }
}

figma.showUI(__html__, { height: 300, visible: true });
figma.ui.postMessage({ fileId: FILE_ID, token: TOKEN });
