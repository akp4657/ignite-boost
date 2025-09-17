// Potential options. Children is used for dropdowns
export interface NavbarOption {
  text: string;
  id: number;
  url?: URLOption;
  children?: NavbarOption[];
  elementType?: string;
}

export interface URLOption {
  path: string;
  external?: boolean;
}
