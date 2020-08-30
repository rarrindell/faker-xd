const Scenegraph = require("scenegraph"),
  Point = Scenegraph.Point,
  Text = Scenegraph.Text,
  Color = Scenegraph.Color,
  selection = Scenegraph.selection,
  assets = require("assets"),
  viewport = require("viewport"),
  Faker = require("faker"),
  moment = require("moment"),
  app = require("application"),
  fs = require("uxp").storage.localFileSystem,
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
var btnGenerate,
  btnClear,
  inputFormat,
  helperText,
  accordionButtons,
  fakerLocale,
  prefs = {},
  previousFormat,
  delayedSelection;

/**
 * Override Faker with formatted date functions
 */
Faker.dateFormat = {
  between: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let from = obj.from || new Date(Date.now() - 604800000);
    let to = obj.to || new Date(Date.now() + 604800000);
    let format = obj.format || undefined;
    let date = Faker.date.between(from, to);
    return moment(date).format(format);
  },
  future: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let years = obj.years || undefined;
    let refDate = obj.refDate || undefined;
    let format = obj.format || undefined;
    let date = Faker.date.future(years, refDate);
    return moment(date).format(format);
  },
  past: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let years = obj.years || undefined;
    let refDate = obj.refDate || undefined;
    let format = obj.format || undefined;
    let date = Faker.date.past(years, refDate);
    return moment(date).format(format);
  },
  recent: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let days = obj.days || undefined;
    let refDate = obj.refDate || undefined;
    let format = obj.format || undefined;
    let date = Faker.date.recent(days, refDate);
    return moment(date).format(format);
  },
  soon: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let days = obj.days || undefined;
    let refDate = obj.refDate || undefined;
    let format = obj.format || undefined;
    let date = Faker.date.soon(days, refDate);
    return moment(date).format(format);
  },
  relative: function (obj) {
    try {
      if (typeof obj === "string") obj = JSON.parse(obj);
    } catch (e) {
      obj = {};
    }
    let min = obj.min || 0;
    let max = obj.max || 7;
    let count = Faker.random.number({ min: min, max: max, precision: 0.00001 });
    return moment.duration(count, "days").humanize();
  },
};

/**
 * Get an array of text nodes from selection
 **/
function getTextNodes(items) {
  selectedNodes.length = 0;
  selectedFormats.length = 0;

  for (let i = 0, j = items.length; i < j; i++) {
    storeNode(items[i], true);
  }

  updatePanelUI();
}

/**
 * Recursive function to get text nodes from within groups
 **/
function getTextChildren(children) {
  for (let i = 0, j = children.length; i < j; i++) {
    storeNode(children.at(i), true);
  }
}

/**
 * Store text node and format
 **/
function storeNode(node, children) {
  if (node instanceof Text) {
    selectedNodes.push(node);
    let format = node.pluginData ? node.pluginData : "";
    if (!selectedFormats.includes(format)) selectedFormats.push(format);
  } else if (!node.mask && node.children && node.children.length) {
    getTextChildren(node.children, true);
  }
}

/**
 * Updates panel UI for current state
 **/
function updatePanelUI() {
  accordionButtons.classList.remove("fakerDisabled");

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
  if (selectedNodes.length === 0) return createTextNode();

  app.editDocument({ editLabel: "Faker generate formats" }, function (
    selection
  ) {
    selectedNodes.forEach((node) => {
      // Keep existing format if multiple selected
      if (selectedFormats.length > 1 && !node.pluginData) return;
      node.pluginData =
        selectedFormats.length > 1 ? node.pluginData : inputFormat.value;
      if (!node.pluginData) return;

      try {
        node.text = getFakeText(node.pluginData);
      } catch (e) {
        node.text = node.pluginData;
      }
    });
  });
}

/**
 * Creates a populated text node and adds it to the scenegraph
 **/
function createTextNode() {
  if (!inputFormat.value) return;

  app.editDocument({ editLabel: "Faker create text" }, function (selection) {
    let node = new Scenegraph.Text();
    node.pluginData = inputFormat.value;
    try {
      node.text = getFakeText(node.pluginData);
    } catch (e) {
      node.text = node.pluginData;
    }
    node.fill = new Color("black");
    node.areaBox = { width: 360, height: node.fontSize * 1.1 };

    //Add node to cetre of viewport
    Scenegraph.root.addChild(node);
    let viewportBounds = viewport.bounds;
    let viewportCentre = {
      x: viewportBounds.width / 2 + viewportBounds.x,
      y: viewportBounds.height / 2 + viewportBounds.y,
    };

    let nodeOrigin = { x: node.areaBox.width / 2, y: node.areaBox.height / 2 };
    node.placeInParentCoordinates(nodeOrigin, viewportCentre);

    selection.items = [node];
  });
}

