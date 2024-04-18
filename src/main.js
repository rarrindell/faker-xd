const Scenegraph = require("scenegraph"),
  Faker = require("@faker-js/faker"),
  moment = require("moment"),
  app = require("application"),
  selectedNodes = [],
  selectedFormats = [],
  locales = {
    az: "Azərbaycanca",
    cz: "Čeština",
    de: "Deutsch",
    de_AT: "Österreichisches Deutsch",
    de_CH: "Schwizerdütsch",
    en: "English",
    en_AU: "Australia (English)",
    en_au_ocker: "Australia Ocker (English)",
    en_CA: "Canada (English)",
    en_GB: "Great Britain (English)",
    en_IE: "Ireland (English)",
    en_IND: "India (English)",
    en_US: "United States (English)",
    es: "Español",
    es_MX: "Español Mexicano",
    fa: "فارسی",
    fr: "Français",
    fr_CA: "Français Canadien",
    ge: "ქართული",
    id_ID: "Bahasa Indonesia",
    it: "Italiano",
    ja: "日本語",
    ko: "한국어",
    nb_NO: "Bokmål",
    nep: "नेपाली भाषा",
    nl: "Nederlands",
    pl: "Português",
    pt_BR: "Português Brasileiro",
    ru: "Русский",
    sk: "Slovenčina",
    sv: "Svenska",
    tr: "Türkçe",
    uk: "Українська",
    vi: "Tiếng Việt",
    zh_CN: "简体中文",
    zh_TW: "繁體中文",
  };
let btnGenerate,
  btnClear,
  inputFormat,
  helperText,
  accordionButtons,
  fakerLocale,
  previousFormat,
  delayedSelection,
  formatPanel,
  validationMessage,
  validSelection = false;
const pluginId = "632aeb77";
const preferences = {
  locale: "en",
  systemLocale: "en",
};
let fakerInst = Faker.fakerEN;

/**
 * Get an array of text nodes from selection
 * @param {Scenegraph.SceneNode[]} items
 * @param {Scenegraph.Selection} selection
 */
function getTextNodes(items, selection) {
  selectedNodes.length = 0;
  selectedFormats.length = 0;
  validSelection = true;

  selectedNodes.push(...getTextNode(items, selection));
  const formats = Array.from(
    new Set(
      selectedNodes.map((textNode) =>
        textNode.pluginData ? textNode.pluginData : ""
      )
    )
  );
  selectedFormats.push(...formats);
  validSelection = validSelection && selectedNodes.length > 0;

  updatePanelUI();
}

/**
 * Recursively select text nodes
 * @param {Scenegraph.SceneNode[]} items
 * @param {Scenegraph.Selection} selection
 * @returns {Scenegraph.Text[]}
 */
function getTextNode(items, selection) {
  const textNodes = [];
  items.forEach((item) => {
    if (selection.isInEditContext(item) === false) {
      validSelection = false;
      return;
    }
    if (item instanceof Scenegraph.Text) {
      textNodes.push(item);
    } else {
      if (item.children && item.children.length) {
        textNodes.push(...getTextNode(item.children, selection));
      }
    }
  });
  return textNodes;
}

/**
 * Updates panel UI for current state
 **/
function updatePanelUI() {
  accordionButtons.classList.remove("fakerDisabled");
  if (validSelection) {
    formatPanel.classList.remove("hide");
    validationMessage.classList.add("hide");
  } else {
    formatPanel.classList.add("hide");
    validationMessage.classList.remove("hide");
  }

  if (selectedNodes.length === 0) {
    // No selection or invalid selection
    inputFormat.removeAttribute("disabled");
    inputFormat.value = "";
    //updateHelperText(true);
    eventPatternChange();
    btnClear.setAttribute("disabled", "");
  } else if (selectedFormats.length === 1 && selectedFormats[0] === "") {
    // New text objects without previous format
    inputFormat.removeAttribute("disabled");
    inputFormat.value = selectedNodes[0].text;
    previousFormat = inputFormat.value + "-";
    //updateHelperText(true);
    eventPatternChange();
    btnClear.setAttribute("disabled", "");
  } else if (selectedFormats.length === 1) {
    // Text objects with single previous format
    inputFormat.removeAttribute("disabled");
    inputFormat.value = selectedFormats[0];
    previousFormat = inputFormat.value + "-";
    //updateHelperText(true);
    eventPatternChange();
    btnClear.removeAttribute("disabled");
  } // Text objects with multiple previous formats
  else {
    inputFormat.setAttribute("disabled", "");
    accordionButtons.classList.add("fakerDisabled");
    previousFormat = inputFormat.value = "";
    helperText.textContent = "Multiple formats selected";
    eventPatternChange();
    btnClear.removeAttribute("disabled");
  }
}

/**
 * Removes formatting information from all selected nodes
 **/
