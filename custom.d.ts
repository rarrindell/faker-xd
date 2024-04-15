declare module "*.html" {
  const content: string;
  export default content;
}

declare module "scenegraph" {
  const content: import("./src/types/uxp").Scenegraph;
  export default content;
}

declare module "application" {
  const content: import("./src/types/uxp").Application;
  export default content;
}