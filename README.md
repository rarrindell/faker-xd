# faker-xd

An Adobe XD plugin wrapper for [faker-js/faker](https://github.com/faker-js/faker)

## Documentation

To populate a text field with fake data, enter template text in the _Format_ box and click _Generate_.
Select text fields containing faked data and click _Generate_ to refresh the generated content.

Full documentation of methods is available at https://fakerjs.dev/api/

### Examples

| Use Case                             | Format                                                    | Sample Result       |
| ------------------------------------ | --------------------------------------------------------- | ------------------- |
| Ranged random numbers                | {{random.number({"min": 1, "max": 99})}}                  | _42_                |
| Random word from a list              | {{random.arrayElement(["Online", "Offline", "Busy"])}}    | _Busy_              |
| Past date within 1 year              | {{dateFormat.past({"years": 1,"format":"Do MMMM YYYY"})}} | _21st January 2020_ |
| Relative date (between 0 and 5 days) | {{dateFormat.relative({"min":0,"max":5})}}                | _7 hours_           |

## Issues

At this time XD counts any changes to text from the plugin as a style override on component instances. This means font changes to your master components (font, fill, size etc) will not cascade to any component instances you have used Faker on. For now the only way to cascade changes in font is to reset component instances to their master state and then run Faker again on the text.

## Get Involved

Please report any bugs, ideas or feature requests by creating a new [issue](https://github.com/rarrindell/faker-xd/issues), or [get in touch](mailto:ryanarrindell@googlemail.com).
