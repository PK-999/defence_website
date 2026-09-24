import * as React from "react";

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  alt?: string;
  poster?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: number;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string | number;
  "shadow-softness"?: string | number;
  exposure?: string | number;
  "environment-image"?: string;
  "skybox-image"?: string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "min-field-of-view"?: string;
  "max-field-of-view"?: string;
  "interaction-prompt"?: "auto" | "when-focused" | "none";
  ar?: boolean;
  style?: React.CSSProperties;
  class?: string;
  className?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}
