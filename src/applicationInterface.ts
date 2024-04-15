import { SceneNode, SceneNodeList, Text } from "scenegraph";
import Scenegraph from "scenegraph";

function getTextNodes(items: SceneNode[] | SceneNodeList) {
  const textNodes: Text[] = [];
  items.forEach((item) => {
    if (item instanceof Scenegraph.Text) {
      textNodes.push(item as Text);
    } else {
      if (item.children && item.children.length) {
        textNodes.push(...getTextNodes(item.children))
      }
    }
  });
  return textNodes;
  // selectedNodes.length = 0;
  // selectedFormats.length = 0;
  // for (let i = 0, j = items.length; i < j; i++) {
  //   storeNode(items[i], true);
  // }
  // updatePanelUI();

  // if (node instanceof Text) {
  //   selectedNodes.push(node);
  //   let format = node.pluginData ? node.pluginData : "";
  //   if (!selectedFormats.includes(format)) selectedFormats.push(format);
  // } else if (!node.mask && node.children && node.children.length) {
  //   getTextChildren(node.children, true);
  // }
}

export default {
  getTextNodes,
}