## Requirements

### Default Behavior

The default behavior after package code is initialized is as follows:

- On mobiles, when a mobile user taps on `abbr` tags presented on the page, the `title` attribute value appears near the `abbr` tag.
- The value disappears when a user taps beyond an `abbr` tag.
- The look and feel of the `title` value copies that of the desktop-native `abbr` `title` with the distinction that the value is left- or right-aligned based on if `abbr` is to the left or to the right of the viewport middle.
- The `abbr` elements with missing title display nothing on tap.

### Algorithm

The task at hand requires to coordinate some fine logic for the <abbr title="CSS, JS, markup">different actors types</abbr> to work in sync. The task also implies a number of non-transparent edge cases to be tested against to achieve a clean desired result.

**Inputs**

- We get a valid HTML document with standard `abbr` tag with a `title` attribute.
- At synthetic tap event (`touchstart` followed by `touchend` event, discarded when `touchmove` happens) we get the tapped HTML element or `document` object.

**Side Effects (Outputs)**

- The CSS code provides the static and dynamic styles. The static styles are applied with HTML `link` tag. The dynamic styles are applied via **CSS variables** used in the CSS rules.
- The JS code:
  - Clears the package CSS class and its `style` rules on all `abbr` elements
  - Sets that CSS class and CSS variables for the `abbr` just tapped.
- To obtain the actual width of `:after` element containing `title` value a hidden `span` element is temporarily added to a document. 