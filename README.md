# IDS Tools
Tools for querying IDS (Ideographic Description Sequence) of ideographs.

## Installation
### Homebrew
`brew install jimmymasaru/repo/ids-tools`
### Manual Install
Node.js is required to run IDS tools.
You can just clone/download this repository. After running `init.sh` to initialize you can run `idsquery`.

## License
GPLv2

## Usage
### Decomposing an Ideograph
```
idsquery char [character]
idsquery char 鮮
```

### Looking up Ideographs by Components
```
idsquery comp [component]
idsquery comp 寺
```

### Generating PDF
[AFDKO](https://github.com/adobe-type-tools/afdko) is required.
```
idsquery pdf [component] -o [PDF filename] -f [font file] -i [font index for TTC, 0 if ommitted]
idsquery pdf 寺 -o 寺.pdf -f /System/Library/Fonts/PingFang.ttc -i 2
idsquery pdf 名 -o 名.pdf -f /Library/Fonts/KozGoPr6N-Regular.otf
```
![Sample 1](img/sample1.png "Sample 1")

