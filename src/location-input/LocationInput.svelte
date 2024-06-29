<script lang="ts">
  import GooglePlaceAutocomplete from "./googlePlace/GooglePlaceAutocomplete.svelte";
  import { ParsedPlaceResult, parsePlaceResult } from "./googlePlace/utils";
  import { setHiddenHubspotInputs } from "./hubspot/hsFormUtils";
  import { displayBlock, displayNone, fadeIn } from "../visibilityUtils";
  import { onMount } from "svelte";
  import { getZipStore } from "./zipData/zipStore";
  import type { SheetDataConfig, StoredZipDataItem } from "./zipData/types";
  import type { OnAddressSubmitSuccess } from "../types";
  import { hsFormStateBooking } from "../windowVars";

  export let targetAvailableText: string;
  export let targetDisplayAddress: string;

  export let googlePublicApiKey: string;
  export let googleSheetConfig: SheetDataConfig;
  export let addressCtaText: string = "Get Started";

  const { store: zipStore, load: loadZips } = getZipStore(googleSheetConfig);

  onMount(async () => {
    loadZips();
  });

  export let panelEl: HTMLDivElement;
  export let stateContainerEl: HTMLDivElement;
  export let addressPanelEl: HTMLDivElement;
  export let targetAvailableStateEl: HTMLDivElement;
  export let targetNotAvailableStateEl: HTMLDivElement;
  export let onAddressSelect: (data: ParsedPlaceResult) => void | undefined;
  export let onAddressSubmitSuccess: OnAddressSubmitSuccess = () => {};

  $: inputErrorMessage = "";
  let selectedAddress: ParsedPlaceResult | undefined;
  $: selectedAddress = undefined;

  const handleSubmit = () => {
    if (!selectedAddress) {
      inputErrorMessage = "Please select an address with ZIP code.";
      return;
    }
    if (!selectedAddress.postalCode) {
      inputErrorMessage = "Please select an address with ZIP code.";
      return;
    }

    fadeIn(panelEl);
    displayBlock(stateContainerEl);
    displayNone(addressPanelEl);

    const targetDisplayAddressEl = document.querySelector(targetDisplayAddress);
    targetDisplayAddressEl.innerHTML = selectedAddress.formattedAddress;

    const foundZipItem: StoredZipDataItem | null =
      $zipStore.find((zipItem) => {
        return zipItem.zip === selectedAddress.postalCode;
      }) || null;

    if (foundZipItem) {
      document.querySelector(targetAvailableText).innerHTML =
        foundZipItem.availability;

      displayBlock(targetAvailableStateEl);
      displayNone(targetNotAvailableStateEl);
      setHiddenHubspotInputs(
        window.hsFormPreorder,
        selectedAddress,
        foundZipItem
      );
      hsFormStateBooking.update({
        selectedAddress,
        zipConfig: foundZipItem,
      });
      onAddressSubmitSuccess?.(
        selectedAddress,
        "lead-preorder-form",
        foundZipItem
      );
    } else {
      displayBlock(targetNotAvailableStateEl);
      displayNone(targetAvailableStateEl);
      setHiddenHubspotInputs(window.hsFormNewsletter, selectedAddress);
      hsFormStateBooking.update({
        selectedAddress,
        zipConfig: null,
      });
      onAddressSubmitSuccess?.(
        selectedAddress,
        "lead-newsletter-form",
        foundZipItem
      );
    }
  };
</script>

<div>
  <div class="input-address-container">
    <GooglePlaceAutocomplete
      class="location-search-input"
      apiKey={googlePublicApiKey}
      placeholder="Enter your address"
      onSelect={(value) => {
        const parsed = parsePlaceResult(value);
        onAddressSelect?.(parsed);
        window.blur();
        inputErrorMessage = "";

        selectedAddress = parsed;
      }}
      options={{
        componentRestrictions: { country: "us" },
      }}
    />
    <button
      on:click={handleSubmit}
      class="submitAddressButton button secondary w-button"
    >
      {addressCtaText}
    </button>
  </div>
  {#if inputErrorMessage}
    <p class="preorder-address-error-message">
      {inputErrorMessage}
    </p>
  {/if}
</div>

<svelte:head>
  <script
    charset="utf-8"
    type="text/javascript"
    src="//js-eu1.hsforms.net/forms/embed/v2.js"
  ></script>
</svelte:head>

<style lang="scss" global>
  .submitAddressButton {
    flex-shrink: 0;
  }
  .input-address-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media screen and (max-width: 768px) {
      flex-direction: column;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .preorder-address-error-message {
    color: #c95151;
    font-size: 14px;
    margin-top: 6px;
  }
  .location-search-input {
    border: none;
    background: #fafefff7;
    border-radius: 12px;
    height: 44px;
    border: none !important;
    outline: none !important;
    width: 100%;
    padding: 0 16px;
    line-height: 44px;
  }

  .hs-form__virality-link {
    display: none !important;
  }

  #popup-form {
    transition: 0.2s all;
  }
</style>