function eventClearFormats() {
  app.editDocument({ editLabel: "Faker clear formats" }, function (selection) {
    selectedNodes.forEach((node) => (node.pluginData = null));
  });
}

/**
 * Saves current format to all nodes & generates fake content
 **/
function eventGenerateFormats() {
  // if (selectedNodes.length === 0) return createTextNode();
  if (!validSelection) return;
  app.editDocument({ editLabel: "Faker Generate" }, function (selection) {
    validSelection = true;
    const textNodes = getTextNode(selection.items, selection);
    if (!validSelection) return;
    textNodes.forEach((node) => {
      // Keep existing format if multiple selected
      if (selectedFormats.length > 1 && !node.pluginData) {
        return;
      }
      node.pluginData =
        selectedFormats.length > 1 ? node.pluginData : inputFormat.value;
      if (!node.pluginData) {
        return;
      }
      try {
        let text = getFakeText(node.pluginData);
        node.updateText(text);
      } catch (e) {
        node.updateText(node.pluginData);
        console.error(e);
      }
    });
  });
}

/**
 * Processes string applying custom methods and Faker
 * @param {string} pattern
 **/
function getFakeText(pattern) {
  pattern = pattern.replace(/{{dateFormat\.(.*?)}}/gm, (match, func) => {
    let startArgs = func.indexOf("(");
    let endArgs = func.lastIndexOf(")");
    if (startArgs < 0) startArgs = func.length;
    if (endArgs < 0) endArgs = func.length;

    const functionName = func.substring(0, startArgs);
    const argString = func.substring(startArgs + 1, endArgs);
    let args = {};

    try {
      args = JSON.parse(argString);
    } catch (e) {}

    let replacement = "";
    let format = undefined;
    let date;
    switch (functionName) {
      case "recent":
        format = args.format || undefined;
        date = fakerInst.date.recent({
          days: args.days || undefined,
          refDate: args.refDate,
        });
        replacement = moment(date).format(format);
        break;
      case "past":
        format = args.format || undefined;
        date = fakerInst.date.past({
          years: args.years || undefined,
          refDate: args.refDate || undefined,
        });
        replacement = moment(date).format(format);
        break;
      case "future":
        format = args.format || undefined;
        date = fakerInst.date.future({
          years: args.years || undefined,
          refDate: args.refDate || undefined,
        });
        replacement = moment(date).format(format);
        break;
      case "between":
        format = args.format || undefined;
        date = fakerInst.date.between({
          from: args.from || new Date(Date.now() - 604800000),
          to: args.to || new Date(Date.now() + 604800000),
        });
        replacement = moment(date).format(format);
        break;
      case "relative":
        let count = fakerInst.number.float({
          min: args.min || 0,
          max: args.max || 7,
          fractionDigits: 5,
        });
        replacement = moment.duration(count, "days").humanize();
        break;
      default:
        break;
    }
    return replacement;
  });

  return fakerInst.helpers.fake(pattern);
}

/**
 * Updates the helper text to current format
 **/
function updateHelperText(force) {
  if (!inputFormat.value) {
    helperText.textContent = "Choose a format below to get started";
    return;
  }
  if (force || previousFormat != inputFormat.value) {
    let pattern = inputFormat.value ? inputFormat.value : " ";
    try {
      helperText.textContent = pattern
        ? 'Example: "' + getFakeText(pattern) + '"'
        : "";
    } catch (e) {
      helperText.textContent = pattern ? 'Example: "' + pattern + '"' : "";
    }
    previousFormat = inputFormat.value;
  }
}

/**
 * Handle accordion item click
 **/
function eventAccordionClick(e) {
  if (inputFormat.hasAttribute("disabled")) return;

  if (e.target.classList.contains("fakerCategory")) {
    toggleAccordion(e);
    return;
  }
  if (e.target.classList.contains("fakerBtn")) {
    appendFormat(e.target);
  }
}

/**
 * Handle accordion expand & collapse
 **/
function toggleAccordion(e) {
  if (e.target.classList.contains("active")) {
    e.target.classList.remove("active");
    if (
      e.target.nextElementSibling &&
      e.target.nextElementSibling.classList.contains("fakerOptions")
    )
      e.target.nextElementSibling.classList.remove("show");
    return;
  }

  let activeAccordion = e.currentTarget.querySelector(
    "div.fakerCategory.active"
  );
  if (activeAccordion) {
    activeAccordion.classList.remove("active");
    if (
      activeAccordion.nextElementSibling &&
      activeAccordion.nextElementSibling.classList.contains("fakerOptions")
    )
      activeAccordion.nextElementSibling.classList.remove("show");
  }

  e.target.classList.add("active");
  if (
    e.target.nextElementSibling &&
    e.target.nextElementSibling.classList.contains("fakerOptions")
  )
    e.target.nextElementSibling.classList.add("show");
}

/**
 * Insert selected pattern into input format
 **/
