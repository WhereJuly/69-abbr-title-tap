## Requirements

### Default Behavior

The default behavior after package code is initialized is as follows:

- On mobiles, when a mobile user taps on `abbr` tags presented on the page the `title` attribute value appears near the `abbr` tag.
- The value disappears when a user taps beyond an `abbr` tag.
- The look and feel of the `title` value copies that of the desktop-native `abbr` `title`.

The `title` tag must

#### Algorithms

> Despite the seemingly simple, the task at hand requires a lot of logic coming from the <abbr title="CSS, JS, markup">different actors types</abbr> to work in sync. The task also implies a number of non-transparent edge cases to be tested against to achieve a clean desired result.

##### Inputs

- At `touchstart` event we get the first touch 

##### Outputs

##### Invariants

- An `abbr` tag can be within any HTML element, the simples case it is within a `body` element;
- We process `touchstart` only for `abbr` element;

