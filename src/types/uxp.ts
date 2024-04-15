import { RenditionSettings, RenditionResult, DocumentInfo, EditSettings } from "application";
import { RootNode, SceneNode, Text, XDSelection } from "scenegraph";
import { storage } from "uxp";

export type UXPEvent = {
  bubbles: boolean;
  cancelable: boolean;
  currentTarget?: Element;
  defaultPrevented: boolean;
  eventPhase: number;
  hasReturnValue: boolean;
  isTrusted: boolean;
  panel: {
    _panelInfo: {}, panel: {}, rootNode: Document, panelId: string
  }
  panelId: string;
  returnValue: undefined;
  rootNode: Element;
  node: Element;
  stopImmediatePropagation: boolean;
  stopPropagation: boolean;
  target: {};
  type: string;
}

export type Scenegraph = {
  selection: XDSelection;
  root: RootNode;
  getNodeByGUID(guid: string): SceneNode;
  Text: () => Text;
}

export type Application = {
  editDocument(editFunction: (selection: Selection, root: RootNode) => Promise<any> | void): void;
  editDocument(options: EditSettings, editFunction: (selection: Selection, root: RootNode) => Promise<any> | void): void;
  createRenditions(renditions: RenditionSettings[]): Promise<RenditionResult[] | string>;
  import(entries: storage.File[]): void;
  version: string;
  appLanguage: string;
  systemLocale: string;
  activeDocument: DocumentInfo;
}