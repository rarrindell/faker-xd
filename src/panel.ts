import panel from "./lib/panel.html";

const locales: { [key: string]: string } = {
  az: "Azərbaycanca",
  cs_CZ: "Čeština",
  de: "Deutsch",
  de_AT: "Österreichisches Deutsch",
  de_CH: "Schwizerdütsch",
  en: "English",
  en_AU: "Australia (English)",
  en_AU_ocker: "Australia Ocker (English)",
  en_CA: "Canada (English)",
  en_GB: "Great Britain (English)",
  en_IE: "Ireland (English)",
  en_IN: "India (English)",
  en_US: "United States (English)",
  es: "Español",
  es_MX: "Español Mexicano",
  fa: "فارسی",
  fr: "Français",
  fr_CA: "Français Canadien",
  id_ID: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nb_NO: "Bokmål",
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

let currentLocale = "en";

export function BuildPanel({ onLocaleChange, onSelectItem }: { onLocaleChange?: (locale: string) => void, onSelectItem?: (pattern: string) => void }) {
  const rootNode = document.createElement("div");
  rootNode.innerHTML = panel;
  let isEnabled = false;

  // Populate Locale dropdown
  const fakerLocale = rootNode.querySelector<HTMLSelectElement>("#fakerLocale");
  const options = [];
  for (let i in locales) {
    options.push(`<option value="${i}">${locales[i]}</option>`);
  }
  fakerLocale.innerHTML = options.join("");
  if (onLocaleChange) fakerLocale.addEventListener("change", () => onLocaleChange(fakerLocale.value));
  fakerLocale.value = currentLocale;

  // Set panel UI listeners
  const inputFormat = rootNode.querySelector<HTMLTextAreaElement>("#fakerPattern");

  const onAccordionClick = (e: Event) => {
    if (inputFormat.hasAttribute("disabled")) return;
    const target = e.target as Element;
    if (target.classList.contains("fakerCategory")) {
      toggleAccordion(target, e.currentTarget as Element);
      return;
    }
    if (target.classList.contains("fakerBtn")) {
      const attribute = target.attributes.getNamedItem("data-pattern");
      if (attribute && attribute.value) {
        const pattern = updatePattern(attribute.value, inputFormat);
        onSelectItem?.call(pattern);
      }
    }
  };

  const toggleAccordion = (target: Element, parent: Element) => {
    // Close open accordion
    if (target.classList.contains("active")) {
      target.classList.remove("active");
      if (
        target.nextElementSibling &&
        target.nextElementSibling.classList.contains("fakerOptions")
      )
        target.nextElementSibling.classList.remove("show");
      return;
    }
    // Close any open accordions
    let activeAccordion = parent.querySelector(
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
    // Open selected accordion
    target.classList.add("active");
    if (
      target.nextElementSibling &&
      target.nextElementSibling.classList.contains("fakerOptions")
    )
      target.nextElementSibling.classList.add("show");
  };

  rootNode
    .querySelector("div.fakerAccordion")
    .addEventListener("click", onAccordionClick);
  // inputFormat.addEventListener("change", onPatternChange);
  // inputFormat.addEventListener("focus", onPatternChange);
  // inputFormat.addEventListener("blur", onPatternChange);
  // inputFormat.addEventListener("keyup", onPatternChange);

  // Store element references
  // const btnGenerate = rootNode.querySelector<HTMLButtonElement>("#genButton");
  const btnClear = rootNode.querySelector<HTMLButtonElement>("#clearButton");
  const helperText = rootNode.querySelector<HTMLParagraphElement>("#helperText");
  const accordionButtons = rootNode.querySelector<HTMLDivElement>("#accordionButtons");
  // btnGenerate.addEventListener("click", onGenerateFormats);
  // btnClear.addEventListener("click", onClearFormats);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    if (enabled) {
      accordionButtons.classList.remove("fakerDisabled");
      inputFormat.removeAttribute("disabled");
      btnClear.removeAttribute("disabled");
    } else {
      accordionButtons.classList.add("fakerDisabled");
      inputFormat.value = "";
      inputFormat.setAttribute("disabled", "disabled");
      btnClear.setAttribute("disabled", "disabled");
    }
  }

  const setLocale = (locale: string, fallback?: string) => {
    const keys = Object.keys(locales);
    currentLocale = keys.includes(locale) ? locale : (keys.includes(fallback ?? "") ? fallback : currentLocale);
    fakerLocale.value = currentLocale;
    return currentLocale;
  }

  const updateHelperText = (force = false, content = "") => {
    if (!content) {
      helperText.textContent = "Choose a format below to get started";
      return;
    }
    if (force) {
      helperText.textContent = content ? 'Example: "' + content + '"' : "";
    }
  }

  const getPattern = () => {
    return inputFormat.value;
  }

  const setPattern = (pattern: string | null) => {
    if (pattern === null) {
      inputFormat.value = "";
      inputFormat.setAttribute("disabled", "disabled");
    } else {
      inputFormat.removeAttribute("disabled");
      inputFormat.value = pattern;
    }
  }

  return {
    root: rootNode,
    setEnabled: setEnabled,
    setLocale: setLocale,
    updateHelperText,
    getPattern,
    setPattern,
  };
}

const updatePattern = (pattern: string, inputFormat: HTMLTextAreaElement) => {
  let parts;
  if (inputFormat.selectionStart >= 0) {
    // Get insertion point, removing any selected text
    const positions = [inputFormat.selectionStart, inputFormat.selectionEnd];
    positions.sort((a, b) => a - b);
    parts = [
      inputFormat.value.substring(0, positions[0]),
      inputFormat.value.substring(positions[0], positions[1]),
      inputFormat.value.substring(positions[1]),
    ];
    parts[1] = pattern;
  } else {
    parts = [inputFormat.value, pattern, ""];
  }
  // Add spaces if inserting at beginning or end
  if (parts[0] === "" && parts[2] && parts[2].charAt(0) !== " ") {
    parts[1] += " ";
  }
  if (
    parts[2] === "" &&
    parts[0] &&
    parts[0].charAt(parts[0].length - 1) !== " "
  ) {
    parts[1] = " " + parts[1];
  }
  inputFormat.value = parts.join("");
  return inputFormat.value;
}