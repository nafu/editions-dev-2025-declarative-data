import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useSubscription} from "@shopify/ui-extensions/checkout/preact"

// 1. Export the extension
export default function() {
  render(<Extension />, document.body)
}

function Extension() {
  const instructions = useSubscription(shopify.instructions);

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <s-banner heading="payment-banner" tone="warning">
        {shopify.i18n.translate("attributeChangesAreNotSupported")}
      </s-banner>
    );
  }

  // 3. Render a UI
  return (
    <s-banner heading="payment-banner">
      <s-stack gap="base">
        <s-text>
          {shopify.i18n.translate("welcome", {
            target: <s-text type="emphasis">{shopify.extension.target}</s-text>,
          })}
        </s-text>
        <s-button onClick={handleClick}>
          {shopify.i18n.translate("addAFreeGiftToMyOrder")}
        </s-button>
      </s-stack>
    </s-banner>
  );

  async function handleClick() {
    // 4. Call the API to modify checkout
    const result = await shopify.applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: "yes",
    });
    console.log("applyAttributeChange result", result);
  }
}