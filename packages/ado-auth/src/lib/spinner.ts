import Spin from "light-spinner";
import { dim } from "colorette";
import { IOption } from "light-spinner/dist/interface";

export type PrefixedSpinnerOptions = IOption & {
  prefixText?: string;
};

export class PrefixedSpinner extends Spin {
  private prefixText: string;

  constructor(options: PrefixedSpinnerOptions) {
    super(options);
    this.prefixText = options.prefixText || "";
  }

  setPrefixText(text: string) {
    this.prefixText = text;
  }

  setText(text: string) {
    this.text = `${dim(`[${this.prefixText}] `)} ${text}`;
  }
}
