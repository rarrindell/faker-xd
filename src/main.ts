import { BuildPanel } from "./panel";
import scenegraph, { RootNode, XDSelection } from "scenegraph";
import application from "application";
import { UXPEvent } from "./types/uxp";
import * as dataModel from "./dataModel";
import applicationInterface from "./applicationInterface";

const pluginId = "632aeb77";
const preferences = {
  locale: "en",
  systemLocale: "en",
}

const getPreferences = () => {
  let locale = scenegraph.root.sharedPluginData.getItem(pluginId, "locale");
  let systemLocale = locale;
  if (!locale) {
    locale = application.appLanguage;
    systemLocale = application.systemLocale;
  }
  preferences.locale = locale;
  preferences.systemLocale = systemLocale;
}

const savePreferences = async () => {
  await application.editDocument({ editLabel: "Change locale" }, async (selection, rootNode) => {
    rootNode.sharedPluginData.setItem(pluginId, "locale", preferences.locale);
  });
}

const handleLocaleChange = (locale: string) => {
  dataModel.setLocale(locale);
  panelUI.updateHelperText(true, dataModel.generate(panelUI.getPattern()));
  preferences.locale = locale;
  savePreferences();
}

const handleSelectItem = (pattern: string) => {
  panelUI.updateHelperText(true, dataModel.generate(pattern));
}

const panelUI = BuildPanel({ onLocaleChange: handleLocaleChange, onSelectItem: handleSelectItem, });

const show = (event: UXPEvent) => {
  getPreferences();
  event.node.appendChild(panelUI.root);
  panelUI.setEnabled(true);
  panelUI.setLocale(preferences.locale, preferences.systemLocale);
};

const hide = (event: UXPEvent) => {
  event.node.firstChild.remove();
};

const update = (selection: XDSelection, documentRoot: RootNode) => {
  const textNodes = applicationInterface.getTextNodes(selection.items);
  const formats = Array.from(new Set(textNodes.map((textNode) => textNode.pluginData as String ?? "")));
  console.log("Formats", formats);
  // TODO: update UI
  // updatePanelUI();
  panelUI.setEnabled(true);
  if (textNodes.length === 0) {
    // No text is selected
    panelUI.setEnabled(false);
  } else if (formats.length === 0 || (formats.length === 1 && formats[0] === "")) {
    // New text objects without previous format
    panelUI.setPattern(textNodes[0].text);
  } else if (formats.length === 1) {
    // TODO: Text objects with single previous format
    console.log("One format");
  } else {
    // TODO: Text objects with multiple previous formats
    console.log("Multi formats");
  }
  // TODO: Update helper text
};

export const panels = {
  fakerPanel: {
    show,
    hide,
    update,
  },
};
