import type { ParsedPlaceResult } from "./googlePlace/utils";

export const getStyleEl = () => {
  let styles = `
  html, body, input, button, label {
    font-family: Helvetica, sans-serif !important;
  }
  input, button {
    -webkit-appearance:none;
  }
  .form-preview-container {
    background-color: #ffffff;
  }
  /* reset */
  form[class*="hs-form"] *,
  form[class*="hs-form"] *::before,
  form[class*="hs-form"] *::after {
    box-sizing: border-box;
  }
  form[class*="hs-form"] {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1rem;
  }
  form[class*="hs-form"] fieldset { max-width: none; display: flex; flex-wrap: wrap; }
  form[class*="hs-form"] fieldset > .field.hs-form-field { width: 1px; flex-grow: 1; min-width: 230px; }
  form[class*="hs-form"] .field.hs-form-field { flex-grow: 1; min-width: 230px; }
  form[class*="hs-form"] .field.hs-form-field .input { margin-right: 0; }
  form[class*="hs-form"] .field.hs-form-field .input input,
  form[class*="hs-form"] .field.hs-form-field .input select,
  form[class*="hs-form"] .field.hs-form-field .input textarea
   {
    width: 100%;
    resize: none;
    background: white;
    outline: none;
    border: 1px solid black;
    transition: .2s all;
  }
  
  form[class*="hs-form"] .field.hs-form-field .input textarea {
    min-height: 150px;
  }
  
  
  form[class*="hs-form"] fieldset { 
    gap: 1rem 12px; 
  }
  

  form[class*="hs-form"] .field.hs-form-field .input input,
  form[class*="hs-form"] .field.hs-form-field .input select {
    height: 44px;
    line-height: 44px;
    padding: 0 24px;
    border: none;
  }

  form[class*="hs-form"] .field.hs-form-field .input input,
  form[class*="hs-form"] .field.hs-form-field .input select,
  form[class*="hs-form"] .field.hs-form-field .input textarea {
    font-weight: 400;border-style: solid;font-size: 15px;letter-spacing: 0px;height: 44px;padding: 0 24px;border-color: #EFF1F2;color: #090D0FEB;background-color: #EFF1F2;border-width: 0px;border-radius: 12px;
  }
  form[class*="hs-form"] .field.hs-form-field .input input:hover,
  form[class*="hs-form"] .field.hs-form-field .input select:hover,
  form[class*="hs-form"] .field.hs-form-field .input textarea:hover{
    border-color: #000000;
  }
  form[class*="hs-form"] .field.hs-form-field .input textarea {
    height: 150px;
    padding: 24px;
  }

  form[class*="hs-form"] .field.hs-form-field .input input::placeholder,
  form[class*="hs-form"] .field.hs-form-field .input select:invalid,
  form[class*="hs-form"] .field.hs-form-field .input textarea::placeholder {
    color: #020B0F5C;font-weight: 400;letter-spacing: 0px;
  }


  form[class*="hs-form"] .field.hs-form-field > label {
    display: block;
    font-weight: 600;color: #000000;font-size: 15px;margin-bottom: 8px;letter-spacing: 0px;text-transform: capitalize;
  }

  form[class*="hs-form"] .inputs-list label {
    display: block;
    border-style: solid;border-width: 0px;border-radius: 0px;padding: 8px 0px 0px 0px;color: #c95151;border-color: #d02525;font-size: 14px;font-weight: 400;
  }


  form[class*="hs-form"] .actions input[type="submit"] {
    display: flex;
    justify-content: center;
    width: 100%;
    cursor: pointer;
    line-height: 44px;
    outline: none;
    border: none;
    transition: .2s all;
    border-style: solid;font-weight: 400;font-size: 15px;letter-spacing: 0px;height: 44px;padding: 0 32px;color: #090D0FEB;background-color: #56D651;border-width: 0px;border-radius: 12px;text-align: center;
  }

  form[class*="hs-form"] .actions input[type="submit"]:hover {
    border-color: #6c42e0;
  }

  form[class*="hs-form"] .hs_error_rollup {
    display: none;
  }

  form[class*="hs-form"] .hs-error-msgs li { list-style: none; margin-left: 0; }

  div[class*="hs-form"].submitted-message {
    background-color: #6c42e0;border-width: 1px;border-radius: 8px;padding: 16px;text-align: center;color: #ffffff;font-size: 18px;
  }

  div[class*="hs-form"].submitted-message p {
    color: #ffffff;
}`;

  styles += `
.hs-form__virality-link {
  display: none !important;
}
.hs-form .field {
  margin-bottom: 0 !important;
}

form[class*="hs-form"] .field.hs-form-field > label {
  display: none;
}

.hs_submit.hs-submit .actions {
  padding: 0 !important;
  margin: 0 !important;
}

`;

  const styleEl = document.createElement("style");
  styleEl.innerHTML = styles.trim();
  return styleEl;
};

const setInputValue = (
  form: HTMLFormElement,
  fieldName: string,
  value: string
) => {
  try {
    const inputZip = form.querySelector(
      `input[name="${fieldName}"]`
    ) as HTMLInputElement;
    inputZip.value = value;
  } catch {
    console.log("cannot set field value", fieldName, value);
  }
};

export const setHiddenHubspotInputs = (
  form: HTMLFormElement,
  parsedData: ParsedPlaceResult
) => {
  setInputValue(form, "zip", parsedData.postalCode);
  setInputValue(form, "state", parsedData.stateShort);
  setInputValue(form, "country", parsedData.countryCode);
  setInputValue(form, "city", parsedData.city);
  setInputValue(form, "address", parsedData.formattedAddress);
};

const hideField = (form: HTMLFormElement, fieldName: string) => {
  try {
    const inputZip = form.querySelector(
      `input[name="${fieldName}"]`
    ) as HTMLInputElement;
    inputZip.parentElement.parentElement.style.display = "none";
  } catch {
    console.log("cannot hide field", fieldName);
  }
};

const hideFields = (form: HTMLFormElement, fieldNames: string[]) => {
  fieldNames.forEach((fieldName) => hideField(form, fieldName));
};

export const modifyFormOnLoad = (form: HTMLFormElement) => {
  hideFields(form, ["zip", "state", "address", "city", "country"]);

  // append styles
  form.appendChild(getStyleEl());
};
