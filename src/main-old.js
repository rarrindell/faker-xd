const Scenegraph = require("scenegraph"),
  Text = Scenegraph.Text,
  Color = Scenegraph.Color,
  viewport = require("viewport"),
  Faker = require("@faker-js/faker"),
  dataGenerator = require("./dataModel"),
  moment = require("moment"),
  app = require("application"),
  fs = require("uxp").storage.localFileSystem,
  selectedNodes = [],
  selectedFormats = [];
const { locales, BuildPanel } = require("../src/panel");
var btnGenerate,
  btnClear,
  inputFormat,
  helperText,
  accordionButtons,
  fakerLocale,
  faker = Faker.faker,
  prefs = {},
  previousFormat,
  delayedSelection;

/**
 * Override Faker with formatted date functions
 */
Faker.dateFormat = {
  // between: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let from = obj.from || new Date(Date.now() - 604800000);
  //   let to = obj.to || new Date(Date.now() + 604800000);
  //   let format = obj.format || undefined;
  //   let date = Faker.date.between(from, to);
  //   return moment(date).format(format);
  // },
  // future: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let years = obj.years || undefined;
  //   let refDate = obj.refDate || undefined;
  //   let format = obj.format || undefined;
  //   let date = Faker.date.future(years, refDate);
  //   return moment(date).format(format);
  // },
  // past: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let years = obj.years || undefined;
  //   let refDate = obj.refDate || undefined;
  //   let format = obj.format || undefined;
  //   let date = Faker.date.past(years, refDate);
  //   return moment(date).format(format);
  // },
  // recent: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let days = obj.days || undefined;
  //   let refDate = obj.refDate || undefined;
  //   let format = obj.format || undefined;
  //   let date = Faker.date.recent(days, refDate);
  //   return moment(date).format(format);
  // },
  // soon: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let days = obj.days || undefined;
  //   let refDate = obj.refDate || undefined;
  //   let format = obj.format || undefined;
  //   let date = Faker.date.soon(days, refDate);
  //   return moment(date).format(format);
  // },
  // relative: function (obj) {
  //   try {
  //     if (typeof obj === "string") obj = JSON.parse(obj);
  //   } catch (e) {
  //     obj = {};
  //   }
  //   let min = obj.min || 0;
  //   let max = obj.max || 7;
  //   let count = Faker.random.number({ min: min, max: max, precision: 0.00001 });
  //   return moment.duration(count, "days").humanize();
  // },
};

/**
 * Updates panel UI for current state
 **/
function updatePanelUI() {
  // accordionButtons.classList.remove("fakerDisabled");
  // if (selectedNodes.length === 0) {
  // } else if (selectedFormats.length === 1 && selectedFormats[0] === "") {
  // } else if (selectedFormats.length === 1) {
  //   // Text objects with single previous format
  //   inputFormat.removeAttribute("disabled");
  //   inputFormat.value = selectedFormats[0];
  //   previousFormat = inputFormat.value + "-";
  //   //updateHelperText(true);
  //   eventPatternChange();
  //   btnClear.removeAttribute("disabled");
  // } // Text objects with multiple previous formats
  // else {
  //   inputFormat.setAttribute("disabled", "");
  //   accordionButtons.classList.add("fakerDisabled");
  //   previousFormat = inputFormat.value = "";
  //   helperText.textContent = "Multiple formats selected";
  //   btnClear.removeAttribute("disabled");
  // }
}

/**
 * Removes formatting information from all selected nodes
 **/
function eventClearFormats() {
  // app.editDocument({ editLabel: "Faker clear formats" }, function (selection) {
  //   selectedNodes.forEach((node) => (node.pluginData = null));
  // });
}

/**
 * Saves current format to all nodes & generates fake content
 **/
function eventGenerateFormats() {
  // if (selectedNodes.length === 0) return createTextNode();
  // app.editDocument(
  //   { editLabel: "Faker generate formats" },
  //   function (selection) {
  //     selectedNodes.forEach((node) => {
  //       // Keep existing format if multiple selected
  //       if (selectedFormats.length > 1 && !node.pluginData) return;
  //       node.pluginData =
  //         selectedFormats.length > 1 ? node.pluginData : inputFormat.value;
  //       if (!node.pluginData) return;
  //       try {
  //         node.text = dataGenerator.generate(node.pluginData);
  //       } catch (e) {
  //         node.text = node.pluginData;
  //       }
  //     });
  //   }
  // );
}