function appendFormat(node) {
  let patternAttr = node.attributes.getNamedItem("data-pattern");
  if (patternAttr && patternAttr.value) {
    let parts;
    if (inputFormat.selectionStart >= 0) {
      // Get insertion point, removing any selected text
      let positions = [inputFormat.selectionStart, inputFormat.selectionEnd];
      positions.sort((a, b) => a - b);
      parts = [
        inputFormat.value.substring(0, positions[0]),
        inputFormat.value.substring(positions[0], positions[1]),
        inputFormat.value.substring(positions[1]),
      ];
      parts[1] = patternAttr.value;
    } else {
      parts = [inputFormat.value, patternAttr.value, ""];
    }

    // Add spaces if inserting at beginning or end
    if (parts[0] === "" && parts[2] && parts[2].charAt(0) !== " ")
      parts[1] += " ";
    if (
      parts[2] === "" &&
      parts[0] &&
      parts[0].charAt(parts[0].length - 1) !== " "
    )
      parts[1] = " " + parts[1];
    inputFormat.value = parts.join("");
    eventPatternChange();
  }
}

/**
 * Handle format change events
 **/
function eventPatternChange(e) {
  if (!inputFormat.value && selectedFormats.length <= 1) {
    btnGenerate.setAttribute("disabled", "");
  } else {
    btnGenerate.removeAttribute("disabled");
  }
  updateHelperText();
}

/**
 * Handle locale change event
 **/
function eventLocaleChange(e) {
  try {
    if (Faker.allFakers[fakerLocale.value]) {
      preferences.locale = fakerLocale.value;
      fakerInst = Faker.allFakers[fakerLocale.value];
      moment.locale(fakerLocale.value);
    }
  } catch (e) {
    console.error(e);
  }
  updateHelperText(true);
  if (e) savePrefs();
}

/**
 * Generate panel UI
 **/
function createPanel() {
  const panelHTML = require("./lib/panel.html");
  let rootNode = document.createElement("div");
  rootNode.innerHTML = panelHTML.default;

  fakerLocale = rootNode.querySelector("#fakerLocale");
  let options = [];
  for (let i in locales)
    options.push(`<option value="${i}">${locales[i]}</option>`);
  fakerLocale.innerHTML = options.join("");
  fakerLocale.addEventListener("change", eventLocaleChange);
  fakerLocale.value = preferences.locale;

  // Set panel UI listeners
  rootNode
    .querySelector("div.fakerAccordion")
    .addEventListener("click", eventAccordionClick);
  inputFormat = rootNode.querySelector("#fakerPattern");
  inputFormat.addEventListener("change", eventPatternChange);
  inputFormat.addEventListener("focus", eventPatternChange);
  inputFormat.addEventListener("blur", eventPatternChange);
  inputFormat.addEventListener("keyup", eventPatternChange);

  // Store element references
  btnGenerate = rootNode.querySelector("#genButton");
  btnClear = rootNode.querySelector("#clearButton");
  helperText = rootNode.querySelector("#helperText");
  accordionButtons = rootNode.querySelector("#accordionButtons");
  formatPanel = rootNode.querySelector("#formatPanel");
  validationMessage = rootNode.querySelector("#validationMessage");
  btnGenerate.addEventListener("click", eventGenerateFormats);
  btnClear.addEventListener("click", eventClearFormats);
  return rootNode;
}

/**
 * Load preferences from file system
 */
function getPrefs() {
  try {
    let locale = Scenegraph.root.sharedPluginData.getItem(pluginId, "locale");
    let systemLocale = locale;
    let keys = Object.keys(locales);
    if (!locale) {
      locale = app.appLanguage;
      systemLocale = app.systemLocale;
    }
    preferences.locale = keys.includes(locale) ? locale : "en";
    preferences.systemLocale = systemLocale;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Save preferences to file system
 */
function savePrefs() {
  try {
    app.editDocument(
      { editLabel: "Change locale" },
      async (selection, rootNode) => {
        rootNode.sharedPluginData.setItem(
          pluginId,
          "locale",
          preferences.locale
        );
      }
    );
  } catch (e) {
    console.error(e);
  }
}

/**
 * Attach panel UI
 **/
function show(event) {
  getPrefs();
  event.node.appendChild(createPanel());
  eventLocaleChange();
  update(delayedSelection);
}

/**
 * Clean up panel UI
 **/
function hide(event) {
  event.node.firstChild.remove();
}

/**
 * Updates list of selected text nodes
 * @param {Scenegraph.XDSelection} selection
 */
function update(selection) {
  if (!btnClear) {
    delayedSelection = selection;
    return;
  }

  if (selection && selection.items) {
    getTextNodes(selection.items, selection);
  }
  delayedSelection = null;
}

export const panels = {
  fakerPanel: {
    show,
    hide,
    update,
  },
};
