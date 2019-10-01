# sir-helpalot

A collection of Javascript helpers. Tested on Node.

## Text

### pad({ length: number, text: string })

Get padding text, of a repeating pattern, and a given length.

#### Args

| name   | purpose                          | type    | constraints                         | default |
| ------ | -------------------------------- | ------- | ----------------------------------- | ------- |
| length | The exact returned string length | integer | 0 < n < 25,000,000                  | 1       |
| text   | The repeating text pattern       | string  | non-empty: ASCII, UTF-8, and UTF-16 | "#"     |

#### Throws

**SirHelpalotError**: When text isn't a valid string, or length isn't a valid integer.

#### Examples

```js
const { pad } = require("sir-helpalot/text");

pad({ length: 4, text: "ab" }); // => "abab"
pad({ length: 4, text: "a " }); // => "a a "
pad(); // with defaults: => "#"
```

---