/**
 * Creates a populated text node and adds it to the scenegraph
 **/
function createTextNode() {
  // if (!inputFormat.value) return;
  // app.editDocument({ editLabel: "Faker create text" }, function (selection) {
  //   let node = new Scenegraph.Text();
  //   node.pluginData = inputFormat.value;
  //   try {
  //     node.text = dataGenerator.generate(node.pluginData);
  //   } catch (e) {
  //     node.text = node.pluginData;
  //   }
  //   node.fill = new Color("black");
  //   node.areaBox = { width: 360, height: node.fontSize * 1.1 };
  //   //Add node to cetre of viewport
  //   Scenegraph.root.addChild(node);
  //   let viewportBounds = viewport.bounds;
  //   let viewportCentre = {
  //     x: viewportBounds.width / 2 + viewportBounds.x,
  //     y: viewportBounds.height / 2 + viewportBounds.y,
  //   };
  //   let nodeOrigin = { x: node.areaBox.width / 2, y: node.areaBox.height / 2 };
  //   node.placeInParentCoordinates(nodeOrigin, viewportCentre);
  //   selection.items = [node];
  // });
}

/**
 * Processes string applying custom methods and Faker
 **/
function getFakeText(pattern) {
  // pattern = pattern.replace(
  //   /{{dateS\.([a-z]+)\('([^']*)'\)}}/g,
  //   (match, func, param) => {
  //     let replacement = match;
  //     switch (func) {
  //       case "format":
  //         replacement = moment(faker.date.future({ years: 5 })).format(param);
  //         break;
  //       case "relative":
  //         const data = [
  //           {
  //             label: "seconds",
  //             abbr: "secs",
  //             symbol: "s",
  //             single: "second",
  //             single_abbr: "sec",
  //             min: 1,
  //             max: 60,
  //           },
  //           {
  //             label: "minutes",
  //             abbr: "mins",
  //             symbol: "m",
  //             single: "minute",
  //             single_abbr: "min",
  //             min: 1,
  //             max: 60,
  //           },
  //           {
  //             label: "hours",
  //             abbr: "hrs",
  //             symbol: "h",
  //             single: "hour",
  //             single_abbr: "hr",
  //             min: 1,
  //             max: 24,
  //           },
  //           {
  //             label: "days",
  //             abbr: "days",
  //             symbol: "d",
  //             single: "day",
  //             single_abbr: "day",
  //             min: 1,
  //             max: 31,
  //           },
  //           {
  //             label: "months",
  //             abbr: "mos",
  //             symbol: "M",
  //             single: "month",
  //             single_abbr: "mo",
  //             min: 1,
  //             max: 12,
  //           },
  //           {
  //             label: "years",
  //             abbr: "yrs",
  //             symbol: "Y",
  //             single: "year",
  //             single_abbr: "yr",
  //             min: 1,
  //             max: 6,
  //           },
  //         ];
  //         let obj = data[Math.floor(Math.random() * data.length)];
  //         let num = Math.floor(Math.random() * (obj.max - obj.min)) + obj.min;
  //         switch (param.length) {
  //           case 1:
  //             replacement = `${num}${obj.symbol}`;
  //             break;
  //           case 2:
  //             replacement =
  //               num > 1 ? `${num} ${obj.abbr}` : `${num} ${obj.single_abbr}`;
  //             break;
  //           default:
  //             replacement =
  //               num > 1 ? `${num} ${obj.label}` : `${num} ${obj.single}`;
  //             break;
  //         }
  //         break;
  //     }
  //     return replacement;
  //   }
  // );
  // return faker.helpers.fake(pattern);
}

/**
 * Updates the helper text to current format
 **/
function updateHelperText(force) {
  // if (!inputFormat.value) {
  //   helperText.textContent = "Choose a format below to get started";
  //   return;
  // }
  // if (force || previousFormat != inputFormat.value) {
  //   let pattern = inputFormat.value ? inputFormat.value : " ";
  //   try {
  //     helperText.textContent = pattern
  //       ? 'Example: "' + dataGenerator.generate(pattern) + '"'
  //       : "";
  //   } catch (e) {
  //     helperText.textContent = pattern ? 'Example: "' + pattern + '"' : "";
  //   }
  //   previousFormat = inputFormat.value;
  // }
}

/**
 * Updates list of selected text nodes
 **/
function update(selection) {}

export const panels = {
  fakerPanel: {
    show,
    hide,
    update,
  },
};
