/** A sponsor or partner mark. Placeholders are drawn in code until real logos are uploaded. */
export type PartnerLogo =
  | { kind: 'placeholder'; variant: number }
  | { kind: 'image'; url: string; width: number; height: number }
  /** No logo uploaded yet: the name is set as a wordmark. */
  | { kind: 'wordmark' };

export interface Partner {
  id: string;
  name: string;
  logo: PartnerLogo;
}