/**
 * Processes string applying custom methods and Faker
 **/
function getFakeText(pattern) {
  pattern = pattern.replace(
    /{{dateS\.([a-z]+)\('([^']*)'\)}}/g,
    (match, func, param) => {
      let replacement = match;
      switch (func) {
        case "format":
          replacement = moment(Faker.date.future(5)).format(param);
          break;
        case "relative":
          const data = [
            {
              label: "seconds",
              abbr: "secs",
              symbol: "s",
              single: "second",
              single_abbr: "sec",
              min: 1,
              max: 60,
            },
            {
              label: "minutes",
              abbr: "mins",
              symbol: "m",
              single: "minute",
              single_abbr: "min",
              min: 1,
              max: 60,
            },
            {
              label: "hours",
              abbr: "hrs",
              symbol: "h",
              single: "hour",
              single_abbr: "hr",
              min: 1,
              max: 24,
            },
            {
              label: "days",
              abbr: "days",
              symbol: "d",
              single: "day",
              single_abbr: "day",
              min: 1,
              max: 31,
            },
            {
              label: "months",
              abbr: "mos",
              symbol: "M",
              single: "month",
              single_abbr: "mo",
              min: 1,
              max: 12,
            },
            {
              label: "years",
              abbr: "yrs",
              symbol: "Y",
              single: "year",
              single_abbr: "yr",
              min: 1,
              max: 6,
            },
          ];
          let obj = data[Math.floor(Math.random() * data.length)];
          let num = Math.floor(Math.random() * (obj.max - obj.min)) + obj.min;
          switch (param.length) {
            case 1:
              replacement = `${num}${obj.symbol}`;
              break;
            case 2:
              replacement =
                num > 1 ? `${num} ${obj.abbr}` : `${num} ${obj.single_abbr}`;
              break;
            default:
              replacement =
                num > 1 ? `${num} ${obj.label}` : `${num} ${obj.single}`;
              break;
          }
          break;
      }
      return replacement;
    }
  );

  return Faker.fake(pattern);
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
    Faker.locale = fakerLocale.value;
    moment.locale(fakerLocale.value);
  } catch (e) {
    console.log("Error", e);
  }
  prefs.locale = fakerLocale.value;
  updateHelperText(true);
  savePrefs();
}

/**
 * Generate panel UI
 **/
function createPanel() {
  const panelHTML = require("html-loader!./lib/panel.html");
  let rootNode = document.createElement("panel");
  rootNode.innerHTML = panelHTML;

  fakerLocale = rootNode.querySelector("#fakerLocale");
  let options = [];
  for (let i in locales)
    options.push(`<option value="${i}">${locales[i]}</option>`);
  fakerLocale.innerHTML = options.join("");
  fakerLocale.addEventListener("change", eventLocaleChange);
  fakerLocale.value = prefs.locale;

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
  btnGenerate.addEventListener("click", eventGenerateFormats);
  btnClear.addEventListener("click", eventClearFormats);
  return rootNode;
}

/**
 * Load preferences from file system
 */
async function getPrefs() {
  const pluginDataFolder = await fs.getDataFolder();
  let prefsFile;
  try {
    prefsFile = await pluginDataFolder.getEntry("prefs.json");
  } catch (e) {
    prefsFile = null;
  }
  if (!prefsFile) {
    let keys = Object.keys(locales);
    prefs.locale = keys.includes(app.appLanguage) ? app.appLanguage : "en";
    return;
  }
  const contents = await prefsFile.read();
  prefs = JSON.parse(contents);
}

/**
 * Save preferences to file system
 */
async function savePrefs() {
  const pluginDataFolder = await fs.getDataFolder();
  let prefsFile;
  try {
    prefsFile = await pluginDataFolder.getEntry("prefs.json");
  } catch (e) {
    prefsFile = await pluginDataFolder.createFile("prefs.json", {
      overwrite: true,
    });
  }
  await prefsFile.write(JSON.stringify(prefs));
}

/**
 * Attach panel UI
 **/
function show(event) {
  getPrefs()
    .then(() => {
      event.node.appendChild(createPanel());
      eventLocaleChange();
      update(delayedSelection);
    })
    .catch((e, x) => {
      console.log("Error", e, x);
    });
}

/**
 * Clean up panel UI
 **/
function hide(event) {
  event.node.firstChild.remove();
}

/**
 * Updates list of selected text nodes
 **/
function update(selection) {
  if (!btnClear) {
    delayedSelection = selection;
    return;
  }
  getTextNodes(selection.items);
  delayedSelection = null;
}

export const panels = {
  fakerPanel: {
    show,
    hide,
    update,
  },
};
